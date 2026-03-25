// ============================================================================
// ACCESS-CONTROL WITNESS IMPLEMENTATIONS
// ============================================================================
//
// Off-chain computation for the access control contract.
// Handles document sharing proof hashes and timestamps.
//
// IMPORTANT: Function names and signatures MUST match the generated types
// in managed/access-control/contract/index.d.ts exactly:
//
//   Witnesses<PS> = {
//     getCurrentTimestamp(ctx): [PS, bigint]
//     computeSharingEventProofHash(ctx, documentHash: Uint8Array,
//       recipientPublicKeyHash: Uint8Array, sharingTimestamp: bigint): [PS, Uint8Array]
//     lookupRoleCommitmentMerklePath(ctx, publicKeyHash: Uint8Array):
//       [PS, MerkleTreePath<Uint8Array> | undefined]
//   }
// ============================================================================

import { type WitnessContext, type MerkleTreePath } from "@midnight-ntwrk/compact-runtime";
import type { Ledger } from "../managed/access-control/contract/index.js";
import { hashToBytes32 } from "./hash-utils.js";

// --- Private State Type ---

export type AccessControlPrivateState = {
  // Local cache of sharing events (proof hash hex → recipient key hash hex)
  sharingEventLog: Record<string, string>;
};

// --- Private State Factory ---

export const createAccessControlPrivateState = (): AccessControlPrivateState => ({
  sharingEventLog: {},
});

// --- Hash Utility ---

/** Convert a Uint8Array to a hex string */
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// --- Witness Implementations ---

/**
 * getCurrentTimestamp
 *
 * Returns the current Unix timestamp (seconds since epoch).
 * Used for document sharing event timestamps.
 *
 * @returns [unchangedPrivateState, currentTimestamp]
 */
export const getCurrentTimestamp = (
  context: WitnessContext<Ledger, AccessControlPrivateState>,
): [AccessControlPrivateState, bigint] => {
  const timestamp = BigInt(Math.floor(Date.now() / 1000));
  return [context.privateState, timestamp];
};

/**
 * lookupRoleCommitmentMerklePath
 *
 * Looks up the Merkle proof path for a given public key hash in the
 * authorizedRoleCommitments tree. Returns the path if found, undefined if not.
 *
 * This witness is called by the proveParticipantHasRole circuit to get
 * the Merkle inclusion proof that the caller is registered in the role tree.
 *
 * @param context - WitnessContext with ledger and private state
 * @param publicKeyHash_0 - The caller's Bytes<32> public key value (as returned by ownPublicKey()).
 *                         This matches the value stored in the tree via registerParticipantKey.
 * @returns [unchangedPrivateState, MerkleTreePath if found, undefined if not]
 */
export const lookupRoleCommitmentMerklePath = (
  context: WitnessContext<Ledger, AccessControlPrivateState>,
  publicKeyHash_0: Uint8Array,
): [AccessControlPrivateState, MerkleTreePath<Uint8Array> | undefined] => {
  const path = context.ledger.authorizedRoleCommitments.findPathForLeaf(publicKeyHash_0);
  return [context.privateState, path];
};

/**
 * computeSharingEventProofHash
 *
 * Computes a proof hash for a document sharing event. This hash anchors
 * the fact that a specific document was shared with a specific party at
 * a specific time, without revealing the document contents or party identity.
 *
 * @param context - WitnessContext with ledger and private state
 * @param documentHash_0 - Hash of the shared document (Bytes<32>)
 * @param recipientPublicKeyHash_0 - Hash of the recipient's public key (Bytes<32>)
 * @param sharingTimestamp_0 - When the sharing occurred (Field / bigint)
 * @returns [updatedPrivateState, sharingProofHash as Bytes<32>]
 */
export const computeSharingEventProofHash = (
  context: WitnessContext<Ledger, AccessControlPrivateState>,
  documentHash_0: Uint8Array,
  recipientPublicKeyHash_0: Uint8Array,
  sharingTimestamp_0: bigint,
): [AccessControlPrivateState, Uint8Array] => {
  const proofHash = hashToBytes32(
    documentHash_0,
    recipientPublicKeyHash_0,
    sharingTimestamp_0,
  );

  // Log the sharing event in private state
  const updatedState: AccessControlPrivateState = {
    ...context.privateState,
    sharingEventLog: {
      ...context.privateState.sharingEventLog,
      [bytesToHex(proofHash)]: bytesToHex(recipientPublicKeyHash_0),
    },
  };

  return [updatedState, proofHash];
};

// --- Witness Map (for contract binding) ---
// Names MUST match generated Witnesses<PS> type exactly.

export const accessControlWitnesses = {
  getCurrentTimestamp,
  computeSharingEventProofHash,
  lookupRoleCommitmentMerklePath,
};
