// =============================================================================
// RealDeal Case Provider
// =============================================================================
// Implements ICaseProvider with local-first storage + on-chain anchoring.
//
// DATA LAYER:
//   localStorage (keyed by wallet userId) → immediate persistence, offline-first
//
// ON-CHAIN ANCHORING (future, when VITE_CONTRACT_DISCOVERY_CORE is set):
//   createNewCase  → calls discovery-core.compact → returns caseId hash
//   addDiscoveryStep → calls addDiscoveryStepToCase
//   completeStep   → calls markDiscoveryStepAsCompleted
//
// STEP GENERATION:
//   When a case is created, steps are auto-generated from the jurisdiction's
//   rule pack using the deadline engine. The user can then:
//   - Refine event dates (e.g., actual scheduling order date)
//   - Mark steps as complete → triggers on-chain attestation
// =============================================================================

import type { ICaseProvider, IAuthProvider, Case, DiscoveryStep, Party, CreateCaseParams } from '../types';
import { readStore, writeStore, computeCaseId, generateStepsFromRulePack } from '../../modules/midnight/discovery-sdk';
import { loadRulePack, RULE_PACK_FILENAMES } from '../../modules/midnight/jurisdiction-sdk';

const NS_CASES = 'cases';
const NS_STEPS = 'steps';

export class RealCaseProvider implements ICaseProvider {
  private readonly auth: IAuthProvider;

  constructor(auth: IAuthProvider) {
    this.auth = auth;
  }

  private getUserId(): string {
    const session = this.auth.getSession();
    if (!session) throw new Error('Not authenticated. Please sign in to access your cases.');
    return session.userId;
  }

  // ---------------------------------------------------------------------------
  // List
  // ---------------------------------------------------------------------------

  async listCases(): Promise<Case[]> {
    return readStore<Case[]>(NS_CASES, this.getUserId(), []);
  }

  // ---------------------------------------------------------------------------
  // Get single
  // ---------------------------------------------------------------------------

  async getCase(caseId: string): Promise<Case> {
    this.getUserId();
    const cases = await this.listCases();
    const found = cases.find((c) => c.id === caseId);
    if (!found) throw new Error(`Case not found: ${caseId}`);
    return found;
  }

  // ---------------------------------------------------------------------------
  // Create
  // ---------------------------------------------------------------------------

  async createCase(params: CreateCaseParams): Promise<Case> {
    const userId = this.getUserId();
    const cases = await this.listCases();

    // Compute the deterministic case ID (mirrors discovery-core.compact witness)
    const caseId = await computeCaseId(params.caseNumber, params.jurisdiction);

    // Prevent duplicate registration
    if (cases.some((c) => c.id === caseId)) {
      throw new Error(
        `Case "${params.caseNumber}" in jurisdiction "${params.jurisdiction}" is already registered.`,
      );
    }

    const now = new Date().toISOString();
    const filingDate = now.slice(0, 10);

    // Auto-generate discovery steps from the jurisdiction rule pack
    let initialSteps: DiscoveryStep[] = [];
    const rulePackPath = RULE_PACK_FILENAMES[params.jurisdiction.toUpperCase()];
    if (rulePackPath) {
      try {
        const { rulePack } = await loadRulePack(rulePackPath);
        initialSteps = await generateStepsFromRulePack(
          caseId,
          rulePack,
          new Date(filingDate),
        );
      } catch (err) {
        console.warn(`[RealCaseProvider] Could not generate steps for ${params.jurisdiction}:`, err);
      }
    }

    const newCase: Case = {
      id: caseId,
      caseNumber: params.caseNumber,
      title: params.title,
      jurisdiction: params.jurisdiction,
      caseType: params.caseType,
      status: 'active',
      filingDate,
      parties: params.parties.map((p, i) => ({ ...p, id: `party-${caseId.slice(0, 8)}-${i}` })),
      documentCount: 0,
      stepsComplete: 0,
      stepsTotal: initialSteps.length,
      complianceScore: initialSteps.length > 0 ? 0 : 1.0,
      nextDeadline: initialSteps[0]?.deadline,
      nextDeadlineLabel: initialSteps[0]?.title,
      createdAt: now,
      updatedAt: now,
    };

    // Persist case
    const updatedCases = [...cases, newCase];
    writeStore(NS_CASES, userId, updatedCases);

    // Persist generated steps
    if (initialSteps.length > 0) {
      const allSteps = readStore<DiscoveryStep[]>(NS_STEPS, userId, []);
      writeStore(NS_STEPS, userId, [...allSteps, ...initialSteps]);
    }

    return newCase;
  }

  // ---------------------------------------------------------------------------
  // Steps
  // ---------------------------------------------------------------------------

  async getCaseSteps(caseId: string): Promise<DiscoveryStep[]> {
    const allSteps = readStore<DiscoveryStep[]>(NS_STEPS, this.getUserId(), []);
    return allSteps.filter((s) => s.caseId === caseId);
  }

  // ---------------------------------------------------------------------------
  // Parties
  // ---------------------------------------------------------------------------

  async getCaseParties(caseId: string): Promise<Party[]> {
    const c = await this.getCase(caseId);
    return c.parties;
  }
}
