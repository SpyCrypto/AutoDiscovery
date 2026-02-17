# Deep Dive: Document Hashing Strategy

> **Date**: February 15, 2026
> **Authors**: John + Cassie
> **Branch**: `johnny5i-branch`
> **Status**: Architectural decision — needs Spy review

---

## The Questions

1. Should every document have its own hash?
2. What about multi-page documents — hash each page + a compendium hash?
3. When several documents form a single compound document, how do we handle that?

**Short answers**: Yes, yes, and Merkle trees. But the devil is in the details.

---

## The Fundamental Problem: What IS a "Document"?

Before we can hash anything, we need to define what we're hashing. In legal discovery, the word "document" is dangerously ambiguous:

| What You Might Call "A Document" | Pages | Complexity |
|----------------------------------|-------|------------|
| A one-page letter | 1 | Simple — one hash |
| A 200-page deposition transcript | 200 | Is this 1 document or 200 pages? |
| An email chain with 47 messages | 47 msg | Is this 1 thread or 47 communications? |
| Medical records from 3 hospitals | 500+ | 1 production, 3 sources, hundreds of records |
| Expert report + 5 appendices | 80 | 1 report or 6 documents? |
| USB drive dump of 10,000 files | ??? | 1 "production" containing 10,000 documents |
| Video surveillance footage (8 hrs) | N/A | No pages at all — time-based |
| A database export (50,000 rows) | N/A | No pages — structured data |
| A contract + its 3 amendments | 45 | 4 documents that together form 1 "agreement" |

**The answer**: A document is whatever a party *says* it is when they produce it. But AutoDiscovery needs to handle ALL of these cases with a single, consistent hashing architecture.

---

## The Hashing Hierarchy: Five Levels

The solution is a **hierarchy of hashes** — like a file system, like Git, like blockchain blocks themselves. Each level nests inside the next:

```
LEVEL 5: CASE ROOT
    │     Merkle root of ALL discovery in the entire case
    │     (this is what gets periodic on-chain anchoring)
    │
    ├── LEVEL 4: PRODUCTION
    │     Merkle root of everything in a single production
    │     e.g., "DEF's Response to RFP #3, Production #1"
    │     │
    │     ├── LEVEL 3: PACKAGE (compound document)
    │     │     Merkle root of related documents grouped together
    │     │     e.g., "Expert Report + Appendices A-E"
    │     │     │
    │     │     ├── LEVEL 2: DOCUMENT
    │     │     │     Merkle root of all pages in one file
    │     │     │     e.g., "Expert Report (45 pages)"
    │     │     │     │
    │     │     │     ├── LEVEL 1: PAGE / SEGMENT
    │     │     │     │     Hash of individual page content
    │     │     │     │     e.g., "Page 12 of Expert Report"
    │     │     │     │     │
    │     │     │     │     └── LEVEL 0: RAW BYTES
    │     │     │     │           SHA-256 of the raw byte content
    │     │     │     │           The atomic unit of integrity
    │     │     │     │
    │     │     │     ├── Page 1 Hash
    │     │     │     ├── Page 2 Hash
    │     │     │     └── Page N Hash
    │     │     │
    │     │     ├── Document A (Expert Report)
    │     │     ├── Document B (Appendix A)
    │     │     └── Document F (Appendix E)
    │     │
    │     ├── Package 1 (Expert Report + Appendices)
    │     ├── Package 2 (Email Communications)
    │     └── Standalone Document (no package needed)
    │
    ├── Production 1 (DEF Response to RFP #3)
    ├── Production 2 (DEF Supplemental to RFP #3)
    └── Production 3 (PRO Initial Disclosures)
```

### The Git Analogy

If you've used Git, this is the same architecture:

| Git Concept | AutoDiscovery Equivalent |
|-------------|-------------------------|
| **Blob** (raw file content) | Level 0/1: Raw bytes / page hash |
| **Tree** (directory of blobs) | Level 2/3: Document / package hash |
| **Commit** (snapshot of a tree) | Level 4: Production hash |
| **Repository** | Level 5: Case root hash |

Git doesn't put every file on the network — it puts the commit hash. From that single hash, you can verify any individual file via its Merkle path. Same principle here.

---

## Level 1: Page-Level Hashing — Why It Matters

### The Tampering Detection Problem

If you only hash the whole document:

```
Document Hash: SHA-256("entire 200-page deposition") = abc123...

Someone replaces page 47 (where the witness said something damaging).

New Document Hash: SHA-256("altered 200-page deposition") = def456...

❌ You know the document was altered.
❌ You DON'T know which page was changed.
❌ You can't prove to the court exactly what was altered.
```

With page-level hashing:

```
Document Merkle Root: xyz789...
├── Page 1:   hash_a (✅ matches)
├── Page 2:   hash_b (✅ matches)
├── ...
├── Page 47:  hash_WRONG (❌ MISMATCH — this page was altered!)
├── Page 48:  hash_c (✅ matches)
└── Page 200: hash_d (✅ matches)

✅ You know the document was altered.
✅ You know EXACTLY which page was changed.
✅ You can prove it with the Merkle proof path.
✅ You can show the court: "Pages 1-46 and 48-200 are intact.
   Page 47 was modified after origination."
```

### Bates Number Alignment

Legal documents are stamped with sequential Bates numbers — and these are **page-level**. DEF-000001 through DEF-000200 for a 200-page document. Courts reference specific Bates pages:

> "The Court notes that DEF-000047 contradicts Defendant's sworn interrogatory response."

Page-level hashing aligns perfectly with Bates numbering. Each Bates-stamped page has its own hash. This means:

```
Bates #:    DEF-000047
Page Hash:  SHA-256(content of page 47) = 7f3a2b...
Verified:   ✅ Matches origination record
Timestamp:  Originated 2025-01-15 14:32:07 UTC
```

The court can verify any individual page without needing to process the entire document.

---

## Level 2: Document-Level Hashing — The Merkle Root

Every document gets a Merkle root computed from its page hashes:

```
                    DOCUMENT MERKLE TREE
                    
                       Root Hash
                      /          \
                   H(1-4)        H(5-8)
                  /      \      /      \
               H(1-2)  H(3-4) H(5-6) H(7-8)
               /   \   /   \  /   \   /   \
             P1   P2  P3  P4 P5  P6 P7  P8
             
    P1 = SHA-256(page 1 content)
    P2 = SHA-256(page 2 content)
    ...
    H(1-2) = SHA-256(P1 + P2)
    ...
    Root = SHA-256(H(1-4) + H(5-8))
```

**Properties**:
- **Verification**: The root hash verifies the entire document in one comparison
- **Granularity**: Any individual page can be verified by providing its Merkle proof path (log₂(n) hashes)
- **Efficiency**: For a 200-page document, proving one page only requires ~8 hashes, not all 200
- **Tamper localization**: If any page changes, the root changes AND the Merkle path reveals which page

### What About Non-Page-Based Content?

Not everything has pages:

| Content Type | "Page" Equivalent | Hashing Strategy |
|-------------|-------------------|------------------|
| **PDF/DOCX/TIFF** | Actual pages | Hash per page |
| **Email** | Per-message in chain | Hash per message (headers + body + attachments separate) |
| **Audio/Video** | Time segments | Hash per N-second chunk (e.g., 60-second segments) |
| **Database export** | Row groups / tables | Hash per table or per N-row batch |
| **Spreadsheet** | Per sheet | Hash per worksheet + hash per row-group within sheets |
| **Source code** | Per file | Hash per file (already how Git works) |
| **Photos** | Per image | Each image is one "page" — atomic hash |
| **Chat/text messages** | Per message | Hash per message with timestamp |

For audio/video, the time-segment approach is critical:

```
8-hour surveillance video, 60-second segments:
├── Segment 001 (00:00:00 - 00:01:00): hash_001
├── Segment 002 (00:01:00 - 00:02:00): hash_002
├── ...
└── Segment 480 (07:59:00 - 08:00:00): hash_480

Merkle Root: [root hash of all 480 segments]

"Your Honor, the defense claims the footage was continuous.
 However, segments 127-129 (02:06:00 - 02:09:00) have hash
 mismatches, indicating the video was edited in that window."
```

---

## Level 3: Package-Level Hashing — Compound Documents

This is where it gets interesting. **Yes**, there are absolutely cases where several documents form a single logical unit. This happens constantly:

### Real-World Compound Document Scenarios

#### 1. Expert Report + Appendices
```
Package: "Dr. Chen's Expert Report"
├── Document A: Expert Report (45 pages)          → Merkle root A
├── Document B: Appendix A — Statistical Analysis  → Merkle root B
├── Document C: Appendix B — Lab Results           → Merkle root C
├── Document D: Appendix C — Literature Review     → Merkle root D
├── Document E: Appendix D — CV of Expert          → Merkle root E
└── Document F: Appendix E — Fee Schedule          → Merkle root F

Package Merkle Root: SHA-256(root_A + root_B + ... + root_F)
```

The package root proves ALL components are present and unaltered. But you can also verify any individual appendix independently.

#### 2. Deposition Package
```
Package: "Deposition of Jane Doe — Feb 10, 2025"
├── Document A: Transcript (312 pages)             → Merkle root A
├── Document B: Video recording (4.2 hours)        → Merkle root B
├── Document C: Exhibit 1 marked during depo       → Merkle root C
├── Document D: Exhibit 2 marked during depo       → Merkle root D
├── Document E: Errata sheet (corrections by witness)→ Merkle root E
└── Document F: Certificate of court reporter       → Merkle root F

Package Merkle Root: [root of all components]
```

#### 3. Contract + Amendments (Evolution Over Time)
```
Package: "The Agreement" (as it exists today)
├── Document A: Original Contract (Jan 2023)       → Merkle root A
├── Document B: Amendment #1 (Jun 2023)            → Merkle root B
├── Document C: Amendment #2 (Dec 2023)            → Merkle root C
├── Document D: Amendment #3 (Mar 2024)            → Merkle root D
└── Document E: Side Letter re: Amendment #3       → Merkle root E

Package Merkle Root: [root of all components]

NOTE: Each component has its own origination date.
The package itself has a "composed date" — when these
documents were grouped together for discovery purposes.
```

#### 4. Medical Records Compilation
```
Package: "Medical Records of Plaintiff"
├── Source 1: St. Luke's Hospital (120 pages)      → Merkle root 1
├── Source 2: Dr. Smith's Office (45 pages)        → Merkle root 2
├── Source 3: PhysioTherapy Inc. (30 pages)        → Merkle root 3
└── Source 4: Prescription Records (15 pages)      → Merkle root 4

Package Merkle Root: [root of all sources]

NOTE: Each source retains its own origination (the hospital
produced it), but the package was assembled by DEF's paralegal.
The package has a different custodian than the individual sources.
```

#### 5. Email Chain — The Trickiest Case
```
Package: "Email Thread RE: Project Deadline"
├── Message 1: Original email (Alice → Bob, Jan 5)      → hash_1
├── Message 2: Reply (Bob → Alice, Jan 5)                → hash_2
├── Message 3: Forward (Alice → Carol, Jan 6)            → hash_3
│   └── Attachment: spreadsheet.xlsx                     → hash_3a
├── Message 4: Reply-all (Carol → Alice, Bob, Jan 6)     → hash_4
├── Message 5: Reply (Bob → Carol, Jan 7)                → hash_5
│   └── Attachment: revised_spreadsheet.xlsx             → hash_5a
└── Message 6: Reply-all (Alice → Bob, Carol, Jan 7)     → hash_6

Thread Merkle Root: [root of all messages + attachments]

IMPORTANT: The thread is one "document" in discovery,
but each message is independently hashable. If the
producing party omits Message 4 (where Carol says
something damaging), the Merkle root won't match —
AND you can identify exactly which message is missing.
```

### The Package Record

```
┌─────────────────────────────────────────────────────────────┐
│                     PACKAGE RECORD                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Package ID:        [unique identifier]                      │
│  Package Type:      EXPERT_REPORT | DEPOSITION |             │
│                     CONTRACT_SET | MEDICAL_RECORDS |          │
│                     EMAIL_THREAD | EVIDENCE_BUNDLE | OTHER   │
│                                                               │
│  Components:                                                  │
│  ┌────┬──────────────────────┬──────────┬──────────────┐     │
│  │ #  │ Document             │ Doc Hash │ Pages/Segs   │     │
│  ├────┼──────────────────────┼──────────┼──────────────┤     │
│  │ 1  │ Expert Report        │ abc123   │ 45 pages     │     │
│  │ 2  │ Appendix A           │ def456   │ 12 pages     │     │
│  │ 3  │ Appendix B           │ ghi789   │ 8 pages      │     │
│  └────┴──────────────────────┴──────────┴──────────────┘     │
│                                                               │
│  Package Merkle Root:  [root of all component doc hashes]    │
│  Total Pages/Segments: [sum across all components]           │
│  Bates Range:          [first Bates # — last Bates #]       │
│  Assembled By:         [who created the package]             │
│  Assembly Date:        [when components were grouped]        │
│  Assembly Reason:      [why — e.g., "Response to RFP #3"]   │
│                                                               │
│  Component Provenance:                                        │
│  ┌────┬──────────────┬───────────────┬────────────────┐     │
│  │ #  │ Originated   │ Originator    │ Orig. Date     │     │
│  ├────┼──────────────┼───────────────┼────────────────┤     │
│  │ 1  │ DEF expert   │ Dr. Chen      │ 2025-01-15     │     │
│  │ 2  │ DEF expert   │ Dr. Chen      │ 2025-01-15     │     │
│  │ 3  │ 3P lab       │ GeneLab Inc   │ 2024-11-20     │     │
│  └────┴──────────────┴───────────────┴────────────────┘     │
│                                                               │
│  ZK PROOF: "Package [root] contains [n] components,          │
│            assembled [date] by [party]."                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Special Cases That Complicate Hashing

### 1. Redacted Documents

When a document is redacted before production, it's a **different file** with a **different hash**. Both must exist in the system:

```
ORIGINAL:  hash_abc  (unredacted — held by producing party)
REDACTED:  hash_def  (produced version — received by other party)

Link Record:
├── Original Hash: hash_abc (exists in producing party's system)
├── Redacted Hash: hash_def (exists in both parties' systems)
├── Redaction Basis: Attorney-client privilege
├── Redaction Locations: Pages 3, 7, 12 (paragraphs 2-4)
├── Unredacted Held By: DEF (for potential in camera review)
└── Redaction Approved: [by court order / by agreement / self-assessed]
```

The **original hash** may only exist in the producing party's instance (access-controlled). If the court orders in camera review, the judge's instance gets access to hash_abc. The ZK proof can attest: "A redacted version of this document was produced, and the unredacted version is preserved."

### 2. Format Conversions (Native → Produced)

> **📎 See also**: [`TWIN_PROTOCOL.md`](./TWIN_PROTOCOL.md) — for digitized physical documents, the image scan and OCR'd digital file are permanently bonded as "twins" with a combined bond hash at Level 1.

Discovery often requires converting native files to produced format:

```
NATIVE:    quarterly_financials.xlsx  → hash_native
PRODUCED:  quarterly_financials.pdf   → hash_produced

Link Record:
├── Native Hash:    hash_native  (original format)
├── Produced Hash:  hash_produced (produced format)
├── Conversion:     XLSX → PDF via [tool/method]
├── Metadata Loss:  [formulas, hidden columns, cell comments — 
│                    not visible in PDF]
└── Native Available: YES (per ESI agreement / court order)
```

This matters because metadata in native format (Excel formulas, Word track changes, email headers) can be legally significant. The produced PDF doesn't contain it. AutoDiscovery tracks both versions and their relationship.

### 3. Supplemental Productions (Document Versioning)

When a party supplements their production (finds new docs, court orders more):

```
PRODUCTION #1 (Jan 15):
├── Doc 001-050 (50 documents)
└── Production Merkle Root: root_v1

SUPPLEMENT #1 (Feb 10):
├── NEW: Doc 051-062 (12 new documents)
├── CORRECTED: Doc 023 (replaced — original had wrong Bates stamp)
└── Supplement Merkle Root: root_s1

COMBINED STATE (as of Feb 10):
├── Doc 001-022 (unchanged from Production #1)
├── Doc 023 (CORRECTED version — original hash preserved in history)
├── Doc 024-050 (unchanged from Production #1)
├── Doc 051-062 (NEW from Supplement #1)
└── Current Merkle Root: root_combined

HISTORY:
├── root_v1 → root_combined (diff: +12 new, 1 corrected)
├── Doc 023 original hash: hash_023_v1 (preserved, never deleted)
├── Doc 023 corrected hash: hash_023_v2 (current)
└── Reason for correction: "Bates stamp error per meet-and-confer"
```

Like Git, we **never delete history**. The original hash is preserved even when a document is corrected. This prevents anyone from claiming a document was always what it is now.

### 4. Identical Documents From Multiple Sources

The same email exists in both DEF's production and PRO's production:

```
DEF produces: email_from_alice_to_bob.pdf  → hash_xyz
PRO produces: email_from_alice_to_bob.pdf  → hash_xyz (same!)

The system recognizes: same content hash from two different sources.

Cross-Reference Record:
├── Content Hash: hash_xyz
├── Produced By DEF: in Production #1, Bates DEF-000234
├── Produced By PRO: in Production #2, Bates PRO-000891
├── First Originated: DEF (Jan 15) — 3 days before PRO (Jan 18)
└── Status: DUPLICATE — content identical, different Bates numbers

This is actually GOOD: independent productions from both sides 
contain the same document, confirming authenticity.
```

Content-addressable hashing (hash based on content, not filename) makes deduplication automatic. If both sides produce the same email, the system knows instantly.

### 5. Audio/Video — Time-Segment Hashing

No pages. We use time segments instead:

```
Body Camera Footage: 2 hours, 14 minutes
Segment Size: 60 seconds

├── Segment 001 (00:00:00 — 00:01:00): hash_001
├── Segment 002 (00:01:00 — 00:02:00): hash_002
├── ...
├── Segment 067 (01:06:00 — 01:07:00): hash_067  ← gap detected!
├── [MISSING: 01:07:00 — 01:09:00]                ← 2-minute gap
├── Segment 070 (01:09:00 — 01:10:00): hash_070
├── ...
└── Segment 134 (02:13:00 — 02:14:00): hash_134

Merkle Root: [root of all segment hashes]

INTEGRITY ALERT:
Segments 068-069 are missing. 2-minute gap detected at 
01:07:00 — 01:09:00. This may indicate editing or 
selective production. Flagged for review.
```

The segment-level hashing catches **edited footage** — if someone cuts a section, the gap is mathematically provable.

---

## On-Chain Efficiency: What Actually Goes to Midnight

We do NOT put every page hash on-chain. That would be wildly expensive and unnecessary.

```
WHAT GOES ON-CHAIN:
├── Case Root Hash (Level 5) — periodically anchored
├── Production Root Hash (Level 4) — at each production event  
└── Key individual document hashes — when specifically disputed

WHAT STAYS OFF-CHAIN (but verifiable):
├── Package hashes (Level 3) — stored in AutoDiscovery's DB
├── Document hashes (Level 2) — stored in AutoDiscovery's DB
└── Page/segment hashes (Level 1) — stored in AutoDiscovery's DB
```

### Verification Flow

When someone needs to verify a specific page:

```
"Prove that page 47 of the Expert Report was part of 
 Production #1 and hasn't been altered."

VERIFICATION CHAIN:
1. Page 47 hash → verified against Document Merkle root
2. Document root → verified against Package Merkle root
3. Package root → verified against Production Merkle root
4. Production root → verified against on-chain Case Root

Total verification: 4 Merkle proof paths.
On-chain lookup: 1 (the Case Root at the relevant timestamp).
Cost: Minimal.
Proof strength: Mathematically irrefutable.
```

This is the same technique Bitcoin SPV (Simplified Payment Verification) uses — verify a single transaction without downloading the entire blockchain.

---

## The Complete Hash Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│                    AUTODISCOVERY HASH ARCHITECTURE            │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │  MIDNIGHT BLOCKCHAIN (on-chain)                      │     │
│  │                                                       │     │
│  │  • Case Root Hash (anchored periodically)            │     │
│  │  • Production Root Hashes (at each production event) │     │
│  │  • Disputed document hashes (when contested)         │     │
│  │  • Memorandum hashes (periodic status proofs)        │     │
│  │                                                       │     │
│  │  ZK Proofs: Existence, timestamp, and party           │     │
│  │  attribution WITHOUT revealing content.               │     │
│  └───────────────────────┬─────────────────────────────┘     │
│                          │                                    │
│                    Merkle Proof Path                          │
│                          │                                    │
│  ┌───────────────────────▼─────────────────────────────┐     │
│  │  AUTODISCOVERY DATABASE (off-chain, verifiable)      │     │
│  │                                                       │     │
│  │  Level 5: Case Root ─────────────────────────────┐   │     │
│  │  Level 4: Production Roots ──────────────────┐   │   │     │
│  │  Level 3: Package Roots ────────────────┐    │   │   │     │
│  │  Level 2: Document Merkle Roots ───┐    │    │   │   │     │
│  │  Level 1: Page/Segment Hashes ─┐   │    │    │   │   │     │
│  │  Level 0: Raw Byte Content     │   │    │    │   │   │     │
│  │                                │   │    │    │   │   │     │
│  │  Every level verifiable against │   │    │    │   │   │     │
│  │  the level above via Merkle    │   │    │    │   │   │     │
│  │  proof path.                   │   │    │    │   │   │     │
│  └────────────────────────────────┘───┘────┘────┘───┘   │     │
│                                                               │
│  VERIFICATION: Any page, document, or package can be         │
│  verified against the on-chain root in O(log n) steps.       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Design Decisions & Recommendations

### 1. Hash Algorithm: SHA-256

- Industry standard, used by Bitcoin, widely supported
- 256-bit output = collision-resistant for our lifetime
- Courts already accept SHA-256 in forensic contexts
- Compatible with Midnight's ZK proof system

### 2. Page Extraction Method

Different formats require different page extraction:

| Format | Page Extraction Method |
|--------|----------------------|
| PDF | Each page rendered independently, hashed |
| TIFF | Each image/frame is a page |
| DOCX | Rendered to PDF first, then per-page hash |
| Email (.eml/.msg) | Headers + body + each attachment separately |
| Audio/Video | Fixed-duration segments (configurable, default 60s) |
| Spreadsheet | Per-sheet + per-row-batch within sheets |
| Database export | Per-table + per-row-batch |
| Plain text | Per-page (if paginated) or per-paragraph-batch |

### 3. Compound Document Rules

- Every component retains its independent identity (hash, origination)
- The package adds a grouping layer — it doesn't replace component identity
- A document can belong to **multiple packages** (e.g., an email appears in both an email thread package AND an expert's reference materials package)
- Package membership is recorded, not assumed — the system knows why documents were grouped

### 4. Immutable History

- No hash is ever deleted. Corrections create new versions, not overwrites.
- Every state of every document is preserved with its timestamp.
- This mirrors how courts expect evidence to be handled: "Show me the original AND the corrected version."

### 5. Cross-Party Deduplication

- Content-addressable hashing means identical content = identical hash, regardless of source
- Automatic deduplication across parties' productions
- Cross-reference records show which parties produced the same document independently
- Useful for privilege disputes: if both sides have the same document, it may not be privileged

---

## Open Questions for Spy

1. **Merkle tree implementation on Midnight** — Does the Compact language support the tree construction natively, or do we compute the tree off-chain and submit only the root?

2. **Hash anchoring frequency** — How often should we anchor the Case Root to Midnight? Every production event? Daily? Weekly? What's the cost/benefit tradeoff?

3. **ZK proof of inclusion** — Can Midnight prove "document X is part of production Y" without revealing X's content? This would use the Merkle proof path as a witness in the ZK circuit.

4. **Content-addressable storage** — Should we use IPFS or similar for the off-chain storage layer, with Midnight anchoring the integrity proofs? IPFS is already content-addressed (CID = hash).

5. **Segment size for audio/video** — 60 seconds is a starting point. Should this be configurable per case? Shorter segments = more granular tamper detection but more hashes to manage.

---

*This document feeds back into the main Partition doc (Step 3: Origination) and Open Question #1 (Granularity of hashing).*
