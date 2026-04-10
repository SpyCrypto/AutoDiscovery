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
  getAllJurisdictions,
  getJurisdictionByCode,
} from './storage/adl-storage';

import {
  isWalletConnected,
  getDeployedContract,
} from '../../contracts/midnight-connection';

import { ContractCallError } from '../../lib/errors';
import { hexToBytes32 } from './chain/bytes-utils';
import { jurisdictionToBytes8 } from './storage/case-storage';

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

    // Attempt live on-chain verification if wallet is connected
    if (isWalletConnected()) {
      const deployed = getDeployedContract('jurisdiction-registry');
      if (deployed && jurisdiction.registryHash) {
        try {
          const codeBytes = jurisdictionToBytes8(code);
          const expectedHash = hexToBytes32(jurisdiction.registryHash);
          const tx = await deployed.callTx.verifyRulePackHashMatchesExpected(codeBytes, expectedHash);
          const isValid = tx.public.result;
          return {
            valid: isValid,
            message: isValid ? 'Rule pack hash verified on-chain ✅' : 'On-chain hash mismatch — rule pack may have been updated',
          };
        } catch (error) {
          throw new ContractCallError('verifyRulePackHashMatchesExpected', error);
        }
      }
    }

    // Fallback: report cached status
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
