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
  return import.meta.env.VITE_INDEXER_URL || 'https://indexer.preprod.midnight.network/api/v1/graphql';
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
 * Parse raw contract state into a typed case status.
 *
 * When @autodiscovery/contract is linked as a workspace dependency,
 * this will use the generated ledger parser:
 *   import { ledger } from '@autodiscovery/contract';
 *   const parsed = ledger(rawState);
 *   parsed.caseStatusByCaseIdentifier.lookup(caseId);
 *
 * Until the contract package is built and linked, this queries the
 * indexer for raw state and attempts to determine case existence.
 */
export async function getOnChainCaseStatus(
  onChainCaseIdentifier: string,
): Promise<OnChainCaseStatus> {
  try {
    const rawState = await fetchRawContractState();

    if (!rawState) {
      return { exists: false, statusCode: -1, jurisdictionCode: null };
    }

    // The raw state is a hex-encoded byte string from the indexer.
    // When the contract ledger parser is linked, this becomes:
    //   const parsed = ledger(rawState);
    //   const exists = parsed.caseStatusByCaseIdentifier.member(BigInt('0x' + id));
    //   const status = parsed.caseStatusByCaseIdentifier.lookup(BigInt('0x' + id));
    //
    // For now, check if the case identifier appears in the raw state bytes.
    // This is a best-effort heuristic until the full parser is available.
    const normalizedId = onChainCaseIdentifier.toLowerCase().replace(/^0x/, '');
    const exists = rawState.toLowerCase().includes(normalizedId);

    if (exists) {
      console.info(
        `[DiscoveryCoreReader] Case ${normalizedId.slice(0, 16)}... found in raw state. ` +
        'Full status parsing requires @autodiscovery/contract dependency.',
      );
      return {
        exists: true,
        statusCode: 1, // IN_PROGRESS — conservative default until parser is linked
        jurisdictionCode: null,
      };
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

    // Same approach as getOnChainCaseStatus — check raw state for hash presence.
    // Full parsing requires the contract ledger parser.
    const normalizedHash = onChainStepHash.toLowerCase().replace(/^0x/, '');
    const exists = rawState.toLowerCase().includes(normalizedHash);

    return { exists, completed: false }; // Completion flag requires parsed state
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

    const normalizedHash = attestationHash.toLowerCase().replace(/^0x/, '');
    return rawState.toLowerCase().includes(normalizedHash);
  } catch (error) {
    console.warn(
      `[DiscoveryCoreReader] Attestation check failed for ${attestationHash.slice(0, 16)}...:`,
      error,
    );
    return false;
  }
}
