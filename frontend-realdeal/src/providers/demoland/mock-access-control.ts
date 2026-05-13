import type {
  IAccessControlProvider, AccessPermission, SharingEvent, CustodyEntry,
  AccessGrant, ProtectiveOrderTier,
} from '../types';
import {
  demoAccessPermissions, demoCustodyEntries, demoSharingEvents,
} from './data/cases';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockAccessControlProvider implements IAccessControlProvider {
  async getPermissions(caseId: string): Promise<AccessPermission[]> {
    await delay(300);
    return demoAccessPermissions.filter((p) => p.caseId === caseId);
  }

  async getSharingEvents(caseId: string): Promise<SharingEvent[]> {
    await delay(300);
    // Return all sharing events for documents in the given case
    // In demoLand we return all events (they're all from case-001)
    if (caseId === 'case-001') return [...demoSharingEvents];
    return [];
  }

  async getCustodyChain(documentId: string): Promise<CustodyEntry[]> {
    await delay(200);
    return demoCustodyEntries
      .filter((c) => c.documentId === documentId)
      .sort((a, b) => a.transferDate.localeCompare(b.transferDate));
  }

  async grantAccess(
    documentId: string,
    participantName: string,
    level: ProtectiveOrderTier,
  ): Promise<AccessGrant> {
    await delay(800);
    return {
      id: `grant-${Date.now()}`,
      documentId,
      grantedTo: participantName,
      grantedToRole: 'third_party',
      accessLevel: level,
      grantedAt: new Date().toISOString(),
      grantedBy: 'Sarah Mitchell',
      revoked: false,
    };
  }

  async revokeAccess(_grantId: string): Promise<void> {
    await delay(500);
    // Simulated — no-op in demoLand
  }
}
