import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RealEmailSafetyProvider } from '../real-email-safety';

// Mock localStorage for Node.js test environment
const store: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
});

describe('RealEmailSafetyProvider', () => {
  let provider: RealEmailSafetyProvider;

  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    provider = new RealEmailSafetyProvider();
  });

  describe('checkRecipients', () => {
    it('flags unknown recipients as caution', async () => {
      const results = await provider.checkRecipients('case-1', ['unknown@example.com']);

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Unknown Recipient');
      expect(results[0].threatLevel).toBe('caution');
      expect(results[0].flag).toBe('neutral_party');
    });

    it('matches contacts from localStorage', async () => {
      // Seed a contact
      store['adl_realdeal_contacts'] = JSON.stringify([{
        id: 'c1',
        caseId: 'case-1',
        name: 'Opposing Lawyer',
        team: 'opposing_team',
        role: 'opposing_counsel',
        email: 'lawyer@opposing.com',
        sortOrder: 0,
        stars: 0,
        connectedContactIds: [],
        description: 'test',
      }]);

      const results = await provider.checkRecipients('case-1', ['lawyer@opposing.com']);

      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Opposing Lawyer');
      expect(results[0].threatLevel).toBe('danger');
      expect(results[0].flag).toBe('opposing_counsel');
    });

    it('flags judges as critical', async () => {
      store['adl_realdeal_contacts'] = JSON.stringify([{
        id: 'j1',
        caseId: 'case-1',
        name: 'Judge Smith',
        team: 'neutral',
        role: 'judge',
        email: 'judge@court.gov',
        sortOrder: 0,
        stars: 0,
        connectedContactIds: [],
        description: 'judge',
      }]);

      const results = await provider.checkRecipients('case-1', ['judge@court.gov']);
      expect(results[0].threatLevel).toBe('critical');
      expect(results[0].flag).toBe('judge');
    });
  });

  describe('calculateThreatLevel', () => {
    it('returns critical when judge is present', () => {
      const recipients = [{
        contactId: 'j1', name: 'Judge', email: 'j@court.gov',
        team: 'neutral' as const, role: 'judge' as const,
        flag: 'judge' as const, threatLevel: 'critical' as const,
        warningMessage: '',
      }];
      expect(provider.calculateThreatLevel(recipients, [])).toBe('critical');
    });

    it('returns danger when opposing counsel has attachments', () => {
      const recipients = [{
        contactId: 'o1', name: 'Opp', email: 'o@opp.com',
        team: 'opposing_team' as const, role: 'opposing_counsel' as const,
        flag: 'opposing_counsel' as const, threatLevel: 'danger' as const,
        warningMessage: '',
      }];
      const attachments = [{
        id: 'a1', fileName: 'doc.pdf', fileSize: 1000,
        mimeType: 'application/pdf',
        containsMetadata: true,
        metadataWarnings: ['PDF may contain hidden layers'],
      }];
      expect(provider.calculateThreatLevel(recipients, attachments)).toBe('danger');
    });

    it('returns safe when only our team', () => {
      const recipients = [{
        contactId: 't1', name: 'Teammate', email: 't@firm.com',
        team: 'our_team' as const, role: 'lead_attorney' as const,
        flag: 'our_team' as const, threatLevel: 'safe' as const,
        warningMessage: '',
      }];
      expect(provider.calculateThreatLevel(recipients, [])).toBe('safe');
    });
  });

  describe('createTandemApproval', () => {
    it('creates an approval record', async () => {
      const approval = await provider.createTandemApproval('draft-1', 2);

      expect(approval.id).toBeTruthy();
      expect(approval.emailDraftId).toBe('draft-1');
      expect(approval.requiredApprovers).toBe(2);
      expect(approval.status).toBe('awaiting');
      expect(approval.approvers).toHaveLength(0);
    });
  });

  describe('submitApproval', () => {
    it('approves when enough approvals collected', async () => {
      const approval = await provider.createTandemApproval('draft-1', 1);
      const result = await provider.submitApproval(approval.id, 'user-1', true, 'LGTM');

      expect(result.status).toBe('approved');
      expect(result.approvers).toHaveLength(1);
      expect(result.approvers[0].status).toBe('approved');
    });

    it('rejects when a rejection is submitted', async () => {
      const approval = await provider.createTandemApproval('draft-1', 2);
      const result = await provider.submitApproval(approval.id, 'user-1', false, 'Needs changes');

      expect(result.status).toBe('rejected');
    });

    it('throws for non-existent approval', async () => {
      await expect(
        provider.submitApproval('nonexistent', 'user-1', true),
      ).rejects.toThrow('Approval not found');
    });
  });
});
