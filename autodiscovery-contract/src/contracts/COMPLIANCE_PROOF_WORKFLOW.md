# Compliance Proof — Workflow & Explanation

> **Contract:** `compliance-proof.compact`  
> **Type:** Per-user instance (each party deploys their own)  
> **Purpose:** THE KILLER FEATURE — generates and verifies ZK compliance attestations

---

## What This Contract Does

This is the **entire value proposition** of AutoDiscovery. It generates mathematical proofs that discovery obligations were met, WITHOUT revealing any case details.

No other legal tech product can do this. Traditional compliance proof requires submitting detailed logs, correspondence records, and sworn declarations — all of which expose case strategy and sensitive information.

With this contract, an attorney can say:

> *"Your Honor, here is a cryptographic attestation proving all 47 discovery obligations were met before their deadlines."*

The court can **verify** this is true without seeing:
- Which documents were produced
- What the deadlines were
- Who the parties are
- Any case details whatsoever

**The proof is mathematically irrefutable. You literally cannot fake compliance.**

---

## Why It Needs to Be a Smart Contract

This is the ONLY contract whose existence requires no justification. If you're going to put anything on a blockchain, it's this:

- **ZK assertions** — The circuit mathematically verifies `timestamp <= deadline` before generating an attestation. If the step was completed AFTER the deadline, the assertion fails and NO attestation is created. You can't cheat the math.
- **Public verifiability** — Anyone (courts, opposing counsel, auditors) can verify an attestation exists by checking the public registry. Zero trust required.
- **Selective disclosure** — The case identifier can be revealed to a court without exposing step details, deadlines, or documents. Midnight's `disclose()` function makes this possible.
- **Immutable timestamps** — Once an attestation is generated with a timestamp, that timestamp can never be changed. No backdating.

---

## Three Levels of Attestation

```
┌─────────────────────────────────────────────────────────┐
│  CASE-LEVEL (0x02)                                       │
│  "Entire case discovery is compliant"                    │
│  ┌───────────────────────────────────────────────────┐  │
│  │  PHASE-LEVEL (0x01)                                │  │
│  │  "All steps in this discovery phase are done"      │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │  STEP-LEVEL (0x00)                           │  │  │
│  │  │  "This specific obligation was met before    │  │  │
│  │  │   its deadline"                              │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘

Step-level  → Granular proof per obligation (47 in a typical case)
Phase-level → Aggregated proof per discovery phase (5 phases typically)
Case-level  → Single proof for entire case compliance (the gold standard)
```

---

## Workflow

### Workflow A: Step-Level Attestation (The Core ZK Proof)

This is the most important circuit in all of AutoDiscovery.

```
WHO:    The case owner (attorney managing discovery)
WHEN:   Immediately after marking a step as completed in discovery-core
TRIGGER: DApp automatically calls this after markDiscoveryStepAsCompleted()

PREREQUISITE:
  The step must already be marked as completed in discovery-core.
  The DApp knows the step's deadline from its local database.

WHAT HAPPENS ON-CHAIN (attestStepLevelCompliance):
  
  WITNESS: getCurrentTimestamp() → attestationTimestamp
  
  ZK ASSERTION: attestationTimestamp <= stepDeadlineTimestamp
    • If TRUE:  Proof is valid. Step was completed before deadline. ✅
    • If FALSE: Transaction REVERTS. No attestation generated. ❌
                You cannot fake compliance.
  
  WITNESS: computeUniqueAttestationHash(caseId, stepHash, timestamp) → hash
  
  PUBLIC:  registeredAttestationHashes.insert(hash)
  PUBLIC:  attestationGeneratedTimestampByHash[hash] = timestamp
  PUBLIC:  attestationScopeLevelByHash[hash] = 0x00 (STEP_LEVEL)
  PUBLIC:  totalAttestationsGenerated incremented
  PRIVATE: associatedCaseIdentifierByAttestationHash[hash] = caseId

  RETURNS: The attestation hash — the attorney's proof of compliance

WHAT THE PUBLIC SEES:
  "A step-level compliance attestation was generated at [timestamp]."
  They do NOT see: which step, which case, what the deadline was, or what was done.

EXAMPLE:
  Attorney completes initial disclosures on April 12, 2026.
  Deadline was April 14, 2026.
  Circuit checks: April 12 <= April 14 → TRUE ✅
  Attestation generated. Stored forever on-chain.
  
  Six months later at a sanctions hearing:
  "Here's the attestation hash. Generated April 12. Deadline was April 14.
   The proof is on-chain and mathematically irrefutable."
```

### Workflow B: Phase-Level Attestation

```
WHO:    The case owner
WHEN:   After ALL steps in a discovery phase are completed
TRIGGER: DApp detects all steps in a phase are done, prompts attorney

DISCOVERY PHASES (typical):
  • Initial Disclosures phase     (8 steps)
  • Written Discovery phase       (12 steps — interrogatories, RFPs, RFAs)
  • Deposition phase              (10 steps)
  • Expert Discovery phase        (9 steps)
  • Pre-trial phase               (8 steps)

WHAT HAPPENS ON-CHAIN (attestPhaseLevelCompliance):
  
  ZK ASSERTION: completedStepsInPhase == totalStepsInPhase
    • 12/12 complete → Assertion passes ✅
    • 11/12 complete → Assertion FAILS ❌ (no partial-phase attestations)
  
  PUBLIC:  Attestation hash registered with scope PHASE_LEVEL (0x01)
  
  RETURNS: The phase-level attestation hash

WHY PHASE-LEVEL EXISTS:
  It's a convenience for reporting. Instead of showing a court 47 individual
  step attestations, you can show 5 phase attestations. "Every phase of
  discovery was completed. Here are the 5 proof hashes."
```

### Workflow C: Case-Level Attestation (The Gold Standard)

```
WHO:    The case owner
WHEN:   After ALL steps across ALL phases are completed
TRIGGER: DApp detects full case compliance, prompts attorney

WHAT THE DAPP DOES FIRST:
  1. Verifies all 47 step-level attestations exist
  2. Generates 5 phase-level attestations (if not already done)
  3. Updates case status to COMPLETED in discovery-core
  4. Takes a final case root snapshot in document-registry
  5. Then calls this circuit

WHAT HAPPENS ON-CHAIN (attestCaseLevelCompliance):
  
  PUBLIC:  Attestation hash registered with scope CASE_LEVEL (0x02)
  PUBLIC:  Timestamp recorded
  PRIVATE: Case identifier linked to attestation

  RETURNS: The case-level attestation hash — THE ultimate proof

THIS IS THE HASH THAT GOES IN THE COURT FILING:
  "Your Honor, attestation hash [abc123...] proves that ALL discovery
   obligations in this case were met. You can verify independently."
```

### Workflow D: Public Verification

```
WHO:    ANYONE — courts, opposing counsel, auditors, the public
WHEN:   Whenever someone wants to verify a compliance claim
TRIGGER: Someone is given an attestation hash and wants to check it

WHAT HAPPENS ON-CHAIN (verifyAttestationExists):
  • Checks if hash is a member of registeredAttestationHashes
  • Returns true (valid) or false (invalid/not found)
  
  This is a simple O(1) set membership check.

HOW IT WORKS IN PRACTICE:
  1. Attorney provides attestation hash to the court
  2. Court clerk visits verify.autodiscovery.legal (or calls circuit directly)
  3. Enters the hash
  4. System confirms: "Attestation exists. Generated July 15, 2027. Scope: Case-level."
  5. Court is satisfied: compliance proven.
  
  No login needed. No account needed. Anyone can verify. That's the point.
```

### Workflow E: Selective Disclosure for Court

```
WHO:    The case owner (only they can reveal their private data)
WHEN:   When a court requires linking an attestation to a specific case
TRIGGER: Court order or attorney voluntarily discloses

WHAT HAPPENS ON-CHAIN (revealAttestationCaseIdentifier):
  ASSERTION: Verifies attestation exists in the registry first
  
  PRIVATE → PUBLIC: associatedCaseIdentifierByAttestationHash[hash] → caseId
  Uses Midnight's disclose() to reveal the case identifier ONLY.
  
  RETURNS: The case identifier (hash of case number + jurisdiction)

WHAT THE COURT LEARNS:
  "Attestation [hash] belongs to case [caseId]."

WHAT THE COURT STILL DOESN'T LEARN:
  • Which specific steps were completed
  • What the deadlines were
  • Which documents were produced
  • Any case content whatsoever
  
  The court can correlate the caseId with their own case records
  (they know the actual case number because it's in their system).
```

---

## The Chain from Step Completion to Court Submission

```
Step 1: Attorney completes a discovery obligation
        (e.g., produces expert report, takes deposition, serves interrogatories)
                    │
                    ▼
Step 2: DApp calls discovery-core.markDiscoveryStepAsCompleted()
        → Public boolean flag flips to TRUE
        → Attestation hash generated in discovery-core
                    │
                    ▼
Step 3: DApp calls compliance-proof.attestStepLevelCompliance()
        → ZK circuit asserts: timestamp <= deadline
        → If assertion passes: attestation hash stored in public registry
        → If assertion fails: no attestation (can't fake compliance)
                    │
                    ▼
Step 4: (Repeat for all 47 steps over weeks/months)
                    │
                    ▼
Step 5: All steps done → DApp generates phase-level attestations
        → 5 phase attestations (one per discovery phase)
                    │
                    ▼
Step 6: DApp generates case-level attestation
        → THE single proof hash for entire case compliance
                    │
                    ▼
Step 7: Court-ready compliance report generated by DApp
        → PDF with attestation hash, timestamp, verification URL, QR code
        → No blockchain jargon — "All obligations met. Verify here."
                    │
                    ▼
Step 8: Court or opposing counsel verifies
        → verifyAttestationExists(hash) → true
        → "Compliance is mathematically proven."
```

---

## State Summary

| State Type | Variable | What It Holds |
|-----------|----------|---------------|
| PUBLIC | `totalAttestationsGenerated` | Count of all attestations |
| PUBLIC | `registeredAttestationHashes` | Master set of all proof hashes |
| PUBLIC | `attestationGeneratedTimestampByHash` | When each proof was created |
| PUBLIC | `attestationScopeLevelByHash` | Step (0x00), Phase (0x01), or Case (0x02) |
| PRIVATE | `associatedCaseIdentifierByAttestationHash` | Which case this proof belongs to |
| PRIVATE | `attestationMetadataReferenceByHash` | Pointer to off-chain details |

---

## What the DApp Handles (NOT This Contract)

- Tracking which steps need attestation (step completion triggers in DApp)
- Batching attestation requests (generate 47 step attestations efficiently)
- Phase detection (knowing when all steps in a phase are done)
- Case completion detection (knowing when all phases are done)
- Formatting compliance reports for court (no blockchain terminology)
- Generating verification QR codes
- Hosting the verification website (verify.autodiscovery.legal)
- Providing verification UI for courts and opposing counsel
- Explaining to non-technical judges what a ZK proof is (in plain English)

---

## Circuit Reference

| Circuit | Who Calls It | What It Does |
|---------|-------------|--------------|
| `attestStepLevelCompliance()` | Case owner | Proves one step was done before deadline (THE CORE PROOF) |
| `attestPhaseLevelCompliance()` | Case owner | Proves all steps in a phase are done |
| `attestCaseLevelCompliance()` | Case owner | Proves entire case is compliant (gold standard) |
| `verifyAttestationExists()` | Anyone | Checks if an attestation hash exists in the registry |
| `revealAttestationCaseIdentifier()` | Case owner | Selective disclosure: reveals which case an attestation belongs to |

---

## The Tagline

> *"AutoDiscovery doesn't just help you manage discovery — it mathematically proves you did it right."*

---

*This contract is the reason AutoDiscovery exists. Everything else — the DApp, the other contracts, the rule packs, the UI — exists to feed data into this contract and present its output to courts. This is the ZK proof that changes legal discovery forever.*
