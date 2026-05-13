/**
 * RealDeal Jurisdiction Provider → jurisdiction-registry.compact
 * TODO: Wire registerNewJurisdiction, updateJurisdictionRulePack,
 *       verifyRulePackHashMatchesExpected circuits
 */
import type { IJurisdictionProvider } from '../types';

function notConnected(method: string): never {
  throw new Error(`[RealDeal] ${method} not yet connected to blockchain`);
}

export class RealJurisdictionProvider implements IJurisdictionProvider {
  async getRegisteredJurisdictions() { return notConnected('getRegisteredJurisdictions'); }
  async getJurisdictionDetails(_code: string) { return notConnected('getJurisdictionDetails'); }
  async verifyRulePack(_code: string) { return notConnected('verifyRulePack'); }
}
