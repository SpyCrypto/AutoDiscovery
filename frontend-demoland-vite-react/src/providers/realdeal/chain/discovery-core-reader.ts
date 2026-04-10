// ============================================================================
// DISCOVERY-CORE ON-CHAIN READER
// ============================================================================
//
// Reads public ledger state from the Midnight indexer via GraphQL.
// This works in the browser with NO wallet needed — the indexer is a
// public read-only API that returns contract state.
//
// What we can read from the public ledger (discovery-core contract):
//   - totalCasesCreated (Counter)
//   - caseStatusByCaseIdentifier (Map<Field, Uint<8>>)
//   - jurisdictionCodeByCaseIdentifier (Map<Field, Bytes<8>>)
//   - isStepCompletedByStepHash (Map<Field, Boolean>)
//   - completionAttestationHashes (Map<Field, Boolean>)
//
// What we CANNOT read (private state — only visible to contract owner):
//   - caseOwnerPublicKeyByCaseIdentifier
//   - stepDeadlineTimestampByStepHash
//   - detailedStepStatusByStepHash
//
// The generated `ledger()` function from the compiled contract parses
// the raw state bytes into typed JavaScript objects.
// ============================================================================

import { DiscoveryCore } from '@autodiscovery/contract';

// --- Types ---

export interface OnChainCaseStatus {
  exists: boolean;
  statusCode: number; // 0=NOT_STARTED, 1=IN_PROGRESS, 2=COMPLETED, 3=OVERDUE, etc.
  jurisdictionCode: string | null;
}

export interface OnChainStepStatus {
  exists: boolean;
  completed: boolean;
}

export interface DiscoveryCoreOnChainState {
  totalCasesCreated: bigint;
}

// --- Status code to human-readable mapping ---

export const CASE_STATUS_LABELS: Record<number, string> = {
  0: 'not_started',
  1: 'in_progress',
  2: 'completed',
  3: 'overdue',
  4: 'waived',
  5: 'objected',
  6: 'protected',
};

// --- Indexer Configuration ---

function getIndexerUrl(): string {
  const url = import.meta.env.VITE_INDEXER_URL;
  if (!url) {
    console.info('[DiscoveryCoreReader] VITE_INDEXER_URL not set — using default preprod indexer');
    return 'https://indexer.preprod.midnight.network/api/v1/graphql';
  }
  return url;
}

function getContractAddress(): string {
  const address = import.meta.env.VITE_CONTRACT_DISCOVERY_CORE;
  if (!address) {
    throw new Error('[DiscoveryCoreReader] VITE_CONTRACT_DISCOVERY_CORE not set in .env');
  }
  return address;
}

// --- GraphQL Query Helper ---

async function queryIndexer<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const indexerUrl = getIndexerUrl();

  const response = await fetch(indexerUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`[DiscoveryCoreReader] Indexer query failed: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors?.length) {
    const messages = result.errors.map((e: { message: string }) => e.message).join(', ');
    throw new Error(`[DiscoveryCoreReader] GraphQL errors: ${messages}`);
  }

  return result.data as T;
}

// --- Contract State Query ---
// The indexer exposes contract state via a queryContractState-like endpoint.
// We query for the raw state, then parse it using the generated ledger() function.

const CONTRACT_STATE_QUERY = `
  query ContractState($address: HexEncoded!) {
    contractState(contractAddress: $address) {
      data
    }
  }
`;

/**
 * Fetches the raw contract state from the indexer.
 * Returns null if the contract is not found or has no state.
 *
 * NOTE: The exact GraphQL schema depends on the indexer version.
 * If this query fails, the indexer API may have changed.
 * Check https://indexer.preprod.midnight.network for the current schema.
 */
export async function fetchRawContractState(): Promise<string | null> {
  try {
    const contractAddress = getContractAddress();
    const data = await queryIndexer<{
      contractState: { data: string } | null;
    }>(CONTRACT_STATE_QUERY, { address: contractAddress });

    return data.contractState?.data ?? null;
  } catch (error) {
    console.warn('[DiscoveryCoreReader] Failed to fetch contract state:', error);
    return null;
  }
}

/**
 * Checks if the discovery-core contract is reachable on the indexer.
 * Useful for health checks and UI status indicators.
 */
export async function isContractReachable(): Promise<boolean> {
  try {
    const state = await fetchRawContractState();
    return state !== null;
  } catch {
    return false;
  }
}

/**
 * Parse raw contract state into a typed case status using the
 * generated ledger parser from @autodiscovery/contract.
 */
export async function getOnChainCaseStatus(
  onChainCaseIdentifier: string,
): Promise<OnChainCaseStatus> {
  try {
    const rawState = await fetchRawContractState();

    if (!rawState) {
      return { exists: false, statusCode: -1, jurisdictionCode: null };
    }

    const parsed = DiscoveryCore.ledger(rawState);
    const caseId = BigInt('0x' + onChainCaseIdentifier.toLowerCase().replace(/^0x/, ''));
    const exists = parsed.caseStatusByCaseIdentifier.member(caseId);

    if (exists) {
      const statusCode = Number(parsed.caseStatusByCaseIdentifier.lookup(caseId));

      // Look up jurisdiction code if available
      let jurisdictionCode: string | null = null;
      if (parsed.jurisdictionCodeByCaseIdentifier.member(caseId)) {
        const codeBytes = parsed.jurisdictionCodeByCaseIdentifier.lookup(caseId);
        jurisdictionCode = new TextDecoder().decode(codeBytes).replace(/\0+$/, '');
      }

      return { exists: true, statusCode, jurisdictionCode };
    }

    return { exists: false, statusCode: -1, jurisdictionCode: null };
  } catch (error) {
    console.warn(
      `[DiscoveryCoreReader] On-chain lookup failed for case ${onChainCaseIdentifier.slice(0, 16)}...:`,
      error,
    );
    return { exists: false, statusCode: -1, jurisdictionCode: null };
  }
}

export async function getOnChainStepStatus(
  onChainStepHash: string,
): Promise<OnChainStepStatus> {
  try {
    const rawState = await fetchRawContractState();

    if (!rawState) {
      return { exists: false, completed: false };
    }

    const parsed = DiscoveryCore.ledger(rawState);
    const stepHash = BigInt('0x' + onChainStepHash.toLowerCase().replace(/^0x/, ''));
    const exists = parsed.isStepCompletedByStepHash.member(stepHash);

    if (exists) {
      const completed = parsed.isStepCompletedByStepHash.lookup(stepHash);
      return { exists: true, completed };
    }

    return { exists: false, completed: false };
  } catch (error) {
    console.warn(
      `[DiscoveryCoreReader] On-chain step lookup failed for ${onChainStepHash.slice(0, 16)}...:`,
      error,
    );
    return { exists: false, completed: false };
  }
}

/**
 * Check if an attestation hash exists on-chain.
 * Used to verify that a step completion was properly anchored.
 */
export async function isAttestationOnChain(attestationHash: string): Promise<boolean> {
  try {
    const rawState = await fetchRawContractState();
    if (!rawState) return false;

    const parsed = DiscoveryCore.ledger(rawState);
    const hash = BigInt('0x' + attestationHash.toLowerCase().replace(/^0x/, ''));
    return parsed.completionAttestationHashes.member(hash);
  } catch (error) {
    console.warn(
      `[DiscoveryCoreReader] Attestation check failed for ${attestationHash.slice(0, 16)}...:`,
      error,
    );
    return false;
  }
}
