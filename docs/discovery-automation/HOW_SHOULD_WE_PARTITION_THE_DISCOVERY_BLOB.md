# How Should We Partition the Discovery Blob?

> **Date**: February 15, 2026
> **Authors**: John + Cassie
> **Branch**: `johnny5i-branch`
> **Status**: Active brainstorm — living document

---

## The Core Problem

Legal discovery is a **giant blob**. One big undifferentiated mass of data, files, and evidence passed between any side of a case — defense, prosecution/plaintiff, judge, and relevant third parties (experts, law enforcement, witnesses, etc.).

Right now, this blob is managed with spreadsheets, email threads, and prayer. The result: $8.5M sanctions, 38,000+ dismissed cases, careers ended.

**AutoDiscovery's job**: Turn the blob into a structured, tracked, auditable, jurisdiction-compliant protocol.

---

## Step 1: Universal Discovery Categories

Before we split by party, we need to define **what kinds of things** exist in the blob. These are universal — they appear in virtually every civil and criminal case regardless of jurisdiction.

### Document Categories

| # | Category | Description | Examples |
|---|----------|-------------|----------|
| 1 | **Pleadings & Motions** | Formal court filings that frame the case | Complaints, answers, motions to compel, motions in limine |
| 2 | **Interrogatories** | Written questions one party serves on another | Standard interrogatories, contention interrogatories |
| 3 | **Requests for Production (RFP)** | Demands to produce documents or things | Requests for emails, contracts, records |
| 4 | **Requests for Admission (RFA)** | Requests that a party admit/deny specific facts | "Admit that you were driving the vehicle on [date]" |
| 5 | **Depositions** | Sworn testimony taken outside of court | Transcripts, video recordings, exhibits used |
| 6 | **Subpoenas** | Court orders to third parties to produce docs or appear | Subpoena duces tecum, subpoena ad testificandum |
| 7 | **Expert Reports & Opinions** | Analysis from qualified experts | Medical opinions, forensic reports, financial analyses |
| 8 | **Physical / Forensic Evidence** | Tangible items or scientific analysis thereof | DNA results, ballistics, accident reconstruction |
| 9 | **Digital Evidence (ESI)** | Electronically Stored Information | Emails, texts, databases, metadata, social media |
| 10 | **Medical Records** | Health-related documentation | Hospital records, therapy notes, imaging |
| 11 | **Financial Records** | Money-related documentation | Bank statements, tax returns, invoices |
| 12 | **Communications** *(see enrichment below)* | Messages between parties or witnesses | Emails, letters, text messages, voicemails |
| 13 | **Photographs / Video / Audio** | Visual or audio evidence | Surveillance footage, body cam, scene photos |
| 14 | **Law Enforcement Reports** | Reports from police, investigators, agencies | Arrest reports, incident reports, forensic lab reports |
| 15 | **Witness Statements** | Accounts from percipient or character witnesses | Written statements, interview transcripts |
| 16 | **Privilege Logs** | Lists of documents withheld and the legal basis | Attorney-client privilege claims, work product |
| 17 | **Protective Orders** | Court orders restricting access to sensitive materials | Trade secrets, minor identities, sealed records |
| 18 | **Disclosure Statements** | Mandatory initial disclosures (FRCP 26(a) / state equiv.) | Witness lists, damage computations, insurance info |
| 19 | **Court Transcripts** | Official record of proceedings — hearings, trial days, conferences | Reporter transcripts, real-time feeds, daily rough drafts |
| 20 | **Court Orders & Rulings** | Written and oral directives from the judge | Scheduling orders, discovery rulings, case management orders, sanctions |
| 21 | **Jury Selection Materials** | Everything related to voir dire and jury composition | Juror questionnaires, strike lists, cause challenges, Batson challenges |
| 22 | **Jury Instructions** | Legal instructions proposed, argued, and delivered to the jury | Proposed instructions (DEF/PRO), objections, final charge to jury |
| 23 | **Jury Notes & Communications** | Notes from jury to judge during deliberation | Questions, requests to replay testimony, requests for exhibits, Allen charges |
| 24 | **Verdict Forms** | The jury's official output | General verdicts, special verdicts, special interrogatories |

### Why This Matters

Every item in the blob should be **tagged** with at least one category. This is the first axis of the partition. An untagged item is a red flag — it means someone dumped it without classification.

### Communications Enrichment — AI-Extracted Metadata

Communications (Category #12) are the highest-volume, highest-risk category in discovery. A single case can produce hundreds of thousands of emails, texts, and letters. A simple category tag isn't enough — we need **deep metadata** on every communication.

#### The Subcategory Problem

We *could* offer a dropdown of subcategories:

| Subcategory | Examples |
|-------------|----------|
| Settlement / Negotiation | Demand letters, offers, counteroffers |
| Contract / Transaction | Terms, amendments, approvals |
| Scheduling / Logistics | Meeting requests, calendar invites |
| Legal Advice (privileged?) | Attorney-client communications |
| Complaint / Dispute | Grievances, threats, escalations |
| Employment / HR | Hiring, firing, discipline, harassment |
| Financial / Billing | Invoices, payment disputes, accounting |
| Medical / Health | Treatment discussions, records requests |
| Witness Contact | Interviews, statements, follow-ups |
| Law Enforcement | Reports, requests, notifications |
| Personal / Social | Non-business communications |
| Administrative / Internal | Company memos, policy updates |
| Evidence Discussion | Discussing, referencing, or forwarding evidence |
| Case Strategy | (almost always privileged) |

**⚠️ THE RISK**: If someone tags a settlement negotiation as "Administrative / Internal" — whether by mistake or intent — it gets miscategorized in the system. Later, when opposing counsel requests "all communications related to settlement," the automated aggregation misses it. This is **exactly** the kind of error that leads to sanctions.

#### The Solution: AI Synopsis + Entity Extraction

**Don't rely on human-assigned subcategories as the primary classification.** Instead, treat them as *optional hints* and let AI do the heavy lifting automatically at intake.

Every communication entering the protocol gets an **AI-generated metadata envelope**:

```
┌─────────────────────────────────────────────────────────────┐
│            COMMUNICATION METADATA ENVELOPE                    │
│            (auto-generated at intake by protocol AI)         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Document ID:       [hash]                                   │
│  Format:            EMAIL | TEXT | LETTER | VOICEMAIL | ...   │
│  Date:              [original timestamp]                     │
│                                                               │
│  ── HUMAN-ASSIGNED (optional, supplementary) ──              │
│  Subcategory:       [dropdown selection — may be wrong]      │
│                                                               │
│  ── AI-EXTRACTED (automatic, authoritative) ──               │
│                                                               │
│  SYNOPSIS:          2-3 sentence plain-language summary      │
│                     of what this communication is about.     │
│                                                               │
│  KEY ELEMENTS:                                                │
│  • Topic(s):        [settlement, contract dispute, ...]      │
│  • Action Items:    [deadline mentioned, request made, ...]  │
│  • Sentiment:       [neutral, adversarial, cooperative, ...] │
│  • Legal Relevance: [high, medium, low, unknown]             │
│                                                               │
│  PARTIES MENTIONED:  (comprehensive — anyone named or        │
│                       referenced, even indirectly)            │
│  ┌───────────────┬──────────┬────────────────────────┐       │
│  │ Name          │ Role     │ Context                │       │
│  ├───────────────┼──────────┼────────────────────────┤       │
│  │ John Smith    │ Victim   │ Discussed throughout   │       │
│  │ Jane Doe      │ Witness  │ Referenced on page 2   │       │
│  │ Acme Corp     │ Entity   │ Defendant's employer   │       │
│  │ Det. Rodriguez│ LEO      │ Forwarded report from  │       │
│  │ Dr. Chen      │ Expert   │ Medical opinion cited  │       │
│  └───────────────┴──────────┴────────────────────────┘       │
│                                                               │
│  ENTITIES MENTIONED: (non-person references)                  │
│  • Locations:     [123 Main St, Boise ID]                    │
│  • Dates/Times:   [Jan 15 meeting, March deadline]           │
│  • Dollar Amounts: [$50,000 settlement offer]                │
│  • Case Numbers:   [CV-2025-1234]                            │
│  • Documents Ref:  ["the contract," "Exhibit B"]             │
│                                                               │
│  THREAD CONTEXT:  (if part of a chain)                        │
│  • Thread ID:     [groups related messages together]         │
│  • Position:      [3 of 7 in chain]                          │
│  • Original From: [who started the thread]                   │
│  • Summary Drift: [did the topic change mid-thread?]         │
│                                                               │
│  AI CONFIDENCE:   [0.0 — 1.0 score on extraction quality]   │
│  FLAGGED FOR HUMAN REVIEW: [yes/no — low confidence items]   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

#### How Searches Work With This

Instead of relying on a subcategory dropdown, queries hit the AI-extracted metadata:

```
QUERY: "Fetch all communications speaking to or about 
        Mr. Smith the victim"

SEARCH PROCESS:
├─ Full-text search:    "Smith" across all communications
├─ Parties Mentioned:   Name="Smith" OR Name="John Smith"
├─ Synopsis search:     semantic match for "Mr. Smith" / "victim"
├─ Entity search:       Role="Victim" across all envelopes
└─ Thread expansion:    if Smith is in message 3 of a 7-message 
                        chain, return the whole chain

RESULTS:
├─ 142 communications directly mention "Smith"
├─ 23 communications reference "the victim" (resolved to Smith)
├─ 8 communications in threads where Smith was discussed earlier
└─ 3 communications flagged: low AI confidence — human review
   recommended (e.g., "he" pronoun — likely Smith but ambiguous)
```

#### Why This Is Better Than Subcategories Alone

| Approach | Pros | Cons |
|----------|------|------|
| **Subcategory dropdown only** | Simple, fast | Miscategorization risk → missed documents → sanctions |
| **AI metadata only** | Comprehensive, searchable, hard to game | AI can hallucinate, needs confidence scoring |
| **Both (our approach)** | Human hint + AI extraction + human review flag = defense in depth | Slightly more complex at intake |

#### The Miscategorization Safety Net

If a human tags something as "Administrative" but the AI synopsis says "Discussion of $50,000 settlement offer with opposing counsel" — the system flags the **mismatch**:

```
⚠️  CATEGORIZATION MISMATCH — Doc [ID]
Human subcategory:   Administrative / Internal
AI-detected topics:  Settlement, Negotiation, Opposing Counsel
AI confidence:       0.94

Recommendation: Review subcategory assignment.
This document may be responsive to RFP #7 
(all settlement communications).
```

This catches both honest mistakes *and* intentional miscategorization (data dump obfuscation tactic #5 from Step 6). The AI doesn't replace human judgment — it backs it up and catches errors before they become sanctions.

---

## Step 2: Party Attribution — Who's Who

Every document has a **relationship** to one or more parties. The parties in a case:

```
┌──────────────┬──────────────┬──────────┬──────────────────────────────────┐
│   DEFENSE    │ PROSECUTION  │  COURT   │   THIRD PARTIES (3P)             │
│    (DEF)     │  / PLAINTIFF │ (JUDGE)  │   ┌──────────────────────────┐   │
│              │    (PRO)     │          │   │ WITNESSES                │   │
│ • Defendant  │ • Plaintiff  │ • Judge  │   │ • Expert witnesses       │   │
│ • Def atty   │ • Prosecutor │ • Clerk  │   │ • Fact/percipient        │   │
│ • Def para-  │ • Pro atty   │ • Staff  │   │ • Character witnesses    │   │
│   legal      │ • Pro para-  │          │   ├──────────────────────────┤   │
│              │   legal      │          │   │ LAW ENFORCEMENT          │   │
│              │              │          │   │ • Investigating officer  │   │
│              │              │          │   │ • Crime scene / forensic │   │
│              │              │          │   │ • Agency (FBI, ATF, etc) │   │
│              │              │          │   ├──────────────────────────┤   │
│              │              │          │   │ JURY                     │   │
│              │              │          │   │ • Seated jurors          │   │
│              │              │          │   │ • Alternates             │   │
│              │              │          │   │ • Venire (jury pool)     │   │
│              │              │          │   ├──────────────────────────┤   │
│              │              │          │   │ OTHER                    │   │
│              │              │          │   │ • Record custodians      │   │
│              │              │          │   │ • Government agencies    │   │
│              │              │          │   │ • Mediators/arbitrators  │   │
│              │              │          │   │ • Guardian ad litem      │   │
│              │              │          │   │ • Court reporters        │   │
│              │              │          │   │ • Interpreters           │   │
│              │              │          │   └──────────────────────────┘   │
└──────────────┴──────────────┴──────────┴──────────────────────────────────┘
```

Each document gets tagged with:
- **Originator**: Who created or first possessed it
- **Current Custodian(s)**: Who has it now
- **Intended Recipient(s)**: Who should receive it
- **Access Level**: Who is allowed to see it (protective orders, privilege)

---

## Step 3: Origination — "It Started Here..."

This is the anchor point. Every document enters the discovery universe at a single moment. We need to capture:

```
┌─────────────────────────────────────────────────────────────┐
│                    ORIGINATION RECORD                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Document ID:     [unique hash — content-addressable]        │
│  Category:        [from Universal Categories above]          │
│  Originating Party: DEF | PRO | COURT | 3P                  │
│  Originating Person: [name, role, bar # if attorney]         │
│  Original Format:  [PDF, DOCX, TIFF, MP4, CSV, etc.]        │
│  Date Created:     [when the document was originally made]   │
│  Date Entered Discovery: [when it entered the case]          │
│  Content Hash:     [SHA-256 of original file — immutable]    │
│  Bates Range:      [if applicable — standard legal numbering]│
│  Jurisdiction:     [which rules govern this document]        │
│  Related Request:  [which RFP/interrogatory/subpoena]        │
│                                                               │
│  ZK PROOF: "This document exists and was originated by       │
│             [party] at [timestamp] without revealing          │
│             the content to the chain."                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### The Content Hash Is Everything

> **📎 See full deep dive**: [`DEEP_DIVE_HASHING_STRATEGY.md`](./DEEP_DIVE_HASHING_STRATEGY.md)

When a document is first entered, we hash it. That hash goes on-chain via Midnight. The actual content **never** touches the blockchain — only the proof that "this document, with this hash, existed at this time, originated from this party."

If anyone later claims the document was altered, the hash proves otherwise. If someone claims they never received it, the delivery proof says otherwise.

Hashing uses a **5-level Merkle tree hierarchy**:

| Level | What | Example |
|-------|------|---------|
| **0: Raw Bytes** | SHA-256 of byte content | The atomic unit |
| **1: Page/Segment** | Hash per page, per message, or per time-segment | Page 47, email #3 in chain, minute 14 of video |
| **2: Document** | Merkle root of all pages | A 200-page deposition transcript |
| **3: Package** | Merkle root of related documents | Expert report + 5 appendices |
| **4: Production** | Merkle root of all packages in a submission | DEF's Response to RFP #3 |
| **5: Case Root** | Merkle root of all productions | The entire discovery universe — anchored on-chain |

Page-level hashing catches *which page* was tampered with, not just *that* something changed. Package-level hashing handles compound documents (expert reports + appendices, deposition transcripts + video + exhibits, email threads). Only Level 4-5 hashes go on-chain; everything below is verifiable via Merkle proof path in O(log n) steps.

---

## Step 4: Chain of Custody — Tracking the Journey

Once a document is originated, it moves. From DEF → PRO. From PRO → COURT. From 3P → both sides. We need a **transfer ledger**.

### Transfer Record

Every time a document moves from one party to another:

```
┌─────────────────────────────────────────────────────────────┐
│                     TRANSFER RECORD                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Document ID:      [hash reference to origination record]    │
│  Transfer ID:      [unique ID for this specific transfer]    │
│                                                               │
│  FROM:             [party + person]                           │
│  TO:               [party + person]                           │
│                                                               │
│  DEADLINE:         [when it was due — per rules/court order] │
│  DATE SENT:        [actual timestamp of transmission]        │
│  DATE RECEIVED:    [confirmed receipt timestamp]             │
│  METHOD:           [DApp / email / physical / courier]       │
│                                                               │
│  STATUS:           PENDING | SENT | RECEIVED | OVERDUE       │
│                                                               │
│  RECEIPT PROOF:    [ZK proof of delivery confirmation]       │
│  CONTENT MATCH:    [hash of received file == original hash?] │
│                                                               │
│  ⚠️  OVERDUE FLAG: [auto-triggers if DEADLINE < NOW          │
│                      and STATUS ≠ RECEIVED]                  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### The Two-Sided Confirmation Problem

The DApp is **most powerful** when all parties use it. Here's why:

| Scenario | Proof Strength |
|----------|---------------|
| **Both parties on DApp** | Full proof — sender confirms send, receiver confirms receipt, both timestamped on-chain |
| **Sender on DApp, receiver not** | Partial proof — we prove it was sent, but receipt is unconfirmed (like certified mail without a signature) |
| **Neither on DApp** | No proof — the status quo. Chaos. |

This is the **adoption flywheel**: once one side uses AutoDiscovery, the other side is incentivized to join because the first side now has proof and they don't.

---

## Step 5: The Memorandum System — Periodic Status Reports

At configurable intervals (daily, weekly, or triggered by events), the protocol generates a **Discovery Memorandum** — a status report for all parties.

### Memorandum Contents

```
╔══════════════════════════════════════════════════════════════╗
║            AUTODISCOVERY MEMORANDUM #[sequence]               ║
║            Case: [case identifier]                            ║
║            Generated: [timestamp]                             ║
║            Period: [start date] — [end date]                  ║
╠══════════════════════════════════════════════════════════════╣
║                                                                ║
║  ITEMS SENT THIS PERIOD:                                       ║
║  ┌──────┬────────┬──────────┬─────────┬─────────────────┐     ║
║  │ Doc# │ From   │ To       │ Sent    │ Received?       │     ║
║  ├──────┼────────┼──────────┼─────────┼─────────────────┤     ║
║  │ 0042 │ DEF    │ PRO      │ Feb 12  │ ✅ Feb 12       │     ║
║  │ 0043 │ PRO    │ DEF      │ Feb 13  │ ✅ Feb 13       │     ║
║  │ 0044 │ PRO    │ COURT    │ Feb 14  │ ⏳ Pending      │     ║
║  └──────┴────────┴──────────┴─────────┴─────────────────┘     ║
║                                                                ║
║  UPCOMING DEADLINES:                                           ║
║  ┌──────────────────────────────┬─────────┬──────────────┐    ║
║  │ Obligation                   │ Due     │ Status       │    ║
║  ├──────────────────────────────┼─────────┼──────────────┤    ║
║  │ DEF Expert Report            │ Feb 20  │ 5 days left  │    ║
║  │ PRO Supplemental Disclosure  │ Feb 25  │ 10 days left │    ║
║  └──────────────────────────────┴─────────┴──────────────┘    ║
║                                                                ║
║  ⚠️  OVERDUE ITEMS:                                            ║
║  ┌──────┬────────┬──────────┬─────────┬──────────────────┐    ║
║  │ Doc# │ From   │ To       │ Due     │ Days Overdue     │    ║
║  ├──────┼────────┼──────────┼─────────┼──────────────────┤    ║
║  │ 0039 │ DEF    │ PRO      │ Feb 05  │ 🔴 10 days      │    ║
║  └──────┴────────┴──────────┴─────────┴──────────────────┘    ║
║                                                                ║
║  ZK COMPLIANCE PROOF: [hash — verifiable on Midnight]         ║
║                                                                ║
╚══════════════════════════════════════════════════════════════╝
```

### Memorandum Triggers

- **Periodic**: Every Monday at 8am (configurable)
- **Event-driven**: When a deadline is 72/48/24 hours away
- **Overdue alert**: Immediate notification when a deadline passes with no delivery
- **On-demand**: Any party can request a current-state memorandum at any time

### On-Chain Proof

Each memorandum gets hashed and anchored to Midnight. This creates a **time-series audit trail** — "as of this date, this was the state of discovery." If a sanctions hearing happens 6 months later, there's an immutable record of who had what, when.

---

## Step 6: The Data Dump Obfuscation Problem

### The Attack

This is the big one. It's not just a technical problem — it's an adversarial strategy. Parties intentionally:

1. **Dump massive volumes** — bury relevant documents in terabytes of irrelevant ones
2. **Use obscure formats** — deliver data in proprietary or hard-to-search formats
3. **Strip metadata** — remove dates, authors, and context from files
4. **Fragment documents** — split a single document across multiple files
5. **Mislabel categories** — tag a damaging email as "administrative" instead of "communications"
6. **Deliver at the last second** — technically meet the deadline but leave no time for review

### Real-World Examples

- **Qualcomm v. Broadcom**: Withheld 46,000+ documents → $8.5M sanctions
- **State v. Kohberger**: 68 TB of disorganized data dumped on defense
- **Gem State Roofing**: Defendant claimed "routine email deletion" while withholding hundreds of pages

### Our Countermeasures

#### 1. Structured Submission Requirements

Don't accept a raw blob. Require:

```
Every submission must include:
├── manifest.json          ← Machine-readable index of all documents
│   ├── document_id
│   ├── category (from Universal Categories)
│   ├── description (human-readable)
│   ├── date_created
│   ├── date_range (if applicable)
│   ├── related_request (which RFP/interrogatory this responds to)
│   └── content_hash
├── documents/             ← The actual files
│   ├── 001_contract.pdf
│   ├── 002_email_chain.pdf
│   └── ...
└── privilege_log.json     ← What was withheld and why
```

**If a party dumps 10,000 files without a manifest, the system flags it immediately.** The receiving party gets an alert: "Unstructured submission received — [n] items without category tags."

#### 2. Volume Anomaly Detection

Track the **ratio** of documents produced vs. documents requested:

```
Normal response to "Produce all emails between X and Y 
regarding [topic] from Jan-Mar 2025":
→ 50-200 documents

Obfuscation dump:
→ 47,000 documents including every email in the company 
  for the entire year, unfiltered
```

The protocol flags statistical outliers:
- **Volume spike**: 10x+ the expected document count for a request type
- **Category imbalance**: 95% of documents are "miscellaneous" or "other"
- **Format irregularity**: Bulk delivery in non-searchable formats (TIFF images of text instead of OCR'd PDFs)
- **Metadata stripping**: Files with no author, no date, no title

#### 3. Relevance Mapping

Each RFP/interrogatory has a **scope**. The protocol can cross-reference:

```
RFP #3: "All communications between Defendant and 
         Contractor X regarding Project Y, 2024-2025"

Expected categories: Communications, Contracts
Expected date range: Jan 2024 — Dec 2025
Expected parties mentioned: Defendant, Contractor X

Red flags if submission includes:
❌ Documents from 2018 (outside date range)
❌ HR records (unrelated category)
❌ 500 pages of corporate policy manuals (relevance?)
```

#### 4. Submission Scoring

Every submission gets a **compliance score**:

| Factor | Weight | Scoring |
|--------|--------|---------|
| Manifest completeness | 25% | All fields populated? |
| Category accuracy | 20% | Categories match request scope? |
| Format searchability | 15% | OCR'd, text-searchable, standard format? |
| Volume proportionality | 15% | Reasonable count for the request? |
| Timeliness | 15% | How close to deadline? Early = better |
| Metadata integrity | 10% | Dates, authors, titles present? |

**Score < 60% = auto-flag for potential obfuscation.** The memorandum system notifies all parties and the court.

#### 5. The "Haystack Alert"

When the system detects a likely data dump attack:

```
⚠️  HAYSTACK ALERT — Case [ID], Submission from DEF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Response to RFP #3 contains 47,000 documents.
Expected range: 50-500 documents.

Anomalies detected:
• 89% of documents are uncategorized
• 12,000 files have no metadata
• Date range spans 2010-2025 (request was 2024-2025)
• 8,000 files are non-searchable TIFF images

Compliance Score: 23/100

Recommended action: Motion to compel properly 
organized production per [jurisdiction rule].

This alert has been recorded on-chain at [timestamp].
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Step 7: The Court Transcript — Daily Audit Ledger

Court transcripts are the **single most underutilized asset in discovery management**. Every hearing, every bench conference, every sidebar — the court reporter captures it. But nobody treats it as a structured data source. We should.

### Why Transcripts Matter for Discovery

1. **Oral rulings on discovery disputes** — Judges frequently rule from the bench on motions to compel, privilege disputes, and scope disagreements. These rulings often **never get formalized in a written order**. The transcript is the only record.
2. **Judicial warnings** — "Counsel, I'm telling you right now, if those documents aren't produced by Friday, I will sanction you." That's in the transcript. It proves the party was warned.
3. **Discovery commentary** — Judges make observations about discovery conduct during hearings: "I'm troubled by the volume of this production" or "Counsel, your privilege log is inadequate." This is gold for sanctions arguments later.
4. **Testimony that triggers new discovery** — A witness says something on the stand that opens a new line of inquiry. The transcript proves when the information became known.

### Daily Transcript Entry Model

```
┌─────────────────────────────────────────────────────────────┐
│               DAILY TRANSCRIPT RECORD                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Case ID:          [case identifier]                         │
│  Date:             [hearing/trial date]                      │
│  Proceeding Type:  HEARING | TRIAL DAY | CONFERENCE |        │
│                    BENCH TRIAL | SIDEBAR                     │
│  Court Reporter:   [name, certification #]                   │
│  Transcript Hash:  [SHA-256 of official transcript]          │
│                                                               │
│  TAGGED EXCERPTS:                                            │
│  ┌──────┬───────────────┬──────────────────────────────┐     │
│  │ Page │ Tag           │ Summary                      │     │
│  ├──────┼───────────────┼──────────────────────────────┤     │
│  │ 14   │ DISCOVERY_    │ Judge orders DEF to produce   │     │
│  │      │ RULING        │ emails by Feb 20              │     │
│  │ 32   │ SANCTIONS_    │ Judge warns PRO re: late      │     │
│  │      │ WARNING       │ supplemental disclosure       │     │
│  │ 47   │ JURY_         │ Court reads instruction #12   │     │
│  │      │ INSTRUCTION   │ (adverse inference)           │     │
│  │ 61   │ NEW_DISCOVERY │ Witness reveals document      │     │
│  │      │ _TRIGGER      │ not previously disclosed      │     │
│  └──────┴───────────────┴──────────────────────────────┘     │
│                                                               │
│  ZK PROOF: "Transcript [hash] entered for [date]             │
│            with [n] tagged discovery-relevant excerpts."     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Transcript Tags (Standard Set)

| Tag | What It Captures |
|-----|------------------|
| `DISCOVERY_RULING` | Judge rules on a discovery motion (oral order) |
| `DISCOVERY_COMMENTARY` | Judge comments on discovery conduct |
| `SANCTIONS_WARNING` | Judge warns a party about potential sanctions |
| `SANCTIONS_IMPOSED` | Judge imposes sanctions from the bench |
| `NEW_DISCOVERY_TRIGGER` | Testimony/evidence that opens new discovery obligations |
| `DEADLINE_SET` | Judge sets or modifies a discovery deadline orally |
| `PRIVILEGE_RULING` | Judge rules on a privilege claim |
| `JURY_INSTRUCTION` | Instruction read to jury (especially adverse inference) |
| `JURY_QUESTION` | Jury sends a note or question |
| `BENCH_CONFERENCE` | Sidebar discussion related to discovery/evidence |
| `STIPULATION` | Parties agree on something on the record |

### Daily Entry Workflow

```
End of each court day:
│
├─ Court reporter files transcript (rough or final)
│
├─ AutoDiscovery ingests transcript
│   ├─ Hash generated and anchored to Midnight
│   ├─ Paralegal/attorney tags discovery-relevant excerpts
│   └─ System auto-extracts: deadlines, rulings, warnings
│
├─ New deadlines auto-populate the obligation tracker
│
├─ Memorandum updated with that day's judicial activity
│
└─ All parties get a "Court Day Summary":
   "Today: 1 new deadline set (Feb 20), 1 sanctions warning,
    1 new discovery trigger from witness testimony."
```

This creates a **running judicial audit trail**. Six months later at a sanctions hearing, you pull up the transcript record and say: "Your Honor, on February 14th you warned opposing counsel. Here is the ZK-anchored transcript hash. On February 21st — one day past the deadline you set — they still hadn't produced. Here is the memorandum proving non-compliance."

---

## Step 8: Judge Instructions & Court Orders — The Authority Layer

Judges don't just rule on motions — they actively manage discovery through orders, scheduling conferences, and bench commentary. These are **authoritative commands** that create obligations. AutoDiscovery needs to treat them as first-class objects.

### Types of Judicial Directives

| Type | When It Happens | Discovery Impact |
|------|----------------|------------------|
| **Scheduling Order** | Early in the case | Sets all discovery deadlines — depositions, expert reports, cutoff dates |
| **Case Management Order** | Ongoing | Modifies procedures, sets conferences, addresses disputes |
| **Discovery Order** | After motion to compel | Compels production, limits scope, sets sanctions |
| **Protective Order** | When sensitive info involved | Restricts who can see what and under what conditions |
| **Sanctions Order** | After discovery abuse | Monetary fines, adverse inferences, issue preclusion, dismissal/default |
| **Oral Ruling** | At hearings/conferences | Same force as written order but ONLY in the transcript |
| **Standing Order** | Judge's general rules | Local judge-specific rules (e.g., "I require meet-and-confer before any discovery motion") |

### The Oral Ruling Problem

This is a **critical gap** in current practice. A judge says from the bench: "Defense will produce all responsive documents by the 20th or I will impose sanctions of $500 per day." That ruling has the force of law. But:

- It's not in a written order (yet, maybe never)
- It's only in the transcript
- The transcript might not be available for days
- By then, the deadline may have passed
- Parties dispute what the judge actually said

**AutoDiscovery's solution**: When a transcript excerpt is tagged `DISCOVERY_RULING` or `DEADLINE_SET`, the system:
1. Immediately creates a new obligation record
2. Starts the deadline countdown
3. Sends alerts to all parties
4. Hashes the transcript excerpt on-chain
5. Includes the ruling in the next memorandum

Now there's no "I didn't know" or "I thought the judge said the 28th, not the 20th."

### Judge Commentary Tracker

Judges often drop hints before they drop hammers. AutoDiscovery should track the **escalation pattern**:

```
╔══════════════════════════════════════════════════════════╗
║         JUDICIAL SENTIMENT TRACKER — Case [ID]            ║
╠══════════════════════════════════════════════════════════╣
║                                                            ║
║  Feb 5   [COMMENTARY]  "I expect full compliance          ║
║                         with the scheduling order."        ║
║          Severity: ● LOW                                   ║
║                                                            ║
║  Feb 10  [WARNING]     "Counsel, your production is        ║
║                         inadequate. Fix it by the 15th."   ║
║          Severity: ●● MEDIUM                               ║
║                                                            ║
║  Feb 18  [WARNING]     "If I don't see those documents     ║
║                         by Friday, there will be            ║
║                         consequences."                      ║
║          Severity: ●●● HIGH                                ║
║                                                            ║
║  Feb 22  [SANCTIONS]   "$500/day until production.         ║
║                         Adverse inference granted."         ║
║          Severity: ●●●● CRITICAL                           ║
║                                                            ║
║  PATTERN: 4-event escalation over 17 days.                 ║
║  AutoDiscovery alerts were sent at each stage.             ║
║  Receiving party acknowledged 2 of 4 alerts.               ║
║                                                            ║
╚══════════════════════════════════════════════════════════╝
```

This tracker becomes **exhibit A** at the sanctions hearing. It shows the court gave ample warning, AutoDiscovery flagged each escalation, and the non-compliant party had every opportunity to fix the problem.

---

## Step 9: Jury Materials — The Trial Layer

Discovery doesn't stop when trial starts. Jury-related materials are a critical extension of the discovery lifecycle — and they directly connect back to discovery failures.

### Jury Selection (Voir Dire)

```
┌─────────────────────────────────────────────────────────────┐
│                   VOIR DIRE RECORD                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Juror Pool:        [total venire members]                   │
│  Questionnaires:    [hash of compiled questionnaire data]    │
│                                                               │
│  For each juror:                                             │
│  ├── Juror ID (anonymized)                                   │
│  ├── Questionnaire hash                                      │
│  ├── Challenges for cause (by whom, basis, ruling)           │
│  ├── Peremptory strikes (by whom)                            │
│  ├── Batson/J.E.B. challenges (if any)                       │
│  └── Seated? [yes/no/alternate]                              │
│                                                               │
│  Final Panel:       [juror IDs of seated jury + alternates]  │
│  ZK PROOF:          "Jury selection completed [timestamp]     │
│                      with [n] jurors seated."                │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**Why this matters for discovery**: Jury questionnaire responses sometimes trigger additional discovery. A juror reveals a connection to a party or witness → potential cause challenge → need to investigate → may require supplemental disclosure.

### Jury Instructions — The Discovery Failure Endgame

This is where discovery failures become **case-deciding**. When a party destroys evidence or fails to produce:

```
DISCOVERY FAILURE ──► SANCTIONS MOTION ──► ADVERSE INFERENCE INSTRUCTION

Judge tells the jury:
"You may infer that the documents Defendant failed to produce
 would have been unfavorable to Defendant's position."
```

That instruction can **win or lose the case**. AutoDiscovery tracks the full chain:

| Step | What AutoDiscovery Captures |
|------|---------------------------|
| 1. Document was due | Obligation record with deadline |
| 2. Not produced on time | Overdue flag in memorandum |
| 3. Judge warned | Transcript tag: `SANCTIONS_WARNING` |
| 4. Still not produced | Escalation in judicial sentiment tracker |
| 5. Motion for sanctions filed | Pleading logged, category: Pleadings & Motions |
| 6. Sanctions granted | Court order logged, transcript tagged |
| 7. Adverse inference instruction | Jury instruction logged: "Proposed by [party], objected by [party], GIVEN by court" |
| 8. Verdict affected | Verdict form recorded |

The **entire chain** — from missed deadline to jury instruction — is on-chain with ZK proofs at every step. This is the most powerful proof of compliance (or non-compliance) that has ever existed in legal practice.

### Jury Instructions Tracking

```
┌─────────────────────────────────────────────────────────────┐
│               JURY INSTRUCTION RECORD                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Instruction #:    [sequence number]                         │
│  Topic:            [e.g., adverse inference, burden of       │
│                     proof, spoliation, credibility]          │
│  Proposed By:      DEF | PRO | COURT (sua sponte)            │
│  Objected By:      DEF | PRO | NONE                          │
│  Basis for Obj:    [legal basis cited]                       │
│  Court Ruling:     GIVEN | REFUSED | MODIFIED                │
│  Given As Modified: [if modified, hash of final version]     │
│  Tied to Discovery │                                         │
│    Failure?:       YES | NO                                  │
│  If YES, linked to:                                          │
│    ├── Obligation Record: [doc ID]                           │
│    ├── Memorandum:        [memo # showing non-compliance]    │
│    └── Sanctions Order:   [order ID]                         │
│                                                               │
│  ZK PROOF: "Instruction #[n] given to jury at [timestamp]"  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Jury Notes & Communications During Deliberation

During deliberation, the jury sends notes to the judge — questions, requests to re-read testimony, requests to see exhibits. These are critical:

- **"Can we see Exhibit 14 again?"** — This tells you which evidence the jury is focused on
- **"What does 'preponderance of evidence' mean?"** — Signals the jury may be struggling with burden of proof
- **"Can we hear the testimony about the missing emails?"** — Directly tied to the discovery failure

```
┌─────────────────────────────────────────────────────────────┐
│                  JURY NOTE RECORD                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Note #:          [sequence]                                 │
│  Timestamp:       [when received by court]                   │
│  Content:         [text of jury note]                        │
│  Related Exhibit: [if requesting to see evidence]            │
│  Related Witness: [if requesting testimony replay]           │
│  Court Response:  [how judge responded — read back,          │
│                    additional instruction, denied, etc.]     │
│  Transcript Page: [where the response appears]               │
│  Parties Present: [who was present for the discussion]       │
│                                                               │
│  Discovery Link:  [does this note relate to a discovery      │
│                    issue? If so, which obligation record?]   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Verdict Forms

The final output:

```
┌─────────────────────────────────────────────────────────────┐
│                   VERDICT RECORD                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Verdict Type:     GENERAL | SPECIAL | SPECIAL INTERROGATORY │
│  Verdict:          [for DEF | for PRO | split]               │
│  Damages (if any): [$amount]                                 │
│  Deliberation Time: [hours]                                  │
│  Unanimous?:       YES | NO (if jurisdiction allows)         │
│  Polling Recorded: YES | NO                                  │
│  Hash:             [SHA-256 of signed verdict form]          │
│                                                               │
│  DISCOVERY IMPACT ASSESSMENT:                                │
│  Were adverse inference instructions given?  YES | NO        │
│  Were discovery sanctions a factor?          YES | NO        │
│  Linked obligation records:                  [list]          │
│                                                               │
│  ZK PROOF: "Verdict rendered [timestamp]. Discovery          │
│            compliance chain: [full audit hash]."             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## The Full Flow — How It All Connects

```
                    THE AUTODISCOVERY PROTOCOL
                    
    ┌─────────────────────────────────────────────────┐
    │                                                   │
    │  1. ORIGINATION                                   │
    │     Document enters the system                    │
    │     → Hash generated                              │
    │     → Category assigned                           │
    │     → Originator recorded                         │
    │     → ZK proof anchored to Midnight               │
    │                                                   │
    │  2. OBLIGATION MAPPING                            │
    │     Court order / rule / agreement creates         │
    │     a deadline for production                      │
    │     → Deadline tracked                            │
    │     → Countdown begins                            │
    │     → Alerts scheduled                            │
    │                                                   │
    │  3. STRUCTURED SUBMISSION                         │
    │     Producing party uploads via protocol           │
    │     → Manifest required                           │
    │     → Category tags required                      │
    │     → Compliance score calculated                 │
    │     → Anomaly detection runs                      │
    │     → ZK proof of submission on-chain             │
    │                                                   │
    │  4. TRANSFER & RECEIPT                            │
    │     Documents move from party to party             │
    │     → Send confirmed                              │
    │     → Receipt confirmed (if both on DApp)         │
    │     → Content hash verified (unchanged?)          │
    │     → ZK proof of delivery on-chain               │
    │                                                   │
    │  5. MEMORANDUM                                    │
    │     Periodic / triggered status reports            │
    │     → Sent/received summary                       │
    │     → Upcoming deadlines                          │
    │     → Overdue alerts                              │
    │     → Compliance scores                           │
    │     → Anchored to Midnight                        │
    │                                                   │
    │  6. DAILY TRANSCRIPT ENTRY                        │
    │     Court proceedings captured daily               │
    │     → Transcript hashed and anchored              │
    │     → Discovery-relevant excerpts tagged           │
    │     → Oral rulings → new obligations auto-created │
    │     → Judge warnings tracked (escalation pattern) │
    │     → Court Day Summary to all parties             │
    │                                                   │
    │  7. JUDGE INSTRUCTIONS & ORDERS                   │
    │     Authority layer — commands that create duties  │
    │     → Written orders logged and hashed             │
    │     → Oral rulings captured from transcripts       │
    │     → Judicial sentiment tracked over time         │
    │     → Escalation pattern = sanctions evidence      │
    │                                                   │
    │  8. JURY MATERIALS                                │
    │     Trial layer — where discovery meets verdict    │
    │     → Voir dire records (anonymized)               │
    │     → Proposed/given/refused instructions logged   │
    │     → Adverse inference ↔ discovery failure linked │
    │     → Jury notes during deliberation tracked       │
    │     → Verdict recorded with discovery impact       │
    │                                                   │
    │  9. DISPUTE RESOLUTION EVIDENCE                   │
    │     When things go wrong, the proof is there       │
    │     → Immutable timeline: deadline → warning →     │
    │       sanctions → jury instruction → verdict       │
    │     → "Your Honor, here is the ZK proof..."       │
    │     → Full chain on Midnight                      │
    │                                                   │
    └─────────────────────────────────────────────────┘
```

---

## Open Questions

1. ~~**Granularity of hashing**~~ — **RESOLVED**: 5-level Merkle tree hierarchy. Page-level hashing (Level 1) up through Case Root (Level 5). Only Level 4-5 go on-chain. Full deep dive: [`DEEP_DIVE_HASHING_STRATEGY.md`](./DEEP_DIVE_HASHING_STRATEGY.md)

2. ~~**What happens when a party supplements discovery?**~~ — **RESOLVED**: Supplements create new Production entries (Level 4) that fold into the Case Root. Corrected documents preserve original hash in history. Never delete, only append. See deep dive: "Supplemental Productions" section.

3. **Format standardization** — Should AutoDiscovery enforce format requirements (e.g., all text must be OCR'd PDF)? Or just flag non-compliance?

4. **Integration with existing e-discovery tools** — Firms already use Relativity, Logikcull, etc. AutoDiscovery should layer on top, not replace their document management.

5. **Privilege disputes** — When a party claims privilege, the other side can challenge. How does AutoDiscovery handle in camera review (judge sees it, nobody else does)?

6. **Transcript turnaround time** — Official transcripts can take days/weeks. Do we ingest rough drafts same-day and update when finals arrive? How do we handle hash changes between rough and final?

7. **Jury anonymity** — Some jurisdictions use anonymous juries. How do we track voir dire without exposing juror identities? ZK is perfect here — prove selection process was followed without revealing who the jurors are.

8. **Post-trial discovery** — Discovery doesn't always end at verdict. Post-trial motions, appeals, and new trial motions can reopen discovery. The audit trail needs to survive beyond the verdict.

---

*This is a living document. We'll update as we build.*
