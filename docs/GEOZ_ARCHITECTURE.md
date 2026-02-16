# 🌐 GeoZ — Privacy-Preserving Geolocation Oracle on Midnight

> **GeoZ.us · GeoZ.app**
> *Prove where you are without revealing where you are.*

> ⚠️ **NOTE:** GeoZ is a **separate project and repository** from AutoDiscovery. This document lives here because AutoDiscovery is the first consumer of GeoZ (via its GeoOracle compliance layer), but GeoZ will be developed and maintained independently at its own repo.

---

## Table of Contents

- [1. Core Goal](#1-core-goal)
- [2. System Roles (Actors)](#2-system-roles-actors)
- [3. Data Model](#3-data-model)
- [4. ISP Trusted Issuer Flow](#4-isp-trusted-issuer-flow)
- [5. End-to-End Flows](#5-end-to-end-flows)
- [6. Midnight On-Chain Architecture](#6-midnight-on-chain-architecture)
- [7. ZK Circuit Design](#7-zk-circuit-design)
- [8. Off-Chain Services](#8-off-chain-services)
- [9. Threat Model & Mitigations](#9-threat-model--mitigations)
- [10. MVP Phased Rollout](#10-mvp-phased-rollout)
- [11. Relationship to AutoDiscovery](#11-relationship-to-autodiscovery)

---

## 1. Core Goal

### Publicly verifiable statement:

> *"This user is within **Region R** at **time T** (or within the last Δ minutes), under **policy P**, without revealing their exact coordinates or IP."*

### Private facts (never revealed on-chain):

| Private Data | Why It Stays Private |
|---|---|
| Exact coordinates (lat/lon) | Precise location is PII |
| IP address | Network identity leakage |
| ISP confirmation code / token | Session-level identity |
| Raw sensor readings / Wi-Fi scan results | Device fingerprinting risk |
| Cell tower / carrier metadata | Movement pattern inference |

### On-chain (Midnight) exposes only:

- **Region ID** (or policy ID)
- **Timestamp window / expiry**
- **Proof verification result / commitment**
- **Optional user identifier** (DID) and optional **nullifier** to prevent replay

---

## 2. System Roles (Actors)

### A) User / Client

The **GeoZ app** (web or mobile) that gathers location signals and requests attestations from trusted issuers. The client produces a **GeoZ proof** via the Midnight proof server flow.

### B) Trusted Issuer(s)

Entities that can attest to something location-related. Multiple issuer types can be combined for stronger assurance:

| Issuer Type | What It Attests | Trust Basis |
|---|---|---|
| **ISP Attestation Service** | Subscriber session originated from edge POP / metro region bucket | ISP controls network ingress |
| **Mobile Carrier Attestor** | Cell tower / SIM auth region | Carrier controls radio access |
| **Enterprise Wi-Fi Attestor** | Authenticated AP / network realm | Organization controls network |
| **Device Attestor** | Hardware-backed location (if available) | Trusted hardware enclave |
| **3rd-Party KYC/AML** (optional) | Identity + address verification | Regulated financial entity |

**Key principle:** Issuers sign location claims in a privacy-preserving way. They don't need to know *why* the user needs the proof — only that the user is a valid subscriber/client in their network.

### C) GeoZ Policy Registry

Defines what **"Region R"** means and which issuers are acceptable for a given policy.

- Off-chain definition (human-readable geofences, issuer whitelists, thresholds)
- Mirrored on-chain as **policy commitments** and **region Merkle roots**
- Defines: single-issuer vs. multi-issuer requirements, freshness windows, etc.

### D) GeoZ Verifier / Aggregator (off-chain)

- Validates issuer signatures
- Normalizes attestations into a standard **GeoAttestation** format
- Optionally aggregates multiple attestations into one bundle

### E) Midnight Contract (GeoZ Ledger + Circuits)

- Stores policy commitments and region commitments
- Verifies ZK proofs that attestations are valid, private location maps inside a region, and freshness/anti-replay are satisfied

---

## 3. Data Model

### 3.1 Region Representation (Geofence)

Regions must be representable in a form that's efficient to prove membership in ZK.

#### Option 1: S2 / H3 Cell IDs *(recommended for MVP)*

1. Convert lat/lon → cell ID (S2 or H3) at a chosen resolution
2. Region R is represented as a **set of allowed cell IDs**
3. In ZK: prove *"my private cellID is in the allowed set"*
4. Membership proofs via **Merkle tree of allowed cells** (root stored on-chain)
5. Prove inclusion with a private Merkle path

```
Region "Idaho" at S2 level 8:
┌─────────────────────────────┐
│  Merkle Root (on-chain)     │
│         /        \          │
│      node        node       │
│     /    \      /    \      │
│  cell₁  cell₂  cell₃  ... │  ← S2/H3 cell IDs covering Idaho
└─────────────────────────────┘

User proves: "My private cell ID has a valid Merkle path to this root"
```

#### Option 2: Polygon Containment *(Phase 3+)*

- More precise, supports arbitrary shapes
- Heavier circuit complexity (point-in-polygon arithmetic in ZK)
- Best deferred until MVP works

### 3.2 GeoAttestation Format (Issuer-Signed)

A canonical claim structure that all issuers produce:

```
GeoAttestation {
  issuer_id:            DID or key ID
  subject_commitment:   commitment to user identity (NOT raw identity)
  region_hint:          coarse region bucket or POP code
  cell_commitment:      commitment to derived cellID (NOT the cell itself)
                        OR commitment to lat/lon
  time_issued:          UTC timestamp
  expires_at:           UTC timestamp (short-lived)
  nonce:                anti-replay value
  signature:            issuer's signature over all above fields
}
```

**Critical design constraint:** The issuer **must** sign something that binds:

1. **The user** (or session) — prevents attestation borrowing
2. **The location claim** (coarse or committed) — prevents region swapping
3. **The time window** — prevents stale replay

---

## 4. ISP Trusted Issuer Flow

### The Honest Constraints

- IP ≠ location reliably
- VPN breaks IP-based geolocation by design
- ISP "code" is only meaningful if it is:
  - Issued per session
  - Signed by the ISP
  - Mapped to a **region bucket the ISP controls** (POP / service area)
  - Short-lived

### What Still Works — And Why It's Powerful

Even if the user is on a VPN, the ISP still sees the **real subscriber session ingress** before traffic exits to the VPN tunnel. The ISP can always identify:

- **Which subscriber line/session** this is
- **Which access network / region** served it (the physical POP, DSLAM, OLT, cell site)

This is the key insight: **the ISP attests to the physical access point, not the exit IP.**

### ISP Attestation Flow

```
┌──────────┐     ① Auth request      ┌──────────────────┐
│  GeoZ    │ ───────────────────────► │  ISP Attestation │
│  Client  │  (OAuth / mTLS / SIM /  │     Endpoint     │
│          │   customer portal token) │                  │
│          │ ◄─────────────────────── │                  │
│          │     ② Signed attestation │                  │
│          │        containing:       └──────────────────┘
│          │        • POP code / region bucket
│          │        • session binding
│          │        • expiry
│          │
│          │     ③ Build ZK proof:
│          │        "issuer sig valid
│          │         AND POP bucket maps
│          │         to allowed region"
│          │
│          │     ④ Submit proof         ┌──────────────────┐
│          │ ───────────────────────►   │  Midnight Chain  │
│          │                            │  (GeoZ Contract) │
└──────────┘                            └──────────────────┘
```

This proves **coarse region via ISP**. For tighter location, add a second issuer channel (carrier / Wi-Fi / device GNSS).

---

## 5. End-to-End Flows

### Flow A: Single-Issuer (ISP Bucket) — MVP

**Best for:** "Are you in Idaho / EU / US / county / service area?"
**Not for:** "You are inside this exact building."

| Step | Action |
|------|--------|
| 1 | User requests access under **Policy P / Region R** |
| 2 | GeoZ client obtains ISP attestation (signed) |
| 3 | GeoZ client derives a private cellID (optional) OR proves bucket membership directly |
| 4 | **ZK proof circuit verifies:** issuer signature · attestation freshness · bucket → allowed region mapping |
| 5 | **Midnight contract records:** policy_id · region_root (Merkle root) · nullifier (prevents replay) · success flag |

### Flow B: Multi-Issuer (ISP + Device/Wi-Fi) — Stronger

**Best for:** Compliance gating, higher security, "VPN allowed but must be physically in region."

| Step | Action |
|------|--------|
| 1 | ISP attests region bucket |
| 2 | Device attests cellID commitment (or lat/lon commitment) |
| 3 | Circuit proves **both are consistent** (same region / within tolerance) |

Policy example: *"Require 2-of-3 issuers within last 5 minutes."*

### Flow C: Verifiable Presentation (DID-Based) — Phase 4

For user portability and composability:

| Step | Action |
|------|--------|
| 1 | User has a DID |
| 2 | Attestations are **Verifiable Credentials** (VCs) |
| 3 | GeoZ generates a VP-like bundle |
| 4 | ZK circuit proves the bundle satisfies policy |

---

## 6. Midnight On-Chain Architecture

### 6.1 Contract: `GeoZRegistry`

The system-of-record for issuers, policies, and regions.

**Public Ledger State:**

| Field | Purpose |
|-------|---------|
| `issuer_keys` | Map of issuer IDs → public keys (or key commitments / DID docs) |
| `policies` | Map of policy IDs → policy hash (allowed issuers, thresholds, region root) |
| `region_roots` | Merkle roots of allowed cells per policy / per epoch |
| `epoch_counter` | Version tracking for region updates |

**Circuits:**

| Circuit | Purpose |
|---------|---------|
| `register_issuer` | Admin adds/rotates issuer keys |
| `update_policy` | Admin creates/modifies a policy definition |
| `publish_region_root` | Region Builder publishes updated Merkle root for a region |

### 6.2 Contract: `GeoZProofLog`

Records proof verification results and prevents replay.

**Public Ledger State:**

| Field | Purpose |
|-------|---------|
| `nullifier_set` | Set of used nullifiers (prevents replay) |
| `proof_count` | Counter per policy (analytics) |

**Private State (per user):**

| Field | Purpose |
|-------|---------|
| `latest_cell_id` | Most recent derived cell ID or lat/lon |
| `latest_attestations` | Current issuer attestation(s) or commitments |
| `user_secret` | Secret for nullifier generation |
| `history` | Optional rolling window of past proofs |

**Circuits:**

| Circuit | Purpose |
|---------|---------|
| `verify_location` | **Main circuit** — verifies attestation(s), region membership, freshness, and nullifier |
| `revoke_nullifier` | Admin can invalidate a specific proof (emergency) |

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MIDNIGHT NETWORK                            │
│                                                                     │
│  ┌─────────────────────┐         ┌─────────────────────┐           │
│  │   GeoZRegistry      │         │   GeoZProofLog      │           │
│  │                     │         │                     │           │
│  │  Public:            │         │  Public:            │           │
│  │  • issuer_keys      │         │  • nullifier_set    │           │
│  │  • policies         │◄───────►│  • proof_count      │           │
│  │  • region_roots     │         │                     │           │
│  │  • epoch_counter    │         │  Private (per user): │           │
│  │                     │         │  • cell_id          │           │
│  │  Circuits:          │         │  • attestations     │           │
│  │  • register_issuer  │         │  • user_secret      │           │
│  │  • update_policy    │         │                     │           │
│  │  • publish_region   │         │  Circuits:          │           │
│  │    _root            │         │  • verify_location  │           │
│  └─────────────────────┘         │  • revoke_nullifier │           │
│                                  └─────────────────────┘           │
└─────────────────────────────────────────────────────────────────────┘
         ▲                                    ▲
         │ policy / region updates            │ proofs
         │                                    │
┌────────┴──────────┐              ┌──────────┴──────────┐
│  Region Builder   │              │  Proof Orchestrator  │
│  Service          │              │  (GeoZ Client)       │
└───────────────────┘              └──────────┬──────────┘
                                              │
                                   ┌──────────┴──────────┐
                                   │  Issuer Gateway      │
                                   │  (ISP / Carrier /    │
                                   │   Wi-Fi / Device)    │
                                   └─────────────────────┘
```

---

## 7. ZK Circuit Design

The `verify_location` circuit is the heart of GeoZ. At minimum, it proves:

### 7.1 Attestation Validity

```
✓ Signature verifies under issuer public key
✓ expires_at has not passed
✓ Attestation binds to subject_commitment (user can't borrow someone else's)
```

### 7.2 Region Membership

```
✓ Attested bucket IS in allowed set
   OR
✓ Derived cellID IS in allowed set
   → via Merkle inclusion proof (private path, public root)
```

### 7.3 Anti-Replay

```
✓ nullifier = H(user_secret, attestation_nonce, policy_id)
✓ Prove nullifier derived correctly (without revealing secret)
✓ Contract rejects reused nullifiers
```

### 7.4 Freshness

```
✓ time_issued within allowed window
   (block height window OR disclosed timestamp commitment,
    depending on Midnight primitives available)
```

### Circuit Input/Output Summary

```
PUBLIC INPUTS  (visible on-chain):
  • policy_id
  • region_root (Merkle root)
  • nullifier
  • current_time (or block height)

PRIVATE INPUTS (known only to prover):
  • attestation(s)       — full GeoAttestation struct(s)
  • issuer_pubkey(s)     — for signature verification
  • merkle_path          — inclusion proof for cell/bucket
  • user_secret          — for nullifier derivation
  • cell_id              — derived location

OUTPUT:
  • Boolean: proof valid / invalid
  • Nullifier (committed to public state)
```

---

## 8. Off-Chain Services

### A) GeoZ Issuer Gateway

| Responsibility | Details |
|---|---|
| **Connectors** | Per issuer type: ISP API, carrier API, enterprise Wi-Fi RADIUS/802.1X, device attestation |
| **Normalization** | Converts raw issuer responses → canonical `GeoAttestation` format |
| **Key Management** | Handles issuer key rotation, revocation, audit logs |
| **Rate Limiting** | Prevents attestation farming |

### B) Region Builder Service

| Responsibility | Details |
|---|---|
| **Polygon → Cells** | Converts geofence polygons → S2/H3 cell sets at configured resolution |
| **Merkle Tree Construction** | Builds Merkle trees from cell sets |
| **Root Publication** | Publishes roots on-chain via `GeoZRegistry.publish_region_root` |
| **Versioning** | Region roots by epoch (e.g., daily) if boundaries update |

### C) Proof Orchestrator

| Responsibility | Details |
|---|---|
| **Input Assembly** | Gathers attestations, Merkle paths, policy params |
| **Proof Generation** | Talks to Midnight proof server and/or local proving |
| **Delivery** | Returns proof + public signals to contract |

---

## 9. Threat Model & Mitigations

| Threat | Attack Vector | Mitigation |
|--------|---------------|------------|
| **VPN Spoofing** | User tunnels traffic to appear in different region | ISP attestation based on **subscriber access network**, not exit IP. Stronger: require second-factor issuer (carrier or enterprise Wi-Fi) |
| **Borrowed Attestation** | User replays someone else's attestation | Bind attestation to `subject_commitment` and `nonce`, short expiry. On-chain nullifier prevents replay |
| **Compromised Issuer** | Issuer key leaked or issuer colludes | Multiple issuers required (2-of-3). Issuer reputation tracking. Key rotation + revocation on-chain. Policy thresholds |
| **Device GPS Spoofing** | Fake GPS coordinates on rooted device | Don't rely solely on GPS. Combine with network attestations. Hardware attestation (TEE) in later phases |
| **Region Set Inference** | Observer learns "user is in Region R" from public state | Use policy IDs that don't reveal geography. Or prove membership in "eligible set" without naming which region (advanced privacy mode) |
| **Stale Attestation** | Old attestation replayed after user moves | Short expiry windows (minutes, not hours). Freshness check in circuit |
| **Issuer Denial of Service** | ISP refuses to issue attestation | Multiple issuer types. Fallback channels. Policy allows alternative issuers |

---

## 10. MVP Phased Rollout

### Phase 1: ISP Bucket Attestation → Region Proof *(MVP)*

| Component | Scope |
|---|---|
| **Regions** | State-level or metro-level (coarse) |
| **Membership** | Merkle root of allowed ISP POP buckets / S2 cells |
| **Proof** | Signature valid + bucket in allowed set + freshness + nullifier |
| **Issuers** | Single ISP attestation |
| **Consumer** | AutoDiscovery (jurisdiction detection) |

### Phase 2: Multi-Issuer Policy Engine

| Component | Scope |
|---|---|
| **Issuers** | Add carrier + enterprise Wi-Fi attestors |
| **Policies** | On-chain policy thresholds (2-of-3, freshness windows) |
| **Regions** | County-level or metro-level |

### Phase 3: Fine Geofence

| Component | Scope |
|---|---|
| **Regions** | Polygon containment or high-res H3/S2 |
| **Precision** | Building-level or campus-level proofs |
| **Proofs** | Tighter freshness windows (real-time) |

### Phase 4: Composability & Portability

| Component | Scope |
|---|---|
| **Identity** | DID/VC-style attestations |
| **Bundles** | Verifiable Presentations + selective disclosure |
| **Ecosystem** | Third-party apps can consume GeoZ proofs |

---

## 11. Relationship to AutoDiscovery

GeoZ is the **infrastructure layer** that powers AutoDiscovery's GeoOracle compliance engine.

```
┌────────────────────────────────────┐
│       AutoDiscovery.legal          │
│  (Legal Discovery Compliance)      │
│                                    │
│  "Which jurisdiction rules apply   │
│   to this case?"                   │
│                                    │
│  Calls GeoZ to prove:             │
│  "This user/firm is operating     │
│   from Idaho (IRCP applies)"      │
├────────────────────────────────────┤
│         GeoZ Oracle Layer          │
│  (GeoZ.us / GeoZ.app)             │
│                                    │
│  "This entity is in Region R      │
│   at time T — here's the proof"   │
├────────────────────────────────────┤
│       Midnight Network             │
│  (ZK Proofs + Dual Ledger)         │
└────────────────────────────────────┘
```

**AutoDiscovery consumes GeoZ proofs** to:

1. **Auto-detect jurisdiction** — When a case is created, GeoZ proves the firm's location → AutoDiscovery loads the correct rule pack (IRCP, URCP, CR, etc.)
2. **Prove compliance jurisdiction** — The compliance proof includes a GeoZ attestation that the work was performed in the claimed jurisdiction
3. **Multi-jurisdiction cases** — When parties are in different states, each party's GeoZ proof determines which rules apply to their obligations

**But GeoZ is general-purpose.** It can serve any application that needs privacy-preserving geolocation:

- Age-gated content (prove you're in a legal jurisdiction)
- Geo-restricted services (streaming, gambling, financial services)
- Supply chain provenance (prove goods originated in a region)
- Regulatory compliance (prove operations are within licensed territory)
- Voting / governance (prove residency without revealing address)

---

## Design Philosophy

> *"The user proves they are somewhere. The world learns only that they're allowed to be."*

GeoZ treats location as a **private claim** — like income, age, or citizenship. You shouldn't have to broadcast your coordinates to prove you're in the right place. The ISP, carrier, or Wi-Fi network already knows where you connect from. GeoZ simply wraps that knowledge in a zero-knowledge proof and puts it on-chain where it matters.

---

## Domains & Branding

| Asset | URL |
|-------|-----|
| **Primary** | [GeoZ.us](https://geoz.us) |
| **App** | [GeoZ.app](https://geoz.app) |
| **Protocol Name** | GeoZ (GeoZ Oracle) |
| **Blockchain** | Midnight Network |
| **First Consumer** | AutoDiscovery.legal |

---

## Architecture Credit

Initial architecture designed collaboratively by **John** ([@bytewizard42i](https://github.com/bytewizard42i)) with architectural review by **Alice** 🌟.

The ISP trusted-issuer attestation concept — proving subscriber access network region rather than exit IP — is John's original insight that forms the core of GeoZ's value proposition.

---

*GeoZ — Prove where you are without revealing where you are.*
*Built on [Midnight Network](https://midnight.network).*
