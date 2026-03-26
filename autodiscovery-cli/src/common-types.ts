import {
  DiscoveryCore, type DiscoveryCorePrivateState,
  JurisdictionRegistry, type RegistryPrivateState,
  ComplianceProof, type CompliancePrivateState,
  DocumentRegistry, type DocumentRegistryPrivateState,
  AccessControl, type AccessControlPrivateState,
  ExpertWitness, type ExpertWitnessPrivateState,
} from '@autodiscovery/contract';
import type { ImpureCircuitId, MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import type { DeployedContract, FoundContract } from '@midnight-ntwrk/midnight-js-contracts';

// --- DiscoveryCore ---

export type DiscoveryCoreCircuits = ImpureCircuitId<DiscoveryCore.Contract<DiscoveryCorePrivateState>>;
export const DiscoveryCorePrivateStateId = 'discoveryCorePrivateState';
export type DiscoveryCoreProviders = MidnightProviders<DiscoveryCoreCircuits, typeof DiscoveryCorePrivateStateId, DiscoveryCorePrivateState>;
export type DiscoveryCoreContract = DiscoveryCore.Contract<DiscoveryCorePrivateState>;
export type DeployedDiscoveryCoreContract = DeployedContract<DiscoveryCoreContract> | FoundContract<DiscoveryCoreContract>;

// --- JurisdictionRegistry ---

export type JurisdictionRegistryCircuits = ImpureCircuitId<JurisdictionRegistry.Contract<RegistryPrivateState>>;
export const JurisdictionRegistryPrivateStateId = 'jurisdictionRegistryPrivateState';
export type JurisdictionRegistryProviders = MidnightProviders<JurisdictionRegistryCircuits, typeof JurisdictionRegistryPrivateStateId, RegistryPrivateState>;
export type JurisdictionRegistryContract = JurisdictionRegistry.Contract<RegistryPrivateState>;
export type DeployedJurisdictionRegistryContract = DeployedContract<JurisdictionRegistryContract> | FoundContract<JurisdictionRegistryContract>;

// --- ComplianceProof ---

export type ComplianceProofCircuits = ImpureCircuitId<ComplianceProof.Contract<CompliancePrivateState>>;
export const ComplianceProofPrivateStateId = 'complianceProofPrivateState';
export type ComplianceProofProviders = MidnightProviders<ComplianceProofCircuits, typeof ComplianceProofPrivateStateId, CompliancePrivateState>;
export type ComplianceProofContract = ComplianceProof.Contract<CompliancePrivateState>;
export type DeployedComplianceProofContract = DeployedContract<ComplianceProofContract> | FoundContract<ComplianceProofContract>;

// --- DocumentRegistry ---

export type DocumentRegistryCircuits = ImpureCircuitId<DocumentRegistry.Contract<DocumentRegistryPrivateState>>;
export const DocumentRegistryPrivateStateId = 'documentRegistryPrivateState';
export type DocumentRegistryProviders = MidnightProviders<DocumentRegistryCircuits, typeof DocumentRegistryPrivateStateId, DocumentRegistryPrivateState>;
export type DocumentRegistryContract = DocumentRegistry.Contract<DocumentRegistryPrivateState>;
export type DeployedDocumentRegistryContract = DeployedContract<DocumentRegistryContract> | FoundContract<DocumentRegistryContract>;

// --- AccessControl ---

export type AccessControlCircuits = ImpureCircuitId<AccessControl.Contract<AccessControlPrivateState>>;
export const AccessControlPrivateStateId = 'accessControlPrivateState';
export type AccessControlProviders = MidnightProviders<AccessControlCircuits, typeof AccessControlPrivateStateId, AccessControlPrivateState>;
export type AccessControlContract = AccessControl.Contract<AccessControlPrivateState>;
export type DeployedAccessControlContract = DeployedContract<AccessControlContract> | FoundContract<AccessControlContract>;

// --- ExpertWitness ---

export type ExpertWitnessCircuits = ImpureCircuitId<ExpertWitness.Contract<ExpertWitnessPrivateState>>;
export const ExpertWitnessPrivateStateId = 'expertWitnessPrivateState';
export type ExpertWitnessProviders = MidnightProviders<ExpertWitnessCircuits, typeof ExpertWitnessPrivateStateId, ExpertWitnessPrivateState>;
export type ExpertWitnessContract = ExpertWitness.Contract<ExpertWitnessPrivateState>;
export type DeployedExpertWitnessContract = DeployedContract<ExpertWitnessContract> | FoundContract<ExpertWitnessContract>;

// --- Shared ---

export type UserAction = {
  createNewCase: string | undefined;
  addDiscoveryStepToCase: string | undefined;
  markDiscoveryStepAsCompleted: string | undefined;
};

export type DerivedState = {
  readonly totalCasesCreated: DiscoveryCore.Ledger["totalCasesCreated"];
};

export const emptyState: DerivedState = {
  totalCasesCreated: 0n,
};
