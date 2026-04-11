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
  isWalletConnected,
  getDeployedContract,
} from '../../contracts/midnight-connection';

import { ContractCallError } from '../../lib/errors';

import { hexToBytes32 } from './storage/case-storage';

import {
  getPermissionsByCase,
  getSharingEventsByCase,
  getCustodyEntriesByDocument,
  addAccessGrantLocally,
  revokeAccessGrantLocally,
  getAccessGrantById,
} from './storage/adl-storage';

import { getDocumentById } from './storage/adl-storage';

const TIER_ENUM: Record<ProtectiveOrderTier, bigint> = {
  none: 0n, confidential: 1n, aeo: 2n, sealed: 3n,
};

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
    participantPublicKey?: string,
  ): Promise<AccessGrant> {
    const now = new Date().toISOString();

    const grant = addAccessGrantLocally({
      documentId,
      grantedTo: participantName,
      grantedToRole: 'defense',
      accessLevel: level,
      grantedAt: now,
      grantedBy: 'current-user',
      revoked: false,
      participantPublicKey,
    });

    if (isWalletConnected() && participantPublicKey) {
      const deployed = getDeployedContract('access-control');
      const doc = getDocumentById(documentId);
      if (deployed && doc?.contentHash) {
        try {
          const docHash = hexToBytes32(doc.contentHash);
          const recipientHash = hexToBytes32(participantPublicKey);
          const tierEnum = TIER_ENUM[level] ?? 0n;
          await deployed.callTx.grantDocumentAccessToParticipant(docHash, recipientHash, tierEnum);
          console.info(
            `[RealAccessControlProvider] Access granted on-chain for document ${documentId.slice(0, 8)}...`,
          );
        } catch (error) {
          throw new ContractCallError('grantDocumentAccessToParticipant', error);
        }
      }
    } else {
      console.info(
        `[RealAccessControlProvider] Access granted locally.${
          !participantPublicKey
            ? ' No participant public key — pass participantPublicKey to anchor on-chain.'
            : ' Connect wallet to anchor on-chain.'
        }`,
      );
    }

    return grant;
  }

  async revokeAccess(grantId: string): Promise<void> {
    const grant = getAccessGrantById(grantId);
    revokeAccessGrantLocally(grantId);

    if (isWalletConnected() && grant?.participantPublicKey) {
      const deployed = getDeployedContract('access-control');
      const doc = grant.documentId ? getDocumentById(grant.documentId) : undefined;
      if (deployed && doc?.contentHash) {
        try {
          const docHash = hexToBytes32(doc.contentHash);
          const revokedHash = hexToBytes32(grant.participantPublicKey);
          await deployed.callTx.revokeDocumentAccessFromParticipant(docHash, revokedHash);
          console.info(
            `[RealAccessControlProvider] Access revoked on-chain for document ${grant.documentId.slice(0, 8)}...`,
          );
        } catch (error) {
          throw new ContractCallError('revokeDocumentAccessFromParticipant', error);
        }
      }
    } else {
      console.info(
        `[RealAccessControlProvider] Access revoked locally.${
          grant && !grant.participantPublicKey
            ? ' No participant public key stored — on-chain revocation skipped.'
            : ' Connect wallet to anchor revocation on-chain.'
        }`,
      );
    }
  }
}
