/**
 * RealDeal Case Provider → discovery-core.compact
 * TODO: Wire createNewCase, addDiscoveryStepToCase,
 *       markDiscoveryStepAsCompleted, checkCaseComplianceStatus circuits
 */
import type { ICaseProvider } from '../types';

function notConnected(method: string): never {
  throw new Error(`[RealDeal] ${method} not yet connected to blockchain`);
}

export class RealCaseProvider implements ICaseProvider {
  async listCases() { return notConnected('listCases'); }
  async getCase(_caseId: string) { return notConnected('getCase'); }
  async createCase(_data: any) { return notConnected('createCase'); }
  async getCaseSteps(_caseId: string) { return notConnected('getCaseSteps'); }
  async getCaseParties(_caseId: string) { return notConnected('getCaseParties'); }
}
