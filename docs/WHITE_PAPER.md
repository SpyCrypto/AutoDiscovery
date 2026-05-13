# autoDiscovery.legal — White Paper

**Version:** 1.0 Draft  
**Date:** February 20, 2026  
**Authors:** Spy ([@SpyCrypto](https://github.com/SpyCrypto)) · John ([@bytewizard42i](https://github.com/bytewizard42i))  
**Repository:** [SpyCrypto/AutoDiscovery](https://github.com/SpyCrypto/AutoDiscovery)  
**License:** Proprietary — Copyright 2026 AutoDiscovery Team. All rights reserved.

---

> *"AutoDiscovery doesn't just help you manage discovery — it mathematically proves you did it right."*

---

## Table of Contents

1. [Abstract](#1-abstract)
2. [Introduction & Problem Statement](#2-introduction--problem-statement)
3. [Market Analysis](#3-market-analysis)
4. [The autoDiscovery.legal Solution](#4-the-autodiscoverylegal-solution)
5. [System Architecture](#5-system-architecture)
6. [The 9-Step Discovery Protocol](#6-the-9-step-discovery-protocol)
7. [GeoOracle Auto Compliance — The Jurisdiction Engine](#7-geooracle-auto-compliance--the-jurisdiction-engine)
8. [Zero-Knowledge Proof Infrastructure](#8-zero-knowledge-proof-infrastructure)
9. [Smart Contract Suite](#9-smart-contract-suite)
10. [Intelligent Safeguards](#10-intelligent-safeguards)
11. [Security Model](#11-security-model)
12. [Technology Stack](#12-technology-stack)
13. [Roadmap & Phased Delivery](#13-roadmap--phased-delivery)
14. [Use Cases](#14-use-cases)
15. [Competitive Landscape](#15-competitive-landscape)
16. [Team](#16-team)
17. [Conclusion](#17-conclusion)
18. [Glossary](#18-glossary)

---

## 1. Abstract

Legal discovery — the pre-trial process by which parties exchange evidence — is one of the most failure-prone, expensive, and jurisdiction-specific processes in the American legal system. Non-compliance results in sanctions reaching $8.5 million in a single case, 38,000+ case dismissals in New York City alone in 2024, and discovery consuming 20–50% of total litigation costs nationally — over $30 billion per year.

**autoDiscovery.legal** is a Midnight-based decentralized application (dApp) that transforms legal discovery from a manual, error-prone process into a mathematically provable, geographically compliant, automated workflow. Built on the Midnight Network's dual-ledger architecture with zero-knowledge proof (ZKP) capabilities, autoDiscovery.legal delivers:

- **Jurisdiction Rule Packs** that auto-apply the correct procedural law at case creation
- A **9-Step Discovery Protocol** covering 24 universal document categories
- **Immutable, court-admissible compliance attestations** without exposing underlying case data
- A **GeoOracle Auto Compliance** engine: *build once, comply everywhere*

autoDiscovery.legal is not merely a document management tool. It is a cryptographically enforced compliance protocol that abstracts away jurisdictional liability, provides mathematically provable chain-of-custody records, and positions itself to become the default infrastructure layer for legal discovery in the United States — and eventually, globally.

---

## 2. Introduction & Problem Statement

### 2.1 The Discovery Compliance Crisis

Legal discovery is the pre-trial process by which parties to litigation exchange information and evidence. It is governed by a patchwork of federal, state, and specialized court rules that differ significantly across jurisdictions. Attorneys and paralegals must manually track which rules apply to each case, stay current with procedural amendments, and ensure every deadline, disclosure, and format requirement is met — or face severe consequences.

The current state of legal discovery is characterized by five systemic failures:

| Failure Mode | Description |
|---|---|
| **Manual Jurisdiction Lookup** | Attorneys must individually research applicable rules for each filing court |
| **Rule Version Drift** | Procedural rules change; no automated mechanism exists to flag stale compliance knowledge |
| **Multi-Jurisdiction Complexity** | Cases spanning states multiply the burden exponentially |
| **Absent Audit Trails** | No cryptographic or immutable record proves compliance was actually followed |
| **Expert Witness Compliance Gaps** | W-9/I-9 collection, Standard of Care documentation, and qualification attestation are handled ad hoc |

### 2.2 The Stakes: By the Numbers

The cost of discovery failure is not theoretical — it is measurable and catastrophic:

| Metric | Value |
|---|---|
| Top single-case sanction | **$8.5 million+** |
| Average sanction (nationally) | **$704,094** |
| NYC case dismissals in 2024 | **38,000+** |
| Drop in conviction rate (NYC, 2024) | **50% → 25%** |
| Malpractice claims from missed deadlines | **28%** |
| Annual national litigation cost from discovery | **$30 billion+** |
| Discovery as % of total litigation costs | **20–50%** |

> In New York City alone, 38,000+ cases were dismissed in 2024 due to discovery compliance failures, and conviction rates dropped by half. Six attorneys were referred to the State Bar for discipline in a single case.

### 2.3 Why Existing Solutions Fall Short

Current legal technology (legaltech) products address document storage and workflow, but none solve the fundamental problem: **provable, jurisdiction-aware, cryptographically enforced compliance**. Existing tools are:

- **Not jurisdiction-aware by default** — rules must be manually configured
- **Centralized and mutable** — compliance records can be altered or deleted
- **Disclosure-agnostic** — no mechanism to selectively prove compliance without revealing privileged data
- **Not court-admissible by design** — no path to using compliance records as factual evidence

autoDiscovery.legal solves all four of these gaps simultaneously.

---

## 3. Market Analysis

### 3.1 Addressable Market

The U.S. legal market represents one of the largest professional services sectors in the world, with total revenues exceeding $350 billion annually. Within it, legal discovery is a disproportionate cost center:

- **$30B+/year** in discovery-related litigation costs
- **28%** of legal malpractice claims are discovery-deadline-related
- Every mid-size to large law firm in the country is a potential customer

### 3.2 Primary Customer Segments

| Segment | Pain | autoDiscovery.legal Value |
|---|---|---|
| **Civil Litigation Law Firms** | Manual discovery management, jurisdiction errors | Automated compliance, ZK proof records |
| **Public Defenders & DA Offices** | Resource-constrained, high volume | Cost reduction, automation |
| **Corporate Legal Departments** | Multi-jurisdiction exposure, discovery spend | Centralized, compliant discovery management |
| **Paralegal Services** | Liability exposure, manual processes | Error abstraction, provable chain-of-custody |
| **Court Systems** | Verification burden, case dismissal volume | Cryptographically verifiable submissions |
| **Legal Malpractice Insurers** | Claim frequency from discovery failures | Risk reduction, compliance attestation |

### 3.3 Go-To-Market Strategy

autoDiscovery.legal targets initial adoption in the Pacific Northwest and Mountain West — where domain expertise is deepest — before expanding to major markets (California, New York) and ultimately the full U.S. federal system. The modular jurisdiction rule pack architecture means new states and circuits can be added without any core code changes, enabling rapid geographic expansion.

---

## 4. The autoDiscovery.legal Solution

### 4.1 Core Premise

autoDiscovery.legal formalizes a **hard-coded, geographically compliant, law-based protocol** that organizes, distributes, and secures legal discovery. The system:

1. **Abstracts away liability** — compliance is enforced by protocol, not by individual diligence
2. **Reduces man-hours and costs** — automated workflows replace manual tracking
3. **Creates immutable proof** — of compliance, custody, provenance, and access — that exists forever on-chain
4. **Protects law firms** — through error insurance backed by mathematically verifiable records

### 4.2 The GeoOracle Compliance Engine

The heart of autoDiscovery.legal is the **GeoOracle Auto Compliance** engine — a privacy-preserving geolocation oracle built on the Midnight Network. When a new case is created, GeoOracle automatically:

- Identifies the filing court's jurisdiction
- Loads the appropriate procedural rule pack (IRCP, URCP, CR, FRCP, CPLR, CCP, Civ.R., etc.)
- Applies jurisdiction-specific deadlines, disclosure requirements, and format rules
- Flags multi-jurisdiction cases and applies layered rule sets

**Build once, comply everywhere.** Adding a new jurisdiction requires no core code changes — only a new rule pack module.

### 4.3 Key Value Propositions

| Value Proposition | Mechanism |
|---|---|
| **Jurisdiction-Aware by Default** | GeoOracle rule packs auto-applied at case creation |
| **Mathematically Proven Compliance** | ZK attestations on the Midnight public ledger |
| **Privacy-First** | Sensitive data never leaves the private ledger or local machine |
| **Selective Disclosure** | Reveal only what is legally required; prove the rest cryptographically |
| **Immutable Chain of Custody** | Every document action is permanently recorded |
| **Email Safety** | Multi-tier threat classification prevents accidental disclosure |
| **Error Insurance Pathway** | ZK proof records enable insurance product integration |

---

## 5. System Architecture

autoDiscovery.legal is built on a three-tier ledger architecture, native to the Midnight Network, with an additional local processing layer:

```
┌──────────────────────────────────────────────────────────────────────┐
│                        USER'S MACHINE                                │
│  Local state: documents, AI metadata, search indexes, encryption     │
├──────────────────────────────────────────────────────────────────────┤
│                     PRIVATE LEDGER (on-chain, encrypted)             │
│  Document metadata · Party records · Deadlines · Case details        │
├──────────────────────────────────────────────────────────────────────┤
│                   PUBLIC LEDGER (on-chain, immutable)                │
│  Compliance proof hashes · Timestamps · Production Merkle roots      │
├──────────────────────────────────────────────────────────────────────┤
│                    SEALED LEDGER (write-once)                        │
│  Commitment schemes · Pre-disclosure freezes                         │
└──────────────────────────────────────────────────────────────────────┘
```

### 5.1 Layer Descriptions

**Local Machine Layer**  
Documents, AI-extracted metadata, full-text search indexes, and encryption keys never leave the user's machine. This is the foundation of the privacy-first architecture — no cloud server ever holds raw case data.

**Private Ledger (On-Chain, Encrypted)**  
Document metadata, party records, deadlines, and case details are stored in Midnight's encrypted private ledger. Only authorized parties with the correct keys can read this data. The blockchain guarantees immutability without sacrificing confidentiality.

**Public Ledger (On-Chain, Immutable)**  
Compliance proof hashes, timestamps, and production Merkle roots are published to the public ledger. These are verifiable by any party — including courts — without revealing the underlying documents. This is the layer that makes compliance attestations court-admissible as factual record.

**Sealed Ledger (Write-Once)**  
Pre-disclosure commitment schemes and document freezes are recorded here. This prevents retroactive manipulation of what was known and when.

### 5.2 Monorepo Structure

```
AutoDiscovery/
├── frontend-vite-react/           # React 19 + Vite 6 + TypeScript 5 application
│   ├── src/
│   │   ├── components/            # Reusable UI (email safety dialog, etc.)
│   │   ├── layouts/               # App shell, sidebar, navigation
│   │   ├── pages/                 # Dashboard, case view, contacts, login
│   │   ├── providers/             # Provider pattern (auth, cases, docs, AI, contacts, email safety)
│   │   │   └── demoland/          # Mock providers for demo environment
│   │   └── lib/                   # Utilities
│   └── public/
├── autodiscovery-contract/        # Compact smart contracts & TypeScript types
│   └── src/types/                 # Strongly-typed data model (6 entities)
├── autodiscovery-cli/             # CLI tools for deployment & operations
├── docs/                          # 20+ comprehensive design and protocol documents
│   ├── discovery-automation/      # 9-step discovery protocol deep dives
│   └── reference/                 # Jurisdiction research archives
├── media/                         # Brand assets
└── turbo.json                     # Turborepo monorepo configuration
```

---

## 6. The 9-Step Discovery Protocol
autoDiscovery.legal implements a universal, structured discovery workflow. Every case — regardless of jurisdiction — passes through the same 9-step framework, with jurisdiction-specific rules applied at each relevant step.

| Step | Name | Description |
|---|---|---|
| **1** | **Document Categorization** | 24 universal document categories; AI-assisted metadata extraction and classification |
| **2** | **Party Attribution** | Full party mapping: Plaintiff, Defendant, Witnesses, Law Enforcement Officers (LEO), Jury, and Third Parties |
| **3** | **Origination & Hashing** | 5-level Merkle tree hashing from page level to case root; Twin Protocol for physical-digital document pairing |
| **4** | **Chain of Custody** | Every document action (creation, access, transfer, production) is permanently recorded |
| **5** | **Memorandum System** | Structured internal communications tied to specific documents and case events |
| **6** | **Data Dump Obfuscation** | Tools to manage and respond to opposing counsel's voluminous data productions without revealing strategy |
| **7** | **Court Transcripts** | Daily audit integration with transcript management |
| **8** | **Judge Instructions** | Automated tracking and management of all judicial orders and standing instructions |
| **9** | **Jury Materials** | Compliant jury instruction preparation and tracking |

### 6.1 The 24 Document Categories

The protocol recognizes 24 universal document categories applicable across all jurisdictions and case types. These categories, combined with AI-assisted metadata extraction, ensure every document is correctly classified, attributed, and tracked from ingestion to production.

### 6.2 The Twin Protocol

For cases involving physical documents that have been digitized, the **Twin Protocol** creates a cryptographic bond between the physical original and its digital representation. A fidelity score is computed using visual feature detection, and the bond hash is recorded on-chain. This ensures that neither the physical nor digital version can be substituted or altered without detection.

### 6.3 5-Level Merkle Tree Hashing

Document integrity is guaranteed through a 5-level Merkle tree:

```
Case Root Hash
└── Production Bundle Hash
    └── Document Hash
        └── Page-Level Hash
            └── Content Block Hash
```

This structure supports redaction versioning, format changes, supplements, audio/video segments, and compound documents — all while maintaining a complete, verifiable integrity chain from individual content blocks up to the case root.

---

## 7. GeoOracle Auto Compliance — The Jurisdiction Engine

### 7.1 Overview
GeoOracle is a privacy-preserving geolocation oracle integrated with autoDiscovery.legal as a companion infrastructure layer (see: [GeoZ Oracle](https://github.com/bytewizard42i/GeoZ_us_app_Midnight-Oracle)). It determines the applicable jurisdiction at case creation and loads the corresponding rule pack — all without revealing the case's geographic details to unauthorized parties.

### 7.2 Supported Jurisdictions (Phase 1)

| Priority | Jurisdiction | Rules | Notes |
|---|---|---|---|
| 1 | **Idaho** | IRCP (Idaho Rules of Civil Procedure) | Primary domain expertise |
| 2 | **Utah** | URCP (Utah Rules of Civil Procedure) | Adjacent state |
| 3 | **Washington** | CR (Civil Rules) | Pacific Northwest coverage |
| 4 | **California** | CCP (Code of Civil Procedure) | Largest state market |
| 5 | **New York City** | CPLR (Civil Practice Law and Rules) | Major market; site of 38,000+ 2024 dismissals |
| 6 | **Ohio** | Civ.R. | Included via serendipitous research |

> Federal rules (FRCP) serve as the baseline comparison across all jurisdictions.

### 7.3 Rule Pack Architecture
Jurisdiction rule packs are modular TypeScript modules that encode:
- Mandatory disclosure deadlines and calculation methods
- Required document formats and privilege log specifications
- Expert witness designation rules and timelines
- E-discovery protocols and metadata requirements
- Court-specific standing orders and local rules

**Adding a new jurisdiction requires no changes to core protocol code** — only the addition of a new rule pack module. This is the foundation of the "build once, comply everywhere" guarantee.

---

## 8. Zero-Knowledge Proof Infrastructure
### 8.1 Why Zero-Knowledge Proofs for Legal Discovery?
Legal discovery presents a unique cryptographic challenge: parties must prove they have complied with disclosure obligations without necessarily revealing the content of every document. ZK proofs are the only technology capable of satisfying this requirement. 
autoDiscovery.legal uses Midnight's native ZK proof capabilities (built on the Compact smart contract language) to generate compliance attestations that:
- **Prove** that a specific document was produced on a specific date
- **Prove** that all mandatory disclosures for a given jurisdiction were completed
- **Prove** that an expert witness meets qualification requirements
- **Prove** that a document's chain of custody is unbroken

...all without revealing the underlying documents, case strategy, or privileged information.

### 8.2 Selective Disclosure
The selective disclosure model allows parties to reveal only what is legally required:
- A party can prove they produced all responsive documents in a category without revealing which specific documents were produced
- A party can prove an expert witness is qualified without revealing the expert's identity until required
- A party can prove compliance with a deadline without revealing what was submitted

### 8.3 Court Precedent Pathway
Courts guard precedent fiercely. Once a ZK proof is accepted as factual record by a court, that precedent binds future proceedings. autoDiscovery.legal is designed with this pathway in mind: every ZK attestation is formatted for court submission, and the system is architected to support the legal system's eventual adoption of ZK proofs as standard evidence.

> Once courts accept ZK proofs as factual record, that precedent binds all future proceedings. No industry can question what the legal system has validated.

---

## 9. Smart Contract Suite
autoDiscovery.legal is implemented as a suite of six Compact smart contracts on the Midnight Network, each responsible for a distinct domain of the discovery process:

| Contract | Ledger Layer | Purpose |
|---|---|---|
| **discovery-core** | Private + Public | Case lifecycle management, discovery step tracking, obligation fulfillment recording |
| **jurisdiction-registry** | Private | Modular rule pack storage, jurisdiction identification, rule version management |
| **compliance-proof** | Public | ZK attestation generation, verification, and publication as court-admissible record |
| **document-registry** | Private + Public | Production tracking, Merkle tree management, Twin Protocol bond registration |
| **access-control** | Private | YubiKey-based hardware authentication, role-gated permissions, team access management |
| **expert-witness** | Private | W-9/I-9 workflow management, qualification attestation, Standard of Care documentation |

### 9.1 State Partitioning

| State Type | What Lives Here | Who Can Read |
|---|---|---|
| **Local (off-chain)** | Raw documents, AI metadata, search indexes | User only |
| **Private (on-chain, encrypted)** | Document metadata, party records, deadlines, case details | Authorized parties with keys |
| **Public (on-chain, immutable)** | Compliance proof hashes, timestamps, Merkle roots | Anyone — including courts |
| **Sealed (write-once)** | Commitment schemes, pre-disclosure freezes | Authorized parties; immutable |

---

## 10. Intelligent Safeguards
### 10.1 Email Safety Protocol
One of autoDiscovery.legal's most distinctive features is its **Email Safety Protocol** — a multi-layered protection system that prevents one of the most damaging and common attorney errors: accidental disclosure of privileged information to the wrong party.

| Threat Level | Trigger Condition | Enforced Action |
|:---:|---|---|
| **SAFE** | All recipients are confirmed team members | Standard send |
| **CAUTION** | Court staff, unknown, or unverified recipients | Content review prompt |
| **DANGER** | Opposing counsel or their affiliated team | Mandatory attachment review + tandem approval recommended |
| **CRITICAL** | Judge, magistrate, or tribunal | Tandem approval **REQUIRED** — minimum 2 independent approvers |

**Additional email safety features:**
- **Recipient auto-detection** against the case contacts database, with real-time threat level calculation
- **Attachment metadata scanning** for EXIF data, tracked changes, and hidden PDF layers before send
- **Image preview** — every attached image is previewed before send to prevent accidental file attachment
- **Tandem approval workflow** — configurable N-of-M approval requirement for sensitive communications

### 10.2 Case Contact Management
A sophisticated contact management system organized around the case, not the firm:
- **Team-based organization** with role-aware visual cues
- **Star precedence ratings** for priority contacts
- **Connected-contact highlighting** to surface relationships between parties
- **Drag-and-drop reorder** for workflow customization
- Integration with the Email Safety threat-level engine

### 10.3 YubiKey Access Control
Hardware-key-based authentication provides three modes of access control:
1. **Document-level access** — specific documents require YubiKey presence to open
2. **Action-level gating** — sensitive actions (production, disclosure, tandem approval) require hardware key confirmation
3. **Role elevation** — temporary privilege escalation for time-limited sensitive operations

---

## 11. Security Model
### 11.1 Privacy-First by Architecture
- Raw case documents **never leave the user's machine** — the system operates on hashes and metadata
- The private ledger is encrypted at rest and in transit; only parties with the correct Lace wallet keys can decrypt
- The public ledger contains only proof hashes — cryptographically useful but legally non-revealing

### 11.2 Immutability Guarantees
- All public ledger entries are write-once and permanent
- Sealed ledger entries cannot be modified by any party, including the system operators
- Merkle tree structure ensures any document tampering is immediately detectable

### 11.3 Hardware Authentication
YubiKey integration ensures that sensitive operations cannot be performed by stolen credentials alone — physical possession of the hardware key is required.

### 11.4 DemoLand vs. RealDeal Architecture
The system maintains a strict separation between the demo environment (DemoLand) — which uses mock providers and synthetic data — and the production environment (RealDeal) — which connects to real Midnight Network contracts and real Lace wallet keys. This separation is enforced at the provider layer in the React application, preventing accidental mixing of demo and production state.

---

## 12. Technology Stack
| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | React 19 · Vite 6 · TypeScript 5 · Tailwind CSS 4 | Glass-morphism UI with jurisdiction comparatives |
| **UI Components** | shadcn/ui · Lucide Icons | Accessible, themeable component library |
| **Smart Contracts** | Compact (Midnight) | Privacy-preserving ZK smart contracts |
| **Blockchain** | Midnight Network | Dual-ledger (public + private) with native ZK proofs |
| **Wallet** | Lace Browser Extension | User key management and transaction signing |
| **Build System** | Turborepo · npm workspaces | Monorepo orchestration across 3 packages |
| **Hosting** | Vercel / Netlify | Frontend deployment |
| **Hardware Auth** | YubiKey | Hardware-gated access control |
| **Companion Oracle** | GeoZ (GeoZ.us / GeoZ.app) | Privacy-preserving geolocation on Midnight |

---

## 13. Roadmap & Phased Delivery
### Phase 1 — MVP (Hackathon Target: Midnight Vegas, April 2026)
- [ ] Core discovery workflow smart contract (`discovery-core`)
- [ ] Idaho jurisdiction rule pack (IRCP)
- [ ] React frontend with Lace wallet integration
- [ ] Proof-of-concept ZK compliance attestation
- [ ] Email Safety Protocol (SAFE / DANGER / CRITICAL levels)
- [ ] Basic case contact management
- [ ] DemoLand mode for live demonstrations
### Phase 2 — Multi-Jurisdiction Expansion
- [ ] Utah (URCP), Washington (CR), California (CCP), New York City (CPLR), Ohio (Civ.R.) rule packs
- [ ] Jurisdiction comparison view in the UI
- [ ] Workflow forking based on filing court
- [ ] Full Email Safety tandem approval workflow
- [ ] YubiKey access control (all 3 modes)
- [ ] Expert witness management module
### Phase 3 — Production Infrastructure
- [ ] Full federal (FRCP) rules integration
- [ ] E-discovery document handling with metadata pipeline
- [ ] Court integration APIs for direct submission
- [ ] Legal malpractice insurance product integration
- [ ] Error insurance underwriting API
- [ ] Additional jurisdiction rule packs (all 50 states)
### Phase 4 — Ecosystem & Scale
- [ ] Rule pack marketplace for third-party jurisdiction contributions
- [ ] Court system API partnerships
- [ ] International jurisdiction modules
- [ ] AutoDiscovery Protocol as an open standard

---

## 14. Use Cases
### 14.1 Medical Malpractice Discovery
Medical malpractice cases have among the most complex discovery requirements, involving:
- Standard of Care (SOC) expert identification and qualification
- Expert witness W-9/I-9 tax and immigration documentation
- HIPAA-compliant medical records requests
- Jurisdiction-specific disclosure deadlines (which vary significantly by state)

autoDiscovery.legal handles all of these natively, with automated HIPAA compliance checks, jurisdiction-specific expert witness disclosure timelines, and ZK-attested qualification records.
### 14.2 General Civil Litigation
- Contract disputes
- Personal injury
- Employment cases
- Real estate litigation

Any civil litigation matter with discovery obligations can use autoDiscovery.legal's universal 9-step protocol, with jurisdiction rules applied automatically at case creation.
### 14.3 High-Stakes Multi-Party Litigation
For cases with multiple parties, multiple jurisdictions, or both, autoDiscovery.legal's layered rule pack architecture and selective disclosure engine provide the only scalable compliance path.
### 14.4 Future: Specialized Courts
- Federal bankruptcy discovery (uniform federal rules)
- Family court proceedings
- Administrative hearings and regulatory discovery

---

## 15. Competitive Landscape
| Competitor Category | What They Do | What They Miss |
|---|---|---|
| **Document Management (NetDocuments, iManage)** | Store and organize legal documents | No jurisdiction awareness; no ZK compliance proofs; mutable records |
| **eDiscovery Platforms (Relativity, Everlaw)** | Electronic discovery review and production | No automated jurisdiction compliance; centralized and mutable |
| **Practice Management (Clio, MyCase)** | Case and matter management | No discovery protocol enforcement; no cryptographic compliance |
| **AI Legal Tools (Harvey, Luminance)** | Document review and summarization | No compliance enforcement; no immutable records; no chain-of-custody |

**autoDiscovery.legal's unique position:** The only platform that combines jurisdiction-aware automation, cryptographically enforced compliance, immutable chain-of-custody, and court-admissible ZK proof attestations in a single, privacy-first system.
---

## 16. Team
### Spy — Domain Expert & Legal Discovery Specialist
**[@SpyCrypto](https://github.com/SpyCrypto)**

20 years of complex litigation paralegal experience. Published statistical reports for Idaho government agencies. Deep jurisdiction expertise across Idaho, Utah, and Washington. The legal domain knowledge backbone of autoDiscovery.legal — every protocol rule, deadline, and workflow reflects real-world experience at the front lines of discovery compliance.

### John — Developer, Midnight Builder & Architect
**[@bytewizard42i](https://github.com/bytewizard42i)**

Full-stack development, smart contract architecture on the Midnight Network, ZK protocol design, and the vision behind privacy-first legal technology. Author of the GeoZ Oracle companion project and the technical architect of the entire autoDiscovery.legal system.
---

## 17. Conclusion
Legal discovery is broken. The consequences — dismissed cases, career-ending sanctions, billions in waste — are not edge cases. They are the everyday reality of a system that has never had a cryptographically enforced, jurisdiction-aware compliance layer.

autoDiscovery.legal changes that. By combining the Midnight Network's unique privacy-preserving dual-ledger architecture with domain-expert-encoded jurisdiction rule packs and a mathematically rigorous 9-step discovery protocol, autoDiscovery.legal delivers something that has never existed before: **proof that you did discovery right**.

For law firms, the value is clear: abstracted liability, reduced costs, and immutable evidence that compliance was followed. For courts, the value is equally compelling: verifiable, tamper-proof submission records that reduce administrative burden and eliminate dismissals caused by documentation failures. For the legal system as a whole, autoDiscovery.legal offers the path to a future where discovery compliance is a solved problem — enforced by protocol, proven by mathematics, and recorded forever.

**Build once. Comply everywhere.**

---

## 18. Glossary
| Term | Definition |
|---|---|
| **Chain of Custody** | The documented, unbroken sequence of possession and handling of evidence from origin to court |
| **Compact** | The smart contract language of the Midnight Network, designed for ZK-native contract execution |
| **CCP** | California Code of Civil Procedure — the rules governing civil discovery in California state courts |
| **CPLR** | Civil Practice Law and Rules — New York's procedural code governing discovery |
| **CR** | Civil Rules — Washington State's rules of civil procedure |
| **dApp** | Decentralized Application — a software application that runs on a blockchain network |
| **E-Discovery** | Electronic discovery — the process of identifying, collecting, and producing electronically stored information |
| **FRCP** | Federal Rules of Civil Procedure — the rules governing civil discovery in all U.S. federal courts |
| **GeoOracle** | The privacy-preserving geolocation oracle used by autoDiscovery.legal to identify jurisdiction at case creation |
| **HIPAA** | Health Insurance Portability and Accountability Act — federal privacy rules for medical information |
| **IRCP** | Idaho Rules of Civil Procedure |
| **Lace** | The browser-extension wallet used by Midnight Network applications for key management and transaction signing |
| **Merkle Tree** | A cryptographic data structure where every node is a hash of its child nodes, enabling efficient and secure content verification |
| **Midnight Network** | The privacy-preserving blockchain platform on which autoDiscovery.legal is built, featuring a dual-ledger (public + private) architecture with native ZK proof support |
| **Rule Pack** | A modular, jurisdiction-specific configuration module that encodes all procedural discovery rules for a given court system |
| **Selective Disclosure** | The ability to cryptographically prove a claim (e.g., "this document was produced on time") without revealing the underlying data |
| **Spoliation** | The destruction, alteration, or failure to preserve evidence relevant to litigation — a serious discovery violation |
| **Twin Protocol** | autoDiscovery.legal's mechanism for cryptographically bonding physical document originals to their digital representations |
| **URCP** | Utah Rules of Civil Procedure |
| **YubiKey** | A hardware security key device used by autoDiscovery.legal for multi-factor, hardware-gated authentication |
| **ZK Proof / ZKP** | Zero-Knowledge Proof — a cryptographic method by which one party can prove to another that a statement is true without revealing any information beyond the truth of the statement itself |

---

*© 2026 AutoDiscovery Team. All rights reserved.*  
*autoDiscovery.legal — Privacy meets compliance. Built on [Midnight Network](https://midnight.network).*