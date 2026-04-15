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
  isWalletConnected,
  getDeployedContract,
} from '../../contracts/midnight-connection';

import { ContractCallError } from '../../lib/errors';

function computeExpertQualificationHash(qualifications: string[]): Uint8Array {
  const combined = qualifications.join('|');
  const encoded = new TextEncoder().encode(combined);
  const bytes = new Uint8Array(32);
  bytes.set(encoded.slice(0, 32));
  return bytes;
}

import {
  getExpertsByCase,
  getExpertById,
  registerExpertLocally,
} from './storage/adl-storage';

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

    if (isWalletConnected()) {
      const deployed = getDeployedContract('expert-witness');
      if (deployed) {
        try {
          const qualificationHash = computeExpertQualificationHash(expert.qualifications ?? []);
          await deployed.callTx.registerExpertWitness(qualificationHash);
          console.info(
            `[RealExpertWitnessProvider] Expert "${newExpert.name}" registered on-chain.`,
          );
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
