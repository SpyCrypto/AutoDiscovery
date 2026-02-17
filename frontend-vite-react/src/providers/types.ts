// =============================================================================
// AutoDiscovery Provider Interfaces
// =============================================================================
// These interfaces are the CONTRACT between the UI and the backend.
// demoLand implements them with mock data.
// realDeal implements them with Midnight + AI services.
// The UI never knows which world it's in.
// =============================================================================

// --- Auth Types ---

export type AuthMethod = 'email' | 'yubikey' | 'trezor';

export interface Credentials {
  email?: string;
  password?: string;
}

export interface AuthSession {
  userId: string;
  displayName: string;
  email: string;
  role: PartyRole;
  publicKey: string;
  authMethod: AuthMethod;
  authenticatedAt: string;
}

export interface IAuthProvider {
  login(method: AuthMethod, credentials?: Credentials): Promise<AuthSession>;
  logout(): Promise<void>;
  getSession(): AuthSession | null;
  getPublicKey(): string | null;
}

// --- Case Types ---

export type CaseStatus = 'active' | 'closed' | 'settled' | 'dismissed' | 'on_appeal';
export type CaseType = 'med_mal' | 'personal_injury' | 'contract' | 'employment' | 'family' | 'criminal' | 'other';
export type PartyRole = 'defense' | 'prosecution' | 'court' | 'third_party';

export interface Party {
  id: string;
  name: string;
  role: PartyRole;
  subRole?: string;
  attorney?: string;
  firm?: string;
  email?: string;
}

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  jurisdiction: string;
  caseType: CaseType;
  status: CaseStatus;
  filingDate: string;
  parties: Party[];
  documentCount: number;
  stepsComplete: number;
  stepsTotal: number;
  complianceScore: number;
  nextDeadline?: string;
  nextDeadlineLabel?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaseParams {
  caseNumber: string;
  title: string;
  jurisdiction: string;
  caseType: CaseType;
  parties: Omit<Party, 'id'>[];
}

export interface ICaseProvider {
  listCases(): Promise<Case[]>;
  getCase(caseId: string): Promise<Case>;
  createCase(params: CreateCaseParams): Promise<Case>;
  getCaseSteps(caseId: string): Promise<DiscoveryStep[]>;
  getCaseParties(caseId: string): Promise<Party[]>;
}

// --- Discovery Step Types ---

export type StepStatus = 'pending' | 'in_progress' | 'complete' | 'overdue' | 'waived';

export interface DiscoveryStep {
  id: string;
  caseId: string;
  ruleReference: string;
  title: string;
  description: string;
  status: StepStatus;
  deadline: string;
  completedAt?: string;
  assignedTo?: string;
  notes?: string;
  daysRemaining?: number;
}

// --- Document Types ---

export type DocumentCategory =
  | 'pleading' | 'motion' | 'order' | 'medical_record' | 'financial_record'
  | 'communication' | 'photograph' | 'video' | 'audio' | 'expert_report'
  | 'deposition' | 'interrogatory' | 'admission' | 'subpoena' | 'contract'
  | 'insurance' | 'employment_record' | 'government_record' | 'scientific'
  | 'digital_forensic' | 'real_property' | 'demonstrative'
  | 'court_transcript' | 'jury_material';

export type ProtectiveOrderTier = 'none' | 'confidential' | 'aeo' | 'sealed';

export interface TwinBond {
  imageHash: string;
  digitalHash: string;
  bondHash: string;
  fidelityScore: number;
  visualFeatures: string[];
}

export interface Document {
  id: string;
  caseId: string;
  title: string;
  category: DocumentCategory;
  originator: string;
  originatorRole: PartyRole;
  dateReceived: string;
  dateCreated?: string;
  pageCount: number;
  contentHash: string;
  batesStart?: string;
  batesEnd?: string;
  protectiveOrder: ProtectiveOrderTier;
  hasTwin: boolean;
  twinBond?: TwinBond;
  aiSynopsis?: string;
  entities?: string[];
  productionId?: string;
  verified: boolean;
}

export interface DocumentInput {
  caseId: string;
  title: string;
  category: DocumentCategory;
  originator: string;
  originatorRole: PartyRole;
  pageCount: number;
  content?: string;
}

export interface SearchFilters {
  caseId?: string;
  category?: DocumentCategory;
  originator?: string;
  dateFrom?: string;
  dateTo?: string;
  protectiveOrder?: ProtectiveOrderTier;
}

export interface SearchResults {
  documents: Document[];
  totalCount: number;
  query: string;
  filters?: SearchFilters;
}

export interface IDocumentProvider {
  listDocuments(caseId: string): Promise<Document[]>;
  getDocument(docId: string): Promise<Document>;
  registerDocument(doc: DocumentInput): Promise<Document>;
  searchDocuments(query: string, filters?: SearchFilters): Promise<SearchResults>;
  getTwinBond(docId: string): Promise<TwinBond | null>;
  verifyHash(docId: string): Promise<VerificationResult>;
}

// --- Compliance Types ---

export interface ComplianceStatus {
  caseId: string;
  overall: 'compliant' | 'at_risk' | 'non_compliant';
  score: number;
  stepsComplete: number;
  stepsTotal: number;
  stepsOverdue: number;
  nextDeadline?: string;
  nextDeadlineLabel?: string;
  lastAttestation?: string;
}

export interface Attestation {
  id: string;
  caseId: string;
  stepId?: string;
  type: 'step_completion' | 'production' | 'case_compliance' | 'deadline_met';
  description: string;
  proofHash: string;
  timestamp: string;
  verified: boolean;
}

export interface ComplianceReport {
  caseId: string;
  generatedAt: string;
  status: ComplianceStatus;
  attestations: Attestation[];
  timeline: TimelineEntry[];
}

export interface TimelineEntry {
  date: string;
  event: string;
  type: 'deadline' | 'production' | 'filing' | 'hearing' | 'attestation';
  status: 'completed' | 'pending' | 'missed';
}

export interface VerificationResult {
  valid: boolean;
  documentId: string;
  contentHash: string;
  timestamp: string;
  message: string;
}

export interface IComplianceProvider {
  getComplianceStatus(caseId: string): Promise<ComplianceStatus>;
  getAttestations(caseId: string): Promise<Attestation[]>;
  generateProof(caseId: string, stepId: string): Promise<Attestation>;
  getComplianceReport(caseId: string): Promise<ComplianceReport>;
}

// --- AI Types ---

export interface Synopsis {
  summary: string;
  keyTopics: string[];
  sentiment: 'neutral' | 'adversarial' | 'cooperative' | 'urgent';
  legalRelevance: number;
}

export interface Entity {
  name: string;
  type: 'person' | 'organization' | 'location' | 'date' | 'amount' | 'case_number';
  context: string;
  mentions: number;
}

export interface ObfuscationScore {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  flags: string[];
  recommendation: string;
}

export interface IAIProvider {
  generateSynopsis(content: string): Promise<Synopsis>;
  extractEntities(content: string): Promise<Entity[]>;
  detectObfuscation(productionId: string): Promise<ObfuscationScore>;
  scoreFidelity(imageHash: string, digitalHash: string): Promise<number>;
}

// --- Contact Types ---

export type ContactTeam = 'our_team' | 'opposing_team' | 'court' | 'neutral';

export type ContactRole =
  | 'lead_attorney' | 'associate' | 'paralegal' | 'legal_secretary'
  | 'expert_witness' | 'fact_witness' | 'victim' | 'plaintiff'
  | 'defendant' | 'judge' | 'magistrate' | 'mediator'
  | 'opposing_counsel' | 'opposing_associate' | 'opposing_paralegal'
  | 'custodian' | 'court_reporter' | 'process_server'
  | 'insurance_adjuster' | 'law_enforcement' | 'other';

export interface CaseContact {
  id: string;
  caseId: string;
  name: string;
  team: ContactTeam;
  role: ContactRole;
  description: string;
  firm?: string;
  email?: string;
  phone?: string;
  barNumber?: string;
  stars: 0 | 1 | 2 | 3;
  isFirstYearAssociate?: boolean;
  connectedContactIds: string[];
  notes?: string;
  sortOrder: number;
}

export interface IContactProvider {
  getContactsByCaseId(caseId: string): Promise<CaseContact[]>;
  updateContactStars(contactId: string, stars: 0 | 1 | 2 | 3): Promise<CaseContact>;
  reorderContacts(caseId: string, contactIds: string[]): Promise<void>;
}

// --- Email Safety Protocol Types ---

export type EmailThreatLevel = 'safe' | 'caution' | 'danger' | 'critical';

export type EmailRecipientFlag =
  | 'opposing_counsel'
  | 'opposing_associate'
  | 'opposing_paralegal'
  | 'opposing_party'
  | 'judge'
  | 'court_staff'
  | 'neutral_party'
  | 'our_team';

export interface EmailRecipientCheck {
  contactId: string;
  name: string;
  email: string;
  team: ContactTeam;
  role: ContactRole;
  flag: EmailRecipientFlag;
  threatLevel: EmailThreatLevel;
  warningMessage: string;
}

export interface EmailAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  previewUrl?: string;
  containsMetadata?: boolean;
  metadataWarnings?: string[];
}

export interface TandemApproval {
  id: string;
  emailDraftId: string;
  requiredApprovers: number;
  approvers: {
    contactId: string;
    name: string;
    status: 'pending' | 'approved' | 'rejected';
    timestamp?: string;
    comment?: string;
  }[];
  status: 'awaiting' | 'approved' | 'rejected' | 'expired';
  createdAt: string;
  expiresAt: string;
}

export interface EmailDraft {
  id: string;
  caseId: string;
  subject: string;
  body: string;
  from: string;
  to: EmailRecipientCheck[];
  cc?: EmailRecipientCheck[];
  bcc?: EmailRecipientCheck[];
  attachments: EmailAttachment[];
  overallThreatLevel: EmailThreatLevel;
  tandemApproval?: TandemApproval;
  requiresTandemApproval: boolean;
  createdAt: string;
}

export interface IEmailSafetyProvider {
  checkRecipients(caseId: string, emailAddresses: string[]): Promise<EmailRecipientCheck[]>;
  scanAttachments(attachments: File[]): Promise<EmailAttachment[]>;
  calculateThreatLevel(recipients: EmailRecipientCheck[], attachments: EmailAttachment[]): EmailThreatLevel;
  createTandemApproval(emailDraftId: string, requiredApprovers: number): Promise<TandemApproval>;
  submitApproval(approvalId: string, approverId: string, approved: boolean, comment?: string): Promise<TandemApproval>;
}

// --- Master Provider Bundle ---

export interface Providers {
  auth: IAuthProvider;
  cases: ICaseProvider;
  documents: IDocumentProvider;
  compliance: IComplianceProvider;
  ai: IAIProvider;
  contacts: IContactProvider;
  emailSafety: IEmailSafetyProvider;
}

export type ADMode = 'demoland' | 'realdeal';
