// ============================================================================
// AutoDiscovery — Document Entity
// Tracks documents produced, received, or withheld during discovery.
// Documents are linked to cases and steps — a step may require
// producing or receiving multiple documents.
// ============================================================================

import { StepCategory } from "./enums";

/**
 * Status of a document in the discovery production process.
 */
export enum DocumentStatus {
  /** Document identified as needing production but not yet produced */
  Pending = "pending",
  /** Document has been produced to opposing counsel */
  Produced = "produced",
  /** Document received from opposing counsel */
  Received = "received",
  /** Document withheld on privilege grounds (must be on privilege log) */
  Withheld = "withheld",
  /** Document redacted (partial production) */
  Redacted = "redacted",
  /** Document requested but not yet located */
  Searching = "searching",
  /** Document destroyed or unavailable — must document reason */
  Unavailable = "unavailable",
}

/**
 * Type/format of the document.
 */
export enum DocumentFormat {
  /** Physical paper document */
  Paper = "paper",
  /** PDF file */
  PDF = "pdf",
  /** Electronic document (Word, Excel, etc.) */
  Electronic = "electronic",
  /** Email or email attachment */
  Email = "email",
  /** Medical records (HIPAA-sensitive) */
  MedicalRecord = "medicalRecord",
  /** Photograph or image */
  Image = "image",
  /** Video or audio recording */
  MediaRecording = "mediaRecording",
  /** Database extract or structured data */
  DataExport = "dataExport",
}

/**
 * A document tracked in the discovery process.
 *
 * Important: AutoDiscovery does NOT store the actual document content.
 * It only tracks metadata about documents for compliance purposes.
 * The actual documents live in the attorney's document management system.
 *
 * Per Spy: common pitfalls include incorrect patient during records
 * submission and incorrect filing type. These fields help catch that.
 */
export interface Document {
  /** Unique identifier for this document record */
  readonly documentId: string;

  /** The case this document belongs to */
  readonly caseId: string;

  /** The discovery step this document is associated with (e.g., production request step) */
  readonly stepId: string;

  /**
   * Which discovery category this document relates to.
   * Helps group documents in the UI (e.g., all deposition exhibits together).
   */
  readonly category: StepCategory;

  /** Descriptive title (e.g., "Patient Medical Records — St. Luke's 2023") */
  readonly title: string;

  /**
   * Bates number or production number range.
   * Standard legal document identification (e.g., "DEF-001 through DEF-150").
   */
  readonly batesRange: string | null;

  /** Format/type of the document */
  readonly format: DocumentFormat;

  /** Current status in the production process */
  status: DocumentStatus;

  /**
   * Which party produced this document.
   * References a Party.partyId.
   */
  readonly producedBy: string | null;

  /**
   * Which party received this document.
   * References a Party.partyId.
   */
  readonly receivedBy: string | null;

  /** Date the document was produced or received */
  productionDate: Date | null;

  /**
   * Whether this document contains HIPAA-protected health information.
   * Med-mal cases will frequently have PHI — extra handling required.
   */
  readonly containsPHI: boolean;

  /**
   * Whether this document is withheld on privilege grounds.
   * If true, must appear on the privilege log.
   */
  isPrivileged: boolean;

  /** Description of the privilege claim (e.g., "Attorney-client communication") */
  privilegeDescription: string | null;

  /**
   * Whether this document has been redacted before production.
   * If true, redactionReason should describe what was redacted and why.
   */
  isRedacted: boolean;

  /** Reason for redaction, if applicable */
  redactionReason: string | null;

  /**
   * Set number — which production set this document belongs to.
   * Per Spy: attorneys sometimes use incorrect set numbers for supplementation.
   * Tracking this helps catch numbering errors.
   * Example: "First Set" = 1, "Second Set" = 2, etc.
   */
  setNumber: number | null;

  /**
   * Whether this is a supplemental production.
   * Per IRCP Rule 26(e), parties must supplement prior productions
   * when new information is obtained.
   */
  readonly isSupplemental: boolean;

  /** If supplemental, the original document ID being supplemented */
  readonly supplementsDocumentId: string | null;

  /**
   * Hash of the document file for integrity verification.
   * Not the full file — just a fingerprint to prove the document
   * hasn't been altered since production.
   */
  readonly fileHash: string | null;

  /** Free-form notes */
  notes: string | null;

  /** When this document record was created */
  readonly createdAt: Date;

  /** Last update timestamp */
  updatedAt: Date;
}
