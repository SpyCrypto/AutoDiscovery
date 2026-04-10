// ============================================================================
// REALDEAL EXPERT WITNESS PROVIDER → expert-witness.compact
// ============================================================================
//
// Manages expert witness registration and credential verification.
//
// Contract circuits (Phase 2 — need wallet):
//   - registerExpertWitness(qualificationProofHash) → expertIdentifierHash
//   - verifyExpertIsRegistered(expertIdentifierHash) → boolean
// ============================================================================

import type {
  IExpertWitnessProvider,
  ExpertWitness,
} from '../types';

import {
  getExpertsByCase,
  getExpertById,
  registerExpertLocally,
} from './storage/adl-storage';

import {
  isWalletConnected,
  getDeployedContract,
} from '../../contracts/midnight-connection';

import { ContractCallError } from '../../lib/errors';
import { stringToBytes32 } from './chain/bytes-utils';

export class RealExpertWitnessProvider implements IExpertWitnessProvider {

  async getExpertsByCase(caseId: string): Promise<ExpertWitness[]> {
    return getExpertsByCase(caseId);
  }

  async getExpert(expertId: string): Promise<ExpertWitness> {
    const expert = getExpertById(expertId);
    if (!expert) throw new Error(`[RealExpertWitnessProvider] Expert not found: ${expertId}`);
    return expert;
  }

  async registerExpert(
    expert: Omit<ExpertWitness, 'id' | 'registeredAt' | 'qualificationProofVerified'>,
  ): Promise<ExpertWitness> {
    const newExpert = registerExpertLocally(expert);

    // Anchor on-chain if wallet is connected
    if (isWalletConnected()) {
      const deployed = getDeployedContract('expert-witness');
      if (deployed) {
        try {
          const qualificationHash = stringToBytes32(
            Array.isArray(expert.qualifications)
              ? expert.qualifications.join(',')
              : String(expert.qualifications || ''),
          );
          await deployed.callTx.registerExpertWitness(qualificationHash);
          // Mark as verified after successful on-chain registration
          // Note: updateExpertLocally would need to be added to adl-storage if not present
          console.info(`[RealExpertWitnessProvider] Expert "${newExpert.name}" anchored on-chain.`);
        } catch (error) {
          throw new ContractCallError('registerExpertWitness', error);
        }
      }
    } else {
      console.info(
        `[RealExpertWitnessProvider] Expert "${newExpert.name}" registered locally. Connect wallet to anchor on-chain.`,
      );
    }

    return newExpert;
  }
}
