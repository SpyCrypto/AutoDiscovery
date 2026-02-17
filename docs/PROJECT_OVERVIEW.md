# AutoDiscovery - Project Overview

> **Automated discovery compliance: build once, comply everywhere.**

---

## Executive Summary

AutoDiscovery is a **Midnight-based dApp** that automates legal discovery workflows with **jurisdiction-aware compliance**. The platform uses modular jurisdiction rule packs to apply the correct regional legislation and procedural rules based on the court where the case is filed—eliminating the risk of discovery non-compliance that leads to sanctions, dismissed cases, or suppressed evidence.

With **autoDiscovery.legal**, we aim to organize and formalize a hard-coded, geographically compliant, law-based protocol that will help organize, distribute, and give proper, accurate, and secure access control to user-aggregated legal discovery. This protocol will **abstract away liability**, reduce man hours and overall costs, increase profits, and form an **immutable (existing forever) proof of compliance, custody, provenance, and access.**

---

## Problem Statement

### The Discovery Compliance Crisis

With legal discovery sanctions reaching **$8.5 million in a single case** and **6 attorneys referred to the State Bar** for discipline, discovery management in its current state is a huge problem in the US.

The legal discovery process is messy, time consuming, and varies by jurisdiction—with enormous consequences for compliance failures resulting in lost cases, unfavorable case delays, extremely expensive sanctions (fines, e.g., $$$), and **the potential of being disbarred.**

**The scale of the crisis:**

| Stat | Impact |
|------|--------|
| **$8.5M+** | Top sanction award in a single case (*Qualcomm v. Broadcom*, 2008) |
| **$704,094** | Average eDiscovery sanction amount |
| **$40,207** | Median sanction amount |
| **38,000+** | NYC cases dismissed in 2024 from discovery compliance failures |
| **50% → 25%** | NYC conviction rate drop due to discovery failures |
| **28%** | Of all legal malpractice claims stem from missed deadlines |
| **20–50%** | Of total litigation costs consumed by discovery |
| **$30B+/year** | Annual US litigation cost attributable to discovery |

In New York City alone, 38,000+ cases were dismissed in 2024 due to discovery compliance failures — and conviction rates dropped from 50% to 25%. Nationally, 28% of all legal malpractice claims stem from missed deadlines, and discovery consumes 20–50% of total litigation costs — over $30 billion a year.

Legal discovery is governed by different rules in every jurisdiction:

- **Federal courts** follow the Federal Rules of Civil Procedure (FRCP)
- **Each state** has its own civil procedure rules (e.g., Idaho IRCP, Utah URCP, Washington CR)
- **Specialized courts** (bankruptcy, family, etc.) add additional layers

### Current Pain Points

1. **Manual jurisdiction lookup** — Attorneys must manually identify which rules apply
2. **Rule version drift** — Procedural rules change; staying current is burdensome
3. **Multi-jurisdiction cases** — Cases spanning states multiply complexity
4. **Expert witness compliance** — W-9/I-9 collection, Standard of Care (SOC) documentation
5. **No audit trail** — Difficult to prove compliance was followed

---

## Solution: AutoDiscovery

### Core Concept

With **autoDiscovery.legal**, we aim to organize and formalize a **hard-coded, geographically compliant, law-based protocol** that will help organize, distribute, and give proper, accurate, and secure access control to user-aggregated legal discovery.

This protocol will **abstract away liability**, reduce man hours and overall costs, increase profits, and form an **immutable (existing forever) proof of compliance, custody, provenance, and access.** It is our hope that autoDiscovery.legal will be the **default protocol for accurate and dependable discovery/evidence management** — backed with error insurance that will protect law firms from errors and omissions.

AutoDiscovery provides:

1. **Automated Workflow Engine** — Step-by-step discovery process execution
2. **Jurisdiction Rule Packs** — Modular, per-state rules loaded at case creation based on filing court
3. **Immutable Compliance Proofs** — Midnight ZK proofs that can be entered as factual record
4. **Selective Disclosure** — Reveal only what's required, prove the rest

### Key Taglines

- *"Automated legal discovery — jurisdiction-aware by design."*
- *"Remove the risks of failing to disclose or handle discovery properly — regional compliance is baked in."*
- *"Prove compliance in an immutable fashion that can be entered as factual record."*
- *"AutoDiscovery doesn't just help you manage discovery — it mathematically proves you did it right."*

---

## Technical Architecture

### Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React + Vite + TypeScript |
| **Smart Contracts** | Compact (Midnight) |
| **Wallet** | Lace Browser Extension |
| **Hosting** | Vercel/Netlify + Custom Domain |
| **Template Base** | MeshJS/Edda Midnight Starter |

### Project Structure

```
AutoDiscovery/
├── autodiscovery-contract/     # Compact smart contracts
│   └── src/
│       ├── discovery.compact   # Main discovery workflow contract
│       ├── jurisdiction.compact # Jurisdiction rule loader
│       └── compliance.compact  # Compliance proof generation
├── autodiscovery-cli/          # CLI tools for deployment/testing
├── frontend-vite-react/        # React frontend
│   └── src/
│       ├── components/         # UI components
│       ├── hooks/              # Midnight wallet hooks
│       └── pages/              # App pages
├── docs/                       # Documentation
└── rule-packs/                 # Jurisdiction rule modules (future)
    ├── federal/
    ├── idaho/
    ├── utah/
    └── washington/
```

### Smart Contract Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AutoDiscovery Protocol                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │ Jurisdiction │───▶│ Rule Loader  │───▶│  Workflow    │  │
│  │ (Case Filed) │    │ (Rule Pack)  │    │  Engine      │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                   │                    │          │
│         ▼                   ▼                    ▼          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Compliance Proof Generator               │  │
│  │         (Midnight ZK Proofs + Selective Disclosure)   │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                │
│                            ▼                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Immutable Audit Record                   │  │
│  │         (Can be entered as factual court record)      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Target Jurisdictions

| # | Jurisdiction | Rules | Priority | Notes |
|---|--------------|-------|----------|-------|
| 1 | **Idaho** | IRCP (Idaho Rules of Civil Procedure) | High | Spy's primary jurisdiction — domain-expert validated |
| 2 | **Utah** | URCP (Utah Rules of Civil Procedure) | High | Adjacent to Idaho; unique tiered discovery system |
| 3 | **Washington** | CR (Civil Rules) | High | Pacific Northwest coverage |
| 4 | **California** | CCP (Code of Civil Procedure) | High | Largest state market |
| 5 | **New York City** | CPLR (Civil Practice Law and Rules) | High | Major market, Commercial Division complexity |
| 6 | **Ohio** | Civ.R. (Ohio Rules of Civil Procedure) | Medium | Serendipitous early research; 2020-2023 modernized rules; Grok deep dive complete |

### Workflow Mapping Strategy

1. **Create Miro flowchart** for each jurisdiction's discovery process
2. **Color-code** differences (A/B/C for ID/UT/WA)
3. **Identify decision forks** where jurisdiction rules diverge
4. **Map to smart contract** functions at each node

---

## Use Cases

### Primary: Medical Malpractice Discovery

Medical malpractice cases require:
- **Standard of Care (SOC)** expert identification
- **Expert witness W-9/I-9** collection
- **Medical records** request compliance
- **HIPAA** privacy requirements

AutoDiscovery handles jurisdiction-specific:
- Disclosure deadlines
- Expert witness designation rules
- Privilege log requirements
- E-discovery protocols

### Secondary: General Civil Litigation

- Contract disputes
- Personal injury
- Employment cases
- Real estate litigation

### Future: Specialized Courts

- Federal bankruptcy discovery (uniform rules)
- Family court proceedings
- Administrative hearings

---

## Competitive Advantage

### Why Midnight?

1. **Privacy-preserving** — Sensitive case data stays private
2. **Selective disclosure** — Reveal only what opposing counsel needs
3. **Immutable proofs** — Compliance attestations can't be altered
4. **Auditability** — Courts can verify without seeing underlying data

### Why Courts = Legitimization

Courts guard precedent fiercely. In one case, a judge refused to let a plaintiff shortcut SCRA military status verification by simply asking the defendant under oath—calling the suggestion "slippery" because it would set dangerous precedent.

**The inverse is equally powerful:** Once courts accept ZK proofs as factual record, that precedent binds all future proceedings. No industry can question what the legal system has validated.

---

## Roadmap

### Phase 1: MVP (Hackathon Target)
- [ ] Basic discovery workflow contract
- [ ] Idaho jurisdiction rules (single state)
- [ ] Simple frontend with wallet connection
- [ ] Proof-of-concept compliance attestation

### Phase 2: Multi-Jurisdiction
- [ ] Utah, Washington, NYC, California rule packs
- [ ] Jurisdiction comparison view
- [ ] Workflow forking based on filing court

### Phase 3: Production
- [ ] Full federal rules integration
- [ ] Expert witness management module
- [ ] E-discovery document handling
- [ ] Court integration APIs

---

## Team

| Member | Role | GitHub |
|--------|------|--------|
| **Spy** | Domain Expert (Retired Paralegal) | [@SpyCrypto](https://github.com/SpyCrypto) |
| **John** | Developer, Midnight Builder | [@bytewizard42i](https://github.com/bytewizard42i) |

---

## Hackathon Target

**Event:** Midnight Vegas Hackathon  
**Date:** April 2026  
**Goal:** Working MVP demonstrating automated jurisdiction-aware discovery compliance

---

## Research Needed

### Discovery Non-Compliance Case Studies

Find examples where attorneys had cases thrown out or evidence suppressed due to discovery non-compliance. These become **counter-examples** that AutoDiscovery solves:

- [ ] Failure to disclose expert witnesses on time
- [ ] Improper privilege log formatting
- [ ] Missing mandatory disclosures
- [ ] E-discovery spoliation
- [ ] Jurisdiction rule misapplication

### Jurisdiction Rule Documentation

- [ ] Idaho IRCP full text + commentary
- [ ] Utah URCP full text + commentary  
- [ ] Washington CR full text + commentary
- [ ] Federal FRCP for comparison

---

## Getting Started (Development)

```bash
# Clone the repo
git clone git@github.com:bytewizard42i/AutoDiscovery.git
cd AutoDiscovery

# Install dependencies
npm install

# Build contracts
npm run build

# Start frontend dev server
npm run dev:frontend
```

### Prerequisites

- Node.js v23+
- Docker
- Git LFS
- Compact tools (`compact check`)
- Lace wallet extension

---

## Potential Collaborators

| Partner | Role | Notes |
|---------|------|-------|
| **Charli3 Oracles** | Oracle Infrastructure | Potential data feed partner for [GeoZ](https://github.com/bytewizard42i/GeoZ_us_app_Midnight-Oracle) companion project |
| **OpenZeppelin** | Smart Contract Security | Compact contract templates and security patterns |
| **NMKR** | NFT/Token Infrastructure | Potential integration for compliance credential tokens |

---

## Resources

- [Midnight Docs](https://docs.midnight.network/)
- [MeshJS Midnight Starter](https://github.com/MeshJS/midnight-starter-template)
- [Midnight Awesome dApps](https://github.com/midnightntwrk/awesome-midnight-dapps)
- [OpenZeppelin Compact Contracts](https://github.com/OpenZeppelin/compact-contracts)
- [Charli3 Oracles](https://charli3.io/)

---

*Built with Midnight Network — Privacy meets compliance.*
