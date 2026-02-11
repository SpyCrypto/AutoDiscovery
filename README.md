<div align="center">
  <img src="./media/brand/logo-full-color.svg" alt="AutoDiscovery" width="400"/>
  
  <h3>Build Once. Comply Everywhere.</h3>
  
  <p><strong>A cutting-edge, geographically compliant legal discovery platform powered by Midnight Network</strong></p>
  
  <p>
    <a href="#why-autodiscovery">Why AutoDiscovery?</a> •
    <a href="#features">Features</a> •
    <a href="#quick-start">Quick Start</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="./docs/PROJECT_OVERVIEW.md">Documentation</a> •
    <a href="#team">Team</a>
  </p>
  
  <img src="https://img.shields.io/badge/Hackathon-Midnight_Vegas_2026-1A2B4A?style=for-the-badge" alt="Hackathon"/>
  <img src="https://img.shields.io/badge/Powered_by-Midnight_Network-2E5C8A?style=for-the-badge" alt="Midnight"/>
</div>

---

## 🎯 Why AutoDiscovery?

Legal discovery—the pre-trial process where parties exchange evidence—is governed by **different rules in every jurisdiction**. A discovery request compliant in Idaho may be **completely invalid** in California or federal court.

### The Problem

- **Manual jurisdiction lookup** — Attorneys must research which rules apply
- **Rule version drift** — Procedural rules change; staying current is burdensome
- **Multi-jurisdiction cases** — Cases spanning states multiply complexity exponentially
- **No audit trail** — Difficult to prove compliance was followed correctly

### The Consequences

❌ Evidence suppression  
❌ Case dismissal  
❌ Attorney sanctions  
❌ Malpractice liability  
❌ Costly retrials and appeals

### The AutoDiscovery Solution

✅ **Automated compliance** — GeoOracle detects jurisdiction and applies correct rules  
✅ **Always current** — Rule packs update automatically with legislative changes  
✅ **Immutable proofs** — Zero-knowledge proofs provide court-admissible audit trail  
✅ **Multi-jurisdiction support** — Seamlessly handle cases spanning multiple regions  
✅ **Selective disclosure** — Reveal only what's required, protect the rest

---

## ✨ Features

### 🌍 **GeoOracle Auto Compliance**
Automatically detects case jurisdiction and loads appropriate procedural rules (FRCP, state-specific IRCP, URCP, etc.). No manual rule selection required.

### 📋 **Automated Discovery Workflows**
Step-by-step guided process execution ensures all required documentation, disclosures, and expert witness compliance (W-9/I-9, SOC) are properly handled.

### 🔌 **Modular Jurisdiction Rules**
Pre-configured rule packs for Idaho, Utah, Washington, New York, California, and federal courts. Easily extensible for additional jurisdictions.

### 🔒 **Immutable Compliance Proofs**
Zero-knowledge proofs on Midnight Network create tamper-proof audit trails that can be entered as factual court record.

### 🎯 **Selective Disclosure**
Privacy-preserving architecture allows you to prove compliance without revealing sensitive case details unnecessarily.

### 🚀 **Modern Tech Stack**
Built on cutting-edge technology: React + TypeScript frontend, Midnight Network smart contracts, Compact language for compliance logic.

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React + Vite + TypeScript | Modern, fast UI with type safety |
| **Smart Contracts** | Compact (Midnight) | Privacy-preserving compliance logic |
| **Blockchain** | Midnight Network | Zero-knowledge proof infrastructure |
| **Wallet** | Lace Browser Extension | Secure wallet integration |
| **Design System** | Tailwind CSS + Custom Tokens | Branded, consistent UI components |
| **Hosting** | Vercel/Netlify | Fast, reliable deployment |

---

## 📁 Project Structure

```
AutoDiscovery/
├── autodiscovery-cli/              # CLI tools for deployment
├── autodiscovery-contract/         # Compact smart contracts
│   └── src/rule-packs/            # Jurisdiction rule definitions
├── frontend-vite-react/            # React application
│   ├── src/
│   │   ├── components/
│   │   │   └── autodiscovery/    # Branded UI components
│   │   └── design-system/        # Design tokens & theme
│   └── public/
├── docs/                           # Documentation
│   ├── BRAND_GUIDELINES.md        # Brand identity guide
│   └── PROJECT_OVERVIEW.md        # Detailed project docs
└── media/brand/                    # Logo assets
```

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v23+) & npm (v11+)
- [Docker](https://docs.docker.com/get-docker/)
- [Git LFS](https://git-lfs.com/)
- [Compact Tools](https://docs.midnight.network/relnotes/compact-tools)
- [Lace Wallet](https://chromewebstore.google.com/detail/hgeekaiplokcnmakghbdfbgnlfheichg)

### Setup

```bash
# Clone the repository
git clone git@github.com:SpyCrypto/AutoDiscovery.git
cd AutoDiscovery

# Install dependencies
npm install

# Build smart contracts
npm run build

# Start frontend development server
npm run dev:frontend
```

### Environment Variables

1. **Backend:** Copy `autodiscovery-cli/.env_template` → `autodiscovery-cli/.env`
2. **Frontend:** Copy `frontend-vite-react/.env_template` → `frontend-vite-react/.env`

### First-Time Setup

After installing, you'll need to:

1. **Install Lace Wallet** browser extension
2. **Connect wallet** to Midnight Network
3. **Configure jurisdiction** for your test cases
4. **Load rule packs** for your target jurisdictions

📖 **[Full setup guide →](./docs/PROJECT_OVERVIEW.md)**

---

## 🎨 Design System

AutoDiscovery features a comprehensive design system with:

- **Brand Colors** — Deep Navy, Legal Blue, Oracle Gold
- **Typography** — IBM Plex Serif (headings), Inter (UI), JetBrains Mono (code)
- **UI Components** — BrandedButton, ComplianceBadge, JurisdictionBanner, CaseCard, and more
- **Design Tokens** — Centralized color, spacing, and typography constants

```typescript
// Use branded components in your app
import { BrandedButton, ComplianceBadge } from '@/components/autodiscovery';

<BrandedButton variant="primary">Submit Discovery Request</BrandedButton>
<ComplianceBadge status="compliant" />
```

📖 **[Brand Guidelines →](./docs/BRAND_GUIDELINES.md)**  
📖 **[Design System Docs →](./frontend-vite-react/src/design-system/README.md)**

---

## 👥 Team

### **Spy** — Legal & Compliance Lead
[@SpyCrypto](https://github.com/SpyCrypto)

Experienced complex litigation paralegal and researcher with numerous published statistics reports for government agencies in Idaho. Brings deep expertise in legal discovery processes, court procedures, and compliance requirements.

**Role:** Legal domain expert, compliance validation, rule pack design  
📄 **[Full Dossier →](./docs/TEAM_SPY.md)**

### **John** — Technical Lead & Developer
[@bytewizard42i](https://github.com/bytewizard42i)

Developer and Midnight Network builder with expertise in blockchain, smart contracts, and privacy-preserving technologies.

**Role:** Architecture, Compact contract development, frontend engineering

---

## 🏆 Hackathon

**Target:** Midnight Vegas Hackathon — April 2026

AutoDiscovery demonstrates how Midnight Network's privacy-preserving infrastructure can revolutionize legal compliance by combining:

- Zero-knowledge proofs for audit trails
- Geographic oracle integration for jurisdiction detection
- Modular smart contracts for extensible rule systems
- Modern UI/UX for legal professionals

---

## 📚 Documentation

- **[Project Overview](./docs/PROJECT_OVERVIEW.md)** — Comprehensive technical documentation
- **[Brand Guidelines](./docs/BRAND_GUIDELINES.md)** — Visual identity and design system
- **[Build Plan](./docs/BUILD_PLAN.md)** — Development roadmap and milestones
- **[UI Design Notes](./docs/UI_DESIGN_NOTES.md)** — Interface design decisions

---

## 🤝 Contributing

We welcome contributions! Please see our contribution guidelines (coming soon) for details on:

- Code style and conventions
- Testing requirements
- Pull request process
- Adding new jurisdiction rule packs

---

## 📄 License & Legal

### Software License

[License information to be added]

### Legal Disclaimer

**AutoDiscovery is a compliance assistance tool.** Users remain responsible for ensuring all discovery submissions comply with applicable court rules and regulations. This platform does not constitute legal advice. Always consult with licensed attorneys for legal matters.

### Privacy

All case data is processed using zero-knowledge proofs on Midnight Network. Personal information is selectively disclosed only as required by court rules. For details, see our [Privacy Policy](./docs/PRIVACY.md) (coming soon).

---

<div align="center">
  <img src="./media/brand/logo-geooracle.svg" alt="GeoOracle" width="300"/>
  
  <p><strong>GeoOracle Auto Compliance Engine</strong></p>
  <p>Intelligent jurisdiction detection and rule application</p>
  
  <hr/>
  
  <p>
    <strong>AutoDiscovery</strong> — Build Once. Comply Everywhere.<br/>
    Built with ❤️ using <strong>Midnight Network</strong><br/>
    Privacy meets compliance.
  </p>
  
  <p>
    <small>© 2026 AutoDiscovery • Powered by Midnight Network</small>
  </p>
</div>

