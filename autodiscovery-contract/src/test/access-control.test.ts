import { AccessControlSimulator, logger } from "./simulators/access-control-simulator.js";
import { describe, it, expect } from "vitest";

const PARTICIPANT_KEY_HASH = new Uint8Array(32).fill(9);
const DOCUMENT_HASH = new Uint8Array(32).fill(10);
const ROLE_DEF = 1n;
const ROLE_COURT = 3n;
const TIER_UNRESTRICTED = 0n;
const TIER_SEALED = 3n;

describe("Access Control smart contract", () => {
  it("should register a participant key and verify role assignment", () => {
    const simulator = AccessControlSimulator.deployContract();
    const ledgerState = simulator.as("p1").registerParticipantKey(
      PARTICIPANT_KEY_HASH,
      ROLE_DEF
    );

    logger.info({ section: "registerParticipantKey" });

    expect(ledgerState.participantRoleByPublicKeyHash.member(PARTICIPANT_KEY_HASH)).toBe(true);
    expect(ledgerState.participantRoleByPublicKeyHash.lookup(PARTICIPANT_KEY_HASH)).toEqual(ROLE_DEF);
  });

  it("should grant document access and verify participant can access unrestricted document", () => {
    const simulator = AccessControlSimulator.deployContract();
    simulator.as("p1").registerParticipantKey(PARTICIPANT_KEY_HASH, ROLE_DEF);
    simulator.as("p1").grantDocumentAccessToParticipant(
      DOCUMENT_HASH,
      PARTICIPANT_KEY_HASH,
      TIER_UNRESTRICTED
    );
    const { ledgerState, hasAccess } = simulator.as("p1").verifyParticipantAccess(
      DOCUMENT_HASH,
      PARTICIPANT_KEY_HASH
    );

    logger.info({ section: "verifyParticipantAccess (unrestricted)", hasAccess });

    expect(hasAccess).toBe(true);
  });

  it("should deny DEF role access to sealed documents", () => {
    const simulator = AccessControlSimulator.deployContract();
    simulator.as("p1").registerParticipantKey(PARTICIPANT_KEY_HASH, ROLE_DEF);
    simulator.as("p1").grantDocumentAccessToParticipant(
      DOCUMENT_HASH,
      PARTICIPANT_KEY_HASH,
      TIER_SEALED
    );
    const { hasAccess } = simulator.as("p1").verifyParticipantAccess(
      DOCUMENT_HASH,
      PARTICIPANT_KEY_HASH
    );

    logger.info({ section: "verifyParticipantAccess (sealed, DEF role)", hasAccess });

    expect(hasAccess).toBe(false);
  });

  it("should allow COURT role access to sealed documents", () => {
    const COURT_KEY_HASH = new Uint8Array(32).fill(11);
    const simulator = AccessControlSimulator.deployContract();
    simulator.as("p1").registerParticipantKey(COURT_KEY_HASH, ROLE_COURT);
    simulator.as("p1").grantDocumentAccessToParticipant(
      DOCUMENT_HASH,
      COURT_KEY_HASH,
      TIER_SEALED
    );
    const { hasAccess } = simulator.as("p1").verifyParticipantAccess(
      DOCUMENT_HASH,
      COURT_KEY_HASH
    );

    logger.info({ section: "verifyParticipantAccess (sealed, COURT role)", hasAccess });

    expect(hasAccess).toBe(true);
  });
});
