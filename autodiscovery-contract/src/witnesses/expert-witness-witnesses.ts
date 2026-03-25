// ============================================================================
// EXPERT-WITNESS WITNESS IMPLEMENTATIONS
// ============================================================================
//
// Off-chain computation for the expert witness registry contract.
// Computes identifier hashes from expert credential data.
//
// IMPORTANT: Function names and signatures MUST match the generated types
// in managed/expert-witness/contract/index.d.ts exactly:
//
//   Witnesses<PS> = {
//     computeExpertIdentifierHash(ctx, expertCredentialData: bigint): [PS, Uint8Array]
//   }
// ============================================================================

import { type WitnessContext } from "@midnight-ntwrk/compact-runtime";
import type { Ledger } from "../managed/expert-witness/contract/index.js";
import { hashToBytes32 } from "./hash-utils.js";

// --- Private State Type ---

export type ExpertWitnessPrivateState = {
  // Local cache of expert identifier hashes registered by this user (hex strings)
  registeredExpertHashes: string[];
};

// --- Private State Factory ---

export const createExpertWitnessPrivateState = (): ExpertWitnessPrivateState => ({
  registeredExpertHashes: [],
});

// --- Witness Implementations ---

/**
 * computeExpertIdentifierHash
 *
 * Computes a unique identifier hash from an expert's credential data.
 * The credential data (bigint) encodes the expert's qualifications.
 * The resulting hash is stored on-chain so courts can verify an expert
 * is registered without revealing their actual credentials.
 *
 * @param context - WitnessContext with ledger and private state
 * @param expertCredentialData_0 - Encoded credential data (Field / bigint)
 * @returns [updatedPrivateState, expertIdentifierHash as Bytes<32>]
 */
export const computeExpertIdentifierHash = (
  context: WitnessContext<Ledger, ExpertWitnessPrivateState>,
  expertCredentialData_0: bigint,
): [ExpertWitnessPrivateState, Uint8Array] => {
  const result = hashToBytes32(expertCredentialData_0);

  // Track in private state
  const hashHex = Array.from(result)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const updatedState: ExpertWitnessPrivateState = {
    ...context.privateState,
    registeredExpertHashes: [
      ...context.privateState.registeredExpertHashes,
      hashHex,
    ],
  };

  return [updatedState, result];
};

// --- Witness Map (for contract binding) ---
// Names MUST match generated Witnesses<PS> type exactly.

export const expertWitnessWitnesses = {
  computeExpertIdentifierHash,
};
