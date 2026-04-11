// ============================================================================
// REALDEAL DOCUMENT PROVIDER → document-registry.compact
// ============================================================================
//
// Hybrid off-chain + on-chain provider for document management.
//
// READ: Local storage for metadata, indexer for hash verification.
// WRITE: Local storage now, on-chain registerDocument circuit when wallet ready.
//
// Contract circuits available (Phase 2 — need wallet):
//   - registerDocument(contentHash, categoryNumber, originatorPubKey) → registrationHash
//   - registerTwinBond(imageHash, digitalHash, fidelityScore) → bondHash
//   - recordCustodyTransfer(docHash, sender, receiver) → transferHash
//   - anchorProductionMerkleRoot(merkleRoot, productionId, docCount)
//   - verifyDocumentExistsInProduction(docHash, merkleRoot) → boolean
// ============================================================================

import type {
  IDocumentProvider,
  Document,
  DocumentInput,
  SearchFilters,
  SearchResults,
  TwinBond,
  VerificationResult,
} from '../types';

import {
  isWalletConnected,
  getDeployedContract,
  getCoinPublicKey,
} from '../../contracts/midnight-connection';

import { ContractCallError } from '../../lib/errors';

import {
  hexToBytes32,
} from './storage/case-storage';

const DOCUMENT_CATEGORY_MAP: Record<string, bigint> = {
  pleading: 1n, deposition: 2n, exhibit: 3n, expert_report: 4n,
  correspondence: 5n, medical_record: 6n, financial_record: 7n,
  contract: 8n, photograph: 9n, video: 10n, audio: 11n,
  electronic: 12n, other: 99n,
};

import {
  getDocumentsByCase,
  getDocumentById,
  registerDocumentLocally,
  getTwinBondForDocument,
  verifyDocumentHash,
  searchDocumentsLocally,
} from './storage/adl-storage';

export class RealDocumentProvider implements IDocumentProvider {

  async listDocuments(caseId: string): Promise<Document[]> {
    return getDocumentsByCase(caseId);
  }

  async getDocument(docId: string): Promise<Document> {
    const doc = getDocumentById(docId);
    if (!doc) throw new Error(`[RealDocumentProvider] Document not found: ${docId}`);
    return doc;
  }

  async registerDocument(input: DocumentInput): Promise<Document> {
    const doc = registerDocumentLocally(input);

    if (isWalletConnected()) {
      const deployed = getDeployedContract('document-registry');
      if (deployed && doc.contentHash) {
        try {
          const contentHashBytes = hexToBytes32(doc.contentHash);
          const categoryNumber = DOCUMENT_CATEGORY_MAP[doc.category ?? 'other'] ?? 99n;
          const originatorPublicKey = getCoinPublicKey() ?? '';
          const originatorKey = hexToBytes32(originatorPublicKey);
          await deployed.callTx.registerDocument(contentHashBytes, categoryNumber, originatorKey);
          console.info(
            `[RealDocumentProvider] Document "${doc.title}" anchored on-chain.`,
          );
        } catch (error) {
          throw new ContractCallError('registerDocument', error);
        }
      }
    } else {
      console.info(
        `[RealDocumentProvider] Document "${doc.title}" saved locally. Connect wallet to anchor on-chain.`,
      );
    }

    return doc;
  }

  async searchDocuments(query: string, filters?: SearchFilters): Promise<SearchResults> {
    const docs = searchDocumentsLocally(query, filters);
    return { documents: docs, totalCount: docs.length, query, filters };
  }

  async getTwinBond(docId: string): Promise<TwinBond | null> {
    return getTwinBondForDocument(docId);
  }

  async verifyHash(docId: string): Promise<VerificationResult> {
    return verifyDocumentHash(docId);
  }
}
