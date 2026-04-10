// ============================================================================
// REALDEAL CASE PROVIDER → discovery-core.compact
// ============================================================================
//
// This is the REAL implementation of ICaseProvider, wired to the
// discovery-core smart contract on Midnight Preprod.
//
// ARCHITECTURE (hybrid off-chain + on-chain):
//
//   ┌─────────────────────────────────────────────────────────────┐
//   │ UI Components                                               │
//   │   listCases(), getCase(), createCase(), getCaseSteps()      │
//   └────────────────────┬────────────────────────────────────────┘
//                        │
//   ┌────────────────────▼────────────────────────────────────────┐
//   │ RealCaseProvider (this file)                                │
//   │   Merges off-chain metadata with on-chain verification      │
//   └────────┬─────────────────────────────────┬──────────────────┘
//            │                                 │
//   ┌────────▼──────────┐            ┌─────────▼─────────────────┐
//   │ Local Storage      │            │ On-Chain Reader            │
//   │ (case-storage.ts)  │            │ (discovery-core-reader.ts) │
//   │                    │            │                            │
//   │ Rich metadata:     │            │ Public ledger:             │
//   │ - Case titles      │            │ - Case existence (hash)    │
//   │ - Party names      │            │ - Case status (uint8)      │
//   │ - Step descriptions│            │ - Step completion (bool)   │
//   │ - Deadlines        │            │ - Attestation hashes       │
//   └───────────────────┘            └────────────────────────────┘
//
// READ OPERATIONS: Work now (local storage + indexer queries)
// WRITE OPERATIONS: Require wallet integration (Phase 2)
//   When wallet is connected, writes will:
//   1. Save metadata locally
//   2. Call the contract circuit (createNewCase, addDiscoveryStepToCase, etc.)
//   3. Store the on-chain hash mapping for future verification
//
// ============================================================================

import type {
  ICaseProvider,
  Case,
  CreateCaseParams,
  DiscoveryStep,
  Party,
} from '../types';

import {
  getAllCases,
  getCaseById,
  createCaseLocally,
  getStepsForCase,
  getPartiesForCase,
  getChainMappingForCase,
  setChainMapping,
  caseNumberToBytes32,
  jurisdictionToBytes8,
} from './storage/case-storage';

import {
  getOnChainCaseStatus,
  CASE_STATUS_LABELS,
} from './chain/discovery-core-reader';

import {
  isWalletConnected,
  getDeployedContract,
} from '../../contracts/midnight-connection';

import { ContractCallError } from '../../lib/errors';

// --- Wallet Connection State ---
// Write operations check the MidnightConnectionManager for wallet availability.
// When the wallet is connected, writes anchor data on-chain via contract circuits.

// ============================================================================
// PROVIDER IMPLEMENTATION
// ============================================================================

export class RealCaseProvider implements ICaseProvider {

  // --- READ OPERATIONS (work now) ---

  /**
   * List all cases the user has created.
   * Reads from local storage and optionally enriches with on-chain status.
   */
  async listCases(): Promise<Case[]> {
    const localCases = getAllCases();

    // Enrich each case with on-chain verification status if a chain mapping exists
    const enrichedCases = await Promise.all(
      localCases.map(async (localCase) => {
        return this.enrichCaseWithOnChainData(localCase);
      }),
    );

    return enrichedCases;
  }

  /**
   * Get a single case by its local ID.
   * Merges local metadata with on-chain state.
   */
  async getCase(caseId: string): Promise<Case> {
    const localCase = getCaseById(caseId);
    if (!localCase) {
      throw new Error(`[RealCaseProvider] Case not found: ${caseId}`);
    }
    return this.enrichCaseWithOnChainData(localCase);
  }

  /**
   * Create a new legal case.
   *
   * Phase 1: Saves metadata locally only.
   * Phase 2: Also calls discovery-core.createNewCase circuit
   *   to anchor the case hash on-chain, then stores the chain mapping.
   */
  async createCase(params: CreateCaseParams): Promise<Case> {
    // Step 1: Save the full case metadata locally
    const newCase = createCaseLocally(params);

    // Step 2: Attempt on-chain anchoring (only if wallet is connected)
    if (isWalletConnected()) {
      const deployed = getDeployedContract('discovery-core');
      if (deployed) {
        try {
          // Call the contract circuit to anchor the case on-chain
          const caseNumberBytes = caseNumberToBytes32(params.caseNumber);
          const jurisdictionBytes = jurisdictionToBytes8(params.jurisdiction);
          const tx = await deployed.callTx.createNewCase(caseNumberBytes, jurisdictionBytes);
          const onChainCaseId = tx.public.result;
          setChainMapping({
            localCaseId: newCase.id,
            onChainCaseIdentifier: onChainCaseId.toString(16),
            onChainStepHashes: {},
          });
          console.info(
            `[RealCaseProvider] Case "${newCase.title}" anchored on-chain. Identifier: ${onChainCaseId.toString(16).slice(0, 16)}...`,
          );
        } catch (error) {
          // On-chain anchoring failed — case is still saved locally
          throw new ContractCallError('createNewCase', error);
        }
      }
    } else {
      console.info(
        `[RealCaseProvider] Case "${newCase.title}" saved locally. ` +
        'Connect wallet to anchor on-chain.',
      );
    }

    return newCase;
  }

  /**
   * Get all discovery steps for a case.
   * Returns local step data, enriched with on-chain completion status
   * when chain mappings are available.
   */
  async getCaseSteps(caseId: string): Promise<DiscoveryStep[]> {
    const localSteps = getStepsForCase(caseId);

    // Enrich with on-chain completion status if we have chain mappings
    const chainMapping = getChainMappingForCase(caseId);
    if (chainMapping) {
      // For each local step, check if we have an on-chain hash and verify its status
      // This is Phase 2 — requires the ledger parser to be linked
      // For now, return local steps as-is
    }

    return localSteps;
  }

  /**
   * Get all parties involved in a case.
   * Parties are stored locally (they're not on-chain).
   */
  async getCaseParties(caseId: string): Promise<Party[]> {
    return getPartiesForCase(caseId);
  }

  // --- PRIVATE HELPERS ---

  /**
   * Merges a locally-stored case with on-chain verification data.
   * If no chain mapping exists (case not yet anchored), returns the local data as-is.
   */
  private async enrichCaseWithOnChainData(localCase: Case): Promise<Case> {
    const chainMapping = getChainMappingForCase(localCase.id);

    if (!chainMapping) {
      // Case exists locally but hasn't been anchored on-chain yet
      return localCase;
    }

    try {
      // Query on-chain status for this case
      const onChainStatus = await getOnChainCaseStatus(chainMapping.onChainCaseIdentifier);

      if (onChainStatus.exists) {
        // Merge on-chain status with local metadata
        const statusLabel = CASE_STATUS_LABELS[onChainStatus.statusCode];
        return {
          ...localCase,
          // On-chain status overrides local status when available
          status: statusLabel === 'completed' ? 'closed' : localCase.status,
          // Add compliance score based on on-chain data
          complianceScore: onChainStatus.statusCode === 2 ? 100 : localCase.complianceScore,
        };
      }
    } catch (error) {
      // On-chain lookup failed — fall back to local data silently
      console.warn(
        `[RealCaseProvider] On-chain enrichment failed for case ${localCase.id}:`,
        error,
      );
    }

    return localCase;
  }
}
