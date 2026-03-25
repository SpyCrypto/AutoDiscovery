import { DocumentRegistrySimulator, logger } from "./simulators/document-registry-simulator.js";
import { describe, it, expect } from "vitest";

const DOCUMENT_HASH = new Uint8Array(32).fill(5);
const ORIGINATOR_KEY = new Uint8Array(32).fill(6);
const IMAGE_TWIN_HASH = new Uint8Array(32).fill(7);
const DIGITAL_TWIN_HASH = new Uint8Array(32).fill(8);
const DOCUMENT_CATEGORY = 1n;
const OCR_FIDELITY = 95n;

describe("Document Registry smart contract", () => {
  it("should register a document and verify public ledger state", () => {
    const simulator = DocumentRegistrySimulator.deployContract();
    const { ledgerState, documentHash } = simulator.as("p1").registerDocument(
      DOCUMENT_HASH,
      DOCUMENT_CATEGORY,
      ORIGINATOR_KEY
    );

    logger.info({
      section: "registerDocument",
      totalDocumentsRegistered: ledgerState.totalDocumentsRegistered.toString()
    });

    expect(ledgerState.totalDocumentsRegistered).toEqual(1n);
    expect(documentHash).toBeInstanceOf(Uint8Array);
    expect(documentHash.length).toBe(32);
  });

  it("should register a twin bond linking image and digital twins", () => {
    const simulator = DocumentRegistrySimulator.deployContract();
    const { ledgerState, bondHash } = simulator.as("p1").registerTwinBond(
      IMAGE_TWIN_HASH,
      DIGITAL_TWIN_HASH,
      OCR_FIDELITY
    );

    logger.info({ section: "registerTwinBond" });

    expect(bondHash).toBeInstanceOf(Uint8Array);
    expect(bondHash.length).toBe(32);
  });

  it("should verify twin bond integrity with the correct digital twin", () => {
    const simulator = DocumentRegistrySimulator.deployContract();
    simulator.as("p1").registerTwinBond(IMAGE_TWIN_HASH, DIGITAL_TWIN_HASH, OCR_FIDELITY);
    const { ledgerState, isIntact } = simulator.as("p1").verifyTwinBondIntegrity(
      IMAGE_TWIN_HASH,
      DIGITAL_TWIN_HASH
    );

    logger.info({ section: "verifyTwinBondIntegrity", isIntact });

    expect(isIntact).toBe(true);
  });

  it("should detect a broken twin bond when digital twin hash changes", () => {
    const simulator = DocumentRegistrySimulator.deployContract();
    const TAMPERED_HASH = new Uint8Array(32).fill(99);
    simulator.as("p1").registerTwinBond(IMAGE_TWIN_HASH, DIGITAL_TWIN_HASH, OCR_FIDELITY);
    const { isIntact } = simulator.as("p1").verifyTwinBondIntegrity(
      IMAGE_TWIN_HASH,
      TAMPERED_HASH
    );

    logger.info({ section: "verifyTwinBondIntegrity (tampered)", isIntact });

    expect(isIntact).toBe(false);
  });
});
