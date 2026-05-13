/**
 * RealDeal Access Control Provider → access-control.compact
 * TODO: Wire registerParticipantKey, assignRoleForCase,
 *       grantDocumentAccessToParticipant, revokeDocumentAccessFromParticipant,
 *       proveParticipantHasRole, shareDocumentWithParticipant circuits
 */
import type { IAccessControlProvider } from '../types';

function notConnected(method: string): never {
  throw new Error(`[RealDeal] ${method} not yet connected to blockchain`);
}

export class RealAccessControlProvider implements IAccessControlProvider {
  async getPermissions(_caseId: string) { return notConnected('getPermissions'); }
  async getSharingEvents(_caseId: string) { return notConnected('getSharingEvents'); }
  async getCustodyChain(_documentId: string) { return notConnected('getCustodyChain'); }
  async grantAccess(_documentId: string, _participantName: string, _level: any) { return notConnected('grantAccess'); }
  async revokeAccess(_grantId: string) { return notConnected('revokeAccess'); }
}
