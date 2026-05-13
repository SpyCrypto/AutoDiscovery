// ============================================================================
// DOCUMENT-REGISTRY WITNESS IMPLEMENTATIONS
// Off-chain computation for the document registry contract.
// ============================================================================

import { createHash } from "node:crypto";
import type { WitnessContext } from "@midnight-ntwrk/compact-runtime";
import type { Ledger } from "../managed/document-registry/contract/index.js";

// --- Types ---

export type DocumentRegistryPrivateState = Record<string, never>;

// --- Private State Factory ---

export const createDocumentRegistryPrivateState = (): DocumentRegistryPrivateState => ({});

// ---------------------------------------------------------------------------
// Witnesses — signatures MUST match generated index.d.ts exactly
// ---------------------------------------------------------------------------

/**
 * computeTwinBondHash
 * Hashes image twin + digital twin content hashes together → Bytes<32>
 * Anchors the physical↔digital document bond on-chain.
 */
export const computeTwinBondHash = (
  context: WitnessContext<Ledger, DocumentRegistryPrivateState>,
  imageTwinHash_0: Uint8Array,
  digitalTwinHash_0: Uint8Array,
): [DocumentRegistryPrivateState, Uint8Array] => {
  const input = Buffer.concat([
    Buffer.from(imageTwinHash_0),
    Buffer.from([0x7c]),
    Buffer.from(digitalTwinHash_0),
  ]);
  const hash = createHash("sha256").update(input).digest();
  return [context.privateState, new Uint8Array(hash)];
};

/**
 * buildMerkleRootFromDocumentHashes
 * In the contract, the documentHashCollection is a Field (bigint) encoding a
 * collection of hashes. For off-chain computation we hash the field value
 * as a 32-byte seed → Bytes<32> Merkle root approximation.
 */
export const buildMerkleRootFromDocumentHashes = (
  context: WitnessContext<Ledger, DocumentRegistryPrivateState>,
  documentHashCollection_0: bigint,
): [DocumentRegistryPrivateState, Uint8Array] => {
  const collectionHex = documentHashCollection_0.toString(16).padStart(62, "0");
  const hash = createHash("sha256").update(Buffer.from(collectionHex, "hex")).digest();
  return [context.privateState, new Uint8Array(hash)];
};

/**
 * getCurrentTimestamp
 * Returns current Unix timestamp in seconds.
 */
export const getCurrentTimestamp = (
  context: WitnessContext<Ledger, DocumentRegistryPrivateState>,
): [DocumentRegistryPrivateState, bigint] => {
  return [context.privateState, BigInt(Math.floor(Date.now() / 1000))];
};

// --- Witness Map (matched to generated Witnesses<PS> type) ---

export const documentRegistryWitnesses = {
  computeTwinBondHash,
  buildMerkleRootFromDocumentHashes,
  getCurrentTimestamp,
};
