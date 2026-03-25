// ============================================================================
// DOCUMENT-REGISTRY WITNESS IMPLEMENTATIONS
// ============================================================================
//
// Off-chain computation for the document registry contract.
// Handles document hash binding, twin bond verification, and Merkle roots.
//
// IMPORTANT: Function names and signatures MUST match the generated types
// in managed/document-registry/contract/index.d.ts exactly:
//
//   Witnesses<PS> = {
//     computeTwinBondHash(ctx, imageTwinHash: Uint8Array,
//       digitalTwinHash: Uint8Array): [PS, Uint8Array]
//     buildMerkleRootFromDocumentHashes(ctx,
//       documentHashCollection: bigint): [PS, Uint8Array]
//     getCurrentTimestamp(ctx): [PS, bigint]
//   }
// ============================================================================

import { type WitnessContext } from "@midnight-ntwrk/compact-runtime";
import type { Ledger } from "../managed/document-registry/contract/index.js";
import { hashToBytes32 } from "./hash-utils.js";

// --- Private State Type ---

export type DocumentRegistryPrivateState = {
  // Local cache of document hashes registered by this user
  registeredDocumentHashes: string[];
  // Twin bond mappings (image hash → digital hash)
  twinBondMappings: Record<string, string>;
};

// --- Private State Factory ---

export const createDocumentRegistryPrivateState = (): DocumentRegistryPrivateState => ({
  registeredDocumentHashes: [],
  twinBondMappings: {},
});

// --- Hash Utilities ---

/** Convert a Uint8Array to a hex string */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// --- Witness Implementations ---

/**
 * computeTwinBondHash
 *
 * Computes a binding hash that links an image-twin (physical scan) to its
 * digital-twin (electronic document). The bond proves they represent the
 * same document without revealing either hash individually.
 *
 * @param context - WitnessContext with ledger and private state
 * @param imageTwinHash_0 - Hash of the scanned physical document (Bytes<32>)
 * @param digitalTwinHash_0 - Hash of the electronic document (Bytes<32>)
 * @returns [updatedPrivateState, twinBondHash as Bytes<32>]
 */
export const computeTwinBondHash = (
  context: WitnessContext<Ledger, DocumentRegistryPrivateState>,
  imageTwinHash_0: Uint8Array,
  digitalTwinHash_0: Uint8Array,
): [DocumentRegistryPrivateState, Uint8Array] => {
  const bondHash = hashToBytes32(imageTwinHash_0, digitalTwinHash_0);

  // Track the twin bond mapping in private state
  const updatedState: DocumentRegistryPrivateState = {
    ...context.privateState,
    twinBondMappings: {
      ...context.privateState.twinBondMappings,
      [bytesToHex(imageTwinHash_0)]: bytesToHex(digitalTwinHash_0),
    },
  };

  return [updatedState, bondHash];
};

/**
 * buildMerkleRootFromDocumentHashes
 *
 * Computes a Merkle root from a collection of document hashes.
 * The collection identifier (bigint) references an off-chain list of
 * document hashes. This witness retrieves or derives the root from them.
 *
 * For MVP, we produce a deterministic hash from the collection ID.
 * In production, this would look up the actual document hashes from
 * the off-chain storage and compute a proper Merkle tree root.
 *
 * @param context - WitnessContext with ledger and private state
 * @param documentHashCollection_0 - Identifier for the collection (Field / bigint)
 * @returns [unchangedPrivateState, merkleRoot as Bytes<32>]
 */
export const buildMerkleRootFromDocumentHashes = (
  context: WitnessContext<Ledger, DocumentRegistryPrivateState>,
  documentHashCollection_0: bigint,
): [DocumentRegistryPrivateState, Uint8Array] => {
  // Convert collection ID to bytes, then hash it to produce a root
  // In production: look up actual document hashes and compute real Merkle tree
  const merkleRoot = hashToBytes32(documentHashCollection_0);

  return [context.privateState, merkleRoot];
};

/**
 * getCurrentTimestamp
 *
 * Returns the current Unix timestamp (seconds since epoch).
 * Used for custody transfer recording and document registration timestamps.
 *
 * @returns [unchangedPrivateState, currentTimestamp]
 */
export const getCurrentTimestamp = (
  context: WitnessContext<Ledger, DocumentRegistryPrivateState>,
): [DocumentRegistryPrivateState, bigint] => {
  const timestamp = BigInt(Math.floor(Date.now() / 1000));
  return [context.privateState, timestamp];
};

// --- Witness Map (for contract binding) ---
// Names MUST match generated Witnesses<PS> type exactly.

export const documentRegistryWitnesses = {
  computeTwinBondHash,
  buildMerkleRootFromDocumentHashes,
  getCurrentTimestamp,
};
