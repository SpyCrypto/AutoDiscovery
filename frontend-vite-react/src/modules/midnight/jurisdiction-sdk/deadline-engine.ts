// =============================================================================
// Deadline Engine
// =============================================================================
// Computes actual deadline dates from rule pack rules + event dates.
//
// Time computation rules per jurisdiction (loaded from rule pack JSON):
//   excludeTriggerDay   — Day 0 is the event day; counting starts on Day 1
//   countEveryDay       — Count all days (Idaho/FRCP); or business days only
//   lastDayExtension    — If last day is Sat/Sun/holiday, roll to next business day
//   mailServiceAdditional — +3 days if served by mail
// =============================================================================

import type { RulePack, RulePackRule, ComputedDeadline, TimeComputationConfig } from './types';

// ---------------------------------------------------------------------------
// Federal holiday list (approximate — expand as needed)
// ---------------------------------------------------------------------------

const FEDERAL_HOLIDAYS_2024_2026: Set<string> = new Set([
  '2024-01-01', '2024-01-15', '2024-02-19', '2024-05-27', '2024-06-19',
  '2024-07-04', '2024-09-02', '2024-10-14', '2024-11-11', '2024-11-28', '2024-12-25',
  '2025-01-01', '2025-01-20', '2025-02-17', '2025-05-26', '2025-06-19',
  '2025-07-04', '2025-09-01', '2025-10-13', '2025-11-11', '2025-11-27', '2025-12-25',
  '2026-01-01', '2026-01-19', '2026-02-16', '2026-05-25', '2026-06-19',
  '2026-07-04', '2026-09-07', '2026-10-12', '2026-11-11', '2026-11-26', '2026-12-25',
]);

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function isWeekend(d: Date): boolean {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function isHoliday(d: Date): boolean {
  return FEDERAL_HOLIDAYS_2024_2026.has(toISODate(d));
}

function isBusinessDay(d: Date): boolean {
  return !isWeekend(d) && !isHoliday(d);
}

function addCalendarDays(start: Date, days: number): Date {
  const result = new Date(start);
  result.setDate(result.getDate() + days);
  return result;
}

function addBusinessDays(start: Date, days: number): Date {
  const result = new Date(start);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    if (isBusinessDay(result)) added++;
  }
  return result;
}

function rollToNextBusinessDay(d: Date): Date {
  const result = new Date(d);
  while (!isBusinessDay(result)) {
    result.setDate(result.getDate() + 1);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Core deadline computation
// ---------------------------------------------------------------------------

export function computeDeadlineDate(
  triggerDate: Date,
  offset: number,
  unit: 'calendarDays' | 'businessDays',
  timeConfig: TimeComputationConfig,
  servedByMail = false,
): Date {
  let start = new Date(triggerDate);

  if (timeConfig.excludeTriggerDay) {
    start = addCalendarDays(start, 1);
  }

  let effectiveOffset = offset;
  if (servedByMail) {
    effectiveOffset += timeConfig.mailServiceAdditionalDays;
  }

  let deadline: Date;
  if (unit === 'businessDays') {
    deadline = addBusinessDays(start, effectiveOffset);
  } else {
    deadline = addCalendarDays(start, effectiveOffset);
  }

  if (timeConfig.lastDayExtension && !isBusinessDay(deadline)) {
    deadline = rollToNextBusinessDay(deadline);
  }

  return deadline;
}

// ---------------------------------------------------------------------------
// Compute all deadlines for a rule pack given a map of event dates
// ---------------------------------------------------------------------------

export function computeAllDeadlines(
  rulePack: RulePack,
  eventDates: Record<string, Date>,
  servedByMail = false,
): ComputedDeadline[] {
  const now = new Date();
  const results: ComputedDeadline[] = [];

  for (const rule of rulePack.rules) {
    if (!rule.deadline) continue;

    const triggerDate = eventDates[rule.deadline.fromEvent];
    if (!triggerDate) continue;

    const deadlineDate = computeDeadlineDate(
      triggerDate,
      rule.deadline.offset,
      rule.deadline.unit,
      rulePack.timeComputation,
      servedByMail,
    );

    const msPerDay = 1000 * 60 * 60 * 24;
    const daysRemaining = Math.ceil((deadlineDate.getTime() - now.getTime()) / msPerDay);

    results.push({
      ruleId: rule.ruleId,
      ruleRef: rule.ruleRef,
      description: rule.description,
      triggerEvent: rule.deadline.fromEvent,
      triggerDate,
      deadlineDate,
      daysFromTrigger: rule.deadline.offset,
      isOverdue: daysRemaining < 0,
      daysRemaining,
    });
  }

  return results.sort((a, b) => a.deadlineDate.getTime() - b.deadlineDate.getTime());
}

// ---------------------------------------------------------------------------
// Find next upcoming deadline from a set of rules
// ---------------------------------------------------------------------------

export function findNextDeadline(
  deadlines: ComputedDeadline[],
): ComputedDeadline | null {
  const upcoming = deadlines.filter((d) => !d.isOverdue);
  if (upcoming.length === 0) return null;
  return upcoming[0];
}

// ---------------------------------------------------------------------------
// Summarise overdue rules
// ---------------------------------------------------------------------------

export function getOverdueRules(deadlines: ComputedDeadline[]): ComputedDeadline[] {
  return deadlines.filter((d) => d.isOverdue);
}

// ---------------------------------------------------------------------------
// Get rules by category
// ---------------------------------------------------------------------------

export function getRulesByCategory(
  rulePack: RulePack,
  category: RulePackRule['category'],
): RulePackRule[] {
  return rulePack.rules.filter((r) => r.category === category);
}
