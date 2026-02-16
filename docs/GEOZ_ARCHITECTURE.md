# 🌐 GeoZ Oracle — How AutoDiscovery Uses It

> **GeoZ** is a **separate project and repository** — a privacy-preserving geolocation oracle built on Midnight.
>
> 🔗 **Full GeoZ documentation:** [github.com/bytewizard42i/GeoZ_us_app_Midnight-Oracle](https://github.com/bytewizard42i/GeoZ_us_app_Midnight-Oracle)
>
> **Domains:** [GeoZ.us](https://geoz.us) · [GeoZ.app](https://geoz.app)

---

## What Is GeoZ?

GeoZ is a privacy-preserving geolocation oracle that produces a ZK proof: *"This user is within Region R at time T"* — without revealing their exact coordinates, IP address, or network identity. It uses trusted issuer attestations (ISP, carrier, enterprise Wi-Fi) to verify location at the network level, making it **VPN-resistant and GPS-spoof-resistant**.

For full architecture, ISP attestation research, circuit design, and CAMARA integration details, see the [GeoZ repository](https://github.com/bytewizard42i/GeoZ_us_app_Midnight-Oracle).

---

## How AutoDiscovery Consumes GeoZ

AutoDiscovery is the **first consumer** of GeoZ proofs. The integration serves three purposes:

```
┌────────────────────────────────────┐
│       AutoDiscovery.legal          │
│  "Which jurisdiction rules apply   │
│   to this case?"                   │
│                                    │
│  Calls GeoZ to prove:             │
│  "This firm is operating from     │
│   Idaho (IRCP applies)"           │
├────────────────────────────────────┤
│         GeoZ Oracle Layer          │
│  (GeoZ.us / GeoZ.app)             │
├────────────────────────────────────┤
│       Midnight Network             │
│  (ZK Proofs + Dual Ledger)         │
└────────────────────────────────────┘
```

### 1. Auto-Detect Jurisdiction

When a case is created, GeoZ proves the firm's location → AutoDiscovery loads the correct rule pack (IRCP, URCP, CR, etc.). No manual jurisdiction selection required.

### 2. Prove Compliance Jurisdiction

The compliance proof includes a GeoZ attestation that the work was performed in the claimed jurisdiction. This is part of the immutable audit trail — cryptographic proof that the right rules were applied from the right place.

### 3. Multi-Jurisdiction Cases

When parties are in different states, each party's GeoZ proof determines which rules apply to their obligations. AutoDiscovery's `jurisdiction-registry` contract references GeoZ proof results to fork the workflow correctly.

---

## What AutoDiscovery Receives from GeoZ

AutoDiscovery does **not** interact with GeoZ internals (issuers, attestations, circuits). It consumes the **output** of a verified GeoZ proof:

| Field | What AutoDiscovery Uses It For |
|-------|-------------------------------|
| **Region ID** | Maps to a jurisdiction rule pack (e.g., `US-ID` → IRCP) |
| **Timestamp** | Ensures the location proof is fresh (within policy window) |
| **Proof validity** | Boolean — did the ZK proof verify on-chain? |
| **Nullifier** | Prevents the same proof from being reused across cases |

AutoDiscovery never sees coordinates, IP addresses, ISP tokens, or any other private location data.

---

## Integration Points in AutoDiscovery

| AutoDiscovery Component | GeoZ Interaction |
|------------------------|-----------------|
| **`jurisdiction-registry` contract** | Reads GeoZ proof results to determine which rule pack to load |
| **`compliance-proof` contract** | Includes GeoZ proof reference in the compliance attestation chain |
| **Frontend — Case Creation** | Triggers GeoZ proof flow when a new case is created |
| **Frontend — Jurisdiction Override** | Allows manual override with GeoZ proof as fallback verification |

---

*For GeoZ architecture, ISP research, circuit design, threat model, and CAMARA integration:*
*See [github.com/bytewizard42i/GeoZ_us_app_Midnight-Oracle](https://github.com/bytewizard42i/GeoZ_us_app_Midnight-Oracle)*
