# PreProd Dapp Review — AutoDiscovery realDeal

<div align="center">

**Date:** 2026-03-26 · **Scope:** full preprod readiness audit · **Branch:** `copilot/preprod-review-dapp-repo`

</div>

---

## Executive Summary

AutoDiscovery's `frontend-realdeal` layer is **Phase 1 complete with Phase 2 blockchain writes deferred**.
All local-storage read paths work correctly; on-chain write operations require completing the wallet/provider integration outlined in the roadmap below.
The project is **not ready for PreProd deployment** without addressing the critical blockers in §10.

| Layer | Phase 1 | Phase 2 | Overall |
|---|---|---|---|
| Provider read paths | ✅ | — | Functional |
| Provider write paths | ⚠️ (local only) | ❌ blocked | Stubs |
| Chain reader (indexer) | ⚠️ (mock data) | ❌ blocked | Skeleton |
| Witness implementations | ✅ | ✅ | Complete |
| Off-chain services (AI / email / contacts) | ❌ | ❌ | Complete stubs |
| Infrastructure (.env, assets) | ❌ | — | Not configured |

---

## 1. Provider Architecture

| Provider | Phase 1 | Phase 2 | Notes |
|---|---|---|---|
| `real-case.ts` | ✅ | ❌ | Reads work; `createCase()` circuit call commented out |
| `real-auth.ts` | ⚠️ | ❌ | Dev mode works; Lace `coinPublicKey` extraction now hardened (this PR) |
| `real-document.ts` | ✅ | ❌ | Reads work; `registerDocument()` circuit call commented out |
| `real-compliance.ts` | ✅ | ❌ | Score works; `attestStepLevelCompliance()` circuit call commented out |
| `real-access-control.ts` | ✅ | ❌ | Reads work; grant/revoke circuit calls commented out |
| `real-jurisdiction.ts` | ⚠️ | ❌ | Reads work; false-positive "verified on-chain" message fixed (this PR) |
| `real-expert-witness.ts` | ✅ | ❌ | Reads work; `registerExpertWitness()` circuit call commented out |
| `real-ai.ts` | ❌ | ❌ | Complete stub — all methods throw |
| `real-contacts.ts` | ❌ | ❌ | Complete stub — all methods throw |
| `real-email-safety.ts` | ❌ | ❌ | Complete stub — all methods throw |

---

## 2. Witness Implementations

All 6 witness modules in `autodiscovery-contract/src/witnesses/` are correctly structured and match
the `Witnesses<PS>` type signatures. Key finding from comparison with the `midnight-doc-manager`
PreProd reference:

| Aspect | midnight-doc-manager | AutoDiscovery |
|---|---|---|
| Witness return type | `[PS, Uint8Array]` | `[PS, bigint]` ✅ correct for `Field` |
| Private state mutation | Returns state unchanged | Returns updated state with case/step tracking ✅ |
| Hash function | `persistentHash` (native) | Custom `deterministicHashToField` (FNV-1a) |

**⚠️ Hash migration needed for production:** `deterministicHashToField` is a custom FNV-1a
implementation. Migrate to Midnight's native `persistentHash` before final production deployment
to ensure consistency with on-chain verification. The circuit trusts witness output directly
so this does not break current operation, but is required for Phase 2 integrity.

---

## 3. Chain Reader (`discovery-core-reader.ts`)

| Function | Status | Detail |
|---|---|---|
| `fetchRawContractState()` | ✅ | GraphQL query wired; env vars read correctly |
| `getOnChainCaseStatus()` | ❌ | Returns mock `{ exists: false }` — ledger parser not linked |
| `getOnChainStepStatus()` | ❌ | Returns mock `{ exists: false }` — not implemented |
| `isAttestationOnChain()` | ❌ | Always returns `false` — not implemented |

**What's missing:** Import `DiscoveryCore` from `@autodiscovery/contract`, call `DiscoveryCore.ledger(rawState)`,
then query `parsed.caseStatusByCaseIdentifier`.

---

## 4. Wallet / SDK Configuration

**Wallet SDK versions are misaligned** — mixing v2 and v3 packages in `frontend-realdeal/package.json`:

```json
// Current (misaligned):
"@midnight-ntwrk/wallet-sdk-facade":            "2.0.0",   // ← v2
"@midnight-ntwrk/wallet-sdk-hd":               "3.0.1",   // ← v3
"@midnight-ntwrk/wallet-sdk-shielded":          "2.0.0",   // ← v2
"@midnight-ntwrk/wallet-sdk-unshielded-wallet": "2.0.0",   // ← v2
"@midnight-ntwrk/wallet-sdk-dust-wallet":       "2.0.0",   // ← v2
```

All five packages must be on the same major version. Align to `^3.0.1` or the latest stable v3.

**Provider components missing** (required by the `midnight-doc-manager` reference pattern):

| Component | Package | Present? |
|---|---|---|
| `privateStateProvider` | `midnight-js-level-private-state-provider` | ❌ |
| `zkConfigProvider` | `midnight-js-node-zk-config-provider` | ❌ |
| `proofProvider` | `midnight-js-http-client-proof-provider` | ✅ (package listed, not wired) |
| `walletProvider` | wallet-sdk (Lace) | ⚠️ (partial) |
| `midnightProvider` | wallet-sdk | ❌ |
| `publicDataProvider` | `midnight-js-indexer-public-data-provider` | ✅ (package listed, used in reader) |

---

## 5. Environment & Infrastructure

`.env.realdeal` contains only 2 entries (`VITE_APP_MODE`, `VITE_INDEXER_URL`).
Missing required variables:

```env
# All 6 deployed contract addresses (required for any on-chain interaction)
VITE_CONTRACT_DISCOVERY_CORE=<preprod address>
VITE_CONTRACT_DISCOVERY_PROOF=<preprod address>
VITE_CONTRACT_DOCUMENT_REGISTRY=<preprod address>
VITE_CONTRACT_ACCESS_CONTROL=<preprod address>
VITE_CONTRACT_JURISDICTION_REGISTRY=<preprod address>
VITE_CONTRACT_EXPERT_WITNESS=<preprod address>

# Proof server (required for ZK proof generation)
VITE_PROOF_SERVER_URL=http://localhost:6300

# WebSocket endpoint for live contract state subscriptions
VITE_INDEXER_WS=ws://localhost:8088/api/v1/graphql

# Node RPC (for midnight-local-dev)
VITE_NODE_URL=http://localhost:9944
```

**Circuit assets** (`.prover`, `.verifier`, `.zkir` files) must be copied to
`frontend-realdeal/public/contracts/` via `npm run copy-contracts` after each contract build.
This step is not yet automated in CI.

---

## 6. Changes Made in This PR

### `frontend-realdeal/src/providers/realdeal/real-jurisdiction.ts`

**Before:** `verifyRulePack()` returned `{ valid: true, message: 'Rule pack hash verified on-chain' }`
whenever `jurisdiction.verifiedOnChain === true` — a locally-stored boolean, not a live on-chain check.
This constituted a false positive that could mislead compliance auditors.

**After:** Message now reads `'Rule pack hash previously recorded as on-chain verified (cached). Connect wallet to re-verify live.'`
This makes the distinction between cached status and live proof explicit without breaking the existing API.

### `frontend-realdeal/src/providers/realdeal/real-auth.ts`

**Before:** `walletState?.coinPublicKey ?? 'lace-connected'` silently accepted the literal string
`'lace-connected'` as the user's public key when Lace didn't return a key.
This would propagate through the session as a fake identity and cause all signing operations to fail silently.

**After:** If `coinPublicKey` is absent, the function logs a diagnostic warning with SDK version
context and returns `null`. The caller already handles `null` by falling back to offline mode
with a visible warning — this path is now taken explicitly rather than accidentally.

---

## 7. Docs Milestone Updates (prior commits in this branch)

- `docs/milestones/past-milestones.md` — attribution tags `[John]`, `[Spy]`, `[Both]`, `[Copilot/Spy]`
  added on every milestone entry with accurate commit counts
- `docs/milestones/present-milestones.md` — centered headers, status key legend,
  collapsible sections, consistent visual style
- `docs/milestones/future-milestones.md` — same polish: centered headers, attribution legend,
  collapsible sections, status keys

---

## 8. Critical Blockers for PreProd (Priority Order)

| # | Blocker | Severity | Fix |
|---|---|---|---|
| B1 | All 6 contract addresses missing from `.env.realdeal` | 🔴 CRITICAL | Populate after preprod deployment |
| B2 | Circuit assets not in `/public/contracts/` | 🔴 CRITICAL | `npm run copy-contracts` after build |
| B3 | `getOnChainCaseStatus()` returns mock data | 🔴 CRITICAL | Link `@autodiscovery/contract`; call `DiscoveryCore.ledger()` |
| B4 | Wallet SDK versions misaligned (v2 + v3) | 🔴 CRITICAL | Align all `wallet-sdk-*` to `^3.0.1` |
| B5 | Wallet provider not implemented (no signing) | 🔴 CRITICAL | Implement `configureProviders()` using SDK v3 |
| B6 | `RealAIProvider` throws on all calls | 🔴 CRITICAL | Implement or remove from provider bundle |
| B7 | `RealEmailSafetyProvider` throws on all calls | 🟠 HIGH | Implement or remove |
| B8 | `RealContactProvider` throws on all calls | 🟠 HIGH | Implement or remove |
| B9 | FNV-1a hash instead of `persistentHash` in witnesses | 🟠 HIGH | Migrate before production |
| B10 | `real-jurisdiction.ts` false-positive on-chain claim | 🟡 FIXED ✅ | Fixed in this PR |
| B11 | `real-auth.ts` silent invalid public key fallback | 🟡 FIXED ✅ | Fixed in this PR |

---

## 9. Integration Roadmap (Continuation of INTEGRATION-FINDINGS.md §7)

| # | Task | Prerequisite |
|---|---|---|
| 1 | Align all `wallet-sdk-*` to `^3.0.1` in `package.json` | — |
| 2 | Create `configureProviders()` in `chain/` with all 6 SDK components | Task 1 |
| 3 | Add `@autodiscovery/contract` as workspace dep to `frontend-realdeal` | — |
| 4 | Implement `DiscoveryCore.ledger()` parsing in `discovery-core-reader.ts` | Task 3 |
| 5 | Implement `CompiledContract.make()` + `deployContract()` for discovery-core | Tasks 2 + 3 |
| 6 | Activate `callTx.createCase()` in `real-case.ts` | Tasks 2 + 5 |
| 7 | Migrate `deterministicHashToField` → `persistentHash` in all 6 witness files | Task 3 |
| 8 | Populate all 6 `VITE_CONTRACT_*` env vars after preprod deploy | Task 5 |
| 9 | Run `npm run copy-contracts` and verify circuit assets in `/public/` | Task 5 |
| 10 | Replicate deploy pipeline for remaining 5 contracts | Task 6 |
| 11 | Implement or remove `RealAIProvider`, `RealEmailSafetyProvider`, `RealContactProvider` | — |
| 12 | Set up `midnight-local-dev` Docker stack in CI | — |

---

## References

- **midnight-doc-manager** (PreProd reference dApp): https://github.com/Mackenzie-OO7/midnight-doc-manager
- **midnight-local-dev** (local Docker stack): https://github.com/midnightntwrk/midnight-local-dev
- **AutoDiscovery witnesses**: `autodiscovery-contract/src/witnesses/`
- **Prior integration audit**: [`INTEGRATION-FINDINGS.md`](./INTEGRATION-FINDINGS.md)
- **Related issue**: [SpyCrypto/AutoDiscovery#37](https://github.com/SpyCrypto/AutoDiscovery/issues/37)
