// ============================================================================
// AutoDiscovery — Party Entity
// Represents any person or entity involved in a case:
// plaintiffs, defendants, attorneys, expert witnesses, third parties.
// ============================================================================

import { PartyRole } from "./enums";

/**
 * A party involved in a case.
 *
 * Parties are linked to cases — a case has multiple parties.
 * Attorneys are also parties (with role "attorney") linked to
 * the party they represent via representedPartyId.
 *
 * Expert witnesses (Phase 2) are tracked here with basic info;
 * detailed credential verification lives in the expert-witness contract.
 */
export interface Party {
  /** Unique identifier for this party */
  readonly partyId: string;

  /** The case this party is associated with */
  readonly caseId: string;

  /** Role in the case */
  readonly role: PartyRole;

  /** Full legal name (person or entity) */
  readonly name: string;

  /**
   * If this party is an attorney, the partyId of the client they represent.
   * Null for non-attorney parties.
   */
  readonly representedPartyId: string | null;

  /** Law firm name (for attorneys) */
  readonly firmName: string | null;

  /** Bar number (for attorneys) — used for identification, not displayed publicly */
  readonly barNumber: string | null;

  /** State of bar admission (for attorneys) */
  readonly barState: string | null;

  /** Contact email */
  readonly email: string | null;

  /** Contact phone */
  readonly phone: string | null;

  /** Mailing address (for service of process) */
  readonly address: string | null;

  /**
   * Whether this party has been properly served.
   * Relevant for determining when response deadlines start.
   */
  isServed: boolean;

  /** Date of service, if served */
  serviceDate: Date | null;

  /**
   * Whether this party is pro se (self-represented).
   * Affects some discovery procedures and communication requirements.
   */
  readonly isProSe: boolean;

  /**
   * Whether this party is a third-party subpoena recipient.
   * Third parties have different obligations than named parties.
   * Per Spy: service of third-party subpoenas in Idaho typically
   * uses a third-party service company.
   */
  readonly isThirdParty: boolean;

  // --- Expert Witness Fields (Phase 2, basic tracking for now) ---

  /**
   * Area of expertise (for expert witnesses).
   * Example: "Orthopedic Surgery", "Nursing Standard of Care"
   */
  readonly expertSpecialty: string | null;

  /**
   * Whether expert qualifications have been verified.
   * Full credential verification is Phase 2 (expert-witness contract).
   */
  expertQualificationsVerified: boolean;

  /**
   * Whether this expert is a rebuttal expert (disclosed later than primary experts).
   */
  readonly isRebuttalExpert: boolean;

  /** Free-form notes */
  notes: string | null;

  /** When this party record was created */
  readonly createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Input for adding a new party to a case.
 */
export interface AddPartyInput {
  readonly caseId: string;
  readonly role: PartyRole;
  readonly name: string;
  readonly representedPartyId: string | null;
  readonly firmName: string | null;
  readonly barNumber: string | null;
  readonly barState: string | null;
  readonly email: string | null;
  readonly phone: string | null;
  readonly isProSe: boolean;
}
