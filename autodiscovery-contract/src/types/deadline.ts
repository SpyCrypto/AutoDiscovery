// ============================================================================
// AutoDiscovery — Deadline Types
// Types for the deadline computation engine.
// DeadlineSpec is relative (data from rule packs).
// ComputedDeadline is absolute (calculated at runtime).
// ============================================================================

import { DeadlineUnit, AlertLevel, JurisdictionLevel } from "./enums";

/**
 * A relative deadline specification as stored in a rule pack JSON.
 * This is DATA, not a computed date — the deadline engine converts it
 * to an absolute date based on the trigger event's actual date.
 *
 * Example: "30 calendar days from joinder deadline"
 * { offset: 30, unit: "calendarDays", fromEvent: "joinder-deadline" }
 */
export interface DeadlineSpec {
  /** Number of days/business days to count from the trigger event */
  readonly offset: number;
  /** Whether to count calendar days or business days (IRCP Rule 6) */
  readonly unit: DeadlineUnit;
  /**
   * The event that triggers this deadline.
   * References another step or case event (e.g., "filing-date", "joinder-deadline").
   * This creates a dependency chain: step B's deadline depends on step A's completion.
   */
  readonly fromEvent: string;
}

/**
 * A scheduling order override — when a judge sets a specific date
 * that replaces the rule-computed deadline.
 * Per Spy: judge overrides are the highest priority in the hierarchy.
 */
export interface SchedulingOverride {
  /** Which deadline field is being overridden */
  readonly fieldName: string;
  /** The original computed deadline (for audit trail) */
  readonly originalDeadline: Date;
  /** The judge-ordered replacement deadline */
  readonly overriddenDeadline: Date;
  /** Reference to the scheduling order document (e.g., "Case No. CV01-24-12345 Order 3") */
  readonly orderReference: string;
  /** Who entered this override (attorney name or user ID) */
  readonly enteredBy: string;
  /** When this override was recorded */
  readonly enteredAt: Date;
}

/**
 * A fully computed deadline — the output of the deadline engine.
 * This is what the UI displays and what the compliance tracker monitors.
 */
export interface ComputedDeadline {
  /** Unique identifier for this deadline instance */
  readonly deadlineId: string;
  /** The step this deadline belongs to */
  readonly stepId: string;
  /** The rule that generated this deadline */
  readonly ruleId: string;
  /** The absolute computed deadline date */
  readonly dueDate: Date;
  /** The trigger event date that started the countdown */
  readonly triggerDate: Date;
  /** The original DeadlineSpec from the rule pack */
  readonly spec: DeadlineSpec;
  /** Which jurisdiction level set this deadline */
  readonly source: JurisdictionLevel;
  /** If overridden by scheduling order, the override details */
  readonly override: SchedulingOverride | null;
  /** The effective deadline (override date if overridden, otherwise dueDate) */
  readonly effectiveDate: Date;
}

/**
 * Warning thresholds for a deadline — computed from the effective date.
 * Per Spy's correction: warning → deadline → escalation
 * (warning comes BEFORE the deadline, not after)
 */
export interface DeadlineWarningThresholds {
  /** The deadline this threshold set belongs to */
  readonly deadlineId: string;
  /** Date to start showing warnings (configurable, e.g., 7 days before) */
  readonly warningDate: Date;
  /** The actual deadline date */
  readonly deadlineDate: Date;
  /** Date when escalation triggers (deadline + grace period, if any) */
  readonly escalationDate: Date;
  /** Current alert level based on today's date */
  readonly currentLevel: AlertLevel | null;
}

/**
 * Holiday definition for business day calculations.
 * Idaho follows federal holidays plus any state-specific holidays.
 */
export interface HolidayDefinition {
  /** Holiday name (e.g., "Martin Luther King Jr. Day") */
  readonly name: string;
  /** Fixed date (e.g., "07-04" for July 4th) or null if floating */
  readonly fixedDate: string | null;
  /**
   * Floating rule (e.g., "third Monday of January").
   * Null if fixedDate is set.
   */
  readonly floatingRule: string | null;
  /** Whether this is a federal holiday */
  readonly isFederal: boolean;
  /** Whether this is a state-specific holiday */
  readonly isStateHoliday: boolean;
  /** Which jurisdictions observe this holiday (empty = all) */
  readonly jurisdictionCodes: string[];
}
