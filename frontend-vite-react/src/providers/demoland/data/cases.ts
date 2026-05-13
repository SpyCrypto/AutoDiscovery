import type {
  Case, Party, DiscoveryStep, Document, Attestation, TimelineEntry,
  CustodyEntry, SharingEvent, AccessPermission, ExpertWitness,
} from '../../types';

// =============================================================================
// Smith v. Acme Medical Center — Demo Case
// Idaho medical malpractice case, mid-discovery phase
// =============================================================================

export const demoParties: Party[] = [
  {
    id: 'party-001',
    name: 'John Smith',
    role: 'prosecution',
    subRole: 'Plaintiff',
    attorney: 'Sarah Mitchell',
    firm: 'Mitchell & Associates',
    email: 's.mitchell@mitchelllaw.demo',
  },
  {
    id: 'party-002',
    name: 'Acme Medical Center',
    role: 'defense',
    subRole: 'Defendant — Hospital',
    attorney: 'Robert Chen',
    firm: 'Chen, Whitfield & Partners',
    email: 'r.chen@cwpartners.demo',
  },
  {
    id: 'party-003',
    name: 'Dr. Jane Wilson',
    role: 'defense',
    subRole: 'Defendant — Physician',
    attorney: 'Robert Chen',
    firm: 'Chen, Whitfield & Partners',
    email: 'r.chen@cwpartners.demo',
  },
  {
    id: 'party-004',
    name: 'Hon. Margaret Torres',
    role: 'court',
    subRole: 'District Judge',
  },
  {
    id: 'party-005',
    name: 'Dr. Alan Reeves',
    role: 'third_party',
    subRole: 'Expert Witness — Cardiology',
    attorney: 'Sarah Mitchell',
    firm: 'Independent Expert',
    email: 'a.reeves@cardioexperts.demo',
  },
  {
    id: 'party-006',
    name: 'Idaho Medical Records Dept.',
    role: 'third_party',
    subRole: 'Record Custodian',
  },
];

export const demoCases: Case[] = [
  {
    id: 'case-001',
    caseNumber: 'CV-2025-04821',
    title: 'Smith v. Acme Medical Center et al.',
    jurisdiction: 'Idaho — IRCP',
    caseType: 'med_mal',
    status: 'active',
    filingDate: '2025-09-15',
    parties: demoParties,
    documentCount: 47,
    stepsComplete: 8,
    stepsTotal: 15,
    complianceScore: 0.82,
    nextDeadline: '2026-03-01',
    nextDeadlineLabel: 'DEF Expert Disclosure',
    createdAt: '2025-09-15T09:00:00Z',
    updatedAt: '2026-02-14T16:30:00Z',
  },
  {
    id: 'case-002',
    caseNumber: 'CV-2025-07103',
    title: 'Rivera v. Mountain View Orthopedics',
    jurisdiction: 'Idaho — IRCP',
    caseType: 'med_mal',
    status: 'active',
    filingDate: '2025-11-02',
    parties: [
      { id: 'p-r1', name: 'Maria Rivera', role: 'prosecution', subRole: 'Plaintiff', attorney: 'Sarah Mitchell', firm: 'Mitchell & Associates' },
      { id: 'p-r2', name: 'Mountain View Orthopedics', role: 'defense', subRole: 'Defendant', attorney: 'David Park', firm: 'Park Legal Group' },
    ],
    documentCount: 23,
    stepsComplete: 4,
    stepsTotal: 12,
    complianceScore: 0.91,
    nextDeadline: '2026-03-20',
    nextDeadlineLabel: 'PRO Interrogatory Responses',
    createdAt: '2025-11-02T10:00:00Z',
    updatedAt: '2026-02-10T11:45:00Z',
  },
  {
    id: 'case-003',
    caseNumber: 'CV-2024-11290',
    title: 'Dawson v. St. Luke\'s Regional',
    jurisdiction: 'Idaho — IRCP',
    caseType: 'med_mal',
    status: 'active',
    filingDate: '2024-08-22',
    parties: [
      { id: 'p-d1', name: 'Thomas Dawson', role: 'prosecution', subRole: 'Plaintiff', attorney: 'Karen Wolfe', firm: 'Wolfe & Barrett' },
      { id: 'p-d2', name: 'St. Luke\'s Regional Medical Center', role: 'defense', subRole: 'Defendant', attorney: 'Jennifer Hale', firm: 'Hale Morrison LLP' },
    ],
    documentCount: 156,
    stepsComplete: 11,
    stepsTotal: 14,
    complianceScore: 0.67,
    nextDeadline: '2026-02-20',
    nextDeadlineLabel: 'Supplemental Production — OVERDUE RISK',
    createdAt: '2024-08-22T08:00:00Z',
    updatedAt: '2026-02-15T09:00:00Z',
  },
];

export const demoSteps: DiscoveryStep[] = [
  {
    id: 'step-001', caseId: 'case-001', ruleReference: 'IRCP 26(a)',
    title: 'Initial Disclosures',
    description: 'Court-ordered initial disclosures per Rule 16 scheduling order',
    status: 'complete', deadline: '2025-11-01', completedAt: '2025-10-28',
    assignedTo: 'Both parties',
  },
  {
    id: 'step-002', caseId: 'case-001', ruleReference: 'IRCP 33',
    title: 'Interrogatories — PRO Set 1',
    description: 'Plaintiff\'s first set of interrogatories (40 max under IRCP)',
    status: 'complete', deadline: '2025-12-01', completedAt: '2025-11-25',
    assignedTo: 'Defense',
  },
  {
    id: 'step-003', caseId: 'case-001', ruleReference: 'IRCP 34',
    title: 'Request for Production — PRO Set 1',
    description: 'Plaintiff\'s first request for production of documents',
    status: 'complete', deadline: '2025-12-15', completedAt: '2025-12-14',
    assignedTo: 'Defense', notes: 'Large production — 312 documents, obfuscation score flagged at 0.62',
  },
  {
    id: 'step-004', caseId: 'case-001', ruleReference: 'IRCP 34',
    title: 'Request for Production — DEF Set 1',
    description: 'Defense first request for production',
    status: 'complete', deadline: '2026-01-05', completedAt: '2025-12-30',
    assignedTo: 'Prosecution',
  },
  {
    id: 'step-005', caseId: 'case-001', ruleReference: 'IRCP 35',
    title: 'Independent Medical Examination',
    description: 'Defense IME of plaintiff per IRCP 35',
    status: 'complete', deadline: '2026-01-20', completedAt: '2026-01-18',
    assignedTo: 'Defense',
  },
  {
    id: 'step-006', caseId: 'case-001', ruleReference: 'IRCP 30',
    title: 'Deposition — John Smith (Plaintiff)',
    description: 'Plaintiff deposition. No limit on depositions under Idaho rules.',
    status: 'complete', deadline: '2026-01-30', completedAt: '2026-01-29',
    assignedTo: 'Defense',
  },
  {
    id: 'step-007', caseId: 'case-001', ruleReference: 'IRCP 30',
    title: 'Deposition — Dr. Jane Wilson',
    description: 'Defendant physician deposition',
    status: 'complete', deadline: '2026-02-10', completedAt: '2026-02-08',
    assignedTo: 'Prosecution',
  },
  {
    id: 'step-008', caseId: 'case-001', ruleReference: 'IRCP 26(e)',
    title: 'Supplemental Disclosures — Round 1',
    description: 'Ongoing duty to supplement under IRCP 26(e)',
    status: 'complete', deadline: '2026-02-15', completedAt: '2026-02-14',
    assignedTo: 'Both parties',
  },
  {
    id: 'step-009', caseId: 'case-001', ruleReference: 'IRCP 26(b)(4)',
    title: 'DEF Expert Disclosure',
    description: 'Defense expert witness disclosure with full report',
    status: 'in_progress', deadline: '2026-03-01',
    assignedTo: 'Defense', daysRemaining: 14,
  },
  {
    id: 'step-010', caseId: 'case-001', ruleReference: 'IRCP 26(b)(4)',
    title: 'PRO Expert Disclosure',
    description: 'Plaintiff expert witness disclosure — Dr. Alan Reeves (cardiology)',
    status: 'pending', deadline: '2026-03-15',
    assignedTo: 'Prosecution', daysRemaining: 28,
  },
  {
    id: 'step-011', caseId: 'case-001', ruleReference: 'IRCP 36',
    title: 'Requests for Admission — PRO Set 1',
    description: 'Plaintiff RFAs. WARNING: deemed admitted if not answered in 30 days.',
    status: 'pending', deadline: '2026-03-20',
    assignedTo: 'Defense', daysRemaining: 33,
  },
  {
    id: 'step-012', caseId: 'case-001', ruleReference: 'IRCP 30',
    title: 'Deposition — Dr. Alan Reeves (Expert)',
    description: 'Defense deposition of plaintiff\'s expert witness',
    status: 'pending', deadline: '2026-04-01',
    assignedTo: 'Defense', daysRemaining: 45,
  },
  {
    id: 'step-013', caseId: 'case-001', ruleReference: 'IRCP 26(e)',
    title: 'Supplemental Disclosures — Round 2',
    description: 'Second supplementation round',
    status: 'pending', deadline: '2026-04-15',
    assignedTo: 'Both parties', daysRemaining: 59,
  },
  {
    id: 'step-014', caseId: 'case-001', ruleReference: 'IRCP 56',
    title: 'Summary Judgment Deadline',
    description: 'Last day to file dispositive motions',
    status: 'pending', deadline: '2026-05-01',
    assignedTo: 'Either party', daysRemaining: 75,
  },
  {
    id: 'step-015', caseId: 'case-001', ruleReference: 'Scheduling Order',
    title: 'Discovery Cutoff',
    description: 'All discovery must be completed by this date per scheduling order',
    status: 'pending', deadline: '2026-05-15',
    assignedTo: 'All parties', daysRemaining: 89,
  },
];

export const demoDocuments: Document[] = [
  {
    id: 'doc-001', caseId: 'case-001', title: 'Complaint — Smith v. Acme Medical Center',
    category: 'pleading', originator: 'Sarah Mitchell', originatorRole: 'prosecution',
    dateReceived: '2025-09-15', dateCreated: '2025-09-14', pageCount: 18,
    contentHash: 'a3f2b8c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
    batesStart: 'SMITH-00001', batesEnd: 'SMITH-00018',
    protectiveOrder: 'none', hasTwin: false, verified: true,
    aiSynopsis: 'Medical malpractice complaint alleging negligent cardiac care by Dr. Wilson at Acme Medical Center resulting in delayed diagnosis of atrial fibrillation.',
    entities: ['John Smith', 'Acme Medical Center', 'Dr. Jane Wilson', 'atrial fibrillation', '$2,500,000'],
  },
  {
    id: 'doc-002', caseId: 'case-001', title: 'Answer and Affirmative Defenses',
    category: 'pleading', originator: 'Robert Chen', originatorRole: 'defense',
    dateReceived: '2025-10-15', dateCreated: '2025-10-14', pageCount: 12,
    contentHash: 'b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5',
    batesStart: 'ACME-00001', batesEnd: 'ACME-00012',
    protectiveOrder: 'none', hasTwin: false, verified: true,
    aiSynopsis: 'Defense answer denying negligence, asserting comparative negligence and statute of limitations defense.',
    entities: ['Acme Medical Center', 'Dr. Jane Wilson', 'comparative negligence'],
  },
  {
    id: 'doc-003', caseId: 'case-001', title: 'Scheduling Order — Judge Torres',
    category: 'order', originator: 'Hon. Margaret Torres', originatorRole: 'court',
    dateReceived: '2025-10-25', pageCount: 4,
    contentHash: 'c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6',
    protectiveOrder: 'none', hasTwin: false, verified: true,
    aiSynopsis: 'Scheduling order setting discovery deadlines, expert disclosure dates, and trial date of September 2026.',
    entities: ['Hon. Margaret Torres', 'September 2026', 'discovery cutoff May 15 2026'],
  },
  {
    id: 'doc-004', caseId: 'case-001', title: 'Medical Records — Acme Medical Center (Smith)',
    category: 'medical_record', originator: 'Idaho Medical Records Dept.', originatorRole: 'third_party',
    dateReceived: '2025-11-20', dateCreated: '2024-03-15', pageCount: 247,
    contentHash: 'd6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7',
    batesStart: 'MED-00001', batesEnd: 'MED-00247',
    protectiveOrder: 'confidential', hasTwin: true,
    twinBond: {
      imageHash: 'img-d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
      digitalHash: 'dig-e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
      bondHash: 'bond-f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
      fidelityScore: 97.3,
      visualFeatures: ['physician signatures', 'handwritten notes', 'hospital stamps', 'highlighting'],
    },
    verified: true,
    aiSynopsis: 'Complete cardiac care records for John Smith from March 2024 through September 2025. Includes ER visits, cardiology consults, EKG results, medication records.',
    entities: ['John Smith', 'Dr. Jane Wilson', 'Dr. Alan Reeves', 'atrial fibrillation', 'warfarin', 'EKG'],
  },
  {
    id: 'doc-005', caseId: 'case-001', title: 'Email Chain — Wilson to Smith re: Follow-up Appointment',
    category: 'communication', originator: 'Dr. Jane Wilson', originatorRole: 'defense',
    dateReceived: '2025-12-14', dateCreated: '2024-06-10', pageCount: 3,
    contentHash: 'e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
    batesStart: 'ACME-00045', batesEnd: 'ACME-00047',
    protectiveOrder: 'none', hasTwin: false, verified: true,
    aiSynopsis: 'Email thread between Dr. Wilson and patient John Smith discussing missed follow-up appointment and rescheduling. Contains discussion of symptoms that may indicate delayed diagnosis.',
    entities: ['Dr. Jane Wilson', 'John Smith', 'follow-up appointment', 'chest pain', 'shortness of breath'],
  },
  {
    id: 'doc-006', caseId: 'case-001', title: 'Expert Report — Dr. Alan Reeves (Cardiology)',
    category: 'expert_report', originator: 'Dr. Alan Reeves', originatorRole: 'third_party',
    dateReceived: '2026-02-01', dateCreated: '2026-01-28', pageCount: 34,
    contentHash: 'f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9',
    batesStart: 'EXP-00001', batesEnd: 'EXP-00034',
    protectiveOrder: 'confidential', hasTwin: false, verified: true,
    aiSynopsis: 'Expert cardiology report opining that Dr. Wilson\'s failure to order timely echocardiogram fell below standard of care, resulting in 6-month delayed diagnosis of atrial fibrillation.',
    entities: ['Dr. Alan Reeves', 'Dr. Jane Wilson', 'echocardiogram', 'standard of care', 'atrial fibrillation', '6-month delay'],
  },
  {
    id: 'doc-007', caseId: 'case-001', title: 'Deposition Transcript — John Smith',
    category: 'deposition', originator: 'Court Reporter', originatorRole: 'third_party',
    dateReceived: '2026-02-05', dateCreated: '2026-01-29', pageCount: 189,
    contentHash: 'a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0',
    batesStart: 'DEP-S-00001', batesEnd: 'DEP-S-00189',
    protectiveOrder: 'none', hasTwin: true,
    twinBond: {
      imageHash: 'img-a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
      digitalHash: 'dig-b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
      bondHash: 'bond-c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
      fidelityScore: 99.1,
      visualFeatures: ['notary seal', 'court reporter signature'],
    },
    verified: true,
    aiSynopsis: 'Full deposition of plaintiff John Smith covering medical history, symptoms, treatment timeline, and damages claimed.',
    entities: ['John Smith', 'Dr. Jane Wilson', 'Acme Medical Center', 'chest pain', 'lost wages', '$85,000'],
  },
  {
    id: 'doc-008', caseId: 'case-001', title: 'DEF Production Set 1 — Bulk Medical Records',
    category: 'medical_record', originator: 'Robert Chen', originatorRole: 'defense',
    dateReceived: '2025-12-14', pageCount: 312,
    contentHash: 'b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1',
    batesStart: 'ACME-00100', batesEnd: 'ACME-00411',
    protectiveOrder: 'confidential', hasTwin: true,
    twinBond: {
      imageHash: 'img-b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
      digitalHash: 'dig-c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
      bondHash: 'bond-d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
      fidelityScore: 89.4,
      visualFeatures: ['physician signatures', 'handwritten notes', 'hospital stamps', 'highlighting', 'strikethroughs'],
    },
    verified: true,
    aiSynopsis: 'Large production from defense — 312 pages of mixed medical records. OBFUSCATION FLAG: Records appear deliberately disordered with unrelated patient records intermixed. Haystack Alert score: 0.62.',
    entities: ['John Smith', 'Dr. Jane Wilson', 'Acme Medical Center', 'multiple unrelated patients detected'],
    productionId: 'prod-001',
  },
  {
    id: 'doc-009', caseId: 'case-001', title: 'Billing Records — Acme Medical Center',
    category: 'financial_record', originator: 'Acme Medical Center', originatorRole: 'defense',
    dateReceived: '2025-12-14', pageCount: 28,
    contentHash: 'c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
    batesStart: 'ACME-00412', batesEnd: 'ACME-00439',
    protectiveOrder: 'confidential', hasTwin: false, verified: true,
    aiSynopsis: 'Itemized billing records for all cardiac services provided to John Smith. Total billed: $127,450.',
    entities: ['John Smith', 'Acme Medical Center', '$127,450', 'cardiac catheterization', 'EKG monitoring'],
  },
  {
    id: 'doc-010', caseId: 'case-001', title: 'Insurance Policy — MedPro Group',
    category: 'insurance', originator: 'MedPro Group', originatorRole: 'third_party',
    dateReceived: '2025-11-30', pageCount: 45,
    contentHash: 'd2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3',
    protectiveOrder: 'aeo', hasTwin: false, verified: true,
    aiSynopsis: 'Professional liability insurance policy for Dr. Jane Wilson through MedPro Group. Coverage limits and exclusions.',
    entities: ['Dr. Jane Wilson', 'MedPro Group', '$1,000,000 per occurrence', '$3,000,000 aggregate'],
  },
  {
    id: 'doc-011', caseId: 'case-001', title: 'Court Transcript — Rule 16 Conference',
    category: 'court_transcript', originator: 'Court Reporter', originatorRole: 'court',
    dateReceived: '2025-10-28', pageCount: 42,
    contentHash: 'e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4',
    protectiveOrder: 'none', hasTwin: true,
    twinBond: {
      imageHash: 'img-e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
      digitalHash: 'dig-f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
      bondHash: 'bond-a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
      fidelityScore: 99.8,
      visualFeatures: ['court seal', 'reporter certification'],
    },
    verified: true,
    aiSynopsis: 'Transcript of Rule 16 scheduling conference. Judge Torres sets discovery deadlines, discusses protective order, orders initial disclosures within 30 days.',
    entities: ['Hon. Margaret Torres', 'Sarah Mitchell', 'Robert Chen', 'scheduling order', 'protective order'],
  },
  {
    id: 'doc-012', caseId: 'case-001', title: 'Motion to Compel — Production Deficiencies',
    category: 'motion', originator: 'Sarah Mitchell', originatorRole: 'prosecution',
    dateReceived: '2026-01-10', dateCreated: '2026-01-09', pageCount: 15,
    contentHash: 'f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5',
    protectiveOrder: 'none', hasTwin: false, verified: true,
    aiSynopsis: 'Motion to compel alleging defense production was deliberately disorganized (data dump obfuscation). Cites 312-page production with unrelated patient records intermixed.',
    entities: ['Sarah Mitchell', 'Robert Chen', 'data dump', 'obfuscation', 'IRCP 37', 'sanctions'],
  },
];

export const demoAttestations: Attestation[] = [
  {
    id: 'att-001', caseId: 'case-001', stepId: 'step-001',
    type: 'step_completion', scope: 'step',
    description: 'Initial disclosures completed by both parties',
    proofHash: 'zk-proof-001-a3f2b8c1d4e5f6a7', timestamp: '2025-10-28T14:30:00Z',
    verified: true, verifiedAt: '2025-10-28T14:31:12Z', blockHeight: 1847203,
  },
  {
    id: 'att-002', caseId: 'case-001', stepId: 'step-003',
    type: 'production', scope: 'step',
    description: 'DEF Production Set 1 — 312 documents produced to PRO',
    proofHash: 'zk-proof-002-b4c5d6e7f8a9b0c1', timestamp: '2025-12-14T16:00:00Z',
    verified: true, verifiedAt: '2025-12-14T16:01:45Z', blockHeight: 1923847,
  },
  {
    id: 'att-003', caseId: 'case-001', stepId: 'step-004',
    type: 'production', scope: 'step',
    description: 'PRO Production Set 1 — 89 documents produced to DEF',
    proofHash: 'zk-proof-003-c5d6e7f8a9b0c1d2', timestamp: '2025-12-30T11:00:00Z',
    verified: true, verifiedAt: '2025-12-30T11:02:03Z', blockHeight: 1951022,
  },
  {
    id: 'att-004', caseId: 'case-001',
    type: 'phase_compliance', scope: 'phase',
    description: 'Initial Discovery phase compliance verified — all deadlines met through Phase 1',
    proofHash: 'zk-proof-004-e7f8a9b0c1d2e3f4', timestamp: '2026-01-15T09:00:00Z',
    verified: true, verifiedAt: '2026-01-15T09:01:30Z', blockHeight: 1978456,
  },
  {
    id: 'att-005', caseId: 'case-001',
    type: 'document_integrity', scope: 'step',
    description: 'Document integrity verified — Medical Records batch (247 pages) hash anchored',
    proofHash: 'zk-proof-005-f8a9b0c1d2e3f4a5', timestamp: '2025-11-20T14:00:00Z',
    verified: true, verifiedAt: '2025-11-20T14:01:15Z', blockHeight: 1903210,
  },
  {
    id: 'att-006', caseId: 'case-001',
    type: 'case_compliance', scope: 'case',
    description: 'Mid-discovery compliance attestation — 82% compliance score across all phases',
    proofHash: 'zk-proof-006-d6e7f8a9b0c1d2e3', timestamp: '2026-02-14T16:30:00Z',
    verified: true, verifiedAt: '2026-02-14T16:31:22Z', blockHeight: 2031847,
  },
];

// =============================================================================
// Custody Chain — tracks who had each document and when
// =============================================================================

export const demoCustodyEntries: CustodyEntry[] = [
  {
    id: 'cust-001', documentId: 'doc-004',
    fromParty: 'Idaho Medical Records Dept.', toParty: 'Sarah Mitchell',
    transferDate: '2025-11-20', method: 'subpoena_response',
    verifiedOnChain: true, proofHash: 'cust-zk-001-a3f2b8c1',
    notes: 'Subpoena duces tecum response — certified medical records',
  },
  {
    id: 'cust-002', documentId: 'doc-004',
    fromParty: 'Sarah Mitchell', toParty: 'Robert Chen',
    transferDate: '2025-12-14', method: 'electronic',
    verifiedOnChain: true, proofHash: 'cust-zk-002-b4c5d6e7',
    notes: 'Produced as part of PRO Production Set 1',
  },
  {
    id: 'cust-003', documentId: 'doc-008',
    fromParty: 'Robert Chen', toParty: 'Sarah Mitchell',
    transferDate: '2025-12-14', method: 'electronic',
    verifiedOnChain: true, proofHash: 'cust-zk-003-c5d6e7f8',
    notes: 'DEF Production Set 1 — flagged for obfuscation',
  },
  {
    id: 'cust-004', documentId: 'doc-006',
    fromParty: 'Dr. Alan Reeves', toParty: 'Sarah Mitchell',
    transferDate: '2026-01-28', method: 'electronic',
    verifiedOnChain: true, proofHash: 'cust-zk-004-d6e7f8a9',
  },
  {
    id: 'cust-005', documentId: 'doc-011',
    fromParty: 'Court Reporter', toParty: 'Hon. Margaret Torres',
    transferDate: '2025-10-28', method: 'court_filing',
    verifiedOnChain: true, proofHash: 'cust-zk-005-e7f8a9b0',
  },
];

// =============================================================================
// Access Permissions — who has access to case documents at what level
// =============================================================================

export const demoAccessPermissions: AccessPermission[] = [
  {
    id: 'perm-001', caseId: 'case-001',
    participantName: 'Sarah Mitchell', participantRole: 'prosecution',
    accessLevel: 'aeo', documentsAccessible: 47,
    lastAccessed: '2026-02-21T08:15:00Z', registeredAt: '2025-09-15T09:00:00Z', isActive: true,
  },
  {
    id: 'perm-002', caseId: 'case-001',
    participantName: 'Robert Chen', participantRole: 'defense',
    accessLevel: 'aeo', documentsAccessible: 42,
    lastAccessed: '2026-02-20T17:30:00Z', registeredAt: '2025-10-15T10:00:00Z', isActive: true,
  },
  {
    id: 'perm-003', caseId: 'case-001',
    participantName: 'Hon. Margaret Torres', participantRole: 'court',
    accessLevel: 'sealed', documentsAccessible: 47,
    lastAccessed: '2026-02-18T14:00:00Z', registeredAt: '2025-10-25T08:00:00Z', isActive: true,
  },
  {
    id: 'perm-004', caseId: 'case-001',
    participantName: 'Dr. Alan Reeves', participantRole: 'third_party',
    accessLevel: 'confidential', documentsAccessible: 12,
    lastAccessed: '2026-02-01T11:00:00Z', registeredAt: '2025-12-01T09:00:00Z', isActive: true,
  },
  {
    id: 'perm-005', caseId: 'case-001',
    participantName: 'Idaho Medical Records Dept.', participantRole: 'third_party',
    accessLevel: 'none', documentsAccessible: 3,
    registeredAt: '2025-11-15T10:00:00Z', isActive: false,
  },
];

// =============================================================================
// Sharing Events — audit trail of document sharing
// =============================================================================

export const demoSharingEvents: SharingEvent[] = [
  {
    id: 'share-001', documentId: 'doc-004',
    sharedBy: 'Sarah Mitchell', sharedWith: 'Robert Chen',
    sharedAt: '2025-12-14T15:30:00Z', method: 'secure_transfer',
    accessLevel: 'confidential', acknowledged: true, acknowledgedAt: '2025-12-14T16:00:00Z',
  },
  {
    id: 'share-002', documentId: 'doc-008',
    sharedBy: 'Robert Chen', sharedWith: 'Sarah Mitchell',
    sharedAt: '2025-12-14T15:45:00Z', method: 'secure_transfer',
    accessLevel: 'confidential', acknowledged: true, acknowledgedAt: '2025-12-14T16:10:00Z',
  },
  {
    id: 'share-003', documentId: 'doc-006',
    sharedBy: 'Sarah Mitchell', sharedWith: 'Robert Chen',
    sharedAt: '2026-02-01T10:00:00Z', method: 'secure_transfer',
    accessLevel: 'confidential', acknowledged: true, acknowledgedAt: '2026-02-01T10:30:00Z',
  },
  {
    id: 'share-004', documentId: 'doc-003',
    sharedBy: 'Hon. Margaret Torres', sharedWith: 'Sarah Mitchell',
    sharedAt: '2025-10-25T09:00:00Z', method: 'court_ecf',
    accessLevel: 'none', acknowledged: true, acknowledgedAt: '2025-10-25T09:15:00Z',
  },
  {
    id: 'share-005', documentId: 'doc-003',
    sharedBy: 'Hon. Margaret Torres', sharedWith: 'Robert Chen',
    sharedAt: '2025-10-25T09:00:00Z', method: 'court_ecf',
    accessLevel: 'none', acknowledged: true, acknowledgedAt: '2025-10-25T09:20:00Z',
  },
  {
    id: 'share-006', documentId: 'doc-010',
    sharedBy: 'Robert Chen', sharedWith: 'Sarah Mitchell',
    sharedAt: '2025-11-30T14:00:00Z', method: 'portal',
    accessLevel: 'aeo', acknowledged: true, acknowledgedAt: '2025-11-30T14:30:00Z',
  },
];

// =============================================================================
// Expert Witnesses
// =============================================================================

export const demoExperts: ExpertWitness[] = [
  {
    id: 'exp-001', caseId: 'case-001',
    name: 'Dr. Alan Reeves', specialty: 'Cardiology',
    qualifications: [
      'Board Certified — American Board of Internal Medicine (Cardiovascular Disease)',
      'MD — Johns Hopkins School of Medicine, 2001',
      'Fellowship — Mayo Clinic, Cardiovascular Medicine, 2005',
      '20+ years clinical practice, 50+ expert witness engagements',
    ],
    retainedBy: 'prosecution',
    registeredAt: '2025-12-01T09:00:00Z',
    reportFiled: true, reportFiledAt: '2026-01-28T15:00:00Z',
    depositionScheduled: true, depositionDate: '2026-04-01',
    status: 'deposition_scheduled',
    qualificationProofVerified: true,
  },
  {
    id: 'exp-002', caseId: 'case-001',
    name: 'Dr. Patricia Huang', specialty: 'Emergency Medicine / Standard of Care',
    qualifications: [
      'Board Certified — American Board of Emergency Medicine',
      'MD — Stanford School of Medicine, 2003',
      'Chief of Emergency Medicine — Boise Regional Medical Center, 2015-present',
      '15+ expert witness engagements in medical malpractice',
    ],
    retainedBy: 'defense',
    registeredAt: '2026-02-10T10:00:00Z',
    reportFiled: false,
    depositionScheduled: false,
    status: 'report_pending',
    qualificationProofVerified: true,
  },
];

export const demoTimeline: TimelineEntry[] = [
  { date: '2025-09-15', event: 'Case filed — Smith v. Acme Medical Center', type: 'filing', status: 'completed' },
  { date: '2025-10-15', event: 'Answer filed by Defense', type: 'filing', status: 'completed' },
  { date: '2025-10-25', event: 'Rule 16 Scheduling Conference', type: 'hearing', status: 'completed' },
  { date: '2025-10-28', event: 'Initial Disclosures completed', type: 'deadline', status: 'completed' },
  { date: '2025-10-28', event: 'ZK Attestation: Initial Disclosures', type: 'attestation', status: 'completed' },
  { date: '2025-11-25', event: 'Interrogatory responses — DEF', type: 'deadline', status: 'completed' },
  { date: '2025-12-14', event: 'DEF Production Set 1 (312 docs) — Obfuscation flagged', type: 'production', status: 'completed' },
  { date: '2025-12-14', event: 'ZK Attestation: DEF Production', type: 'attestation', status: 'completed' },
  { date: '2025-12-30', event: 'PRO Production Set 1 (89 docs)', type: 'production', status: 'completed' },
  { date: '2026-01-10', event: 'Motion to Compel filed by PRO', type: 'filing', status: 'completed' },
  { date: '2026-01-18', event: 'Independent Medical Examination', type: 'deadline', status: 'completed' },
  { date: '2026-01-29', event: 'Deposition — John Smith', type: 'deadline', status: 'completed' },
  { date: '2026-02-08', event: 'Deposition — Dr. Jane Wilson', type: 'deadline', status: 'completed' },
  { date: '2026-02-14', event: 'Supplemental Disclosures — Round 1', type: 'deadline', status: 'completed' },
  { date: '2026-03-01', event: 'DEF Expert Disclosure', type: 'deadline', status: 'pending' },
  { date: '2026-03-15', event: 'PRO Expert Disclosure', type: 'deadline', status: 'pending' },
  { date: '2026-03-20', event: 'Requests for Admission — DEF response due', type: 'deadline', status: 'pending' },
  { date: '2026-05-15', event: 'Discovery Cutoff', type: 'deadline', status: 'pending' },
];
