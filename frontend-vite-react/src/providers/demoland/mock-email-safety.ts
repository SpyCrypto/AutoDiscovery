import type {
  IEmailSafetyProvider,
  EmailRecipientCheck,
  EmailAttachment,
  EmailThreatLevel,
  TandemApproval,
  ContactTeam,
  ContactRole,
  EmailRecipientFlag,
} from '../types';
import { getAllContacts } from './data/contacts';

// --- Recipient flag mapping ---

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
    case 'judge':
      return 'critical';
    case 'opposing_counsel':
    case 'opposing_associate':
    case 'opposing_paralegal':
    case 'opposing_party':
      return 'danger';
    case 'court_staff':
    case 'neutral_party':
      return 'caution';
    case 'our_team':
      return 'safe';
  }
}

function warningFromFlag(flag: EmailRecipientFlag, name: string): string {
  switch (flag) {
    case 'judge':
      return `⚠️ CRITICAL: ${name} is a JUDICIAL OFFICER. All communications must go through proper court channels. Direct email to the judge is almost never appropriate and may constitute ex parte communication.`;
    case 'opposing_counsel':
      return `🔴 WARNING: ${name} is OPPOSING COUNSEL. All attachments will be reviewed for privileged content. Tandem approval required for attachments.`;
    case 'opposing_associate':
      return `🔴 WARNING: ${name} is an associate at the opposing firm. Treat as opposing counsel — same review protocols apply.`;
    case 'opposing_paralegal':
      return `🔴 WARNING: ${name} is a paralegal at the opposing firm. Content may be forwarded to opposing counsel.`;
    case 'opposing_party':
      return `🔴 WARNING: ${name} is an opposing party/defendant. Direct communication may violate ethics rules if they are represented by counsel. Check Rule 4.2.`;
    case 'court_staff':
      return `🟡 CAUTION: ${name} is court staff. Ensure communication is procedurally appropriate and does not contain substantive case arguments.`;
    case 'neutral_party':
      return `🟡 CAUTION: ${name} is a third party. Verify no confidential or privileged material is included.`;
    case 'our_team':
      return `✅ ${name} is on our team. Standard protocols apply.`;
  }
}

// --- Metadata sniffers for attachments ---

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'heic', 'bmp', 'webp', 'tiff'];

function getExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

function checkFileMetadata(fileName: string, fileSize: number): string[] {
  const ext = getExtension(fileName);
  const warnings: string[] = [];

  if (IMAGE_EXTENSIONS.includes(ext)) {
    warnings.push('Image files may contain EXIF metadata (GPS location, device info, timestamps). Consider stripping metadata before sending.');
  }
  if (['doc', 'docx'].includes(ext)) {
    warnings.push('Word documents may contain tracked changes, comments, and author metadata. Review document properties before sending.');
  }
  if (['pdf'].includes(ext)) {
    warnings.push('PDF may contain hidden layers, annotations, or embedded metadata. Use "Sanitize Document" before sending to external parties.');
  }
  if (['xls', 'xlsx'].includes(ext)) {
    warnings.push('Spreadsheets may contain hidden sheets, named ranges with sensitive data, or calculation history.');
  }
  if (fileSize > 10 * 1024 * 1024) {
    warnings.push(`Large file (${(fileSize / 1024 / 1024).toFixed(1)} MB). Consider secure file transfer instead of email attachment.`);
  }

  return warnings;
}

// --- Provider Implementation ---

export function createMockEmailSafetyProvider(): IEmailSafetyProvider {
  const approvalStore = new Map<string, TandemApproval>();

  return {
    async checkRecipients(caseId: string, emailAddresses: string[]): Promise<EmailRecipientCheck[]> {
      await new Promise((r) => setTimeout(r, 150));

      const allContacts = getAllContacts();
      const caseContacts = allContacts.filter((c) => c.caseId === caseId);

      return emailAddresses.map((email) => {
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

        // Unknown recipient — also check all cases
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
            warningMessage: warningFromFlag(flag, anyContact.name) + ' (NOTE: Contact found on a different case.)',
          };
        }

        // Completely unknown email
        return {
          contactId: '',
          name: 'Unknown Recipient',
          email,
          team: 'neutral' as const,
          role: 'other' as const,
          flag: 'neutral_party' as const,
          threatLevel: 'caution' as const,
          warningMessage: `🟡 CAUTION: ${email} is not a known contact in any case. Verify identity before sending sensitive information.`,
        };
      });
    },

    async scanAttachments(files: File[]): Promise<EmailAttachment[]> {
      await new Promise((r) => setTimeout(r, 200));

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
    },

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
    },

    async createTandemApproval(emailDraftId: string, requiredApprovers: number): Promise<TandemApproval> {
      await new Promise((r) => setTimeout(r, 100));

      const approval: TandemApproval = {
        id: `ta-${Date.now()}`,
        emailDraftId,
        requiredApprovers,
        approvers: [],
        status: 'awaiting',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      };

      approvalStore.set(approval.id, approval);
      return { ...approval };
    },

    async submitApproval(
      approvalId: string,
      approverId: string,
      approved: boolean,
      comment?: string,
    ): Promise<TandemApproval> {
      await new Promise((r) => setTimeout(r, 100));

      const approval = approvalStore.get(approvalId);
      if (!approval) throw new Error(`Approval ${approvalId} not found`);

      const existing = approval.approvers.find((a) => a.contactId === approverId);
      if (existing) {
        existing.status = approved ? 'approved' : 'rejected';
        existing.timestamp = new Date().toISOString();
        existing.comment = comment;
      } else {
        approval.approvers.push({
          contactId: approverId,
          name: `Approver ${approval.approvers.length + 1}`,
          status: approved ? 'approved' : 'rejected',
          timestamp: new Date().toISOString(),
          comment,
        });
      }

      const approvedCount = approval.approvers.filter((a) => a.status === 'approved').length;
      const rejectedCount = approval.approvers.filter((a) => a.status === 'rejected').length;

      if (rejectedCount > 0) {
        approval.status = 'rejected';
      } else if (approvedCount >= approval.requiredApprovers) {
        approval.status = 'approved';
      }

      approvalStore.set(approvalId, approval);
      return { ...approval };
    },
  };
}
