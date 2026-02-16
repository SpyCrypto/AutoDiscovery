# demoLand vs realDeal — Architecture Split

> **Date**: February 15, 2026 (updated with implementation status)
> **Authors**: John + Cassie
> **Branch**: `johnny5i-branch`
> **Status**: Architecture design — critical path for hackathon

---

## The Two Worlds

**demoLand**: A fully functional mock UI for demonstrations. Looks identical to the real thing, but runs on artificial data with no blockchain connection. Safe to demo anywhere, anytime, no wallet needed.

**realDeal**: The production system. Same UI, but connected to Midnight testnet/mainnet, real AI processing, real document hashing, real ZK proofs. The actual product.

```
┌─────────────────────────────────────────────────────────────┐
│                     SHARED UI LAYER                           │
│                                                               │
│  Same React components, same pages, same design system       │
│  Same user experience — you can't tell the difference        │
│                                                               │
│  ┌──────────────────────┐  ┌───────────────────────────┐     │
│  │      demoLand         │  │        realDeal            │     │
│  │                       │  │                            │     │
│  │  Mock data provider   │  │  Midnight provider         │     │
│  │  Fake documents       │  │  Real documents            │     │
│  │  Canned AI responses  │  │  Live AI processing        │     │
│  │  Simulated hashes     │  │  Real SHA-256 + Merkle     │     │
│  │  No wallet needed     │  │  Lace wallet + YubiKey     │     │
│  │  No network needed    │  │  Midnight testnet/mainnet  │     │
│  │  Instant "proofs"     │  │  Real ZK proofs            │     │
│  │                       │  │                            │     │
│  │  USE: Demos, pitches, │  │  USE: Actual legal cases,  │     │
│  │  hackathon judges,    │  │  firm deployments,         │     │
│  │  sales presentations, │  │  compliance proofs,        │     │
│  │  training             │  │  court submissions         │     │
│  └──────────────────────┘  └───────────────────────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Why This Split Matters

1. **Hackathon reliability** — Live blockchain demos break. Testnet goes down. Wallets fail to connect. demoLand gives us a bulletproof demo path.

2. **Sales enablement** — Spy can demo to attorneys on her laptop without needing a wallet, testnet connection, or explaining blockchain. It just looks like a legal tech product.

3. **Development speed** — Build UI against mock data first (fast iteration), then wire up real providers later.

4. **Training** — New users learn the interface in demoLand before touching real cases.

5. **Testing** — Deterministic mock data makes automated testing reliable. Real blockchain interactions are non-deterministic.

---

## Technical Architecture: The Provider Pattern

The key is a **provider abstraction layer**. Every service the UI needs is defined as an interface. demoLand and realDeal each implement that interface differently.

```
┌─────────────────────────────────────────────────────────────┐
│                        REACT UI                               │
│                                                               │
│   Components only talk to providers via interfaces.          │
│   They never know whether they're in demoLand or realDeal.   │
│                                                               │
│   useCase()        → ICaseProvider                           │
│   useDocuments()   → IDocumentProvider                       │
│   useCompliance()  → IComplianceProvider                     │
│   useAuth()        → IAuthProvider                           │
│   useAI()          → IAIProvider                             │
│   useSearch()      → ISearchProvider                         │
│                                                               │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    Which provider?
                           │
              ┌────────────┴────────────┐
              │                         │
     ┌────────▼────────┐      ┌────────▼─────────┐
     │  DEMOLAND        │      │  REALDEAL         │
     │  PROVIDERS       │      │  PROVIDERS        │
     ├──────────────────┤      ├──────────────────┤
     │ MockCaseProvider │      │ MidnightCase     │
     │ MockDocProvider  │      │ MidnightDoc      │
     │ MockCompliance   │      │ MidnightCompl    │
     │ MockAuth         │      │ LaceAuth +       │
     │ MockAI           │      │ YubiKeyAuth      │
     │ MockSearch       │      │ AISearch         │
     │                  │      │                  │
     │ ── DATA ──       │      │ ── CONNECTIONS ──│
     │ demo-cases.json  │      │ Midnight testnet │
     │ demo-docs.json   │      │ AI service API   │
     │ demo-parties.json│      │ Document store   │
     │ (all artificial) │      │ IPFS / local FS  │
     └──────────────────┘      └──────────────────┘
```

### The Provider Interface (example)

```typescript
// providers/types.ts — shared interface

interface ICaseProvider {
  createCase(params: CreateCaseParams): Promise<CaseResult>;
  getCase(caseId: string): Promise<Case>;
  listCases(): Promise<Case[]>;
  getComplianceStatus(caseId: string): Promise<ComplianceStatus>;
}

interface IDocumentProvider {
  registerDocument(doc: DocumentInput): Promise<DocumentRecord>;
  registerTwinBond(bond: TwinBondInput): Promise<TwinBond>;
  searchDocuments(query: SearchQuery): Promise<SearchResults>;
  getProductionRoot(productionId: string): Promise<MerkleRoot>;
  verifyDocument(docHash: string, proof: MerkleProof): Promise<boolean>;
}

interface IAuthProvider {
  connect(): Promise<AuthSession>;
  disconnect(): Promise<void>;
  getPublicKey(): Promise<string>;
  signTransaction(tx: Transaction): Promise<SignedTransaction>;
  requireYubiKey(operation: SensitiveOperation): Promise<boolean>;
}

interface IAIProvider {
  generateSynopsis(content: string): Promise<Synopsis>;
  extractEntities(content: string): Promise<EntityList>;
  scoreFidelity(imageHash: string, digitalHash: string): Promise<number>;
  detectObfuscation(production: Production): Promise<ObfuscationScore>;
}
```

### demoLand Implementation

```typescript
// providers/demoland/case-provider.ts

import demoCases from './data/demo-cases.json';

export class MockCaseProvider implements ICaseProvider {
  private cases = demoCases;

  async createCase(params: CreateCaseParams): Promise<CaseResult> {
    const newCase = {
      id: `DEMO-${Date.now()}`,
      ...params,
      status: 'active',
      complianceScore: 0.85,  // always looks good in demos
      createdAt: new Date().toISOString(),
    };
    this.cases.push(newCase);
    return { success: true, case: newCase };
  }

  async getComplianceStatus(caseId: string): Promise<ComplianceStatus> {
    // Demo always returns a nice-looking status
    return {
      overall: 'compliant',
      stepsComplete: 12,
      stepsTotal: 15,
      nextDeadline: '2026-03-15',
      daysRemaining: 28,
    };
  }
}
```

### realDeal Implementation

```typescript
// providers/realdeal/case-provider.ts

import { MidnightSDK } from '@midnight-ntwrk/midnight-js';

export class MidnightCaseProvider implements ICaseProvider {
  private sdk: MidnightSDK;
  private contract: DiscoveryCoreContract;

  async createCase(params: CreateCaseParams): Promise<CaseResult> {
    // Real Midnight transaction
    const caseIdHash = await this.contract.createCase(
      params.caseNumber,
      params.jurisdiction,
      params.caseType
    );
    return { success: true, caseIdHash };
  }

  async getComplianceStatus(caseId: string): Promise<ComplianceStatus> {
    // Real on-chain query
    const status = await this.contract.getComplianceStatus(caseId);
    return status;
  }
}
```

---

## Environment Switching

A single environment variable controls which world you're in:

```typescript
// providers/index.ts

import { MockCaseProvider, MockDocProvider, ... } from './demoland';
import { MidnightCaseProvider, MidnightDocProvider, ... } from './realdeal';

const MODE = import.meta.env.VITE_AD_MODE; // 'demoland' | 'realdeal'

export function createProviders(): Providers {
  if (MODE === 'demoland') {
    return {
      cases: new MockCaseProvider(),
      documents: new MockDocProvider(),
      compliance: new MockComplianceProvider(),
      auth: new MockAuthProvider(),
      ai: new MockAIProvider(),
      search: new MockSearchProvider(),
    };
  }

  return {
    cases: new MidnightCaseProvider(),
    documents: new MidnightDocProvider(),
    compliance: new MidnightComplianceProvider(),
    auth: new LaceAuthProvider(),
    ai: new AIServiceProvider(),
    search: new AISearchProvider(),
  };
}
```

```bash
# .env.demoland
VITE_AD_MODE=demoland

# .env.realdeal
VITE_AD_MODE=realdeal
VITE_MIDNIGHT_NETWORK=testnet
VITE_AI_SERVICE_URL=https://ai.autodiscovery.legal/api
```

### NPM Scripts

```json
{
  "scripts": {
    "dev:demo": "VITE_AD_MODE=demoland vite",
    "dev:real": "VITE_AD_MODE=realdeal vite",
    "build:demo": "VITE_AD_MODE=demoland vite build",
    "build:real": "VITE_AD_MODE=realdeal vite build",
    "preview:demo": "VITE_AD_MODE=demoland vite preview"
  }
}
```

---

## demoLand Mock Data: What It Contains

A pre-loaded fictional case with enough data to demonstrate every feature:

```
demo-data/
├── cases/
│   └── smith-v-acme.json           # One complete case
│       ├── 24 documents (one per category)
│       ├── 4 parties (DEF, PRO, COURT, 3P expert)
│       ├── 15 discovery steps (12 complete, 3 pending)
│       ├── 3 productions (DEF→PRO, PRO→DEF, 3P→both)
│       ├── 1 memorandum
│       └── 2 compliance attestations
│
├── documents/
│   ├── demo-email-chain.json       # With AI metadata envelope
│   ├── demo-medical-record.json    # With twin bond
│   ├── demo-deposition.json        # Multi-page with Merkle tree
│   ├── demo-expert-report.json     # Package (report + appendices)
│   └── ... (24 total, one per category)
│
├── ai-responses/
│   ├── synopsis-examples.json      # Canned AI synopses
│   ├── entity-extractions.json     # Pre-extracted entities
│   └── obfuscation-scores.json     # Demo scoring results
│
├── compliance/
│   ├── demo-attestation.json       # Fake ZK proof (looks real)
│   ├── demo-timeline.json          # Case timeline
│   └── demo-report.json            # Exportable compliance report
│
└── parties/
    ├── defense-team.json
    ├── prosecution-team.json
    ├── judge.json
    └── expert-witness.json
```

### The Demo Case: Smith v. Acme Corp

A fictional medical malpractice case in Idaho:
- **Plaintiff**: John Smith (patient)
- **Defendant**: Acme Medical Center + Dr. Jane Wilson
- **Jurisdiction**: Idaho (IRCP)
- **Case type**: Med-mal
- **Status**: Mid-discovery, some deadlines met, some pending
- **Demonstrates**: All 24 categories, twin bonds, AI enrichment, compliance tracking, data dump detection (one production scores high on obfuscation)

---

## UI Indicators — Which World Am I In?

demoLand should be **obvious** to prevent anyone from thinking mock data is real:

```
demoLand:
┌─────────────────────────────────────────────────────────┐
│ 🎭 DEMO MODE — Artificial Data — Not Connected to Chain │
│ AutoDiscovery.legal                         [No Wallet] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  (normal UI below — everything works, data is fake)     │
│                                                          │
└─────────────────────────────────────────────────────────┘

realDeal:
┌─────────────────────────────────────────────────────────┐
│ AutoDiscovery.legal          [🔐 Connected: addr1q...] │
│ 📍 Idaho — IRCP Active                   [Testnet 🟡]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  (normal UI — real data, real blockchain)                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Build Order

### Phase 1: demoLand First (Hackathon Focus)

1. Define provider interfaces (shared types)
2. Build all UI components against interfaces
3. Create mock providers with demo-data JSON
4. Build Smith v. Acme demo case
5. **Result**: Fully functional demo — no blockchain needed

### Phase 2: realDeal Wiring

1. Compile Compact contracts, deploy to testnet
2. Implement Midnight providers (same interfaces, real backend)
3. Wire up Lace wallet authentication
4. Connect AI service for real metadata extraction
5. **Result**: Same UI, real blockchain, real proofs

### Phase 3: Polish Both

1. Ensure feature parity (anything demoLand can do, realDeal can do)
2. Add the mode indicator banner
3. One-click deploy: `build:demo` for hackathon, `build:real` for production
4. Documentation for both modes

---

## Deployment Architecture

```
HACKATHON / DEMO:
├── Deploy demoLand build to Vercel/Netlify
├── Static site — no backend needed
├── Anyone can visit the URL and try it
├── No wallet, no signup, no blockchain
└── URL: demo.autodiscovery.legal

PRODUCTION:
├── Deploy realDeal build to Vercel/Netlify
├── Requires Lace wallet connection
├── Connected to Midnight testnet (→ mainnet later)
├── AI services running (separate backend)
├── Document storage (IPFS or encrypted cloud)
└── URL: app.autodiscovery.legal

WEBSITE (marketing):
├── Landing page explaining AutoDiscovery
├── Links to both demo and app
├── Blog, docs, pricing
└── URL: autodiscovery.legal
```

---

## Authentication Options — 3 Methods

All three methods are mock placeholders in demoLand. In realDeal, each connects to real hardware/services.

| Method | demoLand | realDeal | Key Type | Best For |
|--------|----------|----------|----------|----------|
| **Email/Password** | Simulated login → mock PK | Derived key from credentials (Argon2id) | secp256k1 derived | Attorneys unfamiliar with hardware |
| **YubiKey** | Simulated WebAuthn tap | Real FIDO2/WebAuthn ceremony | ECDSA P-256 (FIDO2) | Firm-issued security keys |
| **Trezor 5** | Simulated device connection | Trezor Connect SDK + Ed25519 signing | **Ed25519 native** | Best fit for Midnight's curve |

### Why Trezor 5?

- **Ed25519 native** — Unlike YubiKey (ECDSA P-256 only), Trezor 5 speaks the same signing curve as Midnight
- **Color touchscreen** — Transaction details visible on-device for confirmation
- **Dual-purpose** — Acts as both a crypto wallet (Midnight signing) AND a FIDO2 security key
- **USB-C** — Modern connectivity, works with laptops attorneys already carry

### Auth Flow in demoLand

```
Email:   [type creds] → 800ms delay → mock session → dashboard
YubiKey: [click]       → 1500ms "Touch your key..." → mock session → dashboard
Trezor:  [click]       → 2000ms "Confirm on device..." → mock session → dashboard
```

All three produce the same `AuthSession` object. The UI doesn't care how you authenticated.

---

## Guardrails — demoLand vs realDeal Separation Rules

> These rules prevent us from confusing the two worlds during development.

1. **Smart contract `.compact` files live ONLY in `autodiscovery-contract/src/`** — never in the frontend folder
2. **demoLand UI lives in `frontend-vite-react/src/`** with mock providers in `providers/demoland/`
3. **realDeal providers** will go in `providers/realdeal/` — same interfaces, real backends
4. **Complete demoLand UI first** → then create realDeal providers → then wire them up
5. **The "clone" is at build time**, not file duplication: `npm run dev:demo` vs `npm run dev:real`
6. **Never import Midnight SDK in demoLand providers** — if you see `@midnight-ntwrk` in a demoland file, something is wrong
7. **The MeshJS starter modules** (`modules/midnight/`) are preserved as reference for realDeal wiring — not deleted
8. **Environment files** control the mode: `.env.demoland` and `.env.realdeal`

---

## Implementation Status (Feb 15, 2026)

### ✅ Completed
- Provider type interfaces (`providers/types.ts`) — all 5 provider interfaces defined
- Mock auth provider — 3 methods (email, yubikey, trezor)
- Mock case provider — 3 demo cases with full step/deadline data
- Mock document provider — 12 documents with AI synopses, twin bonds, entity extraction
- Mock compliance provider — attestations, timeline, ZK proof generation
- Mock AI provider — synopsis, entity extraction, obfuscation detection, fidelity scoring
- React context + auth guard + provider injection
- Login page — 3 auth method selector with simulated flows
- Dashboard — case list, stats cards, compliance scores, obfuscation alerts
- Case View — 5-tab detail (Overview, Steps, Documents, Parties, Compliance)
- Sidebar layout with collapsible nav + demo mode banner
- Environment files + npm scripts (`dev:demo`, `dev:real`, `build:demo`, `build:real`)
- Dark mode default

### 🔲 Pending
- Global document search page
- Compliance reports page
- Settings page
- Document upload/register flow
- New case wizard
- realDeal providers (Phase 2)

---

## Key Principle

> **The UI should never know which world it's in.** Components call provider methods. Providers return data. Whether that data comes from a JSON file or from Midnight's blockchain is invisible to the UI layer. This is dependency injection at the architecture level.

---

*This pattern is borrowed from how game engines handle mock/test environments — same render pipeline, different data source. It also makes unit testing trivial: just test against MockProviders.*
