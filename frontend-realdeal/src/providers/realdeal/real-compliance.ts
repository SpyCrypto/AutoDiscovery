// ============================================================================
// REALDEAL COMPLIANCE PROVIDER → compliance-proof.compact
// ============================================================================
//
// Hybrid provider for compliance attestations — the money feature of ADL.
// ZK proofs that discovery obligations were met, without revealing case details.
//
// Contract circuits (Phase 2 — need wallet):
//   - attestStepLevelCompliance(caseId, stepHash, deadline) → attestationHash
//   - attestPhaseLevelCompliance(caseId, phaseId, total, completed) → attestationHash
//   - attestCaseLevelCompliance(caseId) → attestationHash
//   - verifyAttestationExists(attestationHash) → boolean
// ============================================================================

import type {
  IComplianceProvider,
  ComplianceStatus,
  Attestation,
  ComplianceReport,
  TimelineEntry,
} from '../types';

import {
  getAttestationsByCase,
  addAttestationLocally,
  computeComplianceStatusLocally,
} from './storage/adl-storage';

import { getStepsForCase } from './storage/case-storage';

import {
  isWalletConnected,
  getDeployedContract,
} from '../../contracts/midnight-connection';

import { ContractCallError } from '../../lib/errors';
import { bytesToHex } from './chain/bytes-utils';

export class RealComplianceProvider implements IComplianceProvider {

  async getComplianceStatus(caseId: string): Promise<ComplianceStatus> {
    const steps = getStepsForCase(caseId);
    const complete = steps.filter((s) => s.status === 'complete').length;
    const overdue = steps.filter((s) => s.status === 'overdue').length;
    return computeComplianceStatusLocally(caseId, complete, steps.length, overdue);
  }

  async getAttestations(caseId: string): Promise<Attestation[]> {
    return getAttestationsByCase(caseId);
  }

  async generateProof(caseId: string, stepId: string): Promise<Attestation> {
    const now = new Date().toISOString();
    let proofHash = `local-${Date.now().toString(16)}`;
    let verified = false;

    // Attempt on-chain attestation if wallet is connected
    if (isWalletConnected()) {
      const deployed = getDeployedContract('compliance-proof');
      if (deployed) {
        try {
          const caseIdBigInt = BigInt('0x' + caseId.replace(/[^0-9a-fA-F]/g, '').slice(0, 16).padEnd(16, '0'));
          const stepHashBigInt = BigInt('0x' + stepId.replace(/[^0-9a-fA-F]/g, '').slice(0, 16).padEnd(16, '0'));
          const deadlineBigInt = BigInt(Math.floor(Date.now() / 1000));
          const tx = await deployed.callTx.attestStepLevelCompliance(caseIdBigInt, stepHashBigInt, deadlineBigInt);
          proofHash = bytesToHex(tx.public.result);
          verified = true;
          console.info(`[RealComplianceProvider] Attestation anchored on-chain: ${proofHash.slice(0, 16)}...`);
        } catch (error) {
          throw new ContractCallError('attestStepLevelCompliance', error);
        }
      }
    }

    const attestation = addAttestationLocally({
      caseId,
      stepId,
      type: 'step_completion',
      scope: 'step',
      description: `Step-level compliance attestation for step ${stepId}`,
      proofHash,
      timestamp: now,
      verified,
    });

    if (!verified) {
      console.info(
        `[RealComplianceProvider] Attestation created locally (${proofHash}). Connect wallet to anchor compliance record on-chain.`,
      );
    }
    return attestation;
  }

  async getComplianceReport(caseId: string): Promise<ComplianceReport> {
    const status = await this.getComplianceStatus(caseId);
    const attestations = await this.getAttestations(caseId);
    const steps = getStepsForCase(caseId);

    // Build timeline from steps and attestations
    const timeline: TimelineEntry[] = steps.map((step) => ({
      date: step.deadline,
      event: step.title,
      type: 'deadline' as const,
      status: step.status === 'complete' ? 'completed' as const : step.status === 'overdue' ? 'missed' as const : 'pending' as const,
    }));

    return {
      caseId,
      generatedAt: new Date().toISOString(),
      status,
      attestations,
      timeline,
    };
  }
}
