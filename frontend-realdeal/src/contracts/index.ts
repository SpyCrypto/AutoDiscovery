/**
 * Contract Integration Layer for RealDeal Frontend
 *
 * This module provides the bridge between the UI providers and the
 * Midnight smart contract SDK. Each contract has a corresponding
 * connector that wraps the generated TypeScript API.
 *
 * Contract → Provider Mapping:
 * ┌─────────────────────────┬──────────────────────────┬──────────────────────┐
 * │ Contract (.compact)     │ Provider Interface       │ Status               │
 * ├─────────────────────────┼──────────────────────────┼──────────────────────┤
 * │ discovery-core          │ ICaseProvider            │ ✅ Phase 1 + Phase 2 │
 * │ document-registry       │ IDocumentProvider        │ ✅ Phase 1 + Phase 2 │
 * │ compliance-proof        │ IComplianceProvider      │ ✅ Phase 1 + Phase 2 │
 * │ jurisdiction-registry   │ IJurisdictionProvider    │ ✅ Phase 1 + Phase 2 │
 * │ access-control          │ IAccessControlProvider   │ ✅ Phase 1 + Phase 2 │
 * │ expert-witness          │ IExpertWitnessProvider   │ ✅ Phase 1 + Phase 2 │
 * └─────────────────────────┴──────────────────────────┴──────────────────────┘
 *
 * All 6 contracts are compiled (0.29.0) and deployed to Preprod (v2).
 * discovery-core is the first to be wired with a real provider.
 *
 * Off-chain services (no contract):
 *   - IAuthProvider        → Midnight wallet + DID
 *   - IAIProvider          → External AI microservice
 *   - IContactProvider     → Local storage / off-chain DB
 *   - IEmailSafetyProvider → Email gateway service
 *
 * Network: Preprod (VITE_MIDNIGHT_NETWORK)
 * Proof Server: 7.0.0 on port 6300
 * Compiler: 0.29.0 / language >= 0.20
 *
 * ARCHITECTURE NOTE:
 *   Reads (public ledger) use the indexer GraphQL API — works in browser, no wallet.
 *   Writes (circuit calls) require wallet + proof server — Phase 2.
 *   Rich metadata (case titles, parties, etc.) lives in localStorage — the
 *   contract only stores hashes and flags.
 */

export interface ContractConfig {
  networkId: string;
  proofServerUrl: string;
  indexerUrl: string;
  contractAddresses: {
    discoveryCore?: string;
    documentRegistry?: string;
    complianceProof?: string;
    jurisdictionRegistry?: string;
    accessControl?: string;
    expertWitness?: string;
  };
}

/**
 * Reads contract configuration from environment variables.
 * All 6 contract addresses are populated from the v2 deployment (Feb 26 2026).
 */
export function getContractConfig(): ContractConfig {
  return {
    networkId: import.meta.env.VITE_MIDNIGHT_NETWORK || 'preprod',
    proofServerUrl: import.meta.env.VITE_PROOF_SERVER_URL || 'http://localhost:6300',
    indexerUrl: import.meta.env.VITE_INDEXER_URL || 'https://indexer.preprod.midnight.network/api/v3/graphql',
    contractAddresses: {
      discoveryCore: import.meta.env.VITE_CONTRACT_DISCOVERY_CORE || undefined,
      documentRegistry: import.meta.env.VITE_CONTRACT_DOCUMENT_REGISTRY || undefined,
      complianceProof: import.meta.env.VITE_CONTRACT_COMPLIANCE_PROOF || undefined,
      jurisdictionRegistry: import.meta.env.VITE_CONTRACT_JURISDICTION_REGISTRY || undefined,
      accessControl: import.meta.env.VITE_CONTRACT_ACCESS_CONTROL || undefined,
      expertWitness: import.meta.env.VITE_CONTRACT_EXPERT_WITNESS || undefined,
    },
  };
}

/**
 * Checks whether a contract address is configured.
 * Returns true if the address exists and is non-empty.
 */
export function isContractConfigured(contractName: keyof ContractConfig['contractAddresses']): boolean {
  const config = getContractConfig();
  const address = config.contractAddresses[contractName];
  return !!address && address.length > 0;
}

/**
 * Returns a summary of which contracts are configured.
 * Useful for health checks and status displays.
 */
export function getContractConfigSummary(): Record<string, boolean> {
  const config = getContractConfig();
  return Object.fromEntries(
    Object.entries(config.contractAddresses).map(([name, address]) => [
      name,
      !!address && address.length > 0,
    ]),
  );
}
