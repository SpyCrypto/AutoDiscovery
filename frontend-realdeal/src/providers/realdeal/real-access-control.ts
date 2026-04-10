// ============================================================================
// REALDEAL ACCESS CONTROL PROVIDER → access-control.compact
// ============================================================================
//
// Manages document access permissions, sharing events, and custody chains.
//
// Contract circuits (Phase 2 — need wallet):
//   - registerParticipantKey(pubKeyHash, role) → void
//   - assignRoleForCase(caseId, pubKeyHash, role) → void
//   - grantDocumentAccessToParticipant(docHash, recipientHash, tier) → void
//   - revokeDocumentAccessFromParticipant(docHash, recipientHash) → void
//   - proveParticipantHasRole(caseId, pubKeyHash, role) → boolean
//   - shareDocumentWithParticipant(docHash, recipientHash, tier) → proofHash
// ============================================================================

import type {
  IAccessControlProvider,
  AccessPermission,
  SharingEvent,
  CustodyEntry,
  AccessGrant,
  ProtectiveOrderTier,
} from '../types';

import {
  getPermissionsByCase,
  getSharingEventsByCase,
  getCustodyEntriesByDocument,
  addAccessGrantLocally,
  revokeAccessGrantLocally,
} from './storage/adl-storage';

import {
  isWalletConnected,
  getDeployedContract,
  getCoinPublicKey,
} from '../../contracts/midnight-connection';

import { ContractCallError } from '../../lib/errors';
import { hexToBytes32, tierToNumber } from './chain/bytes-utils';

export class RealAccessControlProvider implements IAccessControlProvider {

  async getPermissions(caseId: string): Promise<AccessPermission[]> {
    return getPermissionsByCase(caseId);
  }

  async getSharingEvents(caseId: string): Promise<SharingEvent[]> {
    return getSharingEventsByCase(caseId);
  }

  async getCustodyChain(documentId: string): Promise<CustodyEntry[]> {
    return getCustodyEntriesByDocument(documentId);
  }

  async grantAccess(
    documentId: string,
    participantName: string,
    level: ProtectiveOrderTier,
  ): Promise<AccessGrant> {
    const now = new Date().toISOString();
    const walletKey = getCoinPublicKey();

    const grant = addAccessGrantLocally({
      documentId,
      grantedTo: participantName,
      grantedToRole: 'defense',
      accessLevel: level,
      grantedAt: now,
      grantedBy: walletKey || 'current-user',
      revoked: false,
    });

    // Anchor on-chain if wallet is connected
    if (isWalletConnected()) {
      const deployed = getDeployedContract('access-control');
      if (deployed) {
        try {
          const docHash = hexToBytes32(documentId);
          const recipientHash = hexToBytes32(participantName);
          const tierEnum = BigInt(tierToNumber(level));
          await deployed.callTx.grantDocumentAccessToParticipant(docHash, recipientHash, tierEnum);
          console.info(`[RealAccessControlProvider] Access grant anchored on-chain for ${participantName}.`);
        } catch (error) {
          throw new ContractCallError('grantDocumentAccessToParticipant', error);
        }
      }
    } else {
      console.info(
        `[RealAccessControlProvider] Access granted locally. Connect wallet to anchor on-chain.`,
      );
    }

    return grant;
  }

  async revokeAccess(grantId: string): Promise<void> {
    revokeAccessGrantLocally(grantId);

    // Anchor revocation on-chain if wallet is connected
    if (isWalletConnected()) {
      const deployed = getDeployedContract('access-control');
      if (deployed) {
        try {
          // The grantId is used as a proxy for the document + recipient hash pair.
          // In production, the actual docHash/recipientHash would be stored in the grant record.
          const docHash = hexToBytes32(grantId);
          const recipientHash = hexToBytes32(grantId);
          await deployed.callTx.revokeDocumentAccessFromParticipant(docHash, recipientHash);
          console.info(`[RealAccessControlProvider] Access revocation anchored on-chain.`);
        } catch (error) {
          throw new ContractCallError('revokeDocumentAccessFromParticipant', error);
        }
      }
    } else {
      console.info(
        `[RealAccessControlProvider] Access revoked locally. Connect wallet to anchor on-chain.`,
      );
    }
  }
}
