import type {
  IComplianceProvider, ComplianceStatus, Attestation, ComplianceReport,
} from '../types';
import { demoAttestations, demoTimeline } from './data/cases';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockComplianceProvider implements IComplianceProvider {
  async getComplianceStatus(caseId: string): Promise<ComplianceStatus> {
    await delay(300);
    if (caseId === 'case-001') {
      return {
        caseId, overall: 'at_risk', score: 0.82,
        stepsComplete: 8, stepsTotal: 15, stepsOverdue: 0,
        nextDeadline: '2026-03-01', nextDeadlineLabel: 'DEF Expert Disclosure',
        lastAttestation: '2026-02-14T16:30:00Z',
      };
    }
    if (caseId === 'case-003') {
      return {
        caseId, overall: 'at_risk', score: 0.67,
        stepsComplete: 11, stepsTotal: 14, stepsOverdue: 1,
        nextDeadline: '2026-02-20', nextDeadlineLabel: 'Supplemental Production — OVERDUE RISK',
        lastAttestation: '2026-02-10T09:00:00Z',
      };
    }
    return {
      caseId, overall: 'compliant', score: 0.91,
      stepsComplete: 4, stepsTotal: 12, stepsOverdue: 0,
      nextDeadline: '2026-03-20', nextDeadlineLabel: 'PRO Interrogatory Responses',
    };
  }

  async getAttestations(caseId: string): Promise<Attestation[]> {
    await delay(300);
    return demoAttestations.filter((a) => a.caseId === caseId);
  }

  async generateProof(caseId: string, stepId: string): Promise<Attestation> {
    await delay(2000);
    return {
      id: `att-${Date.now()}`, caseId, stepId,
      type: 'step_completion',
      description: `ZK proof generated for step ${stepId}`,
      proofHash: `zk-proof-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: new Date().toISOString(), verified: true,
    };
  }

  async getComplianceReport(caseId: string): Promise<ComplianceReport> {
    await delay(500);
    const status = await this.getComplianceStatus(caseId);
    const attestations = await this.getAttestations(caseId);
    return {
      caseId, generatedAt: new Date().toISOString(),
      status, attestations,
      timeline: caseId === 'case-001' ? demoTimeline : [],
    };
  }
}
