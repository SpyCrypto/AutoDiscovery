# YubiKey + Midnight Access Control Design

> **Date**: February 15, 2026
> **Authors**: John + Cassie
> **Branch**: `johnny5i-branch`
> **Status**: Architecture design — needs hardware testing

---

## The Goal

Give users a **choice** in how they authenticate and sign transactions:

1. **Software wallet only** (Lace) — standard Midnight wallet, private key in browser/extension
2. **YubiKey-backed** — private key lives on hardware, never extractable
3. **YubiKey as 2FA** — software wallet + YubiKey confirmation for sensitive actions

---

## How YubiKey Works with Blockchain Keys

### Option A: Key Generated ON the YubiKey (Most Secure)

```
┌─────────────────────────────────────────────────────────────┐
│                    YUBIKEY-GENERATED KEY                      │
│                                                               │
│  1. YubiKey generates key pair internally                    │
│     ├── Private key: NEVER leaves the YubiKey hardware       │
│     ├── Public key: exported to AutoDiscovery                │
│     └── Key type: ECDSA P-256 (YubiKey native)              │
│                                                               │
│  2. Transaction signing flow:                                │
│     ├── AutoDiscovery prepares transaction                   │
│     ├── Transaction hash sent to YubiKey                     │
│     ├── User touches YubiKey (physical confirmation)         │
│     ├── YubiKey signs the hash internally                    │
│     ├── Signed transaction returned to AutoDiscovery         │
│     └── Submitted to Midnight network                        │
│                                                               │
│  SECURITY:                                                    │
│  ✅ Private key never in software, never on disk             │
│  ✅ Physical touch required — can't be remote-signed         │
│  ✅ Survives malware on the host machine                     │
│  ❌ If YubiKey is lost, key is GONE (need backup strategy)   │
│  ❌ ECDSA P-256 ≠ Ed25519 (Midnight's native curve)         │
│     └── May need curve translation or custom key type        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Option B: Midnight Key Stored on YubiKey (Practical)

```
┌─────────────────────────────────────────────────────────────┐
│                  IMPORTED KEY ON YUBIKEY                      │
│                                                               │
│  1. Generate Midnight-compatible key (Ed25519)               │
│  2. Import private key to YubiKey's PIV slot                 │
│     ├── Uses PKCS#11 interface                               │
│     ├── Key is encrypted at rest on the YubiKey              │
│     └── PIN required to unlock key for signing               │
│                                                               │
│  3. Transaction signing flow:                                │
│     ├── AutoDiscovery prepares transaction                   │
│     ├── PKCS#11 API sends sign request to YubiKey            │
│     ├── User enters PIN + touches YubiKey                    │
│     ├── YubiKey signs with the stored Ed25519 key            │
│     └── Signed transaction submitted to Midnight             │
│                                                               │
│  SECURITY:                                                    │
│  ✅ Private key encrypted on hardware                        │
│  ✅ PIN + touch = two-factor (knowledge + possession)        │
│  ⚠️  Key was in software briefly during import               │
│  ✅ Ed25519 compatible with Midnight's native signing        │
│  ✅ Can backup key before importing (user's choice)          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Option C: YubiKey as 2FA (Simplest, User-Friendly)

```
┌─────────────────────────────────────────────────────────────┐
│                    YUBIKEY AS 2FA                             │
│                                                               │
│  1. Standard Lace wallet manages the Midnight private key    │
│  2. YubiKey adds a SECOND factor for sensitive operations    │
│                                                               │
│  Normal operations (view case, search docs):                 │
│     └── Wallet key only — no YubiKey needed                  │
│                                                               │
│  Sensitive operations (produce docs, sign attestations,      │
│  share with opposing counsel, file compliance proofs):       │
│     ├── Wallet signs the transaction                         │
│     ├── AutoDiscovery requests FIDO2/WebAuthn challenge      │
│     ├── User touches YubiKey                                 │
│     ├── FIDO2 signature appended to transaction metadata     │
│     └── Both factors verified before submission              │
│                                                               │
│  SECURITY:                                                    │
│  ✅ Easy to implement (WebAuthn is browser-native)           │
│  ✅ Users already understand "touch your key to confirm"     │
│  ✅ Works with any FIDO2 key (YubiKey, Titan, SoloKeys)     │
│  ✅ Midnight private key still in Lace (familiar UX)         │
│  ⚠️  Wallet key is still software-based (browser extension)  │
│  ✅ If YubiKey is lost, wallet still works (add new key)     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Recommendation: Offer All Three, Default to C

| Option | Security | UX | Recovery | Best For |
|--------|----------|-----|----------|----------|
| **A: YubiKey-generated** | Highest | Hard | Difficult (no backup) | Government, high-security firms |
| **B: Imported key** | High | Medium | Possible (pre-import backup) | Security-conscious attorneys |
| **C: 2FA (default)** | Good | Easy | Easy (replace YubiKey) | Most users, MVP |

**For the MVP and hackathon**: Implement Option C first. It's browser-native (WebAuthn API), doesn't require PKCS#11 libraries, and works with any FIDO2 key.

**Post-MVP**: Add Options A and B for firms that need hardware-backed keys for compliance reasons (e.g., DOJ investigations, HIPAA-covered cases).

---

## How YubiKey Integrates with access-control.compact

```
KEY REGISTRATION FLOW:

1. User sets up AutoDiscovery account
   ├── Creates or connects Lace wallet (Midnight key pair)
   ├── Public key registered in access-control.compact
   └── Role assigned (DEF attorney, PRO attorney, Judge, etc.)

2. User registers YubiKey (optional)
   ├── FIDO2 ceremony: browser generates credential
   ├── YubiKey credential ID stored locally
   ├── Hash of credential registered in access-control.compact
   │   as a SECOND authentication factor
   └── User chooses which operations require YubiKey

3. Sensitive operation (e.g., produce documents)
   ├── Step 1: Wallet signs transaction (Midnight signature)
   ├── Step 2: WebAuthn challenge sent to YubiKey
   ├── Step 3: User touches YubiKey
   ├── Step 4: FIDO2 assertion verified by AutoDiscovery app
   ├── Step 5: Transaction submitted with both factors
   └── On-chain: only the wallet signature matters to Midnight
       (FIDO2 is application-level, not protocol-level)
```

### Important: FIDO2 is Application-Level, Not Protocol-Level

Midnight's consensus only cares about the wallet signature. The YubiKey/FIDO2 factor is enforced by the **AutoDiscovery application layer**, not by the smart contracts. This means:

- The smart contracts don't know about YubiKeys
- The application refuses to submit transactions without the second factor
- A sophisticated attacker who compromises the wallet key AND bypasses the app could theoretically submit transactions without the YubiKey
- For Options A/B (hardware-backed key), this attack surface disappears because the YubiKey IS the signing key

For most users (attorneys, paralegals), Option C is sufficient because the threat model is "someone steals my laptop" not "nation-state attacker targets my Midnight wallet."

---

## Sensitive Operations That Should Require YubiKey

| Operation | Risk Level | YubiKey Required? |
|-----------|------------|-------------------|
| View case details | Low | No |
| Search documents | Low | No |
| Add a document to local state | Low | No |
| Register a document hash on-chain | Medium | Configurable |
| Create a twin bond | Medium | Configurable |
| **Produce documents to opposing counsel** | **High** | **Yes** |
| **Sign a compliance attestation** | **High** | **Yes** |
| **Submit a memorandum** | **High** | **Yes** |
| **Grant document access to another party** | **High** | **Yes** |
| **Anchor a production Merkle root** | **High** | **Yes** |
| Revoke document access | High | Yes |
| Register a new jurisdiction rule pack | Admin | Yes |

---

## Recovery: What If the YubiKey Is Lost?

```
OPTION C (2FA) RECOVERY:
├── Wallet key still works (it's in Lace, not on the YubiKey)
├── User can add a new FIDO2 credential from a replacement YubiKey
├── Old credential is revoked in AutoDiscovery
└── No on-chain state is lost

OPTION B (IMPORTED KEY) RECOVERY:
├── If user backed up the key before import: restore from backup
├── If no backup: key is GONE
│   ├── Need to register a new key pair
│   ├── On-chain state tied to old key is still there
│   │   but user can't sign new transactions with old key
│   └── Recovery mechanism: multi-sig with firm admin?
└── Recommendation: ALWAYS require backup before import

OPTION A (YUBIKEY-GENERATED) RECOVERY:
├── Key cannot be backed up (by design — it's the whole point)
├── If YubiKey is lost: key is GONE permanently
├── Mitigation: register MULTIPLE YubiKeys (primary + backup)
│   ├── Both keys authorized in access-control.compact
│   ├── Either can sign transactions
│   └── If one is lost, revoke it, order replacement
└── For firms: HSM (Hardware Security Module) as organizational backup
```

---

## Implementation Phases

### Phase 1 (MVP/Hackathon)
- Lace wallet only (no YubiKey)
- `access-control.compact` with role-based permissions
- Wallet signature for all operations

### Phase 2
- Add FIDO2/WebAuthn (Option C)
- Configurable per-operation YubiKey requirements
- Any FIDO2 key works (YubiKey, Titan, etc.)

### Phase 3
- Add PKCS#11 integration (Option B)
- Ed25519 key import to YubiKey PIV slot
- Hardware-backed signing for Midnight transactions

### Phase 4 (if demanded)
- Option A: YubiKey-native key generation
- May require custom curve support or bridge
- Multi-YubiKey registration for redundancy

---

*This document feeds into `access-control.compact` design and the demoLand/realDeal split (demoLand won't need YubiKey; realDeal will).*
