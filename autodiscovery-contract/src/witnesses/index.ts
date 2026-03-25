// ============================================================================
// WITNESS BARREL EXPORTS
// ============================================================================
// Re-exports all witness implementations and types for all ADL contracts.
// ============================================================================

export { hashToField, hashToBytes32 } from "./hash-utils.js";

export {
  discoveryCoreWitnesses,
  computeUniqueCaseIdentifier,
  computeUniqueStepHash,
  getCurrentTimestamp as discoveryGetCurrentTimestamp,
  createDiscoveryCorePrivateState,
  type DiscoveryCorePrivateState,
} from "./discovery-witnesses.js";

export {
  complianceWitnesses,
  computeUniqueAttestationHash,
  getCurrentTimestamp as complianceGetCurrentTimestamp,
  createCompliancePrivateState,
  type CompliancePrivateState,
} from "./compliance-witnesses.js";

export {
  registryWitnesses,
  createRegistryPrivateState,
  type RegistryPrivateState,
} from "./registry-witnesses.js";

export {
  documentRegistryWitnesses,
  computeTwinBondHash,
  buildMerkleRootFromDocumentHashes,
  getCurrentTimestamp as documentGetCurrentTimestamp,
  createDocumentRegistryPrivateState,
  type DocumentRegistryPrivateState,
} from "./document-registry-witnesses.js";

export {
  accessControlWitnesses,
  computeSharingEventProofHash,
  getCurrentTimestamp as accessControlGetCurrentTimestamp,
  createAccessControlPrivateState,
  type AccessControlPrivateState,
} from "./access-control-witnesses.js";

export {
  expertWitnessWitnesses,
  computeExpertIdentifierHash,
  createExpertWitnessPrivateState,
  type ExpertWitnessPrivateState,
} from "./expert-witness-witnesses.js";
