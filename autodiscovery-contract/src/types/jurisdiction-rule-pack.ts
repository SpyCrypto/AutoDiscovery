// ============================================================================
// AutoDiscovery — JurisdictionRulePack Entity
// Defines the structure of a jurisdiction's discovery rules.
// Rule packs are stored as JSON files off-chain; their hashes are
// anchored on-chain via the jurisdiction-registry contract.
// ============================================================================

import {
  StepCategory,
  RuleType,
  DeadlineUnit,
  JurisdictionLevel,
  CaseType,
} from "./enums";
import { DeadlineSpec } from "./deadline";

/**
 * A single discovery rule within a jurisdiction's rule pack.
 * Each rule maps to one or more DiscoverySteps when a case is created.
 *
 * Example: IRCP Rule 33 (Interrogatories) becomes a rule entry with
 * its deadline, limits, exemptions, and sanctions.
 */
export interface JurisdictionRule {
  /**
   * Unique rule identifier within the pack.
   * Format: "{RULESET}-{section}" (e.g., "IRCP-33", "FRCP-26a").
   */
  readonly ruleId: string;

  /**
   * Human-readable rule reference for UI display.
   * Example: "IRCP Rule 33 — Interrogatories"
   */
  readonly ruleRef: string;

  /** Category — groups related rules for UI organization */
  readonly category: StepCategory;

  /** Plain-English description of the obligation */
  readonly description: string;

  /** Whether this rule is mandatory, optional, or conditional */
  readonly type: RuleType;

  /**
   * Relative deadline specification.
   * The deadline engine converts this to an absolute date.
   */
  readonly deadline: DeadlineSpec;

  /**
   * Numerical limits imposed by this rule.
   * Examples:
   *   - Interrogatories: { maxCount: 40 } (Idaho IRCP)
   *   - Depositions: { maxPerSide: 10, maxHoursPerDeponent: 7 } (FRCP default)
   *   - Request for Admissions: { maxCount: null } (no limit in Idaho per IRCP)
   */
  readonly limits: RuleLimits | null;

  /**
   * Case types exempt from this rule.
   * Example: some jurisdictions exempt med-mal from standard initial disclosures.
   * Per Spy: Idaho does NOT exempt med-mal from initial disclosures.
   */
  readonly exemptions: CaseType[];

  /**
   * Rule-specific parameters — typed per category.
   * Avoids generic Record<string, any> per BUILD_PLAN design decision.
   */
  readonly params: RuleParams;

  /**
   * Rules that must be completed before this one can start.
   * References other ruleIds within the same pack.
   */
  readonly dependencies: string[];

  /**
   * Sanctions description for non-compliance.
   * References the sanctions rule (e.g., "IRCP Rule 37").
   */
  readonly sanctions: string;

  /**
   * Whether this rule supports supplementation (IRCP Rule 26(e)).
   * If true, the system will generate supplementation steps when
   * new information is discovered after initial response.
   */
  readonly supportsSupplementation: boolean;
}

/**
 * Numerical limits for a rule — structured to avoid generic objects.
 */
export interface RuleLimits {
  /** Maximum number of items (e.g., 40 interrogatories in Idaho) */
  readonly maxCount: number | null;
  /** Maximum per side (e.g., 10 depositions per side in FRCP) */
  readonly maxPerSide: number | null;
  /** Duration cap in hours (e.g., 7 hours per deponent in FRCP) */
  readonly maxHoursPerDeponent: number | null;
  /** Page limit (e.g., 25 pages for depositions upon written questions) */
  readonly maxPages: number | null;
}

/**
 * Rule-specific parameters — typed union per category.
 * Each category has its own parameter shape instead of generic key-value.
 */
export type RuleParams =
  | InitialDisclosureParams
  | InterrogatoryParams
  | ProductionParams
  | DepositionParams
  | AdmissionParams
  | ExpertDisclosureParams
  | SubpoenaParams
  | GenericRuleParams;

export interface InitialDisclosureParams {
  readonly kind: "initial-disclosures";
  /** Whether computation of damages must be included */
  readonly includeDamagesComputation: boolean;
  /** Whether insurance agreements must be disclosed */
  readonly includeInsuranceAgreements: boolean;
}

export interface InterrogatoryParams {
  readonly kind: "interrogatories";
  /** Default response window in days */
  readonly responseWindowDays: number;
  /** Whether subparts count toward the limit */
  readonly subpartsCountTowardLimit: boolean;
}

export interface ProductionParams {
  readonly kind: "request-for-production";
  /** Default response window in days */
  readonly responseWindowDays: number;
  /** Whether electronically stored information is explicitly covered */
  readonly includesESI: boolean;
}

export interface DepositionParams {
  readonly kind: "depositions";
  /** Whether video depositions are explicitly permitted */
  readonly videoPermitted: boolean;
  /** Whether remote (telephonic/video) depositions are permitted */
  readonly remotePermitted: boolean;
}

export interface AdmissionParams {
  readonly kind: "request-for-admissions";
  /** Default response window in days */
  readonly responseWindowDays: number;
  /**
   * Whether unanswered requests are automatically deemed admitted.
   * Critical compliance trap — Spy would know this well.
   */
  readonly deemedAdmittedOnNoResponse: boolean;
}

export interface ExpertDisclosureParams {
  readonly kind: "expert-disclosure";
  /** Whether a written report is required */
  readonly reportRequired: boolean;
  /** Whether rebuttal expert disclosure has a separate deadline */
  readonly rebuttalDeadlineSeparate: boolean;
}

export interface SubpoenaParams {
  readonly kind: "subpoena";
  /**
   * Whether UIDDA (Uniform Interstate Depositions and Discovery Act) applies.
   * Per Spy: Idaho adopted UIDDA under IRCP 45(j).
   */
  readonly uiddaApplicable: boolean;
  /** Whether local counsel is required for out-of-state subpoenas */
  readonly localCounselRequired: boolean;
}

export interface GenericRuleParams {
  readonly kind: "generic";
  /** Catch-all for rule categories without specific params */
  readonly notes: string | null;
}

/**
 * Case-type-specific overrides within a rule pack.
 * Example: med-mal cases may have additional rules (affidavit of merit in Ohio)
 * or exemptions from standard rules.
 */
export interface CaseTypeOverride {
  /** Rules that are exempted for this case type */
  readonly exemptRules: string[];
  /** Additional rule IDs that apply only to this case type */
  readonly additionalRules: string[];
}

/**
 * Default values for the jurisdiction — used when a specific rule
 * doesn't specify its own value.
 */
export interface JurisdictionDefaults {
  /** Default response window in days (e.g., 28 days in Idaho) */
  readonly responseDays: number;
  /**
   * Business day rule for short deadlines.
   * "exclude_weekends_holidays_under_7" = only apply business-day math
   * for periods under 7 days (Idaho IRCP Rule 6 approach).
   */
  readonly businessDayRule: string;
}

/**
 * The complete rule pack for a jurisdiction.
 * This is the TypeScript representation of a rule-packs/*.json file.
 *
 * On-chain: the hash of the serialized JSON is stored in the
 * jurisdiction-registry contract for audit trail / verification.
 */
export interface JurisdictionRulePack {
  /** Jurisdiction code (e.g., "ID", "OH", "FRCP") */
  readonly jurisdictionCode: string;

  /** Full jurisdiction name (e.g., "Idaho") */
  readonly jurisdictionName: string;

  /** Title of the rules (e.g., "Idaho Rules of Civil Procedure (IRCP)") */
  readonly rulesTitle: string;

  /** Version identifier (e.g., "2024.01") — tracked on-chain */
  readonly version: string;

  /** Date these rules became effective */
  readonly effectiveDate: string;

  /**
   * Hierarchy of rule packs that apply, in override order.
   * Example: ["federal-frcp", "idaho-ircp"] means Idaho rules
   * override federal rules where they differ.
   */
  readonly hierarchy: string[];

  /** Default values for this jurisdiction */
  readonly defaults: JurisdictionDefaults;

  /** All discovery rules in this jurisdiction */
  readonly rules: JurisdictionRule[];

  /**
   * Case-type-specific overrides.
   * Keyed by CaseType enum values.
   */
  readonly caseTypeOverrides: Partial<Record<CaseType, CaseTypeOverride>>;

  /**
   * Statute of limitations by case type (in months or years).
   * Per Spy: Idaho med-mal = 2 years from injury date.
   */
  readonly statuteOfLimitations: Partial<Record<CaseType, StatuteOfLimitations>>;

  /** Non-economic damages cap, if applicable */
  readonly damagesCap: DamagesCap | null;
}

/**
 * Statute of limitations for a case type within a jurisdiction.
 */
export interface StatuteOfLimitations {
  /** Time limit in months */
  readonly months: number;
  /** What starts the clock (e.g., "date-of-injury", "date-of-discovery") */
  readonly fromEvent: string;
  /** Whether a discovery rule exception exists (can extend the deadline) */
  readonly discoveryRuleApplies: boolean;
  /** Additional notes (e.g., tolling for minors, etc.) */
  readonly notes: string | null;
}

/**
 * Non-economic damages cap for a jurisdiction.
 * Per Spy: Idaho's 2025 cap is $509,013.28.
 */
export interface DamagesCap {
  /** Maximum non-economic damages in USD */
  readonly maxNonEconomicDamages: number;
  /** Effective date of this cap amount */
  readonly effectiveDate: string;
  /** Whether the cap is adjusted periodically (Idaho adjusts annually) */
  readonly adjustedPeriodically: boolean;
  /** Notes on cap calculation methodology */
  readonly notes: string | null;
}
