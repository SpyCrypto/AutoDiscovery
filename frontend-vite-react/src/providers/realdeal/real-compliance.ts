// =============================================================================
// RealDeal Compliance Provider
// =============================================================================
// Implements IComplianceProvider with local-first attestation generation.
//
// THREE LEVELS (mirrors compliance-proof.compact):
//   STEP  → "This specific obligation was met before its deadline"
//   PHASE → "All obligations in this phase were completed"
//   CASE  → "Entire case discovery is compliant"
//
// NOW:  SHA-256 based attestation hashes, local persistence
// LATER: Real ZK proofs via attestStepLevelCompliance / attestCaseLevelCompliance
//        (when VITE_CONTRACT_COMPLIANCE_PROOF + proof server are configured)
// =============================================================================

import type {
  IComplianceProvider, IAuthProvider,
  ComplianceStatus, Attestation, ComplianceReport, TimelineEntry,
  DiscoveryStep, AttestationScope,
} from '../types';
import { readStore, writeStore } from '../../modules/midnight/discovery-sdk';
import { sha256Hex } from '../../modules/midnight/jurisdiction-sdk';

const NS_STEPS = 'steps';
const NS_ATTESTATIONS = 'attestations';
const NS_STEP_STATUS = 'step_status';

// ---------------------------------------------------------------------------
// Step status override store (completed/waived/objected overrides)
// ---------------------------------------------------------------------------

type StepStatusOverride = { stepId: string; status: DiscoveryStep['status']; completedAt: string };

// ---------------------------------------------------------------------------
// Attestation hash computation
// Mirrors the ZK witness: computeUniqueAttestationHash(caseId, stepHash, ts)
// ---------------------------------------------------------------------------

async function computeAttestationHash(
  caseId: string,
  stepOrPhaseId: string,
  timestamp: string,
): Promise<string> {
  return sha256Hex(`${caseId}|${stepOrPhaseId}|${timestamp}`);
}

// ---------------------------------------------------------------------------
// Compliance scoring
// ---------------------------------------------------------------------------

function scoreFromSteps(steps: DiscoveryStep[]): {
  score: number;
  overall: ComplianceStatus['overall'];
  stepsComplete: number;
  stepsTotal: number;
  stepsOverdue: number;
  nextDeadline?: string;
  nextDeadlineLabel?: string;
} {
  const total = steps.length;
  if (total === 0) {
    return { score: 1.0, overall: 'compliant', stepsComplete: 0, stepsTotal: 0, stepsOverdue: 0 };
  }

  const complete = steps.filter((s) => s.status === 'complete' || s.status === 'waived').length;
  const overdue = steps.filter((s) => s.status === 'overdue').length;
  const score = complete / total;

  const overall: ComplianceStatus['overall'] =
    overdue > 0 ? 'non_compliant' : score >= 0.9 ? 'compliant' : 'at_risk';

  // Next deadline = earliest pending/in-progress step
  const upcoming = steps
    .filter((s) => s.status === 'pending' || s.status === 'in_progress')
    .sort((a, b) => (a.deadline ?? '').localeCompare(b.deadline ?? ''));

  return {
    score,
    overall,
    stepsComplete: complete,
    stepsTotal: total,
    stepsOverdue: overdue,
    nextDeadline: upcoming[0]?.deadline,
    nextDeadlineLabel: upcoming[0]?.title,
  };
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export class RealComplianceProvider implements IComplianceProvider {
  private readonly auth: IAuthProvider;

  constructor(auth: IAuthProvider) {
    this.auth = auth;
  }

  private getUserId(): string {
    const session = this.auth.getSession();
    if (!session) throw new Error('Not authenticated.');
    return session.userId;
  }

  private getSteps(caseId: string): DiscoveryStep[] {
    const userId = this.getUserId();
    const allSteps = readStore<DiscoveryStep[]>(NS_STEPS, userId, []);
    const overrides = readStore<StepStatusOverride[]>(NS_STEP_STATUS, userId, []);

    return allSteps
      .filter((s) => s.caseId === caseId)
      .map((s) => {
        const override = overrides.find((o) => o.stepId === s.id);
        return override ? { ...s, status: override.status, completedAt: override.completedAt } : s;
      });
  }

  // ---------------------------------------------------------------------------
  // Compliance Status
  // ---------------------------------------------------------------------------

  async getComplianceStatus(caseId: string): Promise<ComplianceStatus> {
    const steps = this.getSteps(caseId);
    const scoring = scoreFromSteps(steps);

    const attestations = await this.getAttestations(caseId);
    const lastAttestation = attestations.length > 0
      ? attestations.sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0].timestamp
      : undefined;

    return {
      caseId,
      ...scoring,
      lastAttestation,
    };
  }

  // ---------------------------------------------------------------------------
  // Attestations
  // ---------------------------------------------------------------------------

  async getAttestations(caseId: string): Promise<Attestation[]> {
    const userId = this.getUserId();
    const all = readStore<Attestation[]>(NS_ATTESTATIONS, userId, []);
    return all.filter((a) => a.caseId === caseId);
  }

  // ---------------------------------------------------------------------------
  // Generate Proof
  // ---------------------------------------------------------------------------

  async generateProof(caseId: string, stepId: string): Promise<Attestation> {
    const userId = this.getUserId();
    const steps = this.getSteps(caseId);
    const step = steps.find((s) => s.id === stepId);

    if (!step) {
      throw new Error(`Step "${stepId}" not found in case "${caseId}".`);
    }

    const now = new Date().toISOString();
    const proofHash = await computeAttestationHash(caseId, stepId, now);

    // Determine attestation type and scope
    const isOverdue = step.status === 'overdue' ||
      (step.deadline != null && step.deadline < now.slice(0, 10));

    if (isOverdue) {
      throw new Error(
        `Cannot generate a compliance proof for "${step.title}" — ` +
        `the deadline of ${step.deadline} has passed. ` +
        `In realDeal mode, the ZK circuit would reject this transaction.`,
      );
    }

    const attestation: Attestation = {
      id: `att-${proofHash.slice(0, 16)}`,
      caseId,
      stepId,
      type: 'step_completion',
      scope: 'step' as AttestationScope,
      description: `Compliance attestation for: ${step.title}`,
      proofHash,
      timestamp: now,
      verified: true,
    };

    // Mark step as complete
    const allOverrides = readStore<StepStatusOverride[]>(NS_STEP_STATUS, userId, []);
    const filteredOverrides = allOverrides.filter((o) => o.stepId !== stepId);
    writeStore(NS_STEP_STATUS, userId, [
      ...filteredOverrides,
      { stepId, status: 'complete', completedAt: now },
    ]);

    // Store attestation
    const allAttestations = readStore<Attestation[]>(NS_ATTESTATIONS, userId, []);
    writeStore(NS_ATTESTATIONS, userId, [...allAttestations, attestation]);

    // Update case compliance score in the case store
    this.refreshCaseComplianceScore(caseId, userId);

    return attestation;
  }

  // ---------------------------------------------------------------------------
  // Compliance Report
  // ---------------------------------------------------------------------------

  async getComplianceReport(caseId: string): Promise<ComplianceReport> {
    const [status, attestations] = await Promise.all([
      this.getComplianceStatus(caseId),
      this.getAttestations(caseId),
    ]);

    const timeline = this.buildTimeline(caseId, attestations);

    return {
      caseId,
      generatedAt: new Date().toISOString(),
      status,
      attestations,
      timeline,
    };
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  private buildTimeline(caseId: string, attestations: Attestation[]): TimelineEntry[] {
    const steps = this.getSteps(caseId);
    const entries: TimelineEntry[] = [];

    // Add step deadlines as timeline entries
    for (const step of steps) {
      if (!step.deadline) continue;
      entries.push({
        date: step.deadline,
        event: step.title,
        type: 'deadline',
        status: step.status === 'complete' ? 'completed' : step.status === 'overdue' ? 'missed' : 'pending',
      });
    }

    // Add attestations as timeline entries
    for (const att of attestations) {
      entries.push({
        date: att.timestamp.slice(0, 10),
        event: att.description,
        type: 'attestation',
        status: 'completed',
      });
    }

    return entries.sort((a, b) => a.date.localeCompare(b.date));
  }

  private refreshCaseComplianceScore(caseId: string, userId: string): void {
    try {
      const steps = this.getSteps(caseId);
      const { score, stepsComplete, stepsTotal, nextDeadline, nextDeadlineLabel } = scoreFromSteps(steps);

      const NS_CASES = 'cases';
      const allCases = readStore<{ id: string; complianceScore: number; stepsComplete: number; stepsTotal: number; nextDeadline?: string; nextDeadlineLabel?: string; updatedAt: string }[]>(NS_CASES, userId, []);
      const updated = allCases.map((c) =>
        c.id === caseId
          ? { ...c, complianceScore: score, stepsComplete, stepsTotal, nextDeadline, nextDeadlineLabel, updatedAt: new Date().toISOString() }
          : c,
      );
      writeStore(NS_CASES, userId, updated);
    } catch {
      // Non-critical — compliance score refresh is best-effort
    }
  }
}
