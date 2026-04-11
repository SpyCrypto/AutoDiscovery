// ============================================================================
// REALDEAL JURISDICTION PROVIDER → jurisdiction-registry.compact
// ============================================================================
//
// Manages jurisdiction registrations and rule pack verification.
// This contract has NO witnesses — all operations are pure circuit logic.
//
// Contract circuits (Phase 2 — need wallet):
//   - registerNewJurisdiction(code, rulePackHash) → void
//   - updateJurisdictionRulePack(code, newHash, version) → void
//   - verifyRulePackHashMatchesExpected(code, expectedHash) → boolean
// ============================================================================

import type {
  IJurisdictionProvider,
  JurisdictionRegistration,
} from '../types';

import {
  isWalletConnected,
  getDeployedContract,
} from '../../contracts/midnight-connection';

import { ContractCallError } from '../../lib/errors';

import { jurisdictionToBytes8, hexToBytes32 } from './storage/case-storage';

import {
  getAllJurisdictions,
  getJurisdictionByCode,
} from './storage/adl-storage';

export class RealJurisdictionProvider implements IJurisdictionProvider {

  async getRegisteredJurisdictions(): Promise<JurisdictionRegistration[]> {
    return getAllJurisdictions();
  }

  async getJurisdictionDetails(code: string): Promise<JurisdictionRegistration> {
    const jurisdiction = getJurisdictionByCode(code);
    if (!jurisdiction) {
      throw new Error(`[RealJurisdictionProvider] Jurisdiction not found: ${code}`);
    }
    return jurisdiction;
  }

  async verifyRulePack(code: string): Promise<{ valid: boolean; message: string }> {
    const jurisdiction = getJurisdictionByCode(code);
    if (!jurisdiction) {
      return { valid: false, message: `Jurisdiction ${code} not registered` };
    }

    if (isWalletConnected()) {
      const deployed = getDeployedContract('jurisdiction-registry');
      if (deployed && jurisdiction.registryHash) {
        try {
          const codeBytes = jurisdictionToBytes8(code);
          const expectedHash = hexToBytes32(jurisdiction.registryHash);
          const tx = await deployed.callTx.verifyRulePackHashMatchesExpected(codeBytes, expectedHash);
          const valid = tx.public.result as boolean;
          return {
            valid,
            message: valid ? 'Rule pack hash verified on-chain.' : 'Rule pack hash mismatch — on-chain hash differs from local record.',
          };
        } catch (error) {
          throw new ContractCallError('verifyRulePackHashMatchesExpected', error);
        }
      }
    }

    if (jurisdiction.verifiedOnChain) {
      return {
        valid: true,
        message: 'Rule pack hash previously recorded as on-chain verified (cached). Connect wallet to re-verify live.',
      };
    }

    return {
      valid: true,
      message: 'Rule pack registered locally. Connect wallet to verify on-chain.',
    };
  }
}
