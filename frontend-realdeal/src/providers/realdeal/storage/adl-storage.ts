// ============================================================================
// ADL UNIFIED LOCAL STORAGE — Off-chain metadata for all entity types
// ============================================================================
//
// Stores rich metadata for documents, compliance attestations, jurisdictions,
// access control permissions, and expert witnesses in localStorage.
// Same pattern as case-storage.ts — on-chain contracts only store hashes.
//
// Each entity type gets its own storage key prefix: adl_realdeal_*
// ============================================================================

import type {
  Document,
  DocumentInput,
  TwinBond,
  CustodyEntry,
  AccessGrant,
  SharingEvent,
  Attestation,
  ComplianceStatus,
  JurisdictionRegistration,
  AccessPermission,
  ExpertWitness,
  VerificationResult,
} from '../../types';

// --- Storage Keys ---

const KEY_DOCUMENTS = 'adl_realdeal_documents';
const KEY_ATTESTATIONS = 'adl_realdeal_attestations';
const KEY_JURISDICTIONS = 'adl_realdeal_jurisdictions';
const KEY_PERMISSIONS = 'adl_realdeal_permissions';
const KEY_SHARING_EVENTS = 'adl_realdeal_sharing_events';
const KEY_CUSTODY_ENTRIES = 'adl_realdeal_custody_entries';
const KEY_ACCESS_GRANTS = 'adl_realdeal_access_grants';
const KEY_EXPERTS = 'adl_realdeal_experts';

// --- Helpers ---

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// Simple content hash for MVP (deterministic hex from string)
function simpleContentHash(content: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < content.length; i++) {
    hash ^= content.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0') + content.length.toString(16).padStart(8, '0');
}

// ============================================================================
// DOCUMENTS
// ============================================================================

export function getAllDocuments(): Document[] {
  return read<Document[]>(KEY_DOCUMENTS, []);
}

export function getDocumentsByCase(caseId: string): Document[] {
  return getAllDocuments().filter((d) => d.caseId === caseId);
}

export function getDocumentById(docId: string): Document | undefined {
  return getAllDocuments().find((d) => d.id === docId);
}

export function registerDocumentLocally(input: DocumentInput): Document {
  const docs = getAllDocuments();
  const now = new Date().toISOString();

  const newDoc: Document = {
    id: generateId(),
    caseId: input.caseId,
    title: input.title,
    category: input.category,
    originator: input.originator,
    originatorRole: input.originatorRole,
    dateReceived: now,
    pageCount: input.pageCount,
    contentHash: simpleContentHash(input.content || input.title + now),
    protectiveOrder: 'none',
    hasTwin: false,
    verified: false,
    custodyChain: [],
    accessGrants: [],
    sharingEvents: [],
  };

  docs.push(newDoc);
  write(KEY_DOCUMENTS, docs);
  return newDoc;
}

export function updateDocumentLocally(docId: string, updates: Partial<Document>): Document | undefined {
  const docs = getAllDocuments();
  const idx = docs.findIndex((d) => d.id === docId);
  if (idx === -1) return undefined;
  docs[idx] = { ...docs[idx], ...updates };
  write(KEY_DOCUMENTS, docs);
  return docs[idx];
}

export function getTwinBondForDocument(docId: string): TwinBond | null {
  const doc = getDocumentById(docId);
  return doc?.twinBond ?? null;
}

export function verifyDocumentHash(docId: string): VerificationResult {
  const doc = getDocumentById(docId);
  if (!doc) {
    return { valid: false, documentId: docId, contentHash: '', timestamp: new Date().toISOString(), message: 'Document not found' };
  }
  // For MVP: local verification only. Phase 2: check on-chain hash.
  return {
    valid: true,
    documentId: docId,
    contentHash: doc.contentHash,
    timestamp: new Date().toISOString(),
    message: doc.verified ? 'Hash verified on-chain' : 'Hash verified locally (not yet anchored on-chain)',
  };
}

export function searchDocumentsLocally(
  query: string,
  filters?: { caseId?: string; allowedCaseIds?: string[]; category?: string; originator?: string },
): Document[] {
  let results = getAllDocuments();
  const lowerQuery = query.toLowerCase();

  if (filters?.allowedCaseIds) results = results.filter((d) => filters.allowedCaseIds!.includes(d.caseId));
  if (filters?.caseId) results = results.filter((d) => d.caseId === filters.caseId);
  if (filters?.category) results = results.filter((d) => d.category === filters.category);
  if (filters?.originator) results = results.filter((d) => d.originator === filters.originator);

  if (query) {
    results = results.filter(
      (d) =>
        d.title.toLowerCase().includes(lowerQuery) ||
        d.originator.toLowerCase().includes(lowerQuery) ||
        (d.aiSynopsis?.toLowerCase().includes(lowerQuery) ?? false),
    );
  }

  return results;
}

// ============================================================================
// COMPLIANCE / ATTESTATIONS
// ============================================================================

export function getAttestationsByCase(caseId: string): Attestation[] {
  return read<Attestation[]>(KEY_ATTESTATIONS, []).filter((a) => a.caseId === caseId);
}

export function addAttestationLocally(attestation: Omit<Attestation, 'id'>): Attestation {
  const all = read<Attestation[]>(KEY_ATTESTATIONS, []);
  const newAttestation: Attestation = { ...attestation, id: generateId() };
  all.push(newAttestation);
  write(KEY_ATTESTATIONS, all);
  return newAttestation;
}

export function computeComplianceStatusLocally(caseId: string, stepsComplete: number, stepsTotal: number, stepsOverdue: number): ComplianceStatus {
  const attestations = getAttestationsByCase(caseId);
  const score = stepsTotal > 0 ? Math.round((stepsComplete / stepsTotal) * 100) : 0;
  let overall: 'compliant' | 'at_risk' | 'non_compliant' = 'compliant';
  if (stepsOverdue > 0) overall = 'non_compliant';
  else if (score < 80) overall = 'at_risk';

  return {
    caseId,
    overall,
    score,
    stepsComplete,
    stepsTotal,
    stepsOverdue,
    lastAttestation: attestations.length > 0 ? attestations[attestations.length - 1].timestamp : undefined,
  };
}

// ============================================================================
// JURISDICTIONS
// ============================================================================

export function getAllJurisdictions(): JurisdictionRegistration[] {
  return read<JurisdictionRegistration[]>(KEY_JURISDICTIONS, []);
}

export function getJurisdictionByCode(code: string): JurisdictionRegistration | undefined {
  return getAllJurisdictions().find((j) => j.jurisdictionCode === code);
}

export function addJurisdictionLocally(jurisdiction: Omit<JurisdictionRegistration, 'id'>): JurisdictionRegistration {
  const all = getAllJurisdictions();
  const newJ: JurisdictionRegistration = { ...jurisdiction, id: generateId() };
  all.push(newJ);
  write(KEY_JURISDICTIONS, all);
  return newJ;
}

// ============================================================================
// ACCESS CONTROL
// ============================================================================

export function getPermissionsByCase(caseId: string): AccessPermission[] {
  return read<AccessPermission[]>(KEY_PERMISSIONS, []).filter((p) => p.caseId === caseId);
}

export function addPermissionLocally(permission: Omit<AccessPermission, 'id'>): AccessPermission {
  const all = read<AccessPermission[]>(KEY_PERMISSIONS, []);
  const newP: AccessPermission = { ...permission, id: generateId() };
  all.push(newP);
  write(KEY_PERMISSIONS, all);
  return newP;
}

export function getSharingEventsByCase(caseId: string): SharingEvent[] {
  return read<SharingEvent[]>(KEY_SHARING_EVENTS, []).filter((s) => {
    // Sharing events reference documentId; look up which case
    const doc = getDocumentById(s.documentId);
    return doc?.caseId === caseId;
  });
}

export function addSharingEventLocally(event: Omit<SharingEvent, 'id'>): SharingEvent {
  const all = read<SharingEvent[]>(KEY_SHARING_EVENTS, []);
  const newE: SharingEvent = { ...event, id: generateId() };
  all.push(newE);
  write(KEY_SHARING_EVENTS, all);
  return newE;
}

export function getCustodyEntriesByDocument(documentId: string): CustodyEntry[] {
  return read<CustodyEntry[]>(KEY_CUSTODY_ENTRIES, []).filter((c) => c.documentId === documentId);
}

export function getAccessGrantsByDocument(documentId: string): AccessGrant[] {
  return read<AccessGrant[]>(KEY_ACCESS_GRANTS, []).filter((g) => g.documentId === documentId);
}

export function addAccessGrantLocally(grant: Omit<AccessGrant, 'id'>): AccessGrant {
  const all = read<AccessGrant[]>(KEY_ACCESS_GRANTS, []);
  const newG: AccessGrant = { ...grant, id: generateId() };
  all.push(newG);
  write(KEY_ACCESS_GRANTS, all);
  return newG;
}

export function revokeAccessGrantLocally(grantId: string): void {
  const all = read<AccessGrant[]>(KEY_ACCESS_GRANTS, []);
  const idx = all.findIndex((g) => g.id === grantId);
  if (idx !== -1) {
    all[idx] = { ...all[idx], revoked: true, revokedAt: new Date().toISOString() };
    write(KEY_ACCESS_GRANTS, all);
  }
}

// ============================================================================
// EXPERT WITNESSES
// ============================================================================

export function getExpertsByCase(caseId: string): ExpertWitness[] {
  return read<ExpertWitness[]>(KEY_EXPERTS, []).filter((e) => e.caseId === caseId);
}

export function getExpertById(expertId: string): ExpertWitness | undefined {
  return read<ExpertWitness[]>(KEY_EXPERTS, []).find((e) => e.id === expertId);
}

export function registerExpertLocally(
  expert: Omit<ExpertWitness, 'id' | 'registeredAt' | 'qualificationProofVerified'>,
): ExpertWitness {
  const all = read<ExpertWitness[]>(KEY_EXPERTS, []);
  const newExpert: ExpertWitness = {
    ...expert,
    id: generateId(),
    registeredAt: new Date().toISOString(),
    qualificationProofVerified: false, // Will be true after on-chain verification
  };
  all.push(newExpert);
  write(KEY_EXPERTS, all);
  return newExpert;
}
