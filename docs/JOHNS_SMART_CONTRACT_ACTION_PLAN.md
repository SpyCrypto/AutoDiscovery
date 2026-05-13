# John's Smart Contract Action Plan

> **AutoDiscovery.legal — The Architecture Bible**  
> **Author:** Penny 🎀 (with John)  
> **Date:** February 21, 2026  
> **Status:** Living document — updated as we build

---

## The Golden Rule

**Everything about the case lives in PRIVATE state or off-chain. The public ledger only ever sees hashes, counts, and boolean flags. Never content. Never names. Never dates. Never strategy.**

This is the non-negotiable foundation. Midnight's dual-ledger system gives us:
- **Private state** — Encrypted, only visible to the contract instance owner
- **Sealed state** — Write-once, immutable forever (for hash commitments)
- **Public state** — Visible to everyone (ONLY hashes and proof artifacts)

---

## Part 1: The Smart Contract Audit — Do We Really Need 6 Contracts?

We originally designed 6 contracts. I went through each one and asked: **"Does this NEED a ZK proof, or can the DApp handle it?"**

### The Test: ZK Proof or DApp?

A Compact smart contract should ONLY be used when you need one or more of:
1. **Mathematical proof** that something happened (ZK attestation)
2. **Immutable sealed commitment** that can never be altered (hash anchoring)
3. **Public verifiability** without revealing private details (selective disclosure)
4. **Shared singleton resource** that multiple users reference (registry)

Everything else — role management, UI logic, deadline computation, document categorization, search, AI metadata extraction — belongs in the **DApp layer** (TypeScript, React, off-chain database).

### The Verdict

| Contract | Keep? | Why |
|----------|-------|-----|
| **jurisdiction-registry.compact** | **YES** | Shared singleton. One deployment, admin-controlled. All users reference it. Proves which rules were in effect immutably. |
| **discovery-core.compact** | **YES** | Per-user instance. Proves case exists, steps completed, deadlines tracked. The lifecycle backbone. |
| **document-registry.compact** | **YES** | Per-user instance. Sealed hash commitments, Merkle proofs, Twin Protocol bonds. The data integrity layer. |
| **compliance-proof.compact** | **YES** | Per-user instance. THE killer feature. Mathematical proof of discovery compliance. Courts verify without seeing details. |
| **access-control.compact** | **MOVE TO DAPP** | Role management is a database concern. Protective order tiers are application-level access control. Sharing is encrypted off-chain transfer. None of this needs ZK proofs for MVP. |
| **expert-witness.compact** | **DEFER TO PHASE 2** | Skeleton only today. Expert tracking lives in the DApp database until Phase 2 when we build proper credential attestation circuits. |

### Result: 4 Contracts (down from 6)

```
COMPACT SMART CONTRACTS (ZK Proofs + Blockchain)
═══════════════════════════════════════════════════
  1. jurisdiction-registry.compact  → Shared singleton (one deployment for all users)
  2. discovery-core.compact         → Per-user (one instance per party)
  3. document-registry.compact      → Per-user (one instance per party)
  4. compliance-proof.compact       → Per-user (one instance per party)

DAPP LAYER (TypeScript + React + Off-chain Storage)
═══════════════════════════════════════════════════
  • Access control (roles, permissions, protective orders)
  • Expert witness tracking (Phase 2 skeleton lives here for now)
  • Deadline computation engine
  • Rule pack loading and merging
  • AI metadata extraction for communications
  • Document categorization and search
  • Haystack Alert (data dump obfuscation detection)
  • UI: Dashboard, New Case Wizard, Case View, Compliance Reports
```

### Why access-control.compact Moves to DApp

- **Roles (DEF/PRO/COURT/3P)** — This is just a database table. The DApp tracks who has what role. No ZK proof needed.
- **Protective order tiers** — The DApp enforces "attorneys only" or "sealed" access when serving documents. This is application-level gating, not a blockchain concern.
- **Sharing protocol** — Documents travel off-chain (encrypted, direct transfer). The *proof* that sharing occurred is already handled by `document-registry`'s `recordCustodyTransfer` circuit. We don't need a separate contract for it.
- **ZK role proofs** — Nice-to-have for Phase 2+. If a court ever needs "prove this person is defense counsel without revealing their identity," we can add a single `proveParticipantRole` circuit to `discovery-core` later. For MVP, the attorney's Lace wallet signature is sufficient identity proof.

### Why expert-witness.compact Defers Entirely

- It's a skeleton with 2 placeholder circuits
- Expert credential verification requires HIPAA compliance infrastructure we haven't built
- For MVP, expert tracking is a DApp database table
- When Phase 2 comes, we build it as a focused contract with proper credential attestation

---

## Part 2: The 4 Contracts — What Each One Does

### Contract 1: `jurisdiction-registry.compact`

**Deployment:** ONE instance for the entire AutoDiscovery platform (admin-controlled)

**Purpose:** Anchors the hash of each jurisdiction's rule pack JSON on-chain, creating an immutable audit trail of which rules were in effect at any point in time.

**Why it needs a smart contract:**
- Courts need to verify "which rules generated these discovery steps?"
- The rule pack hash on-chain proves exactly which version of Idaho IRCP (or Federal FRCP, etc.) was active when attestations were generated
- Admin-controlled updates prevent unauthorized parties from injecting fake rules

**Public state (visible to everyone):**
- `totalJurisdictionsRegistered` — How many jurisdictions are supported
- `registeredJurisdictionCodes` — Set of supported jurisdiction codes (e.g., "ID", "FEDERAL")
- `currentRulePackHashByJurisdictionCode` — SHA-256 hash of each jurisdiction's rule pack
- `currentRulePackVersionByJurisdictionCode` — Version number per jurisdiction

**Circuits:**
- `registerNewJurisdiction()` — Admin adds a new jurisdiction
- `updateJurisdictionRulePack()` — Admin updates rules (e.g., California 2024 reform)
- `verifyRulePackHashMatchesExpected()` — Anyone can verify which rules are active

**DApp handles:** Loading the actual JSON rule packs, merging county/judge overrides, computing deadlines from rules

---

### Contract 2: `discovery-core.compact`

**Deployment:** One instance PER USER (each party manages their own cases)

**Purpose:** Manages the lifecycle of legal cases — creation, discovery step tracking, deadline management, and status transitions. Jurisdiction-agnostic (doesn't know about specific rules — just tracks obligations).

**Why it needs a smart contract:**
- Proves a case EXISTS on-chain without revealing which case
- Proves steps were COMPLETED (public boolean flag) without revealing what the step was
- Generates attestation hashes when steps are completed (feeds into compliance-proof)
- Case identifiers are hashes — the actual case number never appears on-chain

**Public state (visible to everyone):**
- `totalCasesCreated` — Activity counter
- `caseStatusByCaseIdentifier` — Case exists? In progress? Complete?
- `jurisdictionCodeByCaseIdentifier` — Which jurisdiction governs (not sensitive)
- `isStepCompletedByStepHash` — Boolean: is this step done?
- `completionAttestationHashes` — Set of all completion proof hashes

**Private state (only the contract owner sees):**
- `caseOwnerAddressByCaseIdentifier` — Who owns this case
- `stepDeadlineTimestampByStepHash` — When each step is due
- `detailedStepStatusByStepHash` — Full lifecycle status (NOT_STARTED → IN_PROGRESS → COMPLETED/OVERDUE/etc.)

**Circuits:**
- `createNewCase()` — Register a new case on-chain
- `addDiscoveryStepToCase()` — Add an obligation with a deadline
- `markDiscoveryStepAsCompleted()` — Complete a step, generate attestation
- `checkCaseComplianceStatus()` — Is the case fully compliant?

**DApp handles:** Step generation from rule packs, deadline computation, status tracking UI, case management dashboard, scheduling order overrides

---

### Contract 3: `document-registry.compact`

**Deployment:** One instance PER USER

**Purpose:** The data integrity workhorse. Manages document hash anchoring (immutable proof of existence), Twin Protocol bonds (image + digital pairing), chain of custody transfers, production Merkle roots, and case root snapshots.

**Why it needs a smart contract:**
- **Sealed hash commitments** — Once a document hash is committed, it exists FOREVER. This is the mathematical proof that "this document existed at this time and hasn't been altered since." No DApp can provide this guarantee.
- **Merkle proofs** — Verify any document belongs to a production in O(log n) without revealing other documents
- **Twin Protocol bonds** — Immutable bond between image scan and OCR'd text, tamper-detectable
- **Case root snapshots** — Periodic hash of the ENTIRE discovery universe, anchored on-chain

**Public state:**
- `totalProductionsCreated` — Production counter
- `productionMerkleRootByIdentifier` — Merkle root per production
- `latestCaseRootHashByCaseIdentifier` — The single hash representing all discovery
- `caseRootAnchorTimestampByCaseIdentifier` — When each snapshot was taken
- `totalDocumentsRegistered` — Document counter

**Sealed state (immutable forever):**
- `immutableDocumentHashCommitments` — MerkleTree of every document hash ever committed
- `immutableProductionCommitments` — Set of every production root ever finalized

**Private state:**
- `documentMetadataReferenceByDocumentHash` — Pointer to off-chain metadata
- `documentCategoryByDocumentHash` — Which of 24 Universal Discovery Categories
- `documentOriginatorPublicKeyByDocumentHash` — Who created/first possessed the doc
- `digitalTwinHashByImageTwinHash` — Image → Digital twin mapping
- `twinBondFidelityScoreByBondHash` — OCR accuracy score (0-100)
- `latestCustodyTransferReferenceByDocumentHash` — Chain of custody pointer
- `documentListReferenceByProductionIdentifier` — Production contents pointer

**Circuits:**
- `registerDocument()` — Commit a document hash to sealed state (origination)
- `registerTwinBond()` — Bond an image twin to its digital twin
- `recordCustodyTransfer()` — Track document handoffs between parties
- `anchorProductionMerkleRoot()` — Finalize a production on-chain
- `anchorCaseRootSnapshot()` — Periodic snapshot of entire discovery state
- `verifyDocumentExistsInProduction()` — Merkle proof verification
- `verifyTwinBondIntegrity()` — Check if twins are still intact

**DApp handles:** Actual document storage, AI categorization, Bates numbering, search indexing, metadata extraction, format conversions, Haystack Alert scoring, privilege log generation

---

### Contract 4: `compliance-proof.compact`

**Deployment:** One instance PER USER

**Purpose:** THE KILLER FEATURE. Generates and verifies ZK compliance attestations — mathematical proofs that discovery obligations were met, without revealing any case details.

**Why it needs a smart contract:**
- This is the ENTIRE VALUE PROPOSITION of AutoDiscovery
- A ZK proof that "47 discovery obligations were met before their deadlines" is something NO existing legal tech product can provide
- Courts verify by checking a hash on-chain — zero trust required
- The proof is mathematically irrefutable — you literally cannot fake compliance

**Three levels of attestation:**
- **STEP-LEVEL (0x00)** — "This specific obligation was met before its deadline"
- **PHASE-LEVEL (0x01)** — "All obligations in this discovery phase were completed"
- **CASE-LEVEL (0x02)** — "Entire case discovery is compliant"

**Public state:**
- `totalAttestationsGenerated` — Attestation counter
- `registeredAttestationHashes` — Master registry of all proof hashes
- `attestationGeneratedTimestampByHash` — When each proof was created
- `attestationScopeLevelByHash` — Step, phase, or case-level

**Private state:**
- `associatedCaseIdentifierByAttestationHash` — Links attestation to case (revealed via selective disclosure)
- `attestationMetadataReferenceByHash` — Pointer to off-chain details

**Circuits:**
- `attestStepLevelCompliance()` — Prove one step was done before deadline (THE CORE ZK PROOF)
- `attestPhaseLevelCompliance()` — Prove all steps in a phase are done
- `attestCaseLevelCompliance()` — Prove entire case is compliant
- `verifyAttestationExists()` — Anyone can check if a proof exists
- `revealAttestationCaseIdentifier()` — Selective disclosure for court

**DApp handles:** Tracking which steps need attestation, batching attestation requests, formatting compliance reports for court (no blockchain jargon), generating verification QR codes

---

## Part 3: The DApp's Responsibilities

The DApp is a React + TypeScript application that handles everything that does NOT need a ZK proof. This is the majority of the work — the smart contracts are the thin cryptographic layer on top.

### What the DApp Does

| Layer | Responsibility | Examples |
|-------|---------------|----------|
| **Deadline Engine** | Compute absolute dates from relative rules | "IRCP 26(a): 30 calendar days from joinder deadline" → Feb 20, 2026 |
| **Rule Loader** | Load, validate, merge jurisdiction rule packs | Idaho IRCP + Ada County local rules + Judge Smith's standing order |
| **Access Control** | Manage roles, permissions, protective orders | "Attorney Jane is DEF counsel, can see CONFIDENTIAL docs" |
| **Document Manager** | Store, categorize, search, index documents | Drag-and-drop intake, AI categorization, Bates numbering |
| **AI Metadata** | Extract metadata from communications (emails, texts) | Sender, recipient, date, thread ID, attachments, entity resolution |
| **Haystack Alert** | Detect data dump obfuscation tactics | "500 documents dropped 48 hours before deadline — score: 23/100" |
| **Expert Tracker** | Track expert witnesses (Phase 2 DB skeleton) | Qualifications, W-9 status, deposition scheduling |
| **Compliance Dashboard** | Visual status of all obligations | Traffic lights, countdown timers, overdue alerts |
| **Report Generator** | Court-ready compliance reports (no blockchain jargon) | "All discovery obligations met — verification hash: abc123..." |

### The Boundary

```
┌──────────────────────────────────────────────────────────────────┐
│                         USER'S MACHINE                            │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                     DApp (React + TypeScript)                │  │
│  │                                                               │  │
│  │   • Document storage & search     • Deadline engine          │  │
│  │   • AI metadata extraction        • Rule loader              │  │
│  │   • Access control (roles)        • Haystack Alert           │  │
│  │   • Expert witness DB             • Compliance dashboard     │  │
│  │   • Category assignment           • Bates numbering          │  │
│  │   • Report generation             • Court-ready exports      │  │
│  │                                                               │  │
│  │   ┌────────────── LACE WALLET ──────────────┐               │  │
│  │   │  Signs transactions for smart contracts  │               │  │
│  │   └──────────────────────────────────────────┘               │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                              │                                     │
│                    Signed transactions                              │
│                              │                                     │
└──────────────────────────────┼─────────────────────────────────────┘
                               │
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                     MIDNIGHT BLOCKCHAIN                           │
│                                                                    │
│   ┌──────────────────┐  ┌──────────────────┐                     │
│   │  jurisdiction-    │  │  discovery-core   │  ← Per-user        │
│   │  registry         │  │                   │    instances        │
│   │  (shared singleton)│  └──────────────────┘                     │
│   └──────────────────┘  ┌──────────────────┐                     │
│                          │  document-        │                     │
│                          │  registry         │  ← Per-user        │
│                          └──────────────────┘    instances        │
│                          ┌──────────────────┐                     │
│                          │  compliance-      │                     │
│                          │  proof            │  ← Per-user        │
│                          └──────────────────┘    instances        │
│                                                                    │
│   PUBLIC:  Hashes, counts, boolean flags                          │
│   SEALED:  Immutable hash commitments (write-once, forever)       │
│   PRIVATE: All case data, deadlines, metadata (encrypted)         │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## Part 4: Build Order — What Gets Built When

### Phase 0: Foundation (DONE)
- [x] Architecture docs and protocol design
- [x] 9-step discovery protocol
- [x] 5-level Merkle hashing strategy
- [x] Twin Protocol design
- [x] TypeScript data model (9 type files)
- [x] Idaho IRCP rule pack JSON
- [x] All 4 Compact contracts written with hyper-intuitive names + extensive comments

### Phase 1: Compile & Validate Contracts
1. **Resolve pragma version** — Test `>= 0.16 && <= 0.18` against SDK packages
2. **Compile all 4 contracts** — Fix any Compact language issues
3. **Deploy to Midnight testnet** — Get contract addresses
4. **Generate TypeScript bindings** — Auto-generated from compiled output

### Phase 2: Deadline Engine & Rule Loading (DApp)
5. **Deadline computation engine** — Convert relative rules to absolute dates
6. **Rule loader service** — Load Idaho IRCP, merge with county/judge overrides
7. **Federal FRCP rule pack** — Baseline for removal cases

### Phase 3: Witness Implementations
8. **Wire witnesses to discovery-core** — `computeUniqueCaseIdentifier`, `computeUniqueStepHash`, etc.
9. **Wire witnesses to document-registry** — `computeDocumentContentHash`, `computeTwinBondHash`, `buildMerkleRootFromDocumentHashes`
10. **Wire witnesses to compliance-proof** — `computeUniqueAttestationHash`

### Phase 4: Frontend (DApp)
11. **Dashboard** — Case cards, deadline timeline, compliance aggregate
12. **New Case Wizard** — Jurisdiction → Case Type → Details → Parties → Review → Sign
13. **Case View** — Step checklist, document tracker, compliance report button
14. **Access control UI** — Role assignment, protective order tiers (DApp-managed)

### Phase 5: Integration & Polish
15. **End-to-end test** — Create case → add steps → register docs → complete steps → attest → verify
16. **Spy validation** — Walk Spy through Idaho IRCP rules for accuracy
17. **Demo flow** — Scripted 5-minute walkthrough
18. **demoLand/realDeal split** — Mock providers for demo, Midnight providers for production

---

## Part 5: The Story — A Case from Start to Finish

*Let me walk you through how AutoDiscovery handles a real case, from the moment an attorney opens the app to the moment a court verifies their compliance proof. This is the story of how all four contracts and the DApp work together.*

---

### Chapter 1: The Case Begins

**Friday, March 15, 2026 — Boise, Idaho**

Attorney Sarah Chen represents the defendant in *Martinez v. Riverside Medical Center*, a medical malpractice case filed in Ada County, Idaho. The plaintiff alleges that Dr. Williams failed to diagnose a heart condition, leading to a cardiac event.

Sarah opens AutoDiscovery on her laptop. She's already connected her Lace wallet.

**She clicks "New Case."**

The **DApp** presents the New Case Wizard:

- **Step 1: Jurisdiction** — She selects "Idaho (IRCP)" from the dropdown. Behind the scenes, the DApp's **Rule Loader** fetches `idaho-ircp.json` from the rule-packs folder. It also checks with the **jurisdiction-registry** smart contract: "Is Idaho registered? What's the current rule pack hash?" The on-chain hash matches the local JSON hash — rules are current.

- **Step 2: Case Type** — She selects "Medical Malpractice." The Rule Loader filters the Idaho IRCP rules to include med-mal-specific requirements (like expert qualification rules — but NOT an affidavit of merit, because Idaho doesn't have one, as Spy confirmed).

- **Step 3: Case Details** — She enters:
  - Case Number: `CV-2026-03421`
  - Filing Date: March 1, 2026
  - Trial Date: September 15, 2027
  - Court: Ada County District Court
  - Judge: Hon. Patricia Morrison

- **Step 4: Parties** — She adds:
  - Defendant: Riverside Medical Center (represented by Sarah Chen)
  - Plaintiff: Maria Martinez (represented by opposing counsel James Park)

- **Step 5: Review** — The wizard shows everything. Sarah confirms.

- **Step 6: Sign** — Her Lace wallet pops up. She confirms a single transaction.

**What happens on-chain at this moment:**

The DApp calls `discovery-core.createNewCase()`:
- The witness computes `caseUniqueIdentifier = hash("CV-2026-03421" + "ID")` on Sarah's machine
- The actual case number **never leaves her laptop**
- On the public chain: a new entry appears in `caseStatusByCaseIdentifier` with status IN_PROGRESS
- On the public chain: `jurisdictionCodeByCaseIdentifier` shows "ID" (Idaho) — not sensitive
- In private state: Sarah's wallet address is stored as the case owner
- **Total on-chain data visible to the public: one hash, one status byte, one jurisdiction code. That's it.**

---

### Chapter 2: Discovery Steps Are Generated

Immediately after the case is created, the DApp's **Deadline Engine** springs to life.

It takes the Idaho IRCP rule pack and computes every deadline:

```
Step: Initial Disclosures (IRCP 26(a))
  Rule: 30 calendar days from joinder deadline
  Computed deadline: April 14, 2026

Step: Expert Report Disclosure (IRCP 26(b)(4))
  Rule: 120 days before trial
  Computed deadline: May 19, 2027

Step: Rebuttal Expert Report
  Rule: 30 days after initial expert disclosure
  Computed deadline: June 18, 2027

Step: Discovery Cutoff
  Rule: 90 days before trial
  Computed deadline: June 17, 2027

... (47 total steps generated)
```

The DApp calls `discovery-core.addDiscoveryStepToCase()` for each step:
- Each step gets a unique hash: `stepHash = hash(caseId + ruleReference)`
- Public chain: 47 new entries in `isStepCompletedByStepHash`, all set to `false`
- Private state: 47 deadline timestamps stored
- **Public sees: 47 anonymous boolean flags. Private holds: the deadlines.**

The DApp also stores ALL the step details locally — descriptions, rule references, dependencies, category assignments — in its own database. The blockchain doesn't need any of that.

---

### Chapter 3: Documents Start Flowing

Over the next weeks, documents arrive. Sarah's paralegal uses the DApp's document intake interface.

**March 20 — Medical records arrive (312 pages)**

The paralegal uploads the PDF. The DApp:
1. **Categorizes it** → Category 10: Medical Records (DApp AI)
2. **Assigns Bates numbers** → DEF-000001 through DEF-000312 (DApp)
3. **Computes SHA-256** of the raw file content (DApp)
4. **Calls `document-registry.registerDocument()`** on-chain

On-chain, the sealed ledger now contains this document's hash **forever**. The hash is committed to `immutableDocumentHashCommitments`. Even Sarah can't alter it. If anyone ever asks "did this document exist on March 20?", the sealed commitment proves it.

The DApp stores the actual PDF, the Bates numbers, the metadata, and the category in its local database. None of that touches the blockchain.

**March 25 — A handwritten note from the patient (physical document)**

The paralegal scans the handwritten note (creating an image file) and runs OCR (creating a text file). Now we have twins:
- **Image twin:** `patient_note_scan.tiff` (SHA-256: `abc123...`)
- **Digital twin:** `patient_note_ocr.txt` (SHA-256: `def456...`)

The DApp calls `document-registry.registerTwinBond()`:
- Bond hash = SHA-256(`abc123...` + `def456...`) = `789xyz...`
- Fidelity score: 73 (the handwriting is messy — OCR got some words wrong)
- Both twins are now permanently bonded on-chain

If anyone later swaps the OCR text for a different version, the bond hash won't match → tamper detected.

---

### Chapter 4: The Initial Disclosure Deadline

**April 10, 2026 — Four days before the deadline**

Sarah's DApp dashboard shows a yellow warning: "Initial Disclosures due in 4 days."

She reviews the disclosure package — 156 documents across 8 categories. The DApp has been tracking everything:
- 89 medical records
- 23 internal communications (emails)
- 15 employment records
- 12 policy documents
- 8 incident reports
- 5 expert CVs
- 3 insurance documents
- 1 financial summary

For the 23 emails, the DApp's **AI Metadata Extractor** has enriched each one with:
- Sender, recipient, CC, BCC
- Date, subject line, thread ID
- Extracted entities (people, dates, medical terms)
- Attachment inventory

All of this metadata lives in the DApp's local database. The blockchain only holds the document hashes.

**April 12 — Sarah finalizes the production**

She clicks "Finalize Production" in the DApp. Here's what happens:

1. **The DApp builds the Merkle tree** — All 156 document hashes are assembled into a Merkle tree. The root hash is computed locally.

2. **The DApp calls `document-registry.anchorProductionMerkleRoot()`** — The production's Merkle root is anchored on the public chain AND committed to the sealed ledger. This is **permanent** — the production can never be retroactively modified.

3. **The DApp calls `document-registry.anchorCaseRootSnapshot()`** — A snapshot of the entire case's discovery state (all productions so far) is anchored with a timestamp.

4. **The DApp handles the actual sharing** — Sarah's DApp encrypts the 156 documents and transmits them to opposing counsel James Park's AutoDiscovery instance (off-chain, direct transfer). The DApp calls `document-registry.recordCustodyTransfer()` for each document to create the on-chain proof that the transfer occurred.

**What the public chain now shows:**
- Production #1 exists with Merkle root `[hash]`
- Case root snapshot taken at `[timestamp]`
- 156 custody transfer records (anonymized)

**What the public chain does NOT show:**
- What the documents are
- Who sent them to whom
- What categories they belong to
- Any content whatsoever

---

### Chapter 5: The Step Is Completed

**April 12 — Same day, immediately after production**

Sarah clicks "Mark as Complete" on the Initial Disclosures step. The DApp:

1. **Calls `discovery-core.markDiscoveryStepAsCompleted()`**
   - Public: `isStepCompletedByStepHash` flips from `false` to `true`
   - Private: Status updates to COMPLETED (0x02)
   - An attestation hash is generated and stored in `completionAttestationHashes`

2. **Calls `compliance-proof.attestStepLevelCompliance()`**
   - The circuit checks: `currentTimestamp (April 12) <= deadline (April 14)` ✅
   - Assertion passes! The step was completed 2 days early.
   - A unique attestation hash is generated and stored in `registeredAttestationHashes`
   - The timestamp is recorded in `attestationGeneratedTimestampByHash`
   - The scope level is STEP_LEVEL (0x00)

**The ZK proof now exists on-chain:** "A discovery obligation was met before its deadline on April 12, 2026." The proof doesn't say which obligation, which case, or what documents were involved. Just that it was done on time.

---

### Chapter 6: Months Pass — Discovery Continues

Over the next year, Sarah's team:
- Completes 43 more discovery steps
- Produces 4 additional document productions (2,847 total documents)
- Takes 12 depositions
- Exchanges 3 sets of interrogatories
- Files expert reports with 2 retained experts

Each step completion generates attestations through the same flow:
1. DApp tracks the work
2. `discovery-core` marks the step complete
3. `compliance-proof` generates the ZK attestation
4. `document-registry` anchors document hashes and production roots

The DApp's dashboard shows a steady march of green checkmarks. 44 of 47 steps complete. 3 remaining.

---

### Chapter 7: Opposing Counsel Tries a Data Dump

**June 2, 2027 — Three months before trial**

Opposing counsel James Park produces 12,000 documents at 11:47 PM, 48 hours before the discovery cutoff. Most are irrelevant internal memos and duplicates.

Sarah's DApp detects this with the **Haystack Alert** system (entirely DApp-level — no smart contract needed):

```
⚠️ HAYSTACK ALERT — Production from Plaintiff
  Documents received: 12,000
  Time before cutoff: 48 hours
  Anomaly score: 18/100 (POOR — likely obfuscation tactic)
  
  Flags:
  • 73% appear to be duplicates or near-duplicates
  • Average relevance score: 0.12 (very low)
  • 89% are in a single category (internal memos)
  • Volume is 4.2x the typical production for this case type
```

Sarah's DApp generates a report documenting the anomaly. This report is stored off-chain in the DApp — it's evidence for a potential sanctions motion, but it's not something that needs a ZK proof. It's a DApp-level analysis.

---

### Chapter 8: All Steps Complete — Case-Level Attestation

**July 15, 2027 — All 47 steps are done**

Sarah's DApp dashboard shows: **47 of 47 steps complete. Full compliance.**

She clicks "Generate Case Compliance Attestation." The DApp:

1. Verifies all 47 step-level attestations exist
2. Generates phase-level attestations for each discovery phase via `compliance-proof.attestPhaseLevelCompliance()`:
   - Initial Disclosures phase: 8/8 steps ✅
   - Written Discovery phase: 12/12 steps ✅
   - Deposition phase: 10/10 steps ✅
   - Expert Discovery phase: 9/9 steps ✅
   - Pre-trial phase: 8/8 steps ✅
3. Generates the case-level attestation via `compliance-proof.attestCaseLevelCompliance()`
   - This is the "gold standard" proof — the single hash that says "everything was done"
4. Updates the case status to COMPLETED (0x02) via `discovery-core`
5. Takes a final case root snapshot via `document-registry.anchorCaseRootSnapshot()`

**The public chain now contains:**
- 47 step-level attestation hashes
- 5 phase-level attestation hashes
- 1 case-level attestation hash
- All with timestamps proving WHEN they were generated

---

### Chapter 9: The Sanctions Hearing

**August 20, 2027 — Opposing counsel moves for sanctions**

James Park files a motion claiming Sarah's team failed to produce certain medical records on time.

Sarah's attorney opens the DApp and clicks "Generate Compliance Report for Court."

The DApp produces a court-ready PDF (no blockchain terminology):

```
────────────────────────────────────────────────
   COMPLIANCE VERIFICATION REPORT
   Martinez v. Riverside Medical Center
   Case No. CV-2026-03421
   Ada County District Court
────────────────────────────────────────────────

   All 47 discovery obligations were completed
   before their respective deadlines.
   
   Verification:
   • Case compliance attestation: [hash]
   • Generated: July 15, 2027 at 2:34 PM MT
   • Scope: Full case compliance
   
   To verify this attestation independently:
   Visit verify.autodiscovery.legal
   Enter hash: [hash]
   
   Or scan: [QR CODE]

   This attestation is anchored on the Midnight
   blockchain and is mathematically irrefutable.
────────────────────────────────────────────────
```

**In court, Judge Morrison asks:** "How do I know this is legitimate?"

Sarah explains: "Your Honor, this is a zero-knowledge proof anchored on a blockchain. It mathematically proves that every discovery obligation was met before its deadline. You can verify it independently — the hash exists on-chain with a timestamp. The proof cannot be forged, backdated, or altered."

The judge's clerk enters the hash at the verification URL. The `compliance-proof.verifyAttestationExists()` circuit confirms: **true — this attestation exists, generated on July 15, 2027.**

If the court needs to know which CASE this attestation belongs to, Sarah can authorize selective disclosure via `revealAttestationCaseIdentifier()`. The court learns the case ID — but still not the deadlines, steps, or documents.

**The sanctions motion is denied.** Sarah's compliance is mathematically proven.

---

### Chapter 10: The Case Closes

**September 22, 2027 — After trial concludes**

Win or lose, Sarah's discovery record is permanently anchored:
- **53 attestation hashes** on the public chain (step + phase + case level)
- **5 production Merkle roots** sealed forever
- **2,847 document hash commitments** in the sealed Merkle tree
- **1 final case root hash** representing the entire discovery universe

If anyone — a court, an insurer, a bar association, a malpractice auditor — ever needs to verify Sarah's discovery compliance, the proofs are there. Permanent. Immutable. Mathematically irrefutable.

The actual case documents? They live on Sarah's machine and in her firm's document management system. The blockchain never saw them. It only saw their hashes. Privacy preserved. Compliance proven.

**That is AutoDiscovery.**

---

## Part 6: Quick Reference — What Lives Where

| Data | Where It Lives | Why There |
|------|---------------|-----------|
| Actual document files (PDFs, TIFFs, emails) | User's machine (DApp local storage) | Privacy — files never leave the user's control |
| Document metadata (Bates #, category, dates) | DApp database (off-chain) | Too granular for on-chain; no ZK proof needed |
| AI-extracted metadata (email entities, threads) | DApp database (off-chain) | Computation-heavy; no ZK proof needed |
| Deadline computations | DApp deadline engine (off-chain) | Complex date math; jurisdiction-specific logic |
| Role assignments (DEF/PRO/COURT/3P) | DApp database (off-chain) | Application-level access control |
| Protective order tiers | DApp database (off-chain) | Enforced at application layer |
| Expert witness credentials | DApp database (off-chain, Phase 2) | HIPAA-sensitive; deferred to Phase 2 |
| Rule pack JSON files | DApp local storage + rule-packs/ folder | Too large for on-chain; frequently updated |
| Document content hashes | Sealed ledger (immutable forever) | Mathematical proof of existence — MUST be immutable |
| Production Merkle roots | Public + Sealed ledger | Verifiable by anyone; permanent |
| Case root snapshots | Public ledger | Periodic proof of entire discovery state |
| Twin bond hashes + fidelity scores | Private state | Tamper detection for digitized documents |
| Step completion flags | Public ledger (boolean only) | Courts can verify without seeing details |
| Step deadlines | Private state | Sensitive — reveals case strategy |
| Compliance attestation hashes | Public ledger | The whole point — verifiable by courts |
| Case-to-attestation links | Private state | Only revealed via selective disclosure |
| Jurisdiction rule pack hashes | Public ledger (jurisdiction-registry) | Proves which rules were in effect |

---

*This plan is your roadmap, John. Four lean contracts, each with a clear purpose. A DApp that handles the heavy lifting. And ZK proofs that do something no other legal tech product can do — mathematically prove discovery compliance without revealing a single case detail.*

*— Penny 🎀*
