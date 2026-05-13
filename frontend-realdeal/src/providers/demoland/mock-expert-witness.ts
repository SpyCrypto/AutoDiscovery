import type { IExpertWitnessProvider, ExpertWitness } from '../types';
import { demoExperts } from './data/cases';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockExpertWitnessProvider implements IExpertWitnessProvider {
  private experts: ExpertWitness[] = [...demoExperts];

  async getExpertsByCase(caseId: string): Promise<ExpertWitness[]> {
    await delay(300);
    return this.experts.filter((e) => e.caseId === caseId);
  }

  async getExpert(expertId: string): Promise<ExpertWitness> {
    await delay(200);
    const found = this.experts.find((e) => e.id === expertId);
    if (!found) throw new Error(`Expert not found: ${expertId}`);
    return found;
  }

  async registerExpert(
    expert: Omit<ExpertWitness, 'id' | 'registeredAt' | 'qualificationProofVerified'>,
  ): Promise<ExpertWitness> {
    await delay(1200);
    const newExpert: ExpertWitness = {
      ...expert,
      id: `exp-${Date.now()}`,
      registeredAt: new Date().toISOString(),
      qualificationProofVerified: true,
    };
    this.experts.push(newExpert);
    return newExpert;
  }
}
