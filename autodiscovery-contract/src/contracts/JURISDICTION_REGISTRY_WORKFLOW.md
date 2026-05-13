# Jurisdiction Registry — Workflow & Explanation

> **Contract:** `jurisdiction-registry.compact`  
> **Type:** Shared singleton (ONE deployment for the entire AutoDiscovery platform)  
> **Admin-controlled:** Only the registry administrator can register or update jurisdictions

---

## What This Contract Does

This contract is the **rule book anchor**. Legal discovery rules are different in every jurisdiction — Idaho has IRCP, Utah has URCP, Federal has FRCP, etc. The actual rules live off-chain as JSON files (too large and too frequently updated for on-chain storage). This contract stores the **hash** of each rule pack on-chain, creating an immutable audit trail.

**The question it answers:** "Which exact rules were in effect when this case's discovery steps were generated?"

---

## Why It Needs to Be a Smart Contract

- **Immutable audit trail** — Rule pack hashes can't be retroactively changed
- **Shared singleton** — One deployment serves ALL users. Every party's `discovery-core` instance references the same jurisdiction registry.
- **Version tracking** — When rules change (e.g., California's 2024 mandatory disclosure reform), the new hash is recorded with a new version number
- **Court verification** — Courts can independently verify which rules were active

---

## Workflow

### Step 1: Platform Admin Registers a Jurisdiction

```
WHO:    AutoDiscovery platform administrator (John or designated admin)
WHEN:   When adding support for a new jurisdiction (e.g., Idaho at launch)
HOW:    Admin calls registerNewJurisdiction("ID", hash_of_idaho_ircp_json)

WHAT HAPPENS ON-CHAIN:
  PUBLIC:  "ID" added to registeredJurisdictionCodes
  PUBLIC:  Rule pack hash stored in currentRulePackHashByJurisdictionCode
  PUBLIC:  Version initialized to 1
  PUBLIC:  totalJurisdictionsRegistered incremented

WHAT THE DAPP DOES:
  • Loads idaho-ircp.json from the rule-packs/ folder
  • Computes SHA-256 of the JSON file
  • Submits the hash to the contract via admin's Lace wallet
```

### Step 2: User Creates a Case (References the Registry)

```
WHO:    Any AutoDiscovery user (e.g., attorney Sarah)
WHEN:   During case creation in the New Case Wizard
HOW:    DApp reads the registry to verify jurisdiction is supported

WHAT HAPPENS:
  • DApp checks: Is "ID" in registeredJurisdictionCodes? → YES
  • DApp reads: currentRulePackHashByJurisdictionCode["ID"] → hash
  • DApp compares: Does local JSON hash match on-chain hash? → YES
  • DApp proceeds: Loads the rule pack and generates discovery steps
  • If hashes DON'T match: DApp warns "Rule pack may be outdated"
```

### Step 3: Rules Get Updated

```
WHO:    Platform administrator
WHEN:   When a jurisdiction's rules change (new legislation, court rule amendment)
HOW:    Admin calls updateJurisdictionRulePack("CA", new_hash, version_2)

WHAT HAPPENS ON-CHAIN:
  PUBLIC:  New hash replaces old hash in currentRulePackHashByJurisdictionCode
  PUBLIC:  Version number updated (1 → 2)
  
  NOTE: Cases that were created BEFORE the update retain their original
        attestations. The compliance-proof timestamps prove which version
        was active when each attestation was generated.
```

### Step 4: Court Verifies Which Rules Were Used

```
WHO:    Court, opposing counsel, auditor — anyone
WHEN:   During a sanctions hearing or compliance audit
HOW:    Verifier calls verifyRulePackHashMatchesExpected("ID", expected_hash)

WHAT HAPPENS:
  • Circuit compares expected hash to on-chain hash
  • Returns true if they match, false if not
  • Combined with compliance-proof timestamps, this proves:
    "This case used Idaho IRCP version 2024.07 (hash: abc123...)
     which was the active version on April 12, 2026 when the
     compliance attestation was generated."
```

---

## State Summary

| State Type | Variable | What It Holds |
|-----------|----------|---------------|
| PUBLIC | `totalJurisdictionsRegistered` | Count of supported jurisdictions |
| PUBLIC | `registeredJurisdictionCodes` | Set of codes: "ID", "UT", "FEDERAL", etc. |
| PUBLIC | `currentRulePackHashByJurisdictionCode` | SHA-256 hash per jurisdiction |
| PUBLIC | `currentRulePackVersionByJurisdictionCode` | Version number per jurisdiction |
| PRIVATE | `offChainRulePackDataReferenceByJurisdictionCode` | Pointer to off-chain JSON |

---

## What the DApp Handles (NOT This Contract)

- Loading and parsing the actual JSON rule pack files
- Merging county-level and judge-level overrides onto the base rule pack
- Computing deadlines from rules (the Deadline Engine)
- Displaying jurisdiction information in the UI
- Detecting cross-jurisdiction conflicts (e.g., "Utah tier limits conflict with California disclosure requirements")

---

## Circuit Reference

| Circuit | Who Calls It | What It Does |
|---------|-------------|--------------|
| `registerNewJurisdiction()` | Admin only | Adds a new jurisdiction to the registry |
| `updateJurisdictionRulePack()` | Admin only | Updates rules to a new version |
| `verifyRulePackHashMatchesExpected()` | Anyone | Verifies which rules are active |

---

*This contract is simple by design. It's a hash anchor with version tracking. The complexity lives in the DApp's rule loader and deadline engine.*
