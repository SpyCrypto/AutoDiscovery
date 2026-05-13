// ============================================================================
// DISCOVERY-CORE WITNESS IMPLEMENTATIONS
// These functions run off-chain and provide data to the Compact circuits
// at transaction time. They bridge the TypeScript world with the ZK world.
// ============================================================================

import { createHash } from "node:crypto";
import type { WitnessContext } from "@midnight-ntwrk/compact-runtime";
import type { Ledger } from "../managed/discovery-core/contract/index.js";

// --- Types ---

export type DiscoveryCorePrivateState = {
  // Local tracking of cases owned by this user
  ownedCaseIds: string[];
};

// --- Private State Factory ---

export const createDiscoveryCorePrivateState = (): DiscoveryCorePrivateState => ({
  ownedCaseIds: [],
});

// ---------------------------------------------------------------------------
// Hash utility: SHA-256 bytes → bigint (248-bit, safely within Midnight Field)
// ---------------------------------------------------------------------------

function sha256ToField(data: Buffer): bigint {
  const hash = createHash("sha256").update(data).digest();
  // Use first 31 bytes (248 bits) to stay safely within Midnight's field prime
  return BigInt("0x" + hash.slice(0, 31).toString("hex"));
}

// ---------------------------------------------------------------------------
// Witnesses — signatures MUST match generated index.d.ts exactly
// ---------------------------------------------------------------------------

/**
 * computeUniqueCaseIdentifier
 * Mirrors the contract witness: hash(caseNumber || jurisdictionCode) → Field
 */
export const computeUniqueCaseIdentifier = (
  context: WitnessContext<Ledger, DiscoveryCorePrivateState>,
  caseNumber_0: Uint8Array,
  jurisdictionCode_0: Uint8Array,
): [DiscoveryCorePrivateState, bigint] => {
  const input = Buffer.concat([
    Buffer.from(caseNumber_0),
    Buffer.from([0x7c]), // separator "|"
    Buffer.from(jurisdictionCode_0),
  ]);
  const caseId = sha256ToField(input);
  return [context.privateState, caseId];
};

/**
 * computeUniqueStepHash
 * Mirrors the contract witness: hash(caseIdentifier || ruleReference) → Field
 */
export const computeUniqueStepHash = (
  context: WitnessContext<Ledger, DiscoveryCorePrivateState>,
  caseIdentifier_0: bigint,
  jurisdictionRuleReference_0: Uint8Array,
): [DiscoveryCorePrivateState, bigint] => {
  const caseIdHex = caseIdentifier_0.toString(16).padStart(62, "0");
  const input = Buffer.concat([
    Buffer.from(caseIdHex, "hex"),
    Buffer.from([0x7c]),
    Buffer.from(jurisdictionRuleReference_0),
  ]);
  const stepHash = sha256ToField(input);
  return [context.privateState, stepHash];
};

/**
 * getCurrentTimestamp
 * Returns current Unix timestamp in seconds.
 */
export const getCurrentTimestamp = (
  context: WitnessContext<Ledger, DiscoveryCorePrivateState>,
): [DiscoveryCorePrivateState, bigint] => {
  return [context.privateState, BigInt(Math.floor(Date.now() / 1000))];
};

// --- Witness Map (matched to generated Witnesses<PS> type) ---

export const discoveryCoreWitnesses = {
  computeUniqueCaseIdentifier,
  computeUniqueStepHash,
  getCurrentTimestamp,
};
