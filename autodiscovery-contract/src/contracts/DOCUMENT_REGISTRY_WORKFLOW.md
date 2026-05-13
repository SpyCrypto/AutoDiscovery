# Document Registry — Workflow & Explanation

> **Contract:** `document-registry.compact`  
> **Type:** Per-user instance (each party deploys their own)  
> **Purpose:** The data integrity workhorse — hash anchoring, Twin Protocol, chain of custody, productions, case root snapshots

---

## What This Contract Does

This is the **heaviest** of the four contracts. It manages everything about documents:

- **Hash anchoring** — Commits a document's SHA-256 hash to the sealed (immutable) ledger. Once committed, the hash exists forever. This is the mathematical proof that "this document existed at this time and hasn't been altered since."
- **Twin Protocol** — Bonds image scans to their OCR'd digital counterparts. If either twin is swapped or tampered with, the bond hash changes → tamper detected.
- **Chain of custody** — Records every time a document changes hands (DEF → PRO, PRO → COURT, etc.). Creates the proof that "document X was transferred to party Y at time Z."
- **Production tracking** — Groups documents into formal legal productions and anchors the Merkle root. From one root hash, any individual document can be verified via Merkle proof path.
- **Case root snapshots** — Periodic snapshots of the ENTIRE discovery universe. "As of [timestamp], THIS was the complete state of all discovery in this case."

---

## Why It Needs to Be a Smart Contract

- **Sealed hash commitments** — The sealed ledger is write-once, immutable forever. No DApp, database, or application can provide this guarantee. Once a document hash is committed, not even the contract owner can alter it.
- **Merkle proofs** — Verify any document belongs to a production in O(log n) steps. For 1 million documents, only ~20 hash comparisons needed.
- **Twin bond integrity** — Recompute bond hash from current twins and compare to stored bond. If they differ, tamper is detected mathematically.
- **Production immutability** — Once a production Merkle root is sealed, the production can never be retroactively modified. "We actually produced different documents" is provably false.

---

## The 5-Level Merkle Hashing Hierarchy

Understanding this is key to understanding the contract:

```
Level 5: CASE ROOT           ← anchorCaseRootSnapshot()
  │       Merkle root of ALL productions in the case.
  │       One hash = the entire discovery universe.
  │
  ├── Level 4: PRODUCTION ROOT    ← anchorProductionMerkleRoot()
  │     │       Merkle root of all documents in one submission.
  │     │       e.g., "DEF's Response to RFP #3" (500 documents)
  │     │
  │     ├── Level 3: PACKAGE       (off-chain, DApp manages)
  │     │     │       Related documents grouped together.
  │     │     │       e.g., Expert report + 3 appendices
  │     │     │
  │     │     ├── Level 2: DOCUMENT     ← registerDocument()
  │     │     │     │       Merkle root of all pages in one file.
  │     │     │     │       e.g., 47-page expert report
  │     │     │     │
  │     │     │     ├── Level 1: PAGE/SEGMENT  (off-chain, DApp computes)
  │     │     │     │       Hash per page, per email, per video segment.
  │     │     │     │       Detects single-page tampering.
  │     │     │     │
  │     │     │     └── Level 0: RAW BYTES     (off-chain, DApp computes)
  │     │     │             SHA-256 of raw file content.
  │     │     │             The atomic unit of integrity.

WHAT GOES ON-CHAIN:    Levels 4-5 (production + case roots)
WHAT'S IN SEALED STATE: Level 2 document hashes (in the Merkle tree)
WHAT'S OFF-CHAIN:      Levels 0-3 (but verifiable via Merkle proof path)
```

---

## Workflow

### Workflow A: Document Registration (Origination)

This is Step 1 of the 9-step discovery protocol.

```
WHO:    The party's paralegal or attorney
WHEN:   When a document enters the discovery system for the first time
TRIGGER: User uploads a document via the DApp's intake interface

WHAT THE DAPP DOES FIRST:
  1. User uploads file (PDF, TIFF, email, audio, video, etc.)
  2. DApp computes SHA-256 of raw file content
  3. DApp assigns a category (1-24 Universal Discovery Categories)
     • AI assists: "This looks like a Medical Record (category 10)"
     • User confirms or overrides
  4. DApp assigns Bates numbers (e.g., DEF-000001 through DEF-000047)
  5. DApp records originator (who created/first possessed the doc)
  6. DApp stores the actual file + all metadata in local database

WHAT HAPPENS ON-CHAIN (registerDocument):
  SEALED:  Document hash committed to immutableDocumentHashCommitments
           → This hash exists FOREVER. Cannot be altered or removed.
  PRIVATE: documentCategoryByDocumentHash[hash] = category number
  PRIVATE: documentOriginatorPublicKeyByDocumentHash[hash] = originator key
  PUBLIC:  totalDocumentsRegistered incremented

  RETURNS: The document content hash for use in subsequent operations

WHAT THE PUBLIC SEES:
  "A document was registered." (counter went up by 1)
  They do NOT see: which document, what category, who originated it, or any content.
```

### Workflow B: Twin Protocol Bond

For digitized physical documents (scans of paper, photos of handwritten notes).

```
WHO:    Paralegal doing the digitization
WHEN:   After scanning a physical document and running OCR
TRIGGER: DApp detects an image file + OCR output need bonding

WHAT THE DAPP DOES FIRST:
  1. Paralegal scans the physical document → image file (TIFF/PNG)
  2. DApp runs OCR on the image → digital text file
  3. DApp computes SHA-256 of image file (Image Twin hash)
  4. DApp computes SHA-256 of text file (Digital Twin hash)
  5. DApp runs fidelity check: re-OCR the image, compare to digital text
     • 99-100: Excellent (printed text, clean scan)
     • 90-98:  Good (minor OCR artifacts)
     • 70-89:  Moderate (some misreads, human review recommended)
     • Below 70: Poor (handwriting, damage — manual transcription needed)
  6. Both twins are registered individually via registerDocument() first

WHAT HAPPENS ON-CHAIN (registerTwinBond):
  WITNESS: Computes twinBondHash = SHA-256(imageTwinHash + digitalTwinHash)
  PRIVATE: digitalTwinHashByImageTwinHash[imageHash] = digitalHash
  PRIVATE: twinBondFidelityScoreByBondHash[bondHash] = fidelity score

  RETURNS: The twin bond hash (this becomes the document's identity in the Merkle tree)

WHY THIS MATTERS:
  • If someone re-OCR's the document (different digital twin), the bond hash changes → caught
  • If someone replaces the scan (different image twin), the bond hash changes → caught
  • The fidelity score is IMMUTABLE — if the digital is corrected, a NEW bond is created
  • Production rules: both twins must travel together. Can't produce digital without image.
```

### Workflow C: Chain of Custody Transfer

```
WHO:    The sending party's DApp
WHEN:   When documents are shared with another party
TRIGGER: Attorney clicks "Send to Opposing Counsel" in the DApp

WHAT THE DAPP DOES FIRST:
  1. Attorney selects documents to share
  2. DApp encrypts the files for the recipient
  3. DApp transmits encrypted files directly to recipient's DApp (off-chain)
  4. Recipient's DApp decrypts and verifies document hashes match

WHAT HAPPENS ON-CHAIN (recordCustodyTransfer):
  PRIVATE: latestCustodyTransferReferenceByDocumentHash[docHash] = timestamp
           (The full transfer history chain is maintained off-chain)

  NOTE: The actual file transfer is entirely off-chain.
        The on-chain record is just a timestamp proving WHEN the transfer happened.

PROOF STRENGTH:
  • Both parties on DApp → Full proof (send + receive timestamps)
  • Sender only on DApp → Partial proof (sent confirmed, receipt unconfirmed)
  • Neither on DApp     → No proof (the status quo — chaos)
```

### Workflow D: Finalize a Production

A "production" is a formal legal submission (e.g., "DEF's Response to RFP #3").

```
WHO:    The producing party's attorney
WHEN:   When a batch of documents is ready to be formally produced
TRIGGER: Attorney clicks "Finalize Production" in the DApp

WHAT THE DAPP DOES FIRST:
  1. Attorney reviews the document list for this production
  2. DApp assembles all document hashes into a Merkle tree (off-chain)
  3. DApp computes the Merkle root from all document hashes
  4. DApp stores the full Merkle tree locally (needed for future Merkle proofs)
  5. DApp assigns a unique production identifier

WHAT HAPPENS ON-CHAIN (anchorProductionMerkleRoot):
  PUBLIC:  productionMerkleRootByIdentifier[prodId] = merkleRoot
  SEALED:  merkleRoot committed to immutableProductionCommitments
           → This production root can NEVER be changed. Ever.
  PRIVATE: documentListReferenceByProductionIdentifier[prodId] = off-chain ref
  PUBLIC:  totalProductionsCreated incremented

WHY SEALING THE ROOT MATTERS:
  A party can't later claim "we actually produced different documents."
  The sealed Merkle root proves exactly what was in the production.
  Any individual document can be verified against this root via Merkle proof.
```

### Workflow E: Case Root Snapshot

```
WHO:    The DApp (automatically after each production, or on schedule)
WHEN:   After finalizing a production, or at configurable intervals
TRIGGER: Automatic after anchorProductionMerkleRoot, or manual trigger

WHAT HAPPENS ON-CHAIN (anchorCaseRootSnapshot):
  WITNESS: getCurrentTimestamp() → snapshotTimestamp
  PUBLIC:  latestCaseRootHashByCaseIdentifier[caseId] = caseRootHash
  PUBLIC:  caseRootAnchorTimestampByCaseIdentifier[caseId] = timestamp

WHY PERIODIC SNAPSHOTS:
  Discovery evolves over months. Each snapshot says:
  "As of [timestamp], THIS was the complete state of all discovery."
  Six months later at a sanctions hearing, you can prove exactly what
  existed at any point in time.
```

### Workflow F: Verify a Document Belongs to a Production

```
WHO:    Anyone — courts, opposing counsel, auditors
WHEN:   During a dispute about whether a document was produced
TRIGGER: Verification request

WHAT HAPPENS ON-CHAIN (verifyDocumentExistsInProduction):
  1. Look up the stored Merkle root for the production
  2. Witness computes what the root SHOULD be given this document + proof path
  3. Compare computed root to stored root
  4. If they match → document is mathematically proven to be in the production

  This costs O(log n) — for 1 million documents, only ~20 hash comparisons.
```

### Workflow G: Verify Twin Bond Integrity

```
WHO:    Receiving party, court, auditor
WHEN:   When verifying a digitized document hasn't been tampered with
TRIGGER: Verification request

WHAT HAPPENS ON-CHAIN (verifyTwinBondIntegrity):
  1. Recompute bond hash = SHA-256(currentImageHash + currentDigitalHash)
  2. Compare to the expected (stored) bond hash
  3. If they match → both twins are intact, no tampering
  4. If they differ → at least one twin has been modified since bonding
```

---

## State Summary

| State Type | Variable | What It Holds |
|-----------|----------|---------------|
| PUBLIC | `totalProductionsCreated` | Production counter |
| PUBLIC | `productionMerkleRootByIdentifier` | Merkle root per production |
| PUBLIC | `latestCaseRootHashByCaseIdentifier` | Single hash = entire discovery |
| PUBLIC | `caseRootAnchorTimestampByCaseIdentifier` | When each snapshot was taken |
| PUBLIC | `totalDocumentsRegistered` | Document counter |
| SEALED | `immutableDocumentHashCommitments` | MerkleTree of every document hash (forever) |
| SEALED | `immutableProductionCommitments` | Set of every production root (forever) |
| PRIVATE | `documentMetadataReferenceByDocumentHash` | Pointer to off-chain metadata |
| PRIVATE | `documentCategoryByDocumentHash` | Category 1-24 |
| PRIVATE | `documentOriginatorPublicKeyByDocumentHash` | Who created/first possessed |
| PRIVATE | `digitalTwinHashByImageTwinHash` | Image → Digital twin link |
| PRIVATE | `twinBondFidelityScoreByBondHash` | OCR fidelity (0-100) |
| PRIVATE | `latestCustodyTransferReferenceByDocumentHash` | Latest transfer timestamp |
| PRIVATE | `documentListReferenceByProductionIdentifier` | Production contents pointer |

---

## What the DApp Handles (NOT This Contract)

- Actual document file storage (PDFs, TIFFs, emails on user's machine)
- AI-powered document categorization (the 24 Universal Discovery Categories)
- Bates number assignment and tracking
- Full-text search and indexing
- AI metadata extraction for communications (sender, recipient, thread, entities)
- Format conversions (native → TIFF, native → PDF)
- Haystack Alert scoring (data dump obfuscation detection)
- Privilege log generation
- Redaction tracking
- Cross-reference mapping (which docs respond to which discovery requests)
- Page-level and segment-level hash computation (Levels 0-1)
- Package-level grouping (Level 3)
- Merkle tree construction (done locally, only root goes on-chain)
- Visual feature detection for twin protocol (signatures, stamps, handwriting)

---

## Circuit Reference

| Circuit | Who Calls It | What It Does |
|---------|-------------|--------------|
| `registerDocument()` | Case owner | Commits document hash to sealed ledger |
| `registerTwinBond()` | Case owner | Bonds image + digital twins permanently |
| `recordCustodyTransfer()` | Case owner | Records document handoff between parties |
| `anchorProductionMerkleRoot()` | Case owner | Finalizes a production on-chain |
| `anchorCaseRootSnapshot()` | Case owner / DApp auto | Periodic snapshot of entire case |
| `verifyDocumentExistsInProduction()` | Anyone | Merkle proof verification |
| `verifyTwinBondIntegrity()` | Anyone | Check if twins are still intact |

---

*This contract is the data integrity backbone. Every document that enters the discovery universe gets an immutable hash commitment. Every production gets a sealed Merkle root. Every snapshot captures the full state. The DApp manages the files; this contract proves they haven't been touched.*
