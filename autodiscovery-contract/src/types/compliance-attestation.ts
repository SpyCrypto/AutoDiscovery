// ============================================================================
// AutoDiscovery — ComplianceAttestation Entity
// The ZK proof metadata — the "killer feature" of AutoDiscovery.
// Each attestation is a cryptographic proof that a discovery obligation
// was met on time, without revealing case details.
//
// On-chain: attestation hashes stored in the compliance-proof contract.
// Off-chain: full metadata stored in this TypeScript model.
// ============================================================================

import { AttestationScope } from "./enums";

/**
 * A compliance attestation — proof that a discovery obligation was met.
 *
 * This is what gets presented to courts, opposing counsel, or insurance
 * carriers (per Spy: MedPro, TheDoctorsGroup, MIEC would want this).
 *
 * On-chain representation:
 *   - attestationHash: Bytes<32> (in attestations set)
 *   - timestamp: Field (in attestationTimestamps map)
 *   - scope: Uint<8> (in attestationScopes map)
 *
 * The hash proves the attestation exists; the on-chain data proves
 * when it was created. The full details below are off-chain and
 * selectively disclosed only when needed (e.g., court order).
 */
export interface ComplianceAttestation {
  /**
   * The attestation hash — the primary identifier.
   * Computed by the compliance-proof contract:
   * hash(caseId || stepHash || timestamp).
   * This hash is stored on-chain and can be independently verified.
   */
  readonly attestationHash: string;

  /** The case this attestation belongs to */
  readonly caseId: string;

  /**
   * Scope of this attestation — what level of compliance is proven.
   * - Step: single obligation completed on time
   * - Phase: all steps in a discovery phase completed
   * - Case: entire discovery process completed
   */
  readonly scope: AttestationScope;

  /**
   * The step this attestation covers (for step-level attestations).
   * Null for phase-level and case-level attestations.
   */
  readonly stepId: string | null;

  /**
   * The step hash from the on-chain contract.
   * Used to link this attestation back to the specific on-chain step record.
   */
  readonly stepHash: string | null;

  /**
   * Phase identifier (for phase-level attestations).
   * Example: "initial-disclosures", "written-discovery", "depositions"
   * Null for step-level and case-level attestations.
   */
  readonly phaseId: string | null;

  /**
   * For phase/case attestations: how many steps were included.
   */
  readonly totalSteps: number | null;

  /**
   * For phase/case attestations: how many steps were completed on time.
   */
  readonly completedSteps: number | null;

  /**
   * The deadline that was met (for step-level attestations).
   * Proves completion happened before this timestamp.
   */
  readonly deadlineTimestamp: Date | null;

  /**
   * When the obligation was actually completed.
   * Must be <= deadlineTimestamp for a valid compliance proof.
   */
  readonly completionTimestamp: Date | null;

  /**
   * When this attestation was generated and stored on-chain.
   * This is the timestamp recorded in the contract's attestationTimestamps map.
   */
  readonly attestedAt: Date;

  /**
   * Wallet address of the party who generated this attestation.
   * Usually the attorney managing the case.
   */
  readonly attestedBy: string;

  /**
   * The jurisdiction code at the time of attestation.
   * Important for cases that were removed to federal court mid-discovery.
   */
  readonly jurisdictionCode: string;

  /**
   * Version of the rule pack that was active when this attestation was created.
   * Anchors the attestation to a specific set of rules for audit purposes.
   * Example: "2024.01"
   */
  readonly rulePackVersion: string;

  /**
   * Whether this attestation has been selectively disclosed to anyone.
   * Once disclosed, the details are no longer fully private.
   */
  isDisclosed: boolean;

  /**
   * Who this attestation was disclosed to (if disclosed).
   * Example: ["Opposing counsel", "Ada County District Court"]
   */
  disclosedTo: string[];

  /** Date of disclosure, if applicable */
  disclosedAt: Date | null;

  /**
   * Whether this attestation has been verified by a third party.
   * Anyone can verify by calling verifyAttestation on the contract.
   */
  isVerified: boolean;

  /** Who verified this attestation (if verified) */
  verifiedBy: string | null;

  /** Date of verification */
  verifiedAt: Date | null;

  /**
   * Exportable proof summary — court-ready text with no blockchain jargon.
   * Generated for PDF export / compliance report.
   * Example: "Discovery obligation IRCP Rule 33 (Interrogatories) was
   * completed on 2025-03-15, 5 days before the March 20, 2025 deadline.
   * Verification hash: 0x7a3b..."
   */
  proofSummary: string | null;

  /** When this attestation record was created in the local system */
  readonly createdAt: Date;
}

/**
 * Input for generating a step-level compliance attestation.
 */
export interface AttestStepInput {
  readonly caseId: string;
  readonly stepId: string;
  readonly stepHash: string;
  readonly deadlineTimestamp: Date;
  readonly completionTimestamp: Date;
}

/**
 * Input for generating a phase-level compliance attestation.
 */
export interface AttestPhaseInput {
  readonly caseId: string;
  readonly phaseId: string;
  readonly totalSteps: number;
  readonly completedSteps: number;
}

/**
 * Input for generating a case-level compliance attestation.
 */
export interface AttestCaseInput {
  readonly caseId: string;
}

/**
 * Result of verifying an attestation on-chain.
 */
export interface AttestationVerificationResult {
  /** The hash that was verified */
  readonly attestationHash: string;
  /** Whether the attestation exists on-chain */
  readonly exists: boolean;
  /** The on-chain timestamp (if exists) */
  readonly onChainTimestamp: Date | null;
  /** The on-chain scope (if exists) */
  readonly onChainScope: AttestationScope | null;
  /** Whether the on-chain data matches the off-chain metadata */
  readonly isConsistent: boolean;
}
