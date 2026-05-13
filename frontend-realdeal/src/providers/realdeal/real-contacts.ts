/**
 * RealDeal Contact Provider
 * TODO: Wire to off-chain contact service or local storage
 *       Contacts are not on-chain — they live in the application layer
 */
import type { IContactProvider } from '../types';

function notConnected(method: string): never {
  throw new Error(`[RealDeal] ${method} not yet connected to contact service`);
}

export class RealContactProvider implements IContactProvider {
  async getContactsByCaseId(_caseId: string) { return notConnected('getContactsByCaseId'); }
  async updateContactStars(_contactId: string, _stars: any) { return notConnected('updateContactStars'); }
  async reorderContacts(_caseId: string, _contactIds: string[]) { return notConnected('reorderContacts'); }
}
