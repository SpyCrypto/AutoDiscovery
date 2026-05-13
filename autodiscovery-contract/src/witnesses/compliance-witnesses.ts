// ============================================================================
// COMPLIANCE-PROOF WITNESS IMPLEMENTATIONS
// Off-chain computation for the compliance attestation contract.
// ============================================================================

import { createHash } from "node:crypto";
import type { WitnessContext } from "@midnight-ntwrk/compact-runtime";
import type { Ledger } from "../managed/compliance-proof/contract/index.js";

// --- Types ---

export type CompliancePrivateState = {
  generatedAttestations: string[];
};

// --- Private State Factory ---

export const createCompliancePrivateState = (): CompliancePrivateState => ({
  generatedAttestations: [],
});

// ---------------------------------------------------------------------------
// Witnesses — signatures MUST match generated index.d.ts exactly
// ---------------------------------------------------------------------------

/**
 * getCurrentTimestamp
 * Returns current Unix timestamp in seconds.
 */
export const getCurrentTimestamp = (
  context: WitnessContext<Ledger, CompliancePrivateState>,
): [CompliancePrivateState, bigint] => {
  return [context.privateState, BigInt(Math.floor(Date.now() / 1000))];
};

/**
 * computeUniqueAttestationHash
 * Mirrors: hash(caseId || stepHash || timestamp) → Bytes<32>
 * This becomes the immutable attestation identifier on the public ledger.
 */
export const computeUniqueAttestationHash = (
  context: WitnessContext<Ledger, CompliancePrivateState>,
  caseIdentifier_0: bigint,
  stepOrPhaseHash_0: bigint,
  attestationTimestamp_0: bigint,
): [CompliancePrivateState, Uint8Array] => {
  const input = Buffer.from(
    `${caseIdentifier_0.toString(16)}|${stepOrPhaseHash_0.toString(16)}|${attestationTimestamp_0.toString()}`,
    "utf8",
  );
  const hash = createHash("sha256").update(input).digest();
  return [context.privateState, new Uint8Array(hash)];
};

// --- Witness Map (matched to generated Witnesses<PS> type) ---

export const complianceWitnesses = {
  getCurrentTimestamp,
  computeUniqueAttestationHash,
};
