# Discovery Core — Workflow & Explanation

> **Contract:** `discovery-core.compact`  
> **Type:** Per-user instance (each party deploys their own)  
> **Purpose:** Case lifecycle management — creation, step tracking, deadlines, status transitions

---

## What This Contract Does

This is the **backbone** of AutoDiscovery. It manages the lifecycle of legal cases:
- **Case creation** — Register a new case on-chain (hash of case number + jurisdiction)
- **Step tracking** — Add discovery obligations from jurisdiction rule packs
- **Status management** — Track step completion (NOT_STARTED → IN_PROGRESS → COMPLETED/OVERDUE)
- **Attestation generation** — When a step is completed, generate a hash that feeds into `compliance-proof`

**Crucially, this contract is JURISDICTION-AGNOSTIC.** It doesn't know about Idaho IRCP or Federal FRCP. It just tracks obligations and their completion. The DApp's Rule Loader and Deadline Engine handle the jurisdiction-specific logic.

---

## Why It Needs to Be a Smart Contract

- **Proves case exists** on-chain without revealing which case (case ID is a hash)
- **Proves steps completed** via public boolean flags, without revealing what the step was
- **Generates attestation hashes** when steps are completed (feeds `compliance-proof`)
- **Owner-gated operations** — Only the case owner can modify their case (wallet-based auth)

---

## Workflow

### Step 1: Create a New Case

```
WHO:    Attorney (the party managing discovery)
WHEN:   When a new case is filed or when they adopt AutoDiscovery for an existing case
TRIGGER: User completes the New Case Wizard in the DApp

WHAT THE DAPP DOES FIRST:
  1. User selects jurisdiction (e.g., Idaho)
  2. DApp loads rule pack JSON from rule-packs/ folder
  3. DApp verifies rule pack hash against jurisdiction-registry on-chain
  4. User enters case details (case number, filing date, trial date, parties)

WHAT HAPPENS ON-CHAIN (createNewCase):
  WITNESS: Computes caseUniqueIdentifier = hash("CV-2026-03421" + "ID")
           The actual case number NEVER appears on-chain.
  
  PUBLIC:  totalCasesCreated incremented
  PUBLIC:  caseStatusByCaseIdentifier[hash] = 0x01 (IN_PROGRESS)
  PUBLIC:  jurisdictionCodeByCaseIdentifier[hash] = "ID"
  PRIVATE: caseOwnerAddressByCaseIdentifier[hash] = caller's wallet address

  RETURNS: The case unique identifier (hash) for all future operations

WHAT THE PUBLIC SEES:
  "A case exists in Idaho. It's in progress."
  They do NOT see: case number, parties, filing date, trial date, judge, or anything else.
```

### Step 2: Add Discovery Steps

```
WHO:    The case owner (automatically via DApp after case creation)
WHEN:   Immediately after case creation; also when scheduling orders change
TRIGGER: DApp's Deadline Engine generates steps from the jurisdiction rule pack

WHAT THE DAPP DOES FIRST:
  1. Deadline Engine reads Idaho IRCP rule pack
  2. Computes 47 discovery steps with absolute deadline dates
  3. For each step, prepares: jurisdictionRuleReference (hash of rule ID) + deadline timestamp

WHAT HAPPENS ON-CHAIN (addDiscoveryStepToCase, called 47 times):
  AUTHORIZATION: Verifies caller == case owner
  
  WITNESS: Computes stepUniqueHash = hash(caseId + ruleReference)
           The actual rule name NEVER appears on-chain.
  
  PUBLIC:  isStepCompletedByStepHash[stepHash] = false
  PRIVATE: stepDeadlineTimestampByStepHash[stepHash] = deadline
  PRIVATE: detailedStepStatusByStepHash[stepHash] = 0x00 (NOT_STARTED)

  RETURNS: The step unique hash for tracking

WHAT THE PUBLIC SEES:
  "47 anonymous steps exist. All are incomplete."
  They do NOT see: what the steps are, when they're due, or which rules created them.
```

### Step 3: Work Happens (DApp Only — No Smart Contract)

```
This is the bulk of the attorney's work. For weeks or months:
  • Documents are reviewed, categorized, and produced
  • Depositions are taken
  • Interrogatories are exchanged
  • Expert reports are prepared

ALL of this work is tracked in the DApp's local database.
The smart contract is NOT involved during this phase.
The contract only gets called when a step is COMPLETED (next step).
```

### Step 4: Mark a Step as Completed

```
WHO:    The case owner
WHEN:   When a discovery obligation has been fulfilled
TRIGGER: Attorney clicks "Mark Complete" on a step in the DApp

WHAT HAPPENS ON-CHAIN (markDiscoveryStepAsCompleted):
  AUTHORIZATION: Verifies caller == case owner
  
  PUBLIC:  isStepCompletedByStepHash[stepHash] = true (was false)
  PRIVATE: detailedStepStatusByStepHash[stepHash] = 0x02 (COMPLETED)
  
  ATTESTATION GENERATION:
    • Gets current timestamp from witness
    • Generates completionAttestationHash via disclose(embed<Bytes<32>>())
    • Stores hash in completionAttestationHashes (public set)
  
  RETURNS: The attestation hash (used by compliance-proof contract next)

WHAT THE PUBLIC SEES:
  "One of the 47 steps is now complete. An attestation was generated."
  They do NOT see: which step, what was done, or when it was due.
```

### Step 5: Check Overall Compliance

```
WHO:    Anyone (reads public state only)
WHEN:   Anytime — for dashboards, audits, court verification
TRIGGER: DApp dashboard polling, or explicit verification request

WHAT HAPPENS ON-CHAIN (checkCaseComplianceStatus):
  • Looks up caseStatusByCaseIdentifier[caseId]
  • Returns true if status == 0x02 (COMPLETED)
  • Returns false otherwise

NOTE: This is a simplified case-level check. For granular step-by-step
      compliance verification, the compliance-proof contract is used.
```

---

## How This Contract Connects to the Others

```
                        ┌─────────────────────────┐
                        │  jurisdiction-registry   │
                        │  (shared singleton)      │
                        │                          │
                        │  "Which rules are in     │
                        │   effect for Idaho?"     │
                        └───────────┬─────────────┘
                                    │ DApp reads rule pack hash
                                    │ to verify rules are current
                                    ▼
┌────────────────────────────────────────────────────────────────┐
│                      discovery-core (this contract)             │
│                                                                  │
│  createNewCase → addDiscoveryStepToCase → markStepAsCompleted   │
│                                                  │               │
│                                     Generates attestation hash   │
└──────────────────────────────────────────────────┬──────────────┘
                                                   │
                              Attestation hash flows to
                                                   │
                                                   ▼
                        ┌─────────────────────────┐
                        │  compliance-proof        │
                        │                          │
                        │  "Prove this step was    │
                        │   done before deadline"  │
                        └─────────────────────────┘
```

Documents flow through `document-registry` in parallel — that contract handles hash anchoring and Merkle proofs independently of step tracking.

---

## State Summary

| State Type | Variable | What It Holds |
|-----------|----------|---------------|
| PUBLIC | `totalCasesCreated` | Activity counter |
| PUBLIC | `caseStatusByCaseIdentifier` | Case status: IN_PROGRESS / COMPLETED |
| PUBLIC | `jurisdictionCodeByCaseIdentifier` | "ID", "UT", "FEDERAL", etc. |
| PUBLIC | `isStepCompletedByStepHash` | Boolean per step: done or not done |
| PUBLIC | `completionAttestationHashes` | Set of all attestation hashes |
| PRIVATE | `caseOwnerAddressByCaseIdentifier` | Who owns each case |
| PRIVATE | `stepDeadlineTimestampByStepHash` | When each step is due |
| PRIVATE | `detailedStepStatusByStepHash` | Full lifecycle status per step |

---

## What the DApp Handles (NOT This Contract)

- Generating steps from jurisdiction rule packs (Deadline Engine + Rule Loader)
- Computing absolute deadline dates from relative rules
- Tracking step details (descriptions, rule references, dependencies)
- Scheduling order overrides (when a judge changes a deadline)
- Deadline cascade logic (when one deadline moves, dependents shift)
- Dashboard visualization (traffic lights, countdown timers, overdue alerts)
- Step dependency management (some steps can't start until others complete)
- Notification alerts ("Expert report due in 7 days")

---

## Circuit Reference

| Circuit | Who Calls It | What It Does |
|---------|-------------|--------------|
| `createNewCase()` | Case owner | Registers a new case on-chain |
| `addDiscoveryStepToCase()` | Case owner | Adds an obligation with a deadline |
| `markDiscoveryStepAsCompleted()` | Case owner | Completes a step, generates attestation |
| `checkCaseComplianceStatus()` | Anyone | Checks if case is fully compliant |

---

## Status Enum Reference

| Value | Name | Meaning |
|-------|------|---------|
| 0x00 | NOT_STARTED | Step exists but no work has begun |
| 0x01 | IN_PROGRESS | Step is being worked on |
| 0x02 | COMPLETED | Step finished successfully |
| 0x03 | OVERDUE | Deadline passed without completion |
| 0x04 | WAIVED | Parties agreed to skip this step |
| 0x05 | OBJECTED | Opposing party objected to this obligation |
| 0x06 | PROTECTED | Step is under protective order |

---

*This contract is the lifecycle engine. It tracks WHAT needs to happen and WHETHER it happened. The DApp figures out the details. The compliance-proof contract proves it to courts.*
