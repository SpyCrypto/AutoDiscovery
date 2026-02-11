// ============================================================================
// AutoDiscovery — Case Entity
// The top-level entity. Every discovery workflow starts with a Case.
// On-chain: caseId, status, and jurisdiction stored publicly.
// Off-chain: full case details stored in this TypeScript model.
// ============================================================================

import { CaseStatus, CaseDisposition, CaseType } from "./enums";
import { SchedulingOverride } from "./deadline";

/**
 * A civil litigation case being tracked through the discovery process.
 *
 * The Case is the root entity — all other entities (steps, documents,
 * parties, attestations) are linked to a Case via caseId.
 *
 * On-chain representation:
 *   - caseId: Field (hash commitment of caseNumber + jurisdictionCode)
 *   - status: Uint<8> (maps to CaseStatus enum)
 *   - jurisdictionCode: Bytes<8>
 */
export interface Case {
  /**
   * Unique identifier — deterministic hash of caseNumber + jurisdictionCode.
   * Matches the on-chain Field value computed by the computeCaseId witness.
   */
  readonly caseId: string;

  /**
   * Court-assigned case number (e.g., "CV01-24-12345").
   * Private — never stored on-chain directly. Used as input to the hash.
   */
  readonly caseNumber: string;

  /**
   * Display title for the case (e.g., "Doe v. St. Luke's Medical Center").
   * Not stored on-chain — UI convenience only.
   */
  readonly caseTitle: string;

  /** Type of case — determines which rule overrides apply */
  readonly caseType: CaseType;

  /**
   * Primary jurisdiction code (e.g., "ID" for Idaho).
   * Determines which rule pack is loaded.
   * Stored on-chain in caseJurisdictions ledger.
   */
  readonly jurisdictionCode: string;

  /**
   * County within the jurisdiction (e.g., "Ada", "Canyon").
   * Per Spy: Idaho counties all follow IRCP (no local overrides).
   * Kept for future jurisdictions where county rules differ.
   */
  readonly county: string | null;

  /**
   * Assigned judge name — relevant for scheduling order overrides.
   * Per Spy: no judge-specific patterns in Idaho, but kept for flexibility.
   */
  readonly assignedJudge: string | null;

  /** Current status of the case */
  status: CaseStatus;

  /**
   * How the case concluded — tracked per Spy's requirement to monitor
   * whether discovery process interfered with case outcome.
   * Null while case is still active.
   */
  disposition: CaseDisposition | null;

  /**
   * Notes on the disposition outcome — for post-case analysis.
   * Spy wants this to identify potential discovery reform needs.
   */
  dispositionNotes: string | null;

  /** Date the complaint was filed with the court */
  readonly filingDate: Date;

  /** Scheduled trial date (if set) — used for deadline calculations */
  trialDate: Date | null;

  /**
   * Date the joinder deadline was set by the court.
   * Many Idaho deadlines are computed relative to this date
   * (e.g., initial disclosures = 30 days after joinder deadline).
   */
  joinderDeadline: Date | null;

  /**
   * Discovery cutoff date — after this, no more discovery allowed.
   * Usually set by scheduling order.
   */
  discoveryCutoffDate: Date | null;

  /**
   * Scheduling order overrides — when a judge sets specific dates
   * that replace computed deadlines. Array because there may be
   * multiple amendments to the scheduling order.
   */
  schedulingOverrides: SchedulingOverride[];

  /**
   * Whether the case was removed from state to federal court.
   * Per Spy: happens in Idaho when higher dollar amounts are requested.
   * When true, discovery rules switch to FRCP.
   */
  removedToFederal: boolean;

  /** Date of removal to federal court, if applicable */
  federalRemovalDate: Date | null;

  /**
   * Whether the case is currently on appeal.
   * Per Spy: track this to analyze discovery impact on outcomes.
   */
  onAppeal: boolean;

  /** Date appeal was filed, if applicable */
  appealDate: Date | null;

  /** Wallet address of the case owner (the attorney managing discovery) */
  readonly ownerAddress: string;

  /** When this case record was created in the system */
  readonly createdAt: Date;

  /** Last time any field on this case was updated */
  updatedAt: Date;
}

/**
 * Input for creating a new case — the minimum required to start.
 * Other fields are computed or set later.
 */
export interface CreateCaseInput {
  readonly caseNumber: string;
  readonly caseTitle: string;
  readonly caseType: CaseType;
  readonly jurisdictionCode: string;
  readonly county: string | null;
  readonly filingDate: Date;
  readonly trialDate: Date | null;
  readonly joinderDeadline: Date | null;
}
