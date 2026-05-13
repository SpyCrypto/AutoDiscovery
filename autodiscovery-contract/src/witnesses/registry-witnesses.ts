// ============================================================================
// JURISDICTION-REGISTRY WITNESS IMPLEMENTATIONS
// Off-chain computation for the jurisdiction registry contract.
// ============================================================================

import { type WitnessContext } from "@midnight-ntwrk/compact-runtime";

// --- Types ---

export type RegistryPrivateState = {
  // Admin address for access control verification
  adminAddress: string;
  // Local cache of registered jurisdiction codes
  registeredCodes: string[];
};

// --- Private State Factory ---

export const createRegistryPrivateState = (adminAddress: string): RegistryPrivateState => ({
  adminAddress,
  registeredCodes: [],
});

// --- Witness Implementations ---

/**
 * Returns the caller's wallet address for admin access control.
 */
export const getCaller = (context: WitnessContext): string => {
  // TODO: Extract caller address from the transaction context
  throw new Error("getCaller witness not yet implemented — needs Midnight SDK integration");
};

/**
 * Computes a hash of the rule pack data for on-chain anchoring.
 * The hash proves which exact rules were in effect without storing them on-chain.
 */
export const computeRuleHash = (
  _context: WitnessContext,
  jurisdictionCode: Uint8Array,
  ruleData: bigint
): Uint8Array => {
  // TODO: Implement hash(jurisdictionCode || ruleData)
  // This hash anchors the off-chain JSON rule pack to the on-chain registry
  throw new Error("computeRuleHash witness not yet implemented — needs hash primitive");
};

// --- Witness Map ---

export const registryWitnesses = {
  getCaller,
  computeRuleHash,
};
