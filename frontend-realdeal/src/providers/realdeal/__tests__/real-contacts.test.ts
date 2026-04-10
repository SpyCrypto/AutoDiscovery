import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RealContactProvider, seedContactsForCase } from '../real-contacts';

// Mock localStorage for Node.js test environment
const store: Record<string, string> = {};
vi.stubGlobal('localStorage', {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
});

describe('RealContactProvider', () => {
  let provider: RealContactProvider;

  beforeEach(() => {
    Object.keys(store).forEach((k) => delete store[k]);
    provider = new RealContactProvider();
  });

  describe('getContactsByCaseId', () => {
    it('returns empty array for new case', async () => {
      const contacts = await provider.getContactsByCaseId('new-case');
      expect(contacts).toEqual([]);
    });

    it('returns seeded contacts sorted by sortOrder', async () => {
      seedContactsForCase('case-1', [
        { name: 'Alice', role: 'defense', email: 'alice@firm.com' },
        { name: 'Bob', role: 'prosecution', email: 'bob@other.com' },
      ]);

      const contacts = await provider.getContactsByCaseId('case-1');
      expect(contacts).toHaveLength(2);
      expect(contacts[0].name).toBe('Alice');
      expect(contacts[1].name).toBe('Bob');
      expect(contacts[0].sortOrder).toBe(0);
      expect(contacts[1].sortOrder).toBe(1);
    });

    it('does not return contacts from other cases', async () => {
      seedContactsForCase('case-1', [{ name: 'Alice', role: 'defense' }]);
      seedContactsForCase('case-2', [{ name: 'Bob', role: 'prosecution' }]);

      const contacts = await provider.getContactsByCaseId('case-1');
      expect(contacts).toHaveLength(1);
      expect(contacts[0].name).toBe('Alice');
    });
  });

  describe('updateContactStars', () => {
    it('updates star rating', async () => {
      seedContactsForCase('case-1', [{ name: 'Alice', role: 'defense' }]);
      const contacts = await provider.getContactsByCaseId('case-1');

      const updated = await provider.updateContactStars(contacts[0].id, 3);
      expect(updated.stars).toBe(3);

      // Verify persistence
      const reloaded = await provider.getContactsByCaseId('case-1');
      expect(reloaded[0].stars).toBe(3);
    });

    it('throws for non-existent contact', async () => {
      await expect(
        provider.updateContactStars('nonexistent', 1),
      ).rejects.toThrow('Contact not found');
    });
  });

  describe('reorderContacts', () => {
    it('updates sort order', async () => {
      seedContactsForCase('case-1', [
        { name: 'Alice', role: 'defense' },
        { name: 'Bob', role: 'prosecution' },
      ]);

      const contacts = await provider.getContactsByCaseId('case-1');
      const reversedIds = [contacts[1].id, contacts[0].id];

      await provider.reorderContacts('case-1', reversedIds);

      const reordered = await provider.getContactsByCaseId('case-1');
      expect(reordered[0].name).toBe('Bob');
      expect(reordered[1].name).toBe('Alice');
    });
  });

  describe('seedContactsForCase', () => {
    it('does not re-seed if contacts already exist', () => {
      seedContactsForCase('case-1', [{ name: 'Alice', role: 'defense' }]);
      seedContactsForCase('case-1', [{ name: 'New Person', role: 'prosecution' }]);

      const raw = JSON.parse(store['adl_realdeal_contacts'] || '[]');
      const caseContacts = raw.filter((c: any) => c.caseId === 'case-1');
      expect(caseContacts).toHaveLength(1);
      expect(caseContacts[0].name).toBe('Alice');
    });

    it('maps defense role to our_team', () => {
      seedContactsForCase('case-1', [{ name: 'Alice', role: 'defense' }]);
      const raw = JSON.parse(store['adl_realdeal_contacts'] || '[]');
      expect(raw[0].team).toBe('our_team');
    });

    it('maps non-defense role to opposing_team', () => {
      seedContactsForCase('case-1', [{ name: 'Bob', role: 'prosecution' }]);
      const raw = JSON.parse(store['adl_realdeal_contacts'] || '[]');
      expect(raw[0].team).toBe('opposing_team');
    });
  });
});
