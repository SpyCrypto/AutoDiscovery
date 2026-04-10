/**
 * RealDeal Email Safety Provider
 *
 * Client-side email safety analysis for legal document communications.
 * Checks recipients against case contacts, scans attachment metadata,
 * and manages tandem approval workflows.
 *
 * This is entirely off-chain — no blockchain interaction needed.
 * Logic mirrors the demoland mock-email-safety but uses real localStorage data.
 */
import type {
  IEmailSafetyProvider,
  EmailRecipientCheck,
  EmailAttachment,
  EmailThreatLevel,
  TandemApproval,
  ContactTeam,
  ContactRole,
  EmailRecipientFlag,
  CaseContact,
} from '../types';

// --- Storage ---

const APPROVAL_STORAGE_KEY = 'adl_realdeal_tandem_approvals';
const CONTACT_STORAGE_KEY = 'adl_realdeal_contacts';

function readContacts(): CaseContact[] {
  try {
    const raw = localStorage.getItem(CONTACT_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CaseContact[];
  } catch {
    return [];
  }
}

function readApprovals(): TandemApproval[] {
  try {
    const raw = localStorage.getItem(APPROVAL_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as TandemApproval[];
  } catch {
    return [];
  }
}

function writeApprovals(approvals: TandemApproval[]): void {
  localStorage.setItem(APPROVAL_STORAGE_KEY, JSON.stringify(approvals));
}

// --- Threat Analysis Helpers ---

function flagFromTeamRole(team: ContactTeam, role: ContactRole): EmailRecipientFlag {
  if (role === 'judge' || role === 'magistrate') return 'judge';
  if (role === 'court_reporter' || role === 'process_server') return 'court_staff';
  if (team === 'opposing_team') {
    if (role === 'opposing_counsel') return 'opposing_counsel';
    if (role === 'opposing_associate') return 'opposing_associate';
    if (role === 'opposing_paralegal') return 'opposing_paralegal';
    return 'opposing_party';
  }
  if (team === 'neutral') return 'neutral_party';
  return 'our_team';
}

function threatFromFlag(flag: EmailRecipientFlag): EmailThreatLevel {
  switch (flag) {
    case 'judge': return 'critical';
    case 'opposing_counsel':
    case 'opposing_associate':
    case 'opposing_paralegal':
    case 'opposing_party': return 'danger';
    case 'court_staff':
    case 'neutral_party': return 'caution';
    case 'our_team': return 'safe';
  }
}

function warningFromFlag(flag: EmailRecipientFlag, name: string): string {
  switch (flag) {
    case 'judge':
      return `⚠️ CRITICAL: ${name} is a JUDICIAL OFFICER. Direct email may constitute ex parte communication.`;
    case 'opposing_counsel':
      return `🔴 WARNING: ${name} is OPPOSING COUNSEL. All attachments will be reviewed for privileged content.`;
    case 'opposing_associate':
      return `🔴 WARNING: ${name} is an associate at the opposing firm. Same review protocols apply.`;
    case 'opposing_paralegal':
      return `🔴 WARNING: ${name} is a paralegal at the opposing firm. Content may be forwarded to opposing counsel.`;
    case 'opposing_party':
      return `🔴 WARNING: ${name} is an opposing party. Direct communication may violate Rule 4.2 if represented.`;
    case 'court_staff':
      return `🟡 CAUTION: ${name} is court staff. Ensure no substantive case arguments are included.`;
    case 'neutral_party':
      return `🟡 CAUTION: ${name} is a third party. Verify no confidential material is included.`;
    case 'our_team':
      return `✅ ${name} is on our team. Standard protocols apply.`;
  }
}

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'heic', 'bmp', 'webp', 'tiff'];

function getExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

function checkFileMetadata(fileName: string, fileSize: number): string[] {
  const ext = getExtension(fileName);
  const warnings: string[] = [];

  if (IMAGE_EXTENSIONS.includes(ext)) {
    warnings.push('Image files may contain EXIF metadata (GPS location, device info). Consider stripping metadata.');
  }
  if (['doc', 'docx'].includes(ext)) {
    warnings.push('Word documents may contain tracked changes, comments, and author metadata.');
  }
  if (['pdf'].includes(ext)) {
    warnings.push('PDF may contain hidden layers, annotations, or embedded metadata.');
  }
  if (['xls', 'xlsx'].includes(ext)) {
    warnings.push('Spreadsheets may contain hidden sheets or named ranges with sensitive data.');
  }
  if (fileSize > 10 * 1024 * 1024) {
    warnings.push(`Large file (${(fileSize / 1024 / 1024).toFixed(1)} MB). Consider secure file transfer.`);
  }

  return warnings;
}

// --- Provider Implementation ---

export class RealEmailSafetyProvider implements IEmailSafetyProvider {

  async checkRecipients(caseId: string, emailAddresses: string[]): Promise<EmailRecipientCheck[]> {
    const allContacts = readContacts();
    const caseContacts = allContacts.filter((c) => c.caseId === caseId);

    return emailAddresses.map((email) => {
      // Check case contacts first
      const contact = caseContacts.find((c) => c.email === email);
      if (contact) {
        const flag = flagFromTeamRole(contact.team, contact.role);
        return {
          contactId: contact.id,
          name: contact.name,
          email,
          team: contact.team,
          role: contact.role,
          flag,
          threatLevel: threatFromFlag(flag),
          warningMessage: warningFromFlag(flag, contact.name),
        };
      }

      // Check all contacts across cases
      const anyContact = allContacts.find((c) => c.email === email);
      if (anyContact) {
        const flag = flagFromTeamRole(anyContact.team, anyContact.role);
        return {
          contactId: anyContact.id,
          name: anyContact.name,
          email,
          team: anyContact.team,
          role: anyContact.role,
          flag,
          threatLevel: threatFromFlag(flag),
          warningMessage: warningFromFlag(flag, anyContact.name) + ' (NOTE: Contact from a different case.)',
        };
      }

      // Unknown recipient
      return {
        contactId: '',
        name: 'Unknown Recipient',
        email,
        team: 'neutral' as const,
        role: 'other' as const,
        flag: 'neutral_party' as const,
        threatLevel: 'caution' as const,
        warningMessage: `🟡 CAUTION: ${email} is not a known contact. Verify identity before sending sensitive information.`,
      };
    });
  }

  async scanAttachments(files: File[]): Promise<EmailAttachment[]> {
    return files.map((file, i) => {
      const ext = getExtension(file.name);
      const metadataWarnings = checkFileMetadata(file.name, file.size);

      return {
        id: `att-${Date.now()}-${i}`,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'application/octet-stream',
        previewUrl: IMAGE_EXTENSIONS.includes(ext) ? URL.createObjectURL(file) : undefined,
        containsMetadata: metadataWarnings.length > 0,
        metadataWarnings,
      };
    });
  }

  calculateThreatLevel(recipients: EmailRecipientCheck[], attachments: EmailAttachment[]): EmailThreatLevel {
    const hasJudge = recipients.some((r) => r.flag === 'judge');
    const hasOpposing = recipients.some((r) =>
      ['opposing_counsel', 'opposing_associate', 'opposing_paralegal', 'opposing_party'].includes(r.flag),
    );
    const hasCourt = recipients.some((r) => r.flag === 'court_staff');
    const hasRiskyAttachments = attachments.some((a) => (a.metadataWarnings?.length || 0) > 0);

    if (hasJudge) return 'critical';
    if (hasOpposing && (attachments.length > 0 || hasRiskyAttachments)) return 'danger';
    if (hasOpposing) return 'danger';
    if (hasCourt) return 'caution';
    if (hasRiskyAttachments && recipients.some((r) => r.flag !== 'our_team')) return 'caution';
    return 'safe';
  }

  async createTandemApproval(emailDraftId: string, requiredApprovers: number): Promise<TandemApproval> {
    const approval: TandemApproval = {
      id: `ta-${Date.now()}`,
      emailDraftId,
      requiredApprovers,
      approvers: [],
      status: 'awaiting',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h expiry
    };

    const approvals = readApprovals();
    approvals.push(approval);
    writeApprovals(approvals);

    return approval;
  }

  async submitApproval(
    approvalId: string,
    approverId: string,
    approved: boolean,
    comment?: string,
  ): Promise<TandemApproval> {
    const approvals = readApprovals();
    const idx = approvals.findIndex((a) => a.id === approvalId);
    if (idx === -1) {
      throw new Error(`[RealEmailSafetyProvider] Approval not found: ${approvalId}`);
    }

    const approval = approvals[idx];
    approval.approvers.push({
      contactId: approverId,
      name: approverId, // Will be resolved from contacts in full implementation
      status: approved ? 'approved' : 'rejected',
      timestamp: new Date().toISOString(),
      comment,
    });

    // Check if enough approvals have been collected
    const approvedCount = approval.approvers.filter((a) => a.status === 'approved').length;
    const rejectedCount = approval.approvers.filter((a) => a.status === 'rejected').length;

    if (rejectedCount > 0) {
      approval.status = 'rejected';
    } else if (approvedCount >= approval.requiredApprovers) {
      approval.status = 'approved';
    }

    approvals[idx] = approval;
    writeApprovals(approvals);

    return approval;
  }
}
