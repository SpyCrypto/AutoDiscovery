// ============================================================================
// AutoDiscovery — Shared Enums
// Central enum definitions used across all entity types.
// These mirror the on-chain Uint<8> values where applicable.
// ============================================================================

// --- Case Lifecycle ---

/**
 * Overall status of a case in the discovery process.
 * On-chain: stored as Uint<8> in caseStatuses ledger.
 */
export enum CaseStatus {
  /** Case created but no steps generated yet */
  Created = "created",
  /** Discovery steps generated, work in progress */
  Active = "active",
  /** All discovery steps completed and attested */
  DiscoveryComplete = "discoveryComplete",
  /** Case closed (settlement, verdict, dismissal) */
  Closed = "closed",
  /** Case on appeal — discovery record may be reviewed */
  OnAppeal = "onAppeal",
}

/**
 * How the case concluded — tracked for Spy's requirement to monitor
 * whether discovery process interfered with case outcome.
 */
export enum CaseDisposition {
  /** Case not yet resolved */
  Pending = "pending",
  /** Settled before trial */
  Settlement = "settlement",
  /** Jury or bench trial verdict */
  Verdict = "verdict",
  /** Voluntary or involuntary dismissal */
  Dismissal = "dismissal",
  /** Summary judgment granted */
  SummaryJudgment = "summaryJudgment",
  /** Default judgment (failure to respond) */
  DefaultJudgment = "defaultJudgment",
}

// --- Discovery Steps ---

/**
 * Status of an individual discovery step/obligation.
 * On-chain: stored as Uint<8> in stepStatuses ledger.
 */
export enum StepStatus {
  /** Step identified but not yet actionable */
  NotStarted = "notStarted",
  /** Work underway on this step */
  InProgress = "inProgress",
  /** Step fulfilled and documented */
  Completed = "completed",
  /** Deadline passed without completion */
  Overdue = "overdue",
  /** Step waived by opposing counsel or court order */
  Waived = "waived",
  /** Objection filed — step disputed */
  Objected = "objected",
  /** Protected by privilege (logged on privilege log) */
  Protected = "protected",
}

/**
 * Category of discovery step — maps to IRCP/FRCP rule sections.
 */
export enum StepCategory {
  /** IRCP Rule 26(a) — mandatory initial disclosures */
  InitialDisclosures = "initial-disclosures",
  /** IRCP Rule 33 — written interrogatories */
  Interrogatories = "interrogatories",
  /** IRCP Rule 34 — request for production of documents */
  RequestForProduction = "request-for-production",
  /** IRCP Rule 36 — request for admissions */
  RequestForAdmissions = "request-for-admissions",
  /** IRCP Rule 30/31 — oral or written depositions */
  Depositions = "depositions",
  /** IRCP Rule 35 — physical/mental examination */
  PhysicalExamination = "physical-examination",
  /** IRCP Rule 26(b)(4) — expert witness disclosures */
  ExpertDisclosure = "expert-disclosure",
  /** Privilege log requirement (derived from Rule 26) */
  PrivilegeLog = "privilege-log",
  /** E-discovery obligations (IRCP Rule 34 scope) */
  EDiscovery = "e-discovery",
  /** Scheduling conference / order deadlines */
  SchedulingOrder = "scheduling-order",
  /** Subpoena-related (IRCP Rule 45, including UIDDA 45(j)) */
  Subpoena = "subpoena",
  /** Med-mal specific: standard of care documentation */
  StandardOfCare = "standard-of-care",
  /** Supplementation of prior responses (IRCP Rule 26(e)) */
  Supplementation = "supplementation",
}

/**
 * Type classification for a discovery rule — mandatory vs optional.
 */
export enum RuleType {
  /** Must be performed — no discretion */
  Mandatory = "mandatory",
  /** Available but not required unless requested */
  Optional = "optional",
  /** Triggered by specific conditions (e.g., case type) */
  Conditional = "conditional",
}

// --- Time Units ---

/**
 * Unit for deadline offset computation.
 * IRCP Rule 6 governs business day calculations in Idaho.
 */
export enum DeadlineUnit {
  /** Count every day including weekends/holidays */
  CalendarDays = "calendarDays",
  /** Exclude weekends and recognized holidays */
  BusinessDays = "businessDays",
}

// --- Parties ---

/**
 * Role of a party in the case.
 */
export enum PartyRole {
  Plaintiff = "plaintiff",
  Defendant = "defendant",
  /** Attorney representing a party */
  Attorney = "attorney",
  /** Expert witness (Phase 2 — med-mal specific) */
  ExpertWitness = "expertWitness",
  /** Third-party subpoena recipient */
  ThirdParty = "thirdParty",
}

// --- Case Types ---

/**
 * Type of civil case — determines which rule overrides apply.
 * Med-mal is the primary focus for MVP.
 */
export enum CaseType {
  /** Medical malpractice — PRIMARY MVP USE CASE */
  MedicalMalpractice = "med-mal",
  /** General contract dispute */
  Contract = "contract",
  /** Employment law */
  Employment = "employment",
  /** Personal injury (non-med-mal) */
  PersonalInjury = "personal-injury",
  /** Product liability */
  ProductLiability = "product-liability",
  /** General civil litigation */
  GeneralCivil = "general-civil",
}

// --- Compliance / Attestation ---

/**
 * Scope of a compliance attestation — what level of proof is generated.
 * On-chain: stored as Uint<8> in attestationScopes ledger.
 */
export enum AttestationScope {
  /** Single step completed on time */
  Step = "step",
  /** All steps in a discovery phase completed */
  Phase = "phase",
  /** Entire case discovery completed */
  Case = "case",
}

// --- Jurisdiction Hierarchy ---

/**
 * Level in the rule override hierarchy.
 * Higher levels override lower levels when conflicts exist.
 * In Idaho, Spy confirmed: no county-level overrides exist (all follow IRCP).
 */
export enum JurisdictionLevel {
  /** Federal Rules of Civil Procedure baseline */
  Federal = "federal",
  /** State rules (e.g., Idaho IRCP) — overrides federal */
  State = "state",
  /** County-specific local rules — overrides state (none in Idaho per Spy) */
  County = "county",
  /** Individual judge scheduling order — overrides everything */
  Judge = "judge",
}

// --- Alert / Warning Levels ---

/**
 * Severity levels for deadline warnings.
 * Per Spy's correction: warning comes BEFORE deadline, not after.
 * Flow: warning → deadline → escalation
 */
export enum AlertLevel {
  /** Informational — deadline approaching (configurable days out) */
  Warning = "warning",
  /** Deadline day — action required today */
  Deadline = "deadline",
  /** Deadline passed — escalation needed (motion to compel risk) */
  Escalation = "escalation",
}
