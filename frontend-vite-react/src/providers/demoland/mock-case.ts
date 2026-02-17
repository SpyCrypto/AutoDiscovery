import type { ICaseProvider, Case, DiscoveryStep, Party, CreateCaseParams } from '../types';
import { demoCases, demoSteps } from './data/cases';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockCaseProvider implements ICaseProvider {
  private cases: Case[] = [...demoCases];
  private steps: DiscoveryStep[] = [...demoSteps];

  async listCases(): Promise<Case[]> {
    await delay(400);
    return this.cases;
  }

  async getCase(caseId: string): Promise<Case> {
    await delay(300);
    const found = this.cases.find((c) => c.id === caseId);
    if (!found) throw new Error(`Case not found: ${caseId}`);
    return found;
  }

  async createCase(params: CreateCaseParams): Promise<Case> {
    await delay(600);
    const newCase: Case = {
      id: `case-${Date.now()}`,
      caseNumber: params.caseNumber,
      title: params.title,
      jurisdiction: params.jurisdiction,
      caseType: params.caseType,
      status: 'active',
      filingDate: new Date().toISOString().split('T')[0],
      parties: params.parties.map((p, i) => ({ ...p, id: `party-new-${i}` })),
      documentCount: 0,
      stepsComplete: 0,
      stepsTotal: 0,
      complianceScore: 1.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.cases.push(newCase);
    return newCase;
  }

  async getCaseSteps(caseId: string): Promise<DiscoveryStep[]> {
    await delay(300);
    return this.steps.filter((s) => s.caseId === caseId);
  }

  async getCaseParties(caseId: string): Promise<Party[]> {
    await delay(200);
    const caseData = this.cases.find((c) => c.id === caseId);
    if (!caseData) return [];
    return caseData.parties;
  }
}
