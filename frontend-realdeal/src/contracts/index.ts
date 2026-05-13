/**
 * Contract Integration Layer for RealDeal Frontend
 *
 * This module provides the bridge between the UI providers and the
 * Midnight smart contract SDK. Each contract has a corresponding
 * connector that wraps the generated TypeScript API.
 *
 * Contract → Provider Mapping:
 * ┌─────────────────────────┬──────────────────────────┬───────────┐
 * │ Contract (.compact)     │ Provider Interface       │ Compiled? │
 * ├─────────────────────────┼──────────────────────────┼───────────┤
 * │ discovery-core          │ ICaseProvider            │ ✅ Yes    │
 * │ document-registry       │ IDocumentProvider        │ ✅ Yes    │
 * │ compliance-proof        │ IComplianceProvider      │ ✅ Yes    │
 * │ jurisdiction-registry   │ IJurisdictionProvider    │ ✅ Yes    │
 * │ access-control          │ IAccessControlProvider   │ ❌ No     │
 * │ expert-witness          │ IExpertWitnessProvider   │ ❌ No     │
 * └─────────────────────────┴──────────────────────────┴───────────┘
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
 */

// TODO: Import generated contract APIs when ready
// import { DiscoveryCoreContract } from '@autodiscovery/contract/managed/discovery-core';
// import { DocumentRegistryContract } from '@autodiscovery/contract/managed/document-registry';
// import { ComplianceProofContract } from '@autodiscovery/contract/managed/compliance-proof';
// import { JurisdictionRegistryContract } from '@autodiscovery/contract/managed/jurisdiction-registry';

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
 * All addresses are empty until contracts are deployed to preprod.
 */
export function getContractConfig(): ContractConfig {
  return {
    networkId: import.meta.env.VITE_MIDNIGHT_NETWORK || 'preprod',
    proofServerUrl: import.meta.env.VITE_PROOF_SERVER_URL || 'http://localhost:6300',
    indexerUrl: import.meta.env.VITE_INDEXER_URL || 'https://indexer.preprod.midnight.network/api/v1/graphql',
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
