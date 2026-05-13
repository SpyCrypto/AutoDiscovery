// =============================================================================
// Jurisdiction SDK — Types
// =============================================================================
// Mirrors the shape of the rule pack JSON files in
// autodiscovery-contract/src/rule-packs/
// =============================================================================

export type DeadlineUnit = 'calendarDays' | 'businessDays';

export interface DeadlineDefinition {
  offset: number;
  unit: DeadlineUnit;
  fromEvent: string;
}

export interface RulePackRule {
  ruleId: string;
  ruleRef: string;
  category:
    | 'initial-disclosures'
    | 'interrogatories'
    | 'rfp'
    | 'rfa'
    | 'depositions'
    | 'experts'
    | 'esi'
    | 'privilege'
    | 'sanctions'
    | 'meet-and-confer'
    | 'general';
  description: string;
  type: 'mandatory' | 'optional' | 'conditional';
  deadline: DeadlineDefinition | null;
  limits: Record<string, number | string> | null;
  exemptions: string[];
  sanctions: string;
  supportsSupplementation: boolean;
  params?: Record<string, unknown>;
  dependencies?: string[];
}

export interface TimeComputationConfig {
  excludeTriggerDay: boolean;
  countEveryDay: boolean;
  lastDayExtension: string;
  mailServiceAdditionalDays: number;
}

export interface RulePack {
  jurisdictionCode: string;
  jurisdictionName: string;
  rulesTitle: string;
  version: string;
  effectiveDate: string;
  hierarchy: string[];
  source: string;
  validatedBySpy: boolean;
  timeComputation: TimeComputationConfig;
  defaults: {
    responseDays: number;
    businessDayRule: 'extend_last_day_only' | 'skip_all_non_business' | 'none';
  };
  rules: RulePackRule[];
}

// ---------------------------------------------------------------------------
// On-chain Registry State (read from Midnight indexer)
// ---------------------------------------------------------------------------

export interface OnChainJurisdictionEntry {
  jurisdictionCode: string;
  rulePackHash: string;
  rulePackVersion: number;
  isRegistered: boolean;
}

export interface OnChainRegistryState {
  totalJurisdictionsRegistered: number;
  jurisdictions: OnChainJurisdictionEntry[];
  fetchedAt: string;
}

// ---------------------------------------------------------------------------
// Resolved Jurisdiction (local JSON + on-chain verification merged)
// ---------------------------------------------------------------------------

export interface ResolvedJurisdiction {
  jurisdictionCode: string;
  jurisdictionName: string;
  rulesTitle: string;
  rulePackVersion: string;
  effectiveDate: string;
  totalRules: number;
  localHash: string;
  onChainHash: string | null;
  hashMatchesOnChain: boolean;
  verifiedOnChain: boolean;
  source: string;
  rulePack: RulePack;
}

// ---------------------------------------------------------------------------
// Deadline Computation Result
// ---------------------------------------------------------------------------

export interface ComputedDeadline {
  ruleId: string;
  ruleRef: string;
  description: string;
  triggerEvent: string;
  triggerDate: Date;
  deadlineDate: Date;
  daysFromTrigger: number;
  isOverdue: boolean;
  daysRemaining: number;
}

// ---------------------------------------------------------------------------
// Known rule pack file names (indexed by jurisdiction code)
// ---------------------------------------------------------------------------

export const RULE_PACK_FILENAMES: Record<string, string> = {
  ID: '/rule-packs/idaho-ircp.json',
};
