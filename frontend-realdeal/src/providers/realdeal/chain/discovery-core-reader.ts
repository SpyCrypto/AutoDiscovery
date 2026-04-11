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

// --- Contract Ledger Parser ---
// Imported from the compiled contract package. When @autodiscovery/contract
// is installed and built, this provides typed ledger state parsing.
let _ledgerParser: ((state: unknown) => unknown) | null = null;
try {
  // Dynamic import so missing package doesn't break the module at load time
  import('@autodiscovery/contract').then((m) => {
    _ledgerParser = (m.DiscoveryCore as unknown as { ledger: (s: unknown) => unknown }).ledger ?? null;
  }).catch(() => {
    _ledgerParser = null;
  });
} catch {
  _ledgerParser = null;
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
  return import.meta.env.VITE_INDEXER_URL || 'https://indexer.preprod.midnight.network/api/v3/graphql';
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

    const normalizedId = onChainCaseIdentifier.toLowerCase().replace(/^0x/, '');

    // Prefer the compiled ledger parser when available
    if (_ledgerParser) {
      try {
        const parsed = _ledgerParser(rawState) as {
          caseStatusByCaseIdentifier: {
            member(key: bigint): boolean;
            lookup(key: bigint): bigint;
          };
          jurisdictionCodeByCaseIdentifier: {
            member(key: bigint): boolean;
            lookup(key: bigint): Uint8Array;
          };
        };
        const caseIdBigInt = BigInt('0x' + normalizedId);
        const exists = parsed.caseStatusByCaseIdentifier.member(caseIdBigInt);
        if (exists) {
          const statusCode = Number(parsed.caseStatusByCaseIdentifier.lookup(caseIdBigInt));
          let jurisdictionCode: string | null = null;
          if (parsed.jurisdictionCodeByCaseIdentifier.member(caseIdBigInt)) {
            const jBytes = parsed.jurisdictionCodeByCaseIdentifier.lookup(caseIdBigInt);
            jurisdictionCode = new TextDecoder().decode(jBytes).replace(/\0+$/, '');
          }
          return { exists: true, statusCode, jurisdictionCode };
        }
        return { exists: false, statusCode: -1, jurisdictionCode: null };
      } catch (parseError) {
        console.warn('[DiscoveryCoreReader] Ledger parser failed, falling back to heuristic:', parseError);
      }
    }

    // Fallback: raw hex substring heuristic
    const exists = rawState.toLowerCase().includes(normalizedId);
    if (exists) {
      return { exists: true, statusCode: 1, jurisdictionCode: null };
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

    const normalizedHash = onChainStepHash.toLowerCase().replace(/^0x/, '');

    // Prefer the compiled ledger parser when available
    if (_ledgerParser) {
      try {
        const parsed = _ledgerParser(rawState) as {
          isStepCompletedByStepHash: {
            member(key: bigint): boolean;
            lookup(key: bigint): boolean;
          };
        };
        const stepHashBigInt = BigInt('0x' + normalizedHash);
        const exists = parsed.isStepCompletedByStepHash.member(stepHashBigInt);
        if (exists) {
          const completed = parsed.isStepCompletedByStepHash.lookup(stepHashBigInt);
          return { exists: true, completed };
        }
        return { exists: false, completed: false };
      } catch (parseError) {
        console.warn('[DiscoveryCoreReader] Ledger parser failed for step status, falling back to heuristic:', parseError);
      }
    }

    // Fallback: raw hex substring heuristic
    const exists = rawState.toLowerCase().includes(normalizedHash);
    return { exists, completed: false };
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

    // Prefer the compiled ledger parser when available
    if (_ledgerParser) {
      try {
        const parsed = _ledgerParser(rawState) as {
          completionAttestationHashes: {
            member(key: bigint): boolean;
          };
        };
        const hashBigInt = BigInt('0x' + normalizedHash);
        return parsed.completionAttestationHashes.member(hashBigInt);
      } catch (parseError) {
        console.warn('[DiscoveryCoreReader] Ledger parser failed for attestation check, falling back to heuristic:', parseError);
      }
    }

    // Fallback: raw hex substring heuristic
    return rawState.toLowerCase().includes(normalizedHash);
  } catch (error) {
    console.warn(
      `[DiscoveryCoreReader] Attestation check failed for ${attestationHash.slice(0, 16)}...:`,
      error,
    );
    return false;
  }
}
