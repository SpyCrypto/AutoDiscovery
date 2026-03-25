// --- Compiled Contract Modules ---
export * as Counter from "./managed/counter/contract/index.js";
export * as DiscoveryCore from "./managed/discovery-core/contract/index.js";
export * as DocumentRegistry from "./managed/document-registry/contract/index.js";
export * as ComplianceProof from "./managed/compliance-proof/contract/index.js";
export * as JurisdictionRegistry from "./managed/jurisdiction-registry/contract/index.js";
export * as AccessControl from "./managed/access-control/contract/index.js";
export * as ExpertWitness from "./managed/expert-witness/contract/index.js";

// --- Witness Implementations & Types ---
export * from "./witnesses/index.js";
export { type CounterPrivateState, createPrivateState, witnesses } from "./witnesses.js";
