/**
 * RealDeal Contact Provider
 *
 * Contacts are off-chain metadata — they don't live on the blockchain.
 * This provider stores contacts in localStorage, matching the pattern
 * used by case-storage.ts and adl-storage.ts.
 */
import type { IContactProvider, CaseContact } from '../types';

function isContactsEnabled(): boolean {
  return import.meta.env.VITE_FEATURE_CONTACTS !== 'false';
}

// --- Storage ---

const STORAGE_KEY = 'adl_realdeal_contacts';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

function readContacts(): CaseContact[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CaseContact[];
  } catch {
    return [];
  }
}

function writeContacts(contacts: CaseContact[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

// --- Provider ---

export class RealContactProvider implements IContactProvider {
  async getContactsByCaseId(caseId: string): Promise<CaseContact[]> {
    if (!isContactsEnabled()) return [];
    return readContacts()
      .filter((c) => c.caseId === caseId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async updateContactStars(contactId: string, stars: 0 | 1 | 2 | 3): Promise<CaseContact> {
    const contacts = readContacts();
    const idx = contacts.findIndex((c) => c.id === contactId);
    if (idx === -1) {
      throw new Error(`[RealContactProvider] Contact not found: ${contactId}`);
    }
    contacts[idx] = { ...contacts[idx], stars };
    writeContacts(contacts);
    return contacts[idx];
  }

  async reorderContacts(caseId: string, contactIds: string[]): Promise<void> {
    const contacts = readContacts();
    contactIds.forEach((id, index) => {
      const idx = contacts.findIndex((c) => c.id === id && c.caseId === caseId);
      if (idx !== -1) {
        contacts[idx] = { ...contacts[idx], sortOrder: index };
      }
    });
    writeContacts(contacts);
  }
}

/**
 * Seed initial contacts for a case (used by case creation flow).
 * Converts party data into contact entries.
 */
export function seedContactsForCase(
  caseId: string,
  parties: Array<{ name: string; role: string; email?: string; firm?: string }>,
): void {
  const existing = readContacts();
  const caseContacts = existing.filter((c) => c.caseId === caseId);
  if (caseContacts.length > 0) return; // Already seeded

  const newContacts: CaseContact[] = parties.map((party, index) => ({
    id: generateId(),
    caseId,
    name: party.name,
    team: party.role === 'defense' ? 'our_team' as const : 'opposing_team' as const,
    role: party.role === 'defense' ? 'lead_attorney' as const : 'opposing_counsel' as const,
    description: `${party.role} party`,
    firm: party.firm,
    email: party.email,
    stars: 0 as const,
    connectedContactIds: [],
    sortOrder: index,
  }));

  writeContacts([...existing, ...newContacts]);
}
