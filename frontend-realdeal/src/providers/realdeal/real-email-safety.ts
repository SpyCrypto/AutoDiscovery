/**
 * RealDeal Email Safety Provider
 * TODO: Wire to email gateway service for:
 *   - Recipient analysis against case party database
 *   - Attachment metadata scanning
 *   - Tandem approval workflow with real notification system
 */
import type { IEmailSafetyProvider, EmailRecipientCheck, EmailAttachment, EmailThreatLevel } from '../types';

function notConnected(method: string): never {
  throw new Error(`[RealDeal] ${method} not yet connected to email safety service`);
}

export class RealEmailSafetyProvider implements IEmailSafetyProvider {
  async checkRecipients(_caseId: string, _emailAddresses: string[]) { return notConnected('checkRecipients'); }
  async scanAttachments(_attachments: File[]) { return notConnected('scanAttachments'); }
  calculateThreatLevel(_recipients: EmailRecipientCheck[], _attachments: EmailAttachment[]): EmailThreatLevel { return notConnected('calculateThreatLevel'); }
  async createTandemApproval(_emailDraftId: string, _requiredApprovers: number) { return notConnected('createTandemApproval'); }
  async submitApproval(_approvalId: string, _approverId: string, _approved: boolean, _comment?: string) { return notConnected('submitApproval'); }
}
