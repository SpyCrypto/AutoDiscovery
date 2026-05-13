// =============================================================================
// Discovery SDK — Barrel Exports
// =============================================================================

export { readStore, writeStore, clearStore } from './local-store';
export { computeCaseId, computeStepHash, shortId } from './case-hasher';
export { generateStepsFromRulePack } from './step-generator';
export { hashDocumentContent, hashDocumentMetadata, computeTwinBondHash, computeMerkleRoot } from './document-hasher';
