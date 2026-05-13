// =============================================================================
// Jurisdiction SDK — Barrel Exports
// =============================================================================

export { loadRulePack, sha256Hex, hashesMatch, clearRulePackCache } from './api/rule-pack-loader';
export { fetchRegistryStateFromIndexer, buildOfflineRegistryState } from './api/indexer-api';
export {
  computeDeadlineDate,
  computeAllDeadlines,
  findNextDeadline,
  getOverdueRules,
  getRulesByCategory,
} from './deadline-engine';

export type {
  RulePack,
  RulePackRule,
  DeadlineDefinition,
  DeadlineUnit,
  TimeComputationConfig,
  OnChainJurisdictionEntry,
  OnChainRegistryState,
  ResolvedJurisdiction,
  ComputedDeadline,
} from './types';

export { RULE_PACK_FILENAMES } from './types';
