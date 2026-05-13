import type { IJurisdictionProvider, JurisdictionRegistration } from '../types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const registeredJurisdictions: JurisdictionRegistration[] = [
  {
    id: 'jreg-001',
    jurisdictionCode: 'ID',
    jurisdictionName: 'Idaho — IRCP',
    rulePackVersion: 3,
    rulePackLabel: 'Idaho Rules of Civil Procedure (2024 Revision)',
    effectiveDate: '2024-07-01',
    lastUpdated: '2025-09-15',
    totalRules: 42,
    verifiedOnChain: true,
    registryHash: 'jur-hash-001-a3f2b8c1d4e5f6a7b8c9d0e1f2a3b4c5',
  },
  {
    id: 'jreg-002',
    jurisdictionCode: 'WA',
    jurisdictionName: 'Washington — CR',
    rulePackVersion: 2,
    rulePackLabel: 'Washington Superior Court Civil Rules (2023 Revision)',
    effectiveDate: '2023-09-01',
    lastUpdated: '2025-06-10',
    totalRules: 38,
    verifiedOnChain: true,
    registryHash: 'jur-hash-002-b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9',
  },
  {
    id: 'jreg-003',
    jurisdictionCode: 'UT',
    jurisdictionName: 'Utah — URCP',
    rulePackVersion: 4,
    rulePackLabel: 'Utah Rules of Civil Procedure (2024 Amendment)',
    effectiveDate: '2024-05-01',
    lastUpdated: '2025-08-20',
    totalRules: 45,
    verifiedOnChain: true,
    registryHash: 'jur-hash-003-c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
  },
  {
    id: 'jreg-004',
    jurisdictionCode: 'FED',
    jurisdictionName: 'Federal — FRCP',
    rulePackVersion: 5,
    rulePackLabel: 'Federal Rules of Civil Procedure (2024 Amendments)',
    effectiveDate: '2024-12-01',
    lastUpdated: '2025-12-01',
    totalRules: 86,
    verifiedOnChain: true,
    registryHash: 'jur-hash-004-d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
  },
];

export class MockJurisdictionProvider implements IJurisdictionProvider {
  async getRegisteredJurisdictions(): Promise<JurisdictionRegistration[]> {
    await delay(300);
    return [...registeredJurisdictions];
  }

  async getJurisdictionDetails(code: string): Promise<JurisdictionRegistration> {
    await delay(200);
    const found = registeredJurisdictions.find((j) => j.jurisdictionCode === code);
    if (!found) throw new Error(`Jurisdiction not found: ${code}`);
    return found;
  }

  async verifyRulePack(code: string): Promise<{ valid: boolean; message: string }> {
    await delay(1000);
    const found = registeredJurisdictions.find((j) => j.jurisdictionCode === code);
    if (!found) {
      return { valid: false, message: `Jurisdiction ${code} is not registered in the on-chain registry.` };
    }
    return {
      valid: true,
      message: `Rule pack v${found.rulePackVersion} verified — hash matches on-chain commitment. ${found.totalRules} rules confirmed.`,
    };
  }
}
