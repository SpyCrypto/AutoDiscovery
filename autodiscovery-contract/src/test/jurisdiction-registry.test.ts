import { JurisdictionRegistrySimulator, logger } from "./simulators/jurisdiction-registry-simulator.js";
import { describe, it, expect } from "vitest";

const JURISDICTION_CODE = new TextEncoder().encode("ID\0\0\0\0\0\0");
const RULE_PACK_HASH = new Uint8Array(32).fill(3);
const UPDATED_RULE_PACK_HASH = new Uint8Array(32).fill(4);

describe("Jurisdiction Registry smart contract", () => {
  it("should register a new jurisdiction and verify Set membership", () => {
    const simulator = JurisdictionRegistrySimulator.deployContract();
    const ledgerState = simulator.as("p1").registerNewJurisdiction(
      JURISDICTION_CODE,
      RULE_PACK_HASH
    );

    logger.info({
      section: "registerNewJurisdiction",
      totalJurisdictionsRegistered: ledgerState.totalJurisdictionsRegistered.toString()
    });

    expect(ledgerState.totalJurisdictionsRegistered).toEqual(1n);
    expect(ledgerState.registeredJurisdictionCodes.member(JURISDICTION_CODE)).toBe(true);
    expect(ledgerState.currentRulePackHashByJurisdictionCode.member(JURISDICTION_CODE)).toBe(true);
    expect(ledgerState.currentRulePackHashByJurisdictionCode.lookup(JURISDICTION_CODE)).toEqual(RULE_PACK_HASH);
    expect(ledgerState.currentRulePackVersionByJurisdictionCode.lookup(JURISDICTION_CODE)).toEqual(1n);
  });

  it("should update a jurisdiction rule pack", () => {
    const simulator = JurisdictionRegistrySimulator.deployContract();
    simulator.as("p1").registerNewJurisdiction(JURISDICTION_CODE, RULE_PACK_HASH);
    const ledgerState = simulator.as("p1").updateJurisdictionRulePack(
      JURISDICTION_CODE,
      UPDATED_RULE_PACK_HASH,
      2n
    );

    logger.info({ section: "updateJurisdictionRulePack" });

    expect(ledgerState.currentRulePackHashByJurisdictionCode.lookup(JURISDICTION_CODE)).toEqual(UPDATED_RULE_PACK_HASH);
    expect(ledgerState.currentRulePackVersionByJurisdictionCode.lookup(JURISDICTION_CODE)).toEqual(2n);
  });

  it("should verify rule pack hash matches expected value", () => {
    const simulator = JurisdictionRegistrySimulator.deployContract();
    simulator.as("p1").registerNewJurisdiction(JURISDICTION_CODE, RULE_PACK_HASH);
    const { ledgerState, matches } = simulator.as("p1").verifyRulePackHashMatchesExpected(
      JURISDICTION_CODE,
      RULE_PACK_HASH
    );

    logger.info({ section: "verifyRulePackHashMatchesExpected", matches });

    expect(matches).toBe(true);
  });

  it("should return false when rule pack hash does not match", () => {
    const simulator = JurisdictionRegistrySimulator.deployContract();
    simulator.as("p1").registerNewJurisdiction(JURISDICTION_CODE, RULE_PACK_HASH);
    const { matches } = simulator.as("p1").verifyRulePackHashMatchesExpected(
      JURISDICTION_CODE,
      UPDATED_RULE_PACK_HASH
    );

    logger.info({ section: "verifyRulePackHashMatchesExpected (mismatch)", matches });

    expect(matches).toBe(false);
  });
});
