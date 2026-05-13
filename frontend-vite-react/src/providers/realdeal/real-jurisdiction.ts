// =============================================================================
// RealDeal Jurisdiction Provider
// =============================================================================
// Implements IJurisdictionProvider by:
//   1. Loading local rule pack JSON from /public/rule-packs/
//   2. Computing SHA-256 of each rule pack
//   3. Querying the Midnight indexer for on-chain hashes (if deployed)
//   4. Merging local + on-chain data into JurisdictionRegistration objects
//
// GRACEFUL DEGRADATION:
//   - If VITE_CONTRACT_JURISDICTION_REGISTRY is empty → offline mode
//     (local rule packs only, verifiedOnChain = false)
//   - If indexer query fails → offline mode with a console warning
// =============================================================================

import type { IJurisdictionProvider, JurisdictionRegistration } from '../types';
import {
  loadRulePack,
  fetchRegistryStateFromIndexer,
  buildOfflineRegistryState,
  hashesMatch,
  RULE_PACK_FILENAMES,
} from '../../modules/midnight/jurisdiction-sdk';
import type { OnChainRegistryState } from '../../modules/midnight/jurisdiction-sdk';

const JURISDICTION_DISPLAY_NAMES: Record<string, string> = {
  ID: 'Idaho — IRCP',
  UT: 'Utah — URCP',
  WA: 'Washington — CR',
  CA: 'California — CCP',
  NY: 'New York — CPLR',
  FED: 'Federal — FRCP',
  OH: 'Ohio — Civ.R.',
  TX: 'Texas — TRCP',
  NV: 'Nevada — NRCP',
  WY: 'Wyoming — W.R.C.P.',
  MT: 'Montana — M.R.Civ.P.',
};

function buildRegistrationFromLocalPack(
  code: string,
  sha256: string,
  version: string,
  effectiveDate: string,
  totalRules: number,
  onChainEntry: OnChainRegistryState['jurisdictions'][number] | null,
): JurisdictionRegistration {
  const onChainHash = onChainEntry?.rulePackHash ?? null;
  const matchesChain = hashesMatch(sha256, onChainHash);

  return {
    id: `jreg-${code.toLowerCase()}`,
    jurisdictionCode: code,
    jurisdictionName: JURISDICTION_DISPLAY_NAMES[code] ?? code,
    rulePackVersion: onChainEntry?.rulePackVersion ?? parseInt(version.split('.')[0] ?? '1', 10),
    rulePackLabel: `v${version}`,
    effectiveDate,
    lastUpdated: new Date().toISOString().slice(0, 10),
    totalRules,
    verifiedOnChain: matchesChain,
    registryHash: onChainHash ?? sha256.slice(0, 32),
  };
}

export class RealJurisdictionProvider implements IJurisdictionProvider {
  private readonly indexerUrl: string;
  private readonly contractAddress: string;
  private registryState: OnChainRegistryState | null = null;
  private registrations: JurisdictionRegistration[] | null = null;

  constructor() {
    this.indexerUrl = import.meta.env.VITE_INDEXER_URL ?? '';
    this.contractAddress = import.meta.env.VITE_CONTRACT_JURISDICTION_REGISTRY ?? '';
  }

  private async getRegistryState(): Promise<OnChainRegistryState> {
    if (this.registryState) return this.registryState;

    if (!this.contractAddress || !this.indexerUrl) {
      const offline = buildOfflineRegistryState();
      this.registryState = offline;
      return offline;
    }

    try {
      const state = await fetchRegistryStateFromIndexer(this.indexerUrl, this.contractAddress);
      this.registryState = state;
      return state;
    } catch (err) {
      console.warn('[JurisdictionProvider] Indexer query failed, using offline mode:', err);
      const offline = buildOfflineRegistryState();
      this.registryState = offline;
      return offline;
    }
  }

  async getRegisteredJurisdictions(): Promise<JurisdictionRegistration[]> {
    if (this.registrations) return this.registrations;

    const registryState = await this.getRegistryState();

    const results: JurisdictionRegistration[] = [];

    for (const [code, filePath] of Object.entries(RULE_PACK_FILENAMES)) {
      try {
        const { rulePack, sha256 } = await loadRulePack(filePath);
        const onChainEntry = registryState.jurisdictions.find((j) => j.jurisdictionCode === code) ?? null;

        results.push(
          buildRegistrationFromLocalPack(
            code,
            sha256,
            rulePack.version,
            rulePack.effectiveDate,
            rulePack.rules.length,
            onChainEntry,
          ),
        );
      } catch (err) {
        console.warn(`[JurisdictionProvider] Could not load rule pack for ${code}:`, err);
      }
    }

    this.registrations = results;
    return results;
  }

  async getJurisdictionDetails(code: string): Promise<JurisdictionRegistration> {
    const all = await this.getRegisteredJurisdictions();
    const found = all.find((j) => j.jurisdictionCode === code);
    if (!found) {
      throw new Error(
        `Jurisdiction "${code}" is not registered. ` +
        `Available: ${all.map((j) => j.jurisdictionCode).join(', ')}`,
      );
    }
    return found;
  }

  async verifyRulePack(code: string): Promise<{ valid: boolean; message: string }> {
    const filePath = RULE_PACK_FILENAMES[code];
    if (!filePath) {
      return {
        valid: false,
        message: `No local rule pack found for jurisdiction "${code}". Rule pack file not yet added.`,
      };
    }

    let localHash: string;
    let totalRules: number;
    try {
      const { sha256, rulePack } = await loadRulePack(filePath);
      localHash = sha256;
      totalRules = rulePack.rules.length;
    } catch (err) {
      return {
        valid: false,
        message: `Failed to load local rule pack for ${code}: ${err instanceof Error ? err.message : String(err)}`,
      };
    }

    const registryState = await this.getRegistryState();
    const onChainEntry = registryState.jurisdictions.find((j) => j.jurisdictionCode === code);

    if (!onChainEntry) {
      return {
        valid: false,
        message:
          `Jurisdiction ${code} is not yet registered on-chain. ` +
          `Local rule pack loaded (${totalRules} rules, SHA-256: ${localHash.slice(0, 16)}…). ` +
          `Deploy the jurisdiction-registry contract and run registerNewJurisdiction("${code}", hash).`,
      };
    }

    const matches = hashesMatch(localHash, onChainEntry.rulePackHash);
    if (!matches) {
      return {
        valid: false,
        message:
          `Hash mismatch for ${code}! ` +
          `Local SHA-256: ${localHash.slice(0, 16)}… | ` +
          `On-chain: ${onChainEntry.rulePackHash.slice(0, 16)}… ` +
          `The local rule pack may be outdated. Pull the latest from the registry.`,
      };
    }

    return {
      valid: true,
      message:
        `Rule pack v${onChainEntry.rulePackVersion} verified — ` +
        `hash matches on-chain commitment (${localHash.slice(0, 16)}…). ` +
        `${totalRules} rules confirmed for ${JURISDICTION_DISPLAY_NAMES[code] ?? code}.`,
    };
  }
}
