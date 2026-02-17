# Smart Contract Partitioning for Midnight

> **Date**: February 15, 2026
> **Authors**: John + Cassie
> **Branch**: `johnny5i-branch`
> **Status**: Architecture design — needs Spy review + Midnight MCP validation

---

## The Core Principle

**Almost everything lives in the user's private state.**

The discovery protocol handles sensitive legal documents — case details, client communications, medical records, financial data. None of this should be on a public ledger. Midnight's architecture is perfect for this because it separates:

- **Public ledger** (`export ledger`) — visible to everyone, immutable. Only hashes, timestamps, and compliance proofs go here.
- **Private ledger** (`ledger`) — visible only to the contract instance owner. Document metadata, case details, party info lives here.
- **Sealed ledger** (`sealed ledger`) — write-once, read-never after write. Useful for commitment schemes (prove you committed something without anyone — including you — being able to change what you committed).
- **Witness/local state** — lives entirely on the user's machine. Document content, AI metadata, full-text search indexes. Never touches the chain.

```
┌─────────────────────────────────────────────────────────────┐
│                  WHERE DATA LIVES                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  USER'S MACHINE (witness/local state)                        │
│  ├── Document files (images, PDFs, natives)                  │
│  ├── AI-generated metadata envelopes                         │
│  ├── Full-text search indexes                                │
│  ├── Twin Protocol bonds (image + digital files)             │
│  ├── Communication synopses and entity extractions           │
│  ├── Local encryption keys                                   │
│  └── Case working files                                      │
│                                                               │
│  PRIVATE LEDGER (on-chain, encrypted, owner-only)            │
│  ├── Document metadata records (origination, custody)        │
│  ├── Party attribution records                               │
│  ├── Deadline tracking state                                 │
│  ├── Memorandum drafts                                       │
│  ├── Case details (parties, jurisdiction, type)              │
│  └── Transfer records (who sent what to whom, when)          │
│                                                               │
│  SEALED LEDGER (on-chain, write-once commitments)            │
│  ├── Document hash commitments (can't change after commit)   │
│  ├── Timestamp commitments (prove "existed at time X")       │
│  └── Production commitments (prove "set of docs produced")   │
│                                                               │
│  PUBLIC LEDGER (on-chain, visible to all)                    │
│  ├── Case existence proof (case ID hash — no details)        │
│  ├── Compliance attestation hashes                           │
│  ├── Production Merkle roots                                 │
│  ├── Jurisdiction rule pack version hashes                   │
│  ├── Memorandum submission proofs                            │
│  └── Timestamp anchors (periodic case root hashes)           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Contract Architecture — 6 Contracts

The BUILD_PLAN.md defined 4 contracts. The discovery protocol design adds 2 more. Here's the full set:

```
┌─────────────────────────────────────────────────────────────┐
│               AUTODISCOVERY CONTRACT SUITE                    │
│                                                               │
│  ┌───────────────────┐   ┌───────────────────┐              │
│  │  discovery-core   │   │  jurisdiction-     │              │
│  │     .compact      │   │  registry.compact  │              │
│  │                   │   │                    │              │
│  │ Case lifecycle    │   │ Rule storage &     │              │
│  │ Step tracking     │   │ version anchoring  │              │
│  │ Deadline mgmt     │   │                    │              │
│  └────────┬──────────┘   └────────┬───────────┘              │
│           │                       │                          │
│  ┌────────▼──────────┐   ┌───────▼────────────┐             │
│  │  compliance-proof │   │  document-registry  │  ◄── NEW   │
│  │     .compact      │   │     .compact        │             │
│  │                   │   │                     │             │
│  │ ZK attestations   │   │ Hash anchoring      │             │
│  │ Step/phase/case   │   │ Production roots    │             │
│  │ compliance proofs │   │ Twin bonds          │             │
│  └───────────────────┘   │ Chain of custody    │             │
│                          └─────────────────────┘             │
│  ┌───────────────────┐   ┌─────────────────────┐            │
│  │  access-control   │   │  expert-witness     │            │
│  │     .compact      │◄──│     .compact        │            │
│  │                   │NEW│                     │            │
│  │ Role-based access │   │ Phase 2: med-mal    │            │
│  │ Party permissions │   │ specific features   │            │
│  │ Sharing protocol  │   │                     │            │
│  │ YubiKey/key mgmt  │   │                     │            │
│  └───────────────────┘   └─────────────────────┘            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### New: `document-registry.compact`

This is the workhorse contract for the discovery protocol. It manages:

- **Hash anchoring** — Merkle roots for productions and case state
- **Twin bonds** — linking image + digital file hashes
- **Chain of custody** — transfer records between parties
- **Production tracking** — which documents were produced, when, to whom

### New: `access-control.compact`

Manages who can see what. Handles:

- **Role-based permissions** — DEF, PRO, COURT, 3P roles with different access levels
- **Sharing protocol** — when discovery is "shared," specific documents become visible to specific parties via ZK disclosure
- **Key management** — public key registration, YubiKey integration hooks
- **Protective order tiers** — Confidential, AEO, Sealed

---

## Contract-by-Contract Design

### 1. `discovery-core.compact` — Case Lifecycle

**What's public**: Case count, case existence (hash), compliance status flags
**What's private**: Case details, parties, deadlines, step statuses
**What's sealed**: Nothing (case state needs to be updateable)

```
PUBLIC (export ledger):
├── caseCount: Counter                              (how many cases exist)
├── caseStatuses: Map<Bytes<32>, Uint<8>>           (caseIdHash → status enum)
├── stepCompletionFlags: Map<Bytes<32>, Boolean>    (stepHash → completed?)
└── attestationAnchors: Set<Bytes<32>>              (compliance proof hashes)

PRIVATE (ledger):
├── caseOwners: Map<Bytes<32>, Bytes<32>>           (caseIdHash → owner pubkey)
├── caseJurisdictions: Map<Bytes<32>, Bytes<8>>     (caseIdHash → jurisdiction)
├── caseTypes: Map<Bytes<32>, Uint<8>>              (caseIdHash → case type enum)
├── stepDeadlines: Map<Bytes<32>, Field>            (stepHash → deadline timestamp)
├── stepStatuses: Map<Bytes<32>, Uint<8>>           (stepHash → detailed status)
└── memoHashes: Map<Bytes<32>, Bytes<32>>           (caseIdHash → latest memo hash)

WITNESS (user's machine):
├── private$secret_key(): Bytes<32>                 (user's signing key)
├── computeCaseIdHash(...): Bytes<32>               (hash case number + jurisdiction)
├── computeStepHash(...): Bytes<32>                 (hash case + rule reference)
├── getCurrentTimestamp(): Field                    (current time)
└── getCaseDetails(...): Field                      (full case data — never leaves machine)

CIRCUITS:
├── createCase(caseNumber, jurisdiction, caseType)  → Bytes<32>  (returns caseIdHash)
├── addStep(caseIdHash, ruleRef, deadline)          → Bytes<32>  (returns stepHash)
├── completeStep(caseIdHash, stepHash)              → []
├── updateDeadline(caseIdHash, stepHash, newDeadline, reason) → []
├── getComplianceStatus(caseIdHash)                 → Boolean
└── submitMemo(caseIdHash, memoHash)                → []
```

### 2. `document-registry.compact` — Document & Production Tracking (NEW)

**What's public**: Production Merkle roots, case root anchors, document count
**What's private**: Document metadata, twin bonds, custody records
**What's sealed**: Original hash commitments (can't be changed after submission)

```
PUBLIC (export ledger):
├── productionCount: Counter                        (total productions across all cases)
├── productionRoots: Map<Bytes<32>, Bytes<32>>      (productionId → Merkle root)
├── caseRoots: Map<Bytes<32>, Bytes<32>>            (caseIdHash → latest case root)
├── caseRootTimestamps: Map<Bytes<32>, Field>       (caseIdHash → last anchor time)
└── documentCount: Counter                          (total documents registered)

SEALED (sealed ledger):
├── hashCommitments: MerkleTree<20, Bytes<32>>      (document hashes — immutable once committed)
└── productionCommitments: Set<Bytes<32>>            (production root + timestamp — can't change)

PRIVATE (ledger):
├── docMetadata: Map<Bytes<32>, Field>              (docHash → metadata reference)
├── docCategories: Map<Bytes<32>, Uint<8>>          (docHash → category enum 1-24)
├── docOriginators: Map<Bytes<32>, Bytes<32>>       (docHash → originator pubkey)
├── twinBonds: Map<Bytes<32>, Bytes<32>>            (imageHash → digitalHash)
├── bondFidelity: Map<Bytes<32>, Uint<8>>           (bondHash → fidelity score 0-100)
├── custodyChain: Map<Bytes<32>, Field>             (docHash → latest transfer ref)
└── productionDocs: Map<Bytes<32>, Field>           (productionId → doc list ref)

WITNESS (user's machine):
├── private$secret_key(): Bytes<32>
├── computeDocHash(content: Bytes<32>): Bytes<32>   (SHA-256 of document content)
├── computeBondHash(imgHash, digHash): Bytes<32>    (twin bond hash)
├── buildMerkleRoot(docHashes: Field): Bytes<32>    (compute Merkle root off-chain)
├── getDocumentContent(...): Field                  (full doc data — never leaves machine)
└── getTransferDetails(...): Field                  (custody transfer details)

CIRCUITS:
├── registerDocument(docHash, category, originatorPk)        → Bytes<32>
├── registerTwinBond(imageHash, digitalHash, fidelityScore)  → Bytes<32>
├── recordTransfer(docHash, fromPk, toPk, timestamp)         → []
├── anchorProductionRoot(productionId, merkleRoot)            → []
├── anchorCaseRoot(caseIdHash, caseRoot)                      → []
├── verifyDocInProduction(docHash, productionId, merkleProof) → Boolean
└── verifyTwinIntegrity(bondHash, imageHash, digitalHash)     → Boolean
```

**Key insight**: `MerkleTree<20, Bytes<32>>` is a native Compact type — it can hold up to 2²⁰ (~1 million) hash commitments. This is our sealed commitment store. Once a document hash is inserted, it **cannot be modified or removed**. This is the mathematical proof of "this document existed at this time."

### 3. `access-control.compact` — Roles & Permissions (NEW)

**What's public**: Role commitments (Merkle tree of authorized pubkeys per role)
**What's private**: Actual role assignments, sharing records
**What's sealed**: Key registration commitments

```
PUBLIC (export ledger):
├── roleCommitments: MerkleTree<10, Bytes<32>>      (pubkey commitments per role)
├── shareCount: Counter                             (total sharing events)
└── shareProofs: Set<Bytes<32>>                     (proof that sharing occurred)

SEALED (sealed ledger):
├── keyRegistrations: Set<Bytes<32>>                (registered key hashes — immutable)
└── permissionGrants: Set<Bytes<32>>                (permission grant commitments)

PRIVATE (ledger):
├── roleAssignments: Map<Bytes<32>, Uint<8>>        (pubkeyHash → role enum)
├── caseParties: Map<Bytes<32>, Field>              (caseIdHash → party list ref)
├── documentPermissions: Map<Bytes<32>, Field>      (docHash → permitted pubkeys ref)
└── protectiveOrderTier: Map<Bytes<32>, Uint<8>>    (docHash → tier enum)

WITNESS (user's machine):
├── private$secret_key(): Bytes<32>
├── local_secret_key(): Bytes<32>                   (for key derivation)
├── getKeyFromHardware(): Bytes<32>                 (YubiKey integration point)
└── context$roleCommitments$path_of(pk): Maybe<MerkleTreePath<10, Bytes<32>>>

CIRCUITS:
├── registerKey(pubkeyHash, role)                   → []
├── assignRole(caseIdHash, pubkeyHash, role)        → []
├── grantDocumentAccess(docHash, recipientPk, tier) → []
├── revokeDocumentAccess(docHash, recipientPk)      → []
├── proveRole(caseIdHash, role)                     → Boolean  (ZK: prove you have role X)
├── shareDocument(docHash, recipientPk)             → Bytes<32> (sharing proof)
└── verifyAccess(docHash, requesterPk)              → Boolean
```

### 4. `compliance-proof.compact` — ZK Attestations (existing)

Unchanged from BUILD_PLAN.md. Generates and verifies compliance proofs.

### 5. `jurisdiction-registry.compact` — Rule Storage (existing)

Unchanged from BUILD_PLAN.md. Manages jurisdiction rule pack hashes and versions.

### 6. `expert-witness.compact` — Phase 2 (existing)

Deferred. Med-mal specific features.

---

## The Sharing Protocol — When Private Becomes Shared

The whole point of discovery is **sharing** documents between parties. Here's how private state becomes selectively visible:

```
SCENARIO: DEF produces 500 documents to PRO in response to RFP #3

1. DEF has 500 documents in their PRIVATE ledger + local state
   (document files, metadata, AI envelopes — all private)

2. DEF builds a Production:
   ├── Computes Merkle root of all 500 doc hashes
   ├── Creates a Transfer Record for each document
   ├── Anchors Production Root to PUBLIC ledger
   └── Anchors each doc hash in SEALED commitments

3. DEF "shares" with PRO:
   ├── Off-chain: Encrypted document files sent to PRO
   │   (via AutoDiscovery protocol — NOT on the blockchain)
   ├── On-chain: access-control.compact grants PRO access
   │   to verify these specific documents against the
   │   Production Root
   ├── PRO receives documents + can independently verify
   │   each document's hash against the public Merkle root
   └── ZK proof generated: "500 documents produced on [date]
       by [DEF] to [PRO] in response to [RFP #3]"

4. Neither party can later deny:
   ├── DEF: "We produced these 500 documents" (Production Root is public)
   ├── PRO: "We received them" (Transfer Record exists)
   └── Either: "The documents were different" (sealed hash commitments)
```

**The actual document files travel off-chain** — encrypted, direct transfer between parties via the AutoDiscovery application layer. The blockchain only carries the proof that the transfer happened and the integrity hashes.

---

## What Happens During a Search Query

When someone queries "Find all communications about Mr. Smith":

```
QUERY FLOW:
│
├── 1. ENTIRELY LOCAL (user's machine)
│   ├── AI metadata search across Communication envelopes
│   ├── Full-text search across digital twins
│   ├── Entity extraction results for "Smith"
│   └── Thread expansion for related chains
│   
│   Result: 142 documents identified locally
│
├── 2. VERIFY AGAINST ON-CHAIN (optional, for compliance proof)
│   ├── Each doc's hash verified against sealed commitments
│   ├── Production membership verified via Merkle proof
│   └── Chain of custody confirmed via transfer records
│
└── 3. GENERATE ZK PROOF (if needed for court)
    └── compliance-proof.compact: "These 142 documents
        matching query 'communications about Mr. Smith'
        are all present in Productions #1-4 and were
        produced to opposing counsel on [dates]."
```

The search is **fast and local**. Blockchain only gets involved when you need to *prove* something.

---

## Data Flow Summary

```
┌──────────────────────────────────────────────────────────────┐
│                                                                │
│  PHYSICAL      SCAN/OCR        AI PROCESSING       LOCAL DB   │
│  DOCUMENT ───► TWIN PAIR ───► METADATA ENVELOPE ──► INDEXED  │
│                   │                   │                │       │
│                   │                   │                │       │
│               HASH BOTH          STORE LOCAL      SEARCHABLE  │
│               TWINS              (witness state)  (witness)   │
│                   │                                   │       │
│                   ▼                                   │       │
│           ┌───────────────┐                          │       │
│           │ document-     │                          │       │
│           │ registry      │◄─────────────────────────┘       │
│           │ .compact      │  register doc + twin bond        │
│           └───────┬───────┘                                   │
│                   │                                           │
│           ┌───────▼───────┐  ┌──────────────┐                │
│           │ SEALED:       │  │ access-      │                │
│           │ hash committed│  │ control      │                │
│           │ (immutable)   │  │ .compact     │                │
│           └───────┬───────┘  └──────┬───────┘                │
│                   │                 │                         │
│           ┌───────▼─────────────────▼───┐                    │
│           │ PRODUCTION EVENT            │                    │
│           │ ├── Build Merkle root       │                    │
│           │ ├── Anchor to public ledger │                    │
│           │ ├── Grant access to party   │                    │
│           │ └── Transfer docs off-chain │                    │
│           └───────┬─────────────────────┘                    │
│                   │                                           │
│           ┌───────▼───────┐                                   │
│           │ compliance-   │                                   │
│           │ proof.compact │                                   │
│           │               │                                   │
│           │ ZK proof:     │                                   │
│           │ "Compliant"   │                                   │
│           └───────────────┘                                   │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

---

## Open Questions for Spy / Midnight Team

1. **MerkleTree<20, Bytes<32>> capacity** — Is 2²⁰ entries sufficient for large cases? Some cases have millions of pages. May need MerkleTree<25> or split across multiple trees.

2. **Sealed ledger for hash commitments** — Sealed means write-once. Can we still *read* sealed values for verification, or only prove membership? Need to confirm Compact semantics.

3. **Off-chain document transfer** — What's the best encrypted transport layer? IPFS + encryption? Direct P2P? AutoDiscovery server relay?

4. **Cross-contract calls** — Can `compliance-proof.compact` read from `document-registry.compact`'s public state? Or do we need to pass values through witnesses?

5. **Gas/transaction costs** — Anchoring a Production Root is one transaction. But registering 500 individual documents might be 500 transactions. Batch operations?

---

*This document extends BUILD_PLAN.md Phase 1 with discovery-specific contract design. The original 4-contract architecture becomes 6 contracts.*
