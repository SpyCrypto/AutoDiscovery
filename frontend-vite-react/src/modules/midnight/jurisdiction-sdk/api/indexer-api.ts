// =============================================================================
// Midnight Indexer API — Jurisdiction Registry Queries
// =============================================================================
// Reads PUBLIC ledger state from the jurisdiction-registry contract
// via the Midnight Network indexer REST API.
//
// On-chain public state we can read:
//   - totalJurisdictionsRegistered (Counter)
//   - registeredJurisdictionCodes  (Map<Bytes<8>, Boolean>)
//   - currentRulePackHashByJurisdictionCode (Map<Bytes<8>, Bytes<32>>)
//   - currentRulePackVersionByJurisdictionCode (Map<Bytes<8>, Uint<32>>)
// =============================================================================

import type { OnChainRegistryState, OnChainJurisdictionEntry } from '../types';

// ---------------------------------------------------------------------------
// Indexer response shape (Midnight testnet indexer v1 format)
// ---------------------------------------------------------------------------

interface IndexerContractStateResponse {
  contractAddress: string;
  state: {
    totalJurisdictionsRegistered?: number;
    registeredJurisdictionCodes?: Record<string, boolean>;
    currentRulePackHashByJurisdictionCode?: Record<string, string>;
    currentRulePackVersionByJurisdictionCode?: Record<string, number>;
  };
}

// ---------------------------------------------------------------------------
// Query
// ---------------------------------------------------------------------------

export async function fetchRegistryStateFromIndexer(
  indexerUrl: string,
  contractAddress: string,
): Promise<OnChainRegistryState> {
  const url = `${indexerUrl.replace(/\/$/, '')}/contracts/${contractAddress}/state`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(
      `Indexer query failed for contract ${contractAddress}: HTTP ${response.status} ${response.statusText}`,
    );
  }

  const data = (await response.json()) as IndexerContractStateResponse;
  const s = data.state ?? {};

  const registeredCodes = s.registeredJurisdictionCodes ?? {};
  const hashes = s.currentRulePackHashByJurisdictionCode ?? {};
  const versions = s.currentRulePackVersionByJurisdictionCode ?? {};

  const jurisdictions: OnChainJurisdictionEntry[] = Object.entries(registeredCodes)
    .filter(([, isRegistered]) => isRegistered)
    .map(([code]) => ({
      jurisdictionCode: code.trim().replace(/\0/g, ''),
      rulePackHash: hashes[code] ?? '',
      rulePackVersion: versions[code] ?? 0,
      isRegistered: true,
    }));

  return {
    totalJurisdictionsRegistered: s.totalJurisdictionsRegistered ?? jurisdictions.length,
    jurisdictions,
    fetchedAt: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Registry not yet deployed — return empty offline state
// ---------------------------------------------------------------------------

export function buildOfflineRegistryState(): OnChainRegistryState {
  return {
    totalJurisdictionsRegistered: 0,
    jurisdictions: [],
    fetchedAt: new Date().toISOString(),
  };
}
