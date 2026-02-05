# AutoDiscovery - Project Overview

> **GeoOracle Auto Compliance: build once, comply everywhere.**

---

## Executive Summary

AutoDiscovery is a **Midnight-based dApp** that automates legal discovery workflows with **jurisdiction-aware compliance**. Using a GeoOracle, the platform automatically applies the correct regional legislation and procedural rules based on case location—eliminating the risk of discovery non-compliance that leads to sanctions, dismissed cases, or suppressed evidence.

---

## Problem Statement

### The Discovery Compliance Crisis

Legal discovery—the pre-trial process where parties exchange evidence—is governed by different rules in every jurisdiction:

- **Federal courts** follow the Federal Rules of Civil Procedure (FRCP)
- **Each state** has its own civil procedure rules (e.g., Idaho IRCP, Utah URCP, Washington CR)
- **Specialized courts** (bankruptcy, family, etc.) add additional layers

**Consequences of non-compliance:**
- Evidence suppression
- Case dismissal
- Sanctions against attorneys
- Malpractice liability
- Retrials and appeals

### Current Pain Points

1. **Manual jurisdiction lookup** — Attorneys must manually identify which rules apply
2. **Rule version drift** — Procedural rules change; staying current is burdensome
3. **Multi-jurisdiction cases** — Cases spanning states multiply complexity
4. **Expert witness compliance** — W-9/I-9 collection, Standard of Care (SOC) documentation
5. **No audit trail** — Difficult to prove compliance was followed

---

## Solution: AutoDiscovery

### Core Concept

AutoDiscovery provides:

1. **Automated Workflow Engine** — Step-by-step discovery process execution
2. **GeoOracle Integration** — Detects jurisdiction and loads appropriate rule sets
3. **Modular Rule Packs** — State/federal rules as pluggable modules
4. **Immutable Compliance Proofs** — Midnight ZK proofs that can be entered as factual record
5. **Selective Disclosure** — Reveal only what's required, prove the rest

### Key Taglines

- *"Discovery that knows where it is."*
- *"Automated legal discovery that adapts to location."*
- *"Remove the risks of failing to disclose or handle discovery properly with Midnight's GeoOracle—where regional compliance is baked in."*
- *"Prove compliance in an immutable fashion that can be entered as factual record."*

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
│  │  GeoOracle   │───▶│ Rule Loader  │───▶│  Workflow    │  │
│  │  (Location)  │    │ (Jurisdiction)│    │  Engine      │  │
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

| Jurisdiction | Rules | Priority | Notes |
|--------------|-------|----------|-------|
| **Idaho** | IRCP (Idaho Rules of Civil Procedure) | High | Spy's primary jurisdiction |
| **Utah** | URCP (Utah Rules of Civil Procedure) | High | Adjacent state comparison |
| **Washington** | CR (Civil Rules) | High | Pacific Northwest coverage |
| **New York** | CPLR (Civil Practice Law and Rules) | High | Major market, complex rules |
| **California** | CCP (Code of Civil Procedure) | High | Largest state market |

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

### Why GeoOracle?

**No privacy-preserving geographical oracle exists today.** AutoDiscovery + GeoOracle is a prerequisite infrastructure layer for any location-aware compliance system.

---

## Roadmap

### Phase 1: MVP (Hackathon Target)
- [ ] Basic discovery workflow contract
- [ ] Idaho jurisdiction rules (single state)
- [ ] Simple frontend with wallet connection
- [ ] Proof-of-concept compliance attestation

### Phase 2: Multi-Jurisdiction
- [ ] Utah, Washington, NYC, California rule packs
- [ ] GeoOracle prototype integration
- [ ] Jurisdiction comparison view
- [ ] Workflow forking based on location

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
**Goal:** Working MVP demonstrating GeoOracle Auto Compliance

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
| **Charli3 Oracles** | GeoOracle Infrastructure | May build the privacy-preserving geographical oracle layer |
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
