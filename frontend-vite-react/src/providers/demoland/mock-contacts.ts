import type { IContactProvider, CaseContact } from '../types';
import { getContactsForCase } from './data/contacts';

export function createMockContactProvider(): IContactProvider {
  const contactStore = new Map<string, CaseContact>();

  function ensureLoaded(caseId: string) {
    const contacts = getContactsForCase(caseId);
    for (const c of contacts) {
      if (!contactStore.has(c.id)) {
        contactStore.set(c.id, { ...c });
      }
    }
  }

  return {
    async getContactsByCaseId(caseId: string): Promise<CaseContact[]> {
      await new Promise((r) => setTimeout(r, 200));
      ensureLoaded(caseId);
      return getContactsForCase(caseId)
        .map((c) => contactStore.get(c.id) || c)
        .sort((a, b) => a.sortOrder - b.sortOrder);
    },

    async updateContactStars(contactId: string, stars: 0 | 1 | 2 | 3): Promise<CaseContact> {
      await new Promise((r) => setTimeout(r, 100));
      const contact = contactStore.get(contactId);
      if (!contact) throw new Error(`Contact ${contactId} not found`);
      contact.stars = stars;
      contactStore.set(contactId, contact);
      return { ...contact };
    },

    async reorderContacts(caseId: string, contactIds: string[]): Promise<void> {
      await new Promise((r) => setTimeout(r, 100));
      ensureLoaded(caseId);
      contactIds.forEach((id, index) => {
        const contact = contactStore.get(id);
        if (contact) {
          contact.sortOrder = index;
          contactStore.set(id, contact);
        }
      });
    },
  };
}
