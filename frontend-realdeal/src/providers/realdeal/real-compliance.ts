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
  isWalletConnected,
  getDeployedContract,
} from '../../contracts/midnight-connection';

import { ContractCallError } from '../../lib/errors';

import { getChainMappingForCase } from './storage/case-storage';

import {
  getAttestationsByCase,
  addAttestationLocally,
  computeComplianceStatusLocally,
} from './storage/adl-storage';

import { getStepsForCase } from './storage/case-storage';

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
    const steps = getStepsForCase(caseId);
    const step = steps.find((s) => s.id === stepId);
    let proofHash = `local-${Date.now().toString(16)}`;
    let verified = false;

    if (isWalletConnected()) {
      const deployed = getDeployedContract('compliance-proof');
      const chainMapping = getChainMappingForCase(caseId);
      if (deployed && chainMapping && step) {
        const onChainStepHash = chainMapping.onChainStepHashes[stepId];
        if (onChainStepHash) {
          try {
            const caseIdBigInt = BigInt('0x' + chainMapping.onChainCaseIdentifier);
            const stepHashBigInt = BigInt('0x' + onChainStepHash);
            const deadlineBigInt = BigInt(step.deadline ? new Date(step.deadline).getTime() : Date.now());
            const tx = await deployed.callTx.attestStepLevelCompliance(
              caseIdBigInt,
              stepHashBigInt,
              deadlineBigInt,
            );
            proofHash = (tx.public.result as bigint).toString(16);
            verified = true;
            console.info(
              `[RealComplianceProvider] Step attestation anchored on-chain. Hash: ${proofHash.slice(0, 12)}...`,
            );
          } catch (error) {
            throw new ContractCallError('attestStepLevelCompliance', error);
          }
        }
      }
    } else {
      console.info(
        `[RealComplianceProvider] Attestation created locally. Connect wallet to anchor on-chain.`,
      );
    }

    return addAttestationLocally({
      caseId,
      stepId,
      type: 'step_completion',
      scope: 'step',
      description: `Step-level compliance attestation for step ${stepId}`,
      proofHash,
      timestamp: now,
      verified,
    });
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
