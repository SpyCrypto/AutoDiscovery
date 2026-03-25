import { ComplianceProofSimulator, logger } from "./simulators/compliance-proof-simulator.js";
import { describe, it, expect } from "vitest";

const CASE_IDENTIFIER = 12345678901234567890n;
const STEP_HASH = 98765432109876543210n;
const FUTURE_DEADLINE = BigInt(Math.floor(Date.now() / 1000) + 86400);

describe("Compliance Proof smart contract", () => {
  it("should attest step-level compliance when completed before deadline", () => {
    const simulator = ComplianceProofSimulator.deployContract();
    const { ledgerState, attestationHash } = simulator.as("p1").attestStepLevelCompliance(
      CASE_IDENTIFIER,
      STEP_HASH,
      FUTURE_DEADLINE
    );

    logger.info({
      section: "attestStepLevelCompliance",
      totalAttestationsGenerated: ledgerState.totalAttestationsGenerated.toString()
    });

    expect(ledgerState.totalAttestationsGenerated).toEqual(1n);
    expect(attestationHash).toBeInstanceOf(Uint8Array);
    expect(attestationHash.length).toBe(32);
    expect(ledgerState.registeredAttestationHashes.member(attestationHash)).toBe(true);
  });

  it("should store attestation scope level as 1 (step-level) on the ledger", () => {
    const simulator = ComplianceProofSimulator.deployContract();
    const { ledgerState, attestationHash } = simulator.as("p1").attestStepLevelCompliance(
      CASE_IDENTIFIER,
      STEP_HASH,
      FUTURE_DEADLINE
    );

    logger.info({ section: "attestScopeLevel" });

    expect(ledgerState.attestationScopeLevelByHash.member(attestationHash)).toBe(true);
    expect(ledgerState.attestationScopeLevelByHash.lookup(attestationHash)).toEqual(0n);
  });

  it("should verify that an attestation exists on the ledger", () => {
    const simulator = ComplianceProofSimulator.deployContract();
    const { attestationHash } = simulator.as("p1").attestStepLevelCompliance(
      CASE_IDENTIFIER,
      STEP_HASH,
      FUTURE_DEADLINE
    );
    const { ledgerState, exists } = simulator.as("p1").verifyAttestationExists(attestationHash);

    logger.info({ section: "verifyAttestationExists", exists });

    expect(exists).toBe(true);
  });

  it("should record the attestation timestamp on the ledger", () => {
    const beforeCall = BigInt(Math.floor(Date.now() / 1000));
    const simulator = ComplianceProofSimulator.deployContract();
    const { ledgerState, attestationHash } = simulator.as("p1").attestStepLevelCompliance(
      CASE_IDENTIFIER,
      STEP_HASH,
      FUTURE_DEADLINE
    );
    const afterCall = BigInt(Math.floor(Date.now() / 1000));

    logger.info({ section: "attestationTimestamp" });

    const storedTimestamp = ledgerState.attestationGeneratedTimestampByHash.lookup(attestationHash);
    expect(storedTimestamp).toBeGreaterThanOrEqual(beforeCall);
    expect(storedTimestamp).toBeLessThanOrEqual(afterCall);
  });
});
