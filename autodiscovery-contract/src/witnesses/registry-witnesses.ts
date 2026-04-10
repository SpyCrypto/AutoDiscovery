// ============================================================================
// JURISDICTION-REGISTRY WITNESS IMPLEMENTATIONS
// ============================================================================
//
// The jurisdiction-registry contract has NO witnesses.
// Generated: Witnesses<PS> = {} (empty)
//
// All operations (registerNewJurisdiction, updateJurisdictionRulePack,
// verifyRulePackHashMatchesExpected) are pure circuit logic with no
// off-chain witness inputs needed. Hashes are passed directly as
// circuit parameters rather than computed in witnesses.
//
// This file only exports the private state type and an empty witness map
// for consistency with the other contract witness modules.
// ============================================================================

// --- Private State Type ---
// Even with no witnesses, we track local state for the frontend's benefit.

export type RegistryPrivateState = {
  // Local cache of registered jurisdiction codes (for quick UI lookups)
  registeredJurisdictionCodes: string[];
};

// --- Private State Factory ---

export const createRegistryPrivateState = (): RegistryPrivateState => ({
  registeredJurisdictionCodes: []
});

// --- Witness Map (empty — contract has no witnesses) ---

export const registryWitnesses = {};
