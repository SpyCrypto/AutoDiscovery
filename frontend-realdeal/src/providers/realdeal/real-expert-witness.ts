/**
 * RealDeal Expert Witness Provider → expert-witness.compact
 * TODO: Wire registerExpertWitness, verifyExpertIsRegistered circuits
 */
import type { IExpertWitnessProvider } from '../types';

function notConnected(method: string): never {
  throw new Error(`[RealDeal] ${method} not yet connected to blockchain`);
}

export class RealExpertWitnessProvider implements IExpertWitnessProvider {
  async getExpertsByCase(_caseId: string) { return notConnected('getExpertsByCase'); }
  async getExpert(_expertId: string) { return notConnected('getExpert'); }
  async registerExpert(_expert: any) { return notConnected('registerExpert'); }
}
