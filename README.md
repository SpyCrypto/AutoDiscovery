# AutoDiscovery

**A Midnight-based, geographically compliant template for attaining full and legal discovery for a variety of court applications.**

> *GeoOracle Auto Compliance: build once, comply everywhere.*

---

## Vision

AutoDiscovery automates legal discovery workflows with **jurisdiction-aware compliance**. Using a GeoOracle, it automatically applies the correct regional legislation based on case location—eliminating discovery non-compliance risks.

**Key Features:**
- **Automated Discovery Workflows** — Step-by-step process execution
- **GeoOracle Auto Compliance** — Location-aware rule application
- **Modular Jurisdiction Rules** — Plug-in legislation for Idaho, Utah, Washington
- **Immutable Compliance Proofs** — ZK proofs as factual court record
- **Selective Disclosure** — Reveal only what's required

📖 **[Full Project Overview →](./docs/PROJECT_OVERVIEW.md)**

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite + TypeScript |
| Smart Contracts | Compact (Midnight) |
| Wallet | Lace Browser Extension |
| Hosting | Vercel/Netlify + Custom Domain |

---

## Project Structure

```
├── autodiscovery-cli/        # CLI tools for deployment
├── autodiscovery-contract/   # Compact smart contracts
├── frontend-vite-react/      # React application
└── docs/                     # Documentation
```

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v23+) & npm (v11+)
- [Docker](https://docs.docker.com/get-docker/)
- [Git LFS](https://git-lfs.com/)
- [Compact Tools](https://docs.midnight.network/relnotes/compact-tools)
- [Lace Wallet](https://chromewebstore.google.com/detail/hgeekaiplokcnmakghbdfbgnlfheichg)

### Setup

```bash
# Clone
git clone git@github.com:bytewizard42i/AutoDiscovery.git
cd AutoDiscovery

# Install dependencies
npm install

# Build contracts
npm run build

# Start frontend
npm run dev:frontend
```

### Environment Variables

1. Copy `autodiscovery-cli/.env_template` → `.env`
2. Copy `frontend-vite-react/.env_template` → `.env`

---

## Team

- **Spy ([@SpyCrypto](https://github.com/SpyCrypto))** — Experienced as a complex litigation paralegal and researcher; accented with numerous published statistics reports for government agencies in Idaho, Spy brings her energy and skills to further the worlds' needs. [📄 Dossier](./docs/TEAM_SPY.md)
- **John ([@bytewizard42i](https://github.com/bytewizard42i))** — Developer, Midnight Builder

---

## Hackathon Target

**Midnight Vegas Hackathon** — April 2026

---

*Built with Midnight Network — Privacy meets compliance.*
