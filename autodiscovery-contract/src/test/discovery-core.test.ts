import { DiscoveryCoreSimulator, logger } from "./simulators/discovery-core-simulator.js";
import { describe, it, expect } from "vitest";

const CASE_NUMBER = new Uint8Array(32).fill(1);
const JURISDICTION_CODE = new TextEncoder().encode("ID\0\0\0\0\0\0");
const RULE_REFERENCE = new Uint8Array(32).fill(2);
const FUTURE_DEADLINE = BigInt(Math.floor(Date.now() / 1000) + 86400);

describe("Discovery Core smart contract", () => {
  it("should create a new case and verify public ledger state", () => {
    const simulator = DiscoveryCoreSimulator.deployContract();
    const { ledgerState, caseId } = simulator.as("p1").createNewCase(CASE_NUMBER, JURISDICTION_CODE);

    logger.info({ section: "createNewCase", caseId: caseId.toString(), totalCasesCreated: ledgerState.totalCasesCreated.toString() });

    expect(ledgerState.totalCasesCreated).toEqual(1n);
    expect(ledgerState.caseStatusByCaseIdentifier.member(caseId)).toBe(true);
    expect(ledgerState.caseStatusByCaseIdentifier.lookup(caseId)).toEqual(1n);
    expect(ledgerState.jurisdictionCodeByCaseIdentifier.member(caseId)).toBe(true);
    expect(ledgerState.jurisdictionCodeByCaseIdentifier.lookup(caseId)).toEqual(JURISDICTION_CODE);
  });

  it("should add a discovery step to a case", () => {
    const simulator = DiscoveryCoreSimulator.deployContract();
    const { caseId } = simulator.as("p1").createNewCase(CASE_NUMBER, JURISDICTION_CODE);
    const { ledgerState, stepHash } = simulator.as("p1").addDiscoveryStepToCase(
      caseId,
      RULE_REFERENCE,
      FUTURE_DEADLINE
    );

    logger.info({ section: "addDiscoveryStepToCase", stepHash: stepHash.toString() });

    expect(ledgerState.isStepCompletedByStepHash.member(stepHash)).toBe(true);
    expect(ledgerState.isStepCompletedByStepHash.lookup(stepHash)).toBe(false);
  });

  it("should mark a step as completed and generate attestation", () => {
    const simulator = DiscoveryCoreSimulator.deployContract();
    const { caseId } = simulator.as("p1").createNewCase(CASE_NUMBER, JURISDICTION_CODE);
    const { stepHash } = simulator.as("p1").addDiscoveryStepToCase(
      caseId,
      RULE_REFERENCE,
      FUTURE_DEADLINE
    );
    const { ledgerState, attestationHash } = simulator.as("p1").markDiscoveryStepAsCompleted(caseId, stepHash);

    logger.info({ section: "markDiscoveryStepAsCompleted", stepHash: stepHash.toString(), attestationHash: attestationHash.toString() });

    expect(ledgerState.isStepCompletedByStepHash.lookup(stepHash)).toBe(true);
    expect(ledgerState.completionAttestationHashes.member(attestationHash)).toBe(true);
  });

  it("should check case compliance status", () => {
    const simulator = DiscoveryCoreSimulator.deployContract();
    const { caseId } = simulator.as("p1").createNewCase(CASE_NUMBER, JURISDICTION_CODE);
    const { ledgerState, isCompliant } = simulator.as("p1").checkCaseComplianceStatus(caseId);

    logger.info({ section: "checkCaseComplianceStatus", isCompliant });

    expect(isCompliant).toBe(false);
    expect(ledgerState.caseStatusByCaseIdentifier.member(caseId)).toBe(true);
  });
});
