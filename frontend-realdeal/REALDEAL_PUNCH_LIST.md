# RealDeal Punch List — AutoDiscovery.legal

**Created**: Feb 21, 2026  
**Updated**: Mar 8, 2026  
**Status**: RealCaseProvider wired (Phase 1: local storage + indexer reads). Other providers still stubs.  
**Frontend**: Cloned from demoLand — UI is identical. discovery-core provider now functional for reads.

---

## Legend

- 🔴 **Blocked** — Cannot proceed until dependency is resolved
- 🟡 **Ready to start** — All prerequisites met
- 🟢 **Done**
- ⚪ **Future** — Not needed for MVP

---

## 1. Smart Contract Compilation & Deployment

### 1.1 Compile remaining contracts
| Contract | Compiled? | Circuits | Action |
|----------|-----------|----------|--------|
| `discovery-core.compact` | ✅ Compiled (0.29.0) | 4 | Ready to deploy |
| `document-registry.compact` | ✅ Compiled (0.29.0) | 7 | Ready to deploy |
| `compliance-proof.compact` | ✅ Compiled (0.29.0) | 5 | Ready to deploy |
| `jurisdiction-registry.compact` | ✅ Compiled (0.29.0) | 3 | Ready to deploy |
| `access-control.compact` | ✅ Compiled (0.29.0) | 6 | Ready to deploy |
| `expert-witness.compact` | ✅ Compiled (0.29.0) | 2 | Ready to deploy |

### 1.2 Deploy to Preprod
- [ ] 🟡 Start proof server 7.0.0: `docker run -p 6300:6300 midnightntwrk/proof-server:7.0.0`
- [ ] � Deploy `discovery-core` → get contract address
- [ ] � Deploy `document-registry` → get contract address
- [ ] � Deploy `compliance-proof` → get contract address
- [ ] � Deploy `jurisdiction-registry` → get contract address
- [ ] � Deploy `access-control` → get contract address
- [ ] � Deploy `expert-witness` → get contract address
- [ ] 🔴 Populate `.env` with all 6 contract addresses

---

## 2. Provider Wiring (Frontend ↔ Contracts)

Each provider file in `src/providers/realdeal/` needs to be connected to the corresponding contract SDK.

### 2.1 Blockchain providers (require contract SDK)
| Provider | File | Contract | Status |
|----------|------|----------|--------|
| `RealCaseProvider` | `real-case.ts` | `discovery-core` | 🟢 Phase 1 wired (reads + local writes) |
| `RealDocumentProvider` | `real-document.ts` | `document-registry` | � Phase 1 wired (reads + local writes) |
| `RealComplianceProvider` | `real-compliance.ts` | `compliance-proof` | � Phase 1 wired (reads + local attestations) |
| `RealAccessControlProvider` | `real-access-control.ts` | `access-control` | � Phase 1 wired (reads + local grants) |
| `RealJurisdictionProvider` | `real-jurisdiction.ts` | `jurisdiction-registry` | � Phase 1 wired (reads + local verify) |
| `RealExpertWitnessProvider` | `real-expert-witness.ts` | `expert-witness` | � Phase 1 wired (reads + local register) |

### 2.2 Off-chain providers (no contract needed)
| Provider | File | Backend | Status |
|----------|------|---------|--------|
| `RealAuthProvider` | `real-auth.ts` | Midnight wallet (Lace) | � Lace detection + dev mode + session persistence |
| `RealAIProvider` | `real-ai.ts` | External AI microservice | 🔴 Stub |
| `RealContactProvider` | `real-contacts.ts` | Local storage or off-chain DB | 🔴 Stub |
| `RealEmailSafetyProvider` | `real-email-safety.ts` | Email gateway service | 🔴 Stub |

---

## 3. Wallet Integration

- [ ] 🟡 Add Midnight wallet SDK dependency (`@midnight-ntwrk/wallet-api`)
- [ ] 🔴 Implement wallet connect flow in `RealAuthProvider`
- [ ] 🔴 Extract public key from wallet for on-chain identity
- [ ] 🔴 Session management: persist wallet connection across refreshes
- [ ] ⚪ Support multiple wallet types (Lace, hardware wallets)

---

## 4. Contract SDK Integration

For each compiled contract, the managed output generates a TypeScript API. These need to be:

- [ ] 🟡 Import contract APIs into `src/contracts/index.ts`
- [ ] 🔴 Create contract initialization functions (connect to deployed address)
- [ ] 🔴 Map circuit calls to provider methods:

### discovery-core circuits → RealCaseProvider
| Circuit | Provider Method | Notes |
|---------|----------------|-------|
| `createNewCase` | `createCase()` | Hash case data client-side before calling |
| `addDiscoveryStepToCase` | via `getCaseSteps()` + create | Needs step hash |
| `markDiscoveryStepAsCompleted` | UI action in case view | ZK proof generated |
| `checkCaseComplianceStatus` | `getCase()` compliance field | Read from ledger |

### document-registry circuits → RealDocumentProvider
| Circuit | Provider Method | Notes |
|---------|----------------|-------|
| `registerDocument` | `registerDocument()` | Hash anchoring + Merkle proof |
| `registerTwinBond` | via document detail view | Twin Protocol bonds |
| `recordCustodyTransfer` | `getCustodyChain()` write | Chain of custody on-chain |
| `anchorProductionMerkleRoot` | batch operation | 5-level Merkle hierarchy |
| `verifyDocumentExistsInProduction` | `verifyHash()` | ZK verification |
| `verifyTwinBondIntegrity` | `getTwinBond()` verify | Bond integrity check |

### compliance-proof circuits → RealComplianceProvider
| Circuit | Provider Method | Notes |
|---------|----------------|-------|
| `attestStepLevelCompliance` | `generateProof()` (step scope) | ZK attestation |
| `attestPhaseLevelCompliance` | `generateProof()` (phase scope) | Phase rollup |
| `attestCaseLevelCompliance` | `generateProof()` (case scope) | Full case attestation |
| `verifyAttestationExists` | `getAttestations()` verify | On-chain verification |

### access-control circuits → RealAccessControlProvider
| Circuit | Provider Method | Notes |
|---------|----------------|-------|
| `registerParticipantKey` | wallet connect flow | Auto-register on first use |
| `assignRoleForCase` | `grantAccess()` | Role: DEF/PRO/COURT/THIRDPARTY |
| `grantDocumentAccessToParticipant` | `grantAccess()` | With protective order tier |
| `revokeDocumentAccessFromParticipant` | `revokeAccess()` | On-chain revocation |
| `shareDocumentWithParticipant` | sharing event UI | Audit trail |
| `verifyParticipantAccess` | `getPermissions()` check | ZK role proof |

### jurisdiction-registry circuits → RealJurisdictionProvider
| Circuit | Provider Method | Notes |
|---------|----------------|-------|
| `registerNewJurisdiction` | admin-only | Registry admin action |
| `updateJurisdictionRulePack` | admin-only | Version bump + hash |
| `verifyRulePackHashMatchesExpected` | `verifyRulePack()` | On-chain verification |

### expert-witness circuits → RealExpertWitnessProvider
| Circuit | Provider Method | Notes |
|---------|----------------|-------|
| `registerExpertWitness` | `registerExpert()` | Privacy-preserving registration |
| `verifyExpertIsRegistered` | `getExpert()` verify | ZK credential check |

---

## 5. Off-Chain Services

### 5.1 AI Service
- [ ] 🔴 Stand up AI microservice (Python/FastAPI or Node)
- [ ] 🔴 Endpoint: `POST /synopsis` — document synopsis generation
- [ ] 🔴 Endpoint: `POST /entities` — NER extraction
- [ ] 🔴 Endpoint: `POST /obfuscation` — data dump obfuscation detection
- [ ] 🔴 Endpoint: `POST /fidelity` — scan vs digital fidelity scoring
- [ ] 🔴 Wire `RealAIProvider` to call these endpoints

### 5.2 Contact Service
- [ ] 🟡 Decide: local storage vs backend DB
- [ ] 🔴 Implement CRUD operations in `RealContactProvider`
- [ ] ⚪ Sync contacts across devices (if using backend)

### 5.3 Email Safety Service
- [ ] 🔴 Stand up email gateway or integrate with existing email API
- [ ] 🔴 Recipient analysis against case party database
- [ ] 🔴 Attachment metadata stripping
- [ ] 🔴 Tandem approval workflow with real notifications

---

## 6. UI Adjustments for RealDeal

- [ ] 🟡 Remove "Demo Mode" banner from layout (it's always real)
- [ ] 🟡 Update login page to show wallet connect instead of mock credentials
- [ ] 🟡 Add loading/error states for blockchain operations (they take time)
- [ ] 🔴 Add transaction confirmation modals for on-chain writes
- [ ] 🔴 Show actual block heights and tx hashes from real chain
- [ ] 🔴 Add tDUST balance indicator in header
- [ ] ⚪ Add network switching (preprod → mainnet)

---

## 7. Testing & QA

- [ ] 🔴 Unit tests for each real provider
- [ ] 🔴 Integration tests: provider ↔ contract SDK
- [ ] 🔴 E2E test: full case lifecycle (create → add steps → attest → verify)
- [ ] 🔴 Error handling: graceful fallback when blockchain is unavailable
- [ ] 🔴 Performance: measure ZK proof generation times
- [ ] ⚪ Load testing: concurrent users on same contract

---

## 8. DevOps & Deployment

- [ ] 🟡 Dockerfile for realdeal frontend
- [ ] 🔴 CI/CD pipeline: build + deploy on push
- [ ] 🔴 Environment-specific builds (preprod vs mainnet)
- [ ] 🔴 Proof server hosting (or use Midnight's hosted)
- [ ] ⚪ CDN for static assets
- [ ] ⚪ Monitoring & alerting

---

## Quick Start

```bash
# DemoLand (mock data, no blockchain)
cd frontend-demoland-vite-react && npm run dev    # → localhost:5173

# RealDeal (real blockchain, requires proof server + deployed contracts)
cd frontend-realdeal && npm run dev      # → localhost:5174
```

---

## Priority Order for MVP

1. ~~Compile `access-control` and `expert-witness` contracts~~ ✅ All 6 compiled (0.29.0)
2. ~~Deploy all 6 contracts to preprod~~ ✅ Deployed v2 (Feb 26 2026)
3. ~~Wire `RealCaseProvider`~~ ✅ Phase 1 (Mar 8 2026)
4. ~~Fix/create all witness implementations~~ ✅ All 6 contracts (Mar 14 2026)
5. ~~Wire all 6 blockchain providers~~ ✅ Phase 1 hybrid (Mar 14 2026)
6. ~~Wallet integration (`RealAuthProvider`)~~ ✅ Lace + dev mode (Mar 14 2026)
7. **Phase 2: Activate on-chain writes** — add @midnight-ntwrk SDK deps, wire
   findDeployedContract + callTx to each provider's write methods
8. AI service (can be deferred to post-MVP)
9. Email safety (can be deferred to post-MVP)
10. Contact provider (can be deferred to post-MVP)
