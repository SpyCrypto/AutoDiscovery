// ============================================================================
// LOCAL CASE STORAGE — Off-chain case metadata persistence
// ============================================================================
//
// The discovery-core contract only stores hashes and status flags on-chain.
// Rich case data (titles, parties, step descriptions, deadlines) must be
// stored off-chain. This module manages that data in localStorage.
//
// Data flow:
//   1. User creates a case in the UI
//   2. We save the full case metadata here (localStorage)
//   3. We hash the case number + jurisdiction and send that hash on-chain
//   4. On-chain: only hash + status exist. Off-chain: full case details.
//   5. When reading: we merge local metadata with on-chain status.
//
// For MVP, localStorage is sufficient. In production, this would be
// IndexedDB, an encrypted local database, or a privacy-preserving backend.
// ============================================================================

import type {
  Case,
  CreateCaseParams,
  CaseStatus,
  DiscoveryStep,
  Party,
} from '../../types';

// --- Storage Keys ---

const STORAGE_KEY_CASES = 'adl_realdeal_cases';
const STORAGE_KEY_STEPS = 'adl_realdeal_steps';
const STORAGE_KEY_CASE_CHAIN_MAP = 'adl_realdeal_case_chain_map';

// --- Chain Mapping ---
// Maps local case IDs to on-chain case identifiers (bigint hex strings)
// so we can correlate local metadata with on-chain state.

export interface CaseChainMapping {
  localCaseId: string;
  onChainCaseIdentifier: string; // bigint as hex string
  onChainStepHashes: Record<string, string>; // local step ID → on-chain step hash hex
}

// --- Helper: Generate a local UUID-style ID ---

function generateLocalId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

// --- Read / Write Helpers ---

function readFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeToStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// --- Case CRUD ---

export function getAllCases(): Case[] {
  return readFromStorage<Case[]>(STORAGE_KEY_CASES, []);
}

export function getCaseById(caseId: string): Case | undefined {
  const cases = getAllCases();
  return cases.find((c) => c.id === caseId);
}

export function createCaseLocally(params: CreateCaseParams): Case {
  const cases = getAllCases();
  const now = new Date().toISOString();

  const newCase: Case = {
    id: generateLocalId(),
    caseNumber: params.caseNumber,
    title: params.title,
    jurisdiction: params.jurisdiction,
    caseType: params.caseType,
    status: 'active' as CaseStatus,
    filingDate: now,
    parties: params.parties.map((p) => ({ ...p, id: generateLocalId() })),
    documentCount: 0,
    stepsComplete: 0,
    stepsTotal: 0,
    complianceScore: 0,
    createdAt: now,
    updatedAt: now,
  };

  cases.push(newCase);
  writeToStorage(STORAGE_KEY_CASES, cases);
  return newCase;
}

export function updateCaseLocally(caseId: string, updates: Partial<Case>): Case | undefined {
  const cases = getAllCases();
  const index = cases.findIndex((c) => c.id === caseId);
  if (index === -1) return undefined;

  cases[index] = {
    ...cases[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  writeToStorage(STORAGE_KEY_CASES, cases);
  return cases[index];
}

// --- Step CRUD ---

export function getStepsForCase(caseId: string): DiscoveryStep[] {
  const allSteps = readFromStorage<DiscoveryStep[]>(STORAGE_KEY_STEPS, []);
  return allSteps.filter((s) => s.caseId === caseId);
}

export function addStepLocally(step: Omit<DiscoveryStep, 'id'>): DiscoveryStep {
  const allSteps = readFromStorage<DiscoveryStep[]>(STORAGE_KEY_STEPS, []);

  const newStep: DiscoveryStep = {
    ...step,
    id: generateLocalId(),
  };

  allSteps.push(newStep);
  writeToStorage(STORAGE_KEY_STEPS, allSteps);

  // Update the parent case step counts
  const cases = getAllCases();
  const caseIndex = cases.findIndex((c) => c.id === step.caseId);
  if (caseIndex !== -1) {
    const caseSteps = allSteps.filter((s) => s.caseId === step.caseId);
    cases[caseIndex].stepsTotal = caseSteps.length;
    cases[caseIndex].stepsComplete = caseSteps.filter((s) => s.status === 'complete').length;
    cases[caseIndex].updatedAt = new Date().toISOString();
    writeToStorage(STORAGE_KEY_CASES, cases);
  }

  return newStep;
}

export function updateStepLocally(stepId: string, updates: Partial<DiscoveryStep>): DiscoveryStep | undefined {
  const allSteps = readFromStorage<DiscoveryStep[]>(STORAGE_KEY_STEPS, []);
  const index = allSteps.findIndex((s) => s.id === stepId);
  if (index === -1) return undefined;

  allSteps[index] = { ...allSteps[index], ...updates };
  writeToStorage(STORAGE_KEY_STEPS, allSteps);

  // Recalculate parent case step counts
  const caseId = allSteps[index].caseId;
  const caseSteps = allSteps.filter((s) => s.caseId === caseId);
  updateCaseLocally(caseId, {
    stepsTotal: caseSteps.length,
    stepsComplete: caseSteps.filter((s) => s.status === 'complete').length,
  });

  return allSteps[index];
}

// --- Party Access ---

export function getPartiesForCase(caseId: string): Party[] {
  const caseData = getCaseById(caseId);
  return caseData?.parties ?? [];
}

// --- Chain Mapping ---
// Links local case/step IDs to their on-chain hash identifiers.

export function getChainMappings(): CaseChainMapping[] {
  return readFromStorage<CaseChainMapping[]>(STORAGE_KEY_CASE_CHAIN_MAP, []);
}

export function setChainMapping(mapping: CaseChainMapping): void {
  const mappings = getChainMappings();
  const existingIndex = mappings.findIndex((m) => m.localCaseId === mapping.localCaseId);
  if (existingIndex !== -1) {
    mappings[existingIndex] = mapping;
  } else {
    mappings.push(mapping);
  }
  writeToStorage(STORAGE_KEY_CASE_CHAIN_MAP, mappings);
}

export function getChainMappingForCase(localCaseId: string): CaseChainMapping | undefined {
  return getChainMappings().find((m) => m.localCaseId === localCaseId);
}

// --- Text → Bytes Conversion Helpers ---
// The contract expects Bytes<32> and Bytes<8> for case numbers and jurisdiction codes.
// These helpers convert human-readable strings to the correct byte format.

export function caseNumberToBytes32(caseNumber: string): Uint8Array {
  const bytes = new Uint8Array(32);
  const encoded = new TextEncoder().encode(caseNumber);
  // Copy up to 32 bytes, zero-padded on the right
  bytes.set(encoded.slice(0, 32));
  return bytes;
}

export function jurisdictionToBytes8(jurisdiction: string): Uint8Array {
  const bytes = new Uint8Array(8);
  const encoded = new TextEncoder().encode(jurisdiction);
  // Copy up to 8 bytes, zero-padded on the right
  bytes.set(encoded.slice(0, 8));
  return bytes;
}

export function ruleReferenceToBytes32(ruleReference: string): Uint8Array {
  const bytes = new Uint8Array(32);
  const encoded = new TextEncoder().encode(ruleReference);
  bytes.set(encoded.slice(0, 32));
  return bytes;
}

export function hexToBytes32(hexString: string): Uint8Array {
  const bytes = new Uint8Array(32);
  const cleaned = hexString.replace(/^0x/, '').padStart(64, '0').slice(0, 64);
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(cleaned.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}
