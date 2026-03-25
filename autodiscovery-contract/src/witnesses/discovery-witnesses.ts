// ============================================================================
// DISCOVERY-CORE WITNESS IMPLEMENTATIONS
// ============================================================================
//
// These functions run off-chain on the user's machine at transaction time.
// They provide private inputs to ZK circuits without revealing those inputs.
//
// IMPORTANT: Function names and signatures MUST match the generated types
// in managed/discovery-core/contract/index.d.ts exactly:
//
//   Witnesses<PS> = {
//     computeUniqueCaseIdentifier(ctx, caseNumber: Uint8Array, jurisdictionCode: Uint8Array): [PS, bigint]
//     computeUniqueStepHash(ctx, caseIdentifier: bigint, jurisdictionRuleReference: Uint8Array): [PS, bigint]
//     getCurrentTimestamp(ctx): [PS, bigint]
//   }
//
// NOTE: ownPublicKey() is NOT a witness — it's a built-in Compact function
// handled by the runtime. No witness implementation needed for caller identity.
// ============================================================================

import { type WitnessContext } from "@midnight-ntwrk/compact-runtime";
import type { Ledger } from "../managed/discovery-core/contract/index.js";
import { hashToField } from "./hash-utils.js";

// --- Private State Type ---
// Private state tracks off-chain data that only this user sees.
// The witness functions receive this state and can update it.

export type DiscoveryCorePrivateState = {
  // Local tracking of cases created by this user (case identifier → local metadata)
  ownedCaseIdentifiers: bigint[];
  // Local cache of step hashes for quick lookup (step hash → case identifier)
  stepHashToCaseIdentifier: Record<string, string>;
};

// --- Private State Factory ---

export const createDiscoveryCorePrivateState = (): DiscoveryCorePrivateState => ({
  ownedCaseIdentifiers: [],
  stepHashToCaseIdentifier: {},
});

// --- Witness Implementations ---

/**
 * computeUniqueCaseIdentifier
 *
 * Computes a unique case identifier from the case number and jurisdiction code.
 * Case ID = hash(caseNumber || jurisdictionCode).
 * The actual case number NEVER appears on-chain — only this hash.
 *
 * @param context  - WitnessContext with ledger state and private state
 * @param caseNumber_0 - Court-assigned case number as Bytes<32> (Uint8Array)
 * @param jurisdictionCode_0 - Jurisdiction code as Bytes<8> (Uint8Array)
 * @returns [updatedPrivateState, caseIdentifier]
 */
export const computeUniqueCaseIdentifier = (
  context: WitnessContext<Ledger, DiscoveryCorePrivateState>,
  caseNumber_0: Uint8Array,
  jurisdictionCode_0: Uint8Array,
): [DiscoveryCorePrivateState, bigint] => {
  const caseIdentifier = hashToField(caseNumber_0, jurisdictionCode_0);

  // Track this case in our private state
  const updatedState: DiscoveryCorePrivateState = {
    ...context.privateState,
    ownedCaseIdentifiers: [
      ...context.privateState.ownedCaseIdentifiers,
      caseIdentifier,
    ],
  };

  return [updatedState, caseIdentifier];
};

/**
 * computeUniqueStepHash
 *
 * Computes a unique hash for a discovery step within a case.
 * Step hash = hash(caseIdentifier || jurisdictionRuleReference).
 * Hides WHAT the step is while allowing unique on-chain tracking.
 *
 * @param context - WitnessContext with ledger state and private state
 * @param caseIdentifier_0 - The case this step belongs to (Field / bigint)
 * @param jurisdictionRuleReference_0 - Which rule creates this obligation (Bytes<32>)
 * @returns [updatedPrivateState, stepHash]
 */
export const computeUniqueStepHash = (
  context: WitnessContext<Ledger, DiscoveryCorePrivateState>,
  caseIdentifier_0: bigint,
  jurisdictionRuleReference_0: Uint8Array,
): [DiscoveryCorePrivateState, bigint] => {
  const stepHash = hashToField(caseIdentifier_0, jurisdictionRuleReference_0);

  // Cache the mapping from step hash to case identifier in private state
  const stepHashHex = stepHash.toString(16);
  const caseIdHex = caseIdentifier_0.toString(16);
  const updatedState: DiscoveryCorePrivateState = {
    ...context.privateState,
    stepHashToCaseIdentifier: {
      ...context.privateState.stepHashToCaseIdentifier,
      [stepHashHex]: caseIdHex,
    },
  };

  return [updatedState, stepHash];
};

/**
 * getCurrentTimestamp
 *
 * Returns the current Unix timestamp (seconds since epoch).
 * Used for recording when steps are completed and for deadline comparison.
 * Private state is not modified.
 *
 * @param context - WitnessContext with ledger state and private state
 * @returns [unchangedPrivateState, currentTimestamp]
 */
export const getCurrentTimestamp = (
  context: WitnessContext<Ledger, DiscoveryCorePrivateState>,
): [DiscoveryCorePrivateState, bigint] => {
  const timestamp = BigInt(Math.floor(Date.now() / 1000));
  return [context.privateState, timestamp];
};

// --- Witness Map (for contract binding) ---
// These names MUST match the generated Witnesses<PS> type exactly.

export const discoveryCoreWitnesses = {
  computeUniqueCaseIdentifier,
  computeUniqueStepHash,
  getCurrentTimestamp,
};
