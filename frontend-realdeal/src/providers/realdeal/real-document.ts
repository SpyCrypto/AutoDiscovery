/**
 * RealDeal Document Provider → document-registry.compact
 * TODO: Wire registerDocument, registerTwinBond, recordCustodyTransfer,
 *       anchorProductionMerkleRoot, verifyDocumentExistsInProduction circuits
 */
import type { IDocumentProvider } from '../types';

function notConnected(method: string): never {
  throw new Error(`[RealDeal] ${method} not yet connected to blockchain`);
}

export class RealDocumentProvider implements IDocumentProvider {
  async listDocuments(_caseId: string) { return notConnected('listDocuments'); }
  async getDocument(_documentId: string) { return notConnected('getDocument'); }
  async registerDocument(_doc: any) { return notConnected('registerDocument'); }
  async verifyHash(_docId: string) { return notConnected('verifyHash'); }
  async getTwinBond(_documentId: string) { return notConnected('getTwinBond'); }
  async searchDocuments(_query: string, _filters?: any) { return notConnected('searchDocuments'); }
}
