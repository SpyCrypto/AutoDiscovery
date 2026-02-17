import type {
  IDocumentProvider, Document, DocumentInput, TwinBond,
  SearchFilters, SearchResults, VerificationResult,
} from '../types';
import { demoDocuments } from './data/cases';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockDocumentProvider implements IDocumentProvider {
  private documents: Document[] = [...demoDocuments];

  async listDocuments(caseId: string): Promise<Document[]> {
    await delay(400);
    return this.documents.filter((d) => d.caseId === caseId);
  }

  async getDocument(docId: string): Promise<Document> {
    await delay(200);
    const found = this.documents.find((d) => d.id === docId);
    if (!found) throw new Error(`Document not found: ${docId}`);
    return found;
  }

  async registerDocument(input: DocumentInput): Promise<Document> {
    await delay(800);
    const doc: Document = {
      id: `doc-${Date.now()}`,
      caseId: input.caseId,
      title: input.title,
      category: input.category,
      originator: input.originator,
      originatorRole: input.originatorRole,
      dateReceived: new Date().toISOString().split('T')[0],
      pageCount: input.pageCount,
      contentHash: `hash-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      protectiveOrder: 'none',
      hasTwin: false,
      verified: true,
    };
    this.documents.push(doc);
    return doc;
  }

  async searchDocuments(query: string, filters?: SearchFilters): Promise<SearchResults> {
    await delay(600);
    const q = query.toLowerCase();
    let results = this.documents.filter((d) => {
      const matchesQuery =
        d.title.toLowerCase().includes(q) ||
        (d.aiSynopsis?.toLowerCase().includes(q) ?? false) ||
        (d.entities?.some((e) => e.toLowerCase().includes(q)) ?? false);
      if (!matchesQuery) return false;
      if (filters?.caseId && d.caseId !== filters.caseId) return false;
      if (filters?.category && d.category !== filters.category) return false;
      if (filters?.originator && d.originator !== filters.originator) return false;
      if (filters?.protectiveOrder && d.protectiveOrder !== filters.protectiveOrder) return false;
      return true;
    });
    return { documents: results, totalCount: results.length, query, filters };
  }

  async getTwinBond(docId: string): Promise<TwinBond | null> {
    await delay(200);
    const doc = this.documents.find((d) => d.id === docId);
    return doc?.twinBond ?? null;
  }

  async verifyHash(docId: string): Promise<VerificationResult> {
    await delay(1000);
    const doc = this.documents.find((d) => d.id === docId);
    if (!doc) {
      return {
        valid: false, documentId: docId, contentHash: '', timestamp: new Date().toISOString(),
        message: 'Document not found',
      };
    }
    return {
      valid: true, documentId: docId, contentHash: doc.contentHash,
      timestamp: new Date().toISOString(),
      message: 'Hash verified against sealed Merkle commitment — document integrity confirmed.',
    };
  }
}
