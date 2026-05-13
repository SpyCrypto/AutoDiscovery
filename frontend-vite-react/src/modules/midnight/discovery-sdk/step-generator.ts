// =============================================================================
// Step Generator
// =============================================================================
// Converts rule pack rules into DiscoveryStep objects for a given case.
// Uses the deadline engine to compute actual deadline dates.
// =============================================================================

import type { DiscoveryStep, StepStatus } from '../../../providers/types';
import type { RulePack } from '../jurisdiction-sdk';
import { computeAllDeadlines } from '../jurisdiction-sdk';
import { computeStepHash } from './case-hasher';

// ---------------------------------------------------------------------------
// Event date resolver
// ---------------------------------------------------------------------------
// Maps rule "fromEvent" strings to actual dates based on what we know.
// In order of preference:
//   1. Explicitly provided event dates (from the user)
//   2. Derived from the filing date with known standard offsets

const EVENT_OFFSETS_FROM_FILING: Record<string, number> = {
  'case-filing-date': 0,
  'complaint-served-date': 7,
  'scheduling-order-date': 30,
  'discovery-request-served': 14,
  'discovery-opens-date': 14,
  'response-deadline': 45,
  'expert-designation-date': 60,
  'discovery-cutoff-date': 120,
  'trial-date': 180,
};

function buildEventDates(
  filingDate: Date,
  overrides?: Record<string, Date>,
): Record<string, Date> {
  const dates: Record<string, Date> = {};
  for (const [event, offsetDays] of Object.entries(EVENT_OFFSETS_FROM_FILING)) {
    const d = new Date(filingDate);
    d.setDate(d.getDate() + offsetDays);
    dates[event] = d;
  }
  if (overrides) {
    Object.assign(dates, overrides);
  }
  return dates;
}

// ---------------------------------------------------------------------------
// Status mapping
// ---------------------------------------------------------------------------

function statusFromDaysRemaining(daysRemaining: number, isCompleted: boolean): StepStatus {
  if (isCompleted) return 'complete';
  if (daysRemaining < 0) return 'overdue';
  if (daysRemaining <= 7) return 'in_progress';
  return 'pending';
}

// ---------------------------------------------------------------------------
// Main generator
// ---------------------------------------------------------------------------

export async function generateStepsFromRulePack(
  caseId: string,
  rulePack: RulePack,
  filingDate: Date,
  eventDateOverrides?: Record<string, Date>,
): Promise<DiscoveryStep[]> {
  const eventDates = buildEventDates(filingDate, eventDateOverrides);
  const deadlines = computeAllDeadlines(rulePack, eventDates);
  const steps: DiscoveryStep[] = [];

  for (const dl of deadlines) {
    const stepHash = await computeStepHash(caseId, dl.ruleRef);

    const status = statusFromDaysRemaining(dl.daysRemaining, false);

    steps.push({
      id: stepHash,
      caseId,
      ruleReference: dl.ruleRef,
      title: dl.description.length > 80 ? dl.description.slice(0, 77) + '…' : dl.description,
      description: dl.description,
      status,
      deadline: dl.deadlineDate.toISOString().slice(0, 10),
      daysRemaining: dl.daysRemaining,
    });
  }

  return steps;
}
