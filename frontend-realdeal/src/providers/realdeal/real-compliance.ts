/**
 * RealDeal Compliance Provider → compliance-proof.compact
 * TODO: Wire attestStepLevelCompliance, attestPhaseLevelCompliance,
 *       attestCaseLevelCompliance, verifyAttestationExists circuits
 */
import type { IComplianceProvider } from '../types';

function notConnected(method: string): never {
  throw new Error(`[RealDeal] ${method} not yet connected to blockchain`);
}

export class RealComplianceProvider implements IComplianceProvider {
  async getComplianceStatus(_caseId: string) { return notConnected('getComplianceStatus'); }
  async getAttestations(_caseId: string) { return notConnected('getAttestations'); }
  async generateProof(_caseId: string, _stepId: string) { return notConnected('generateProof'); }
  async getComplianceReport(_caseId: string) { return notConnected('getComplianceReport'); }
}
