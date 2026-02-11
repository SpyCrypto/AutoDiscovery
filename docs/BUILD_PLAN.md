# AutoDiscovery — Build Plan

> **Living document** — updated as work progresses.
> Last updated: February 10, 2026

---

## Status Key

- ⬜ Not started
- 🔨 In progress
- ✅ Complete
- ⏸️ Blocked

---

## Phase 0: Foundation (Current Sprint)

Everything that must exist before any feature code.

### 0.1 ✅ Project Planning & Research
- ✅ Project docs written (overview, customer matrix, jurisdiction deep dive, UI notes, team)
- ✅ Deep dive review doc for cross-LLM feedback
- ✅ Grok data structure review (Ohio used as schema design exercise — archived in `docs/reference/`)
- ✅ Jurisdiction rollout order confirmed: **ID (primary) → OH → WA → UT → CA → NY**
- ✅ 6-entity data model agreed: Case, DiscoveryStep, JurisdictionRulePack, Document, Party, ComplianceAttestation
- ✅ 4-contract architecture agreed: discovery-core, jurisdiction-registry, compliance-proof, expert-witness

### 0.2 ⬜ Pragma & Compiler Version Resolution
- Resolve conflict: MCP reference examples use `>= 0.16 && <= 0.18`, MeshJS starter uses `>= 0.19` with compiler `+0.27.0`
- Test compilation of new contracts against SDK packages (`@midnight-ntwrk/* 3.0.0-alpha.11`)
- Decision: Start with `>= 0.16 && <= 0.18` (per global rules + MCP validation); bump only if compilation fails
- Update `package.json` compact script if compiler version changes

### 0.3 ✅ TypeScript Data Model (`autodiscovery-contract/src/types/`)
Create strongly-typed interfaces (no `Record<string, any>` — everything explicit).

**Files to create:**
```
autodiscovery-contract/src/types/
├── case.ts                    # Case entity
├── discovery-step.ts          # Discovery step/obligation
├── jurisdiction-rule-pack.ts  # Rule pack with params
├── document.ts                # Document production tracking
├── party.ts                   # Party/attorney/expert
├── compliance-attestation.ts  # ZK proof metadata
├── enums.ts                   # Shared enums (status, role, etc.)
├── deadline.ts                # Deadline computation types
└── index.ts                   # Barrel export
```

**Key design decisions:**
- `DeadlineSpec` type: `{ offset: number; unit: 'calendarDays' | 'businessDays'; fromEvent: string }` — relative deadlines as data, computed to absolute at runtime
- `SchedulingOverride`: Explicit fields (not `any`) — `fieldName`, `originalDeadline`, `overriddenDeadline`, `orderReference`, `enteredBy`
- `JurisdictionRule.params`: Typed union per rule category, not generic object
- `StepStatus`: `'notStarted' | 'inProgress' | 'completed' | 'overdue' | 'waived' | 'objected' | 'protected'`
- Rule hierarchy support: `federal → state → county → judge` override chain

### 0.4 ⬜ Project Folder Restructure
Rename/reorganize from starter template to AD-specific structure.

**Contract package — rename and extend:**
```
autodiscovery-contract/src/
├── contracts/
│   ├── discovery-core.compact           # Case lifecycle
│   ├── jurisdiction-registry.compact    # Rule storage & lookup
│   ├── compliance-proof.compact         # ZK attestation generation
│   └── expert-witness.compact           # Phase 2: med-mal experts
├── types/                               # TypeScript interfaces (0.3)
├── witnesses/
│   ├── discovery-witnesses.ts           # Witness implementations for core
│   ├── registry-witnesses.ts            # Witness implementations for registry
│   └── compliance-witnesses.ts          # Witness implementations for proofs
├── rule-packs/
│   ├── idaho-ircp.json                  # Idaho rules data (PRIMARY — MVP)
│   └── federal-frcp.json               # Federal rules baseline (for removal cases)
├── managed/                             # Compiled output (auto-generated)
├── test/
│   ├── discovery-core.test.ts
│   ├── jurisdiction-registry.test.ts
│   └── compliance-proof.test.ts
├── counter.compact                      # KEEP: starter reference (delete later)
├── index.ts
├── config.ts
└── logger.ts
```

**Frontend package — replace starter pages:**
```
frontend-vite-react/src/
├── components/
│   ├── ui/                              # shadcn/ui (keep existing)
│   └── ad/                              # AD-specific components
│       ├── jurisdiction-banner.tsx       # "📍 Idaho — IRCP Active"
│       ├── compliance-traffic-light.tsx  # 🟢🟡🔴 status indicator
│       ├── step-checklist.tsx            # Discovery step list with statuses
│       ├── deadline-countdown.tsx        # Days remaining / overdue
│       ├── outlier-flag.tsx              # Collapsible outlier + explanation
│       └── case-card.tsx                # Case summary card for dashboard
├── modules/
│   └── midnight/                        # Keep existing wallet/counter SDK
│       ├── discovery-sdk/               # NEW: Discovery contract integration
│       │   ├── contexts/
│       │   │   └── index.tsx
│       │   └── hooks/
│       │       ├── use-case.ts
│       │       ├── use-discovery-steps.ts
│       │       └── use-compliance.ts
│       ├── counter-sdk/                 # KEEP for now (reference)
│       └── wallet-widget/               # KEEP (we need this)
├── pages/
│   ├── dashboard/index.tsx              # Case overview, deadlines, compliance
│   ├── new-case/index.tsx               # Step-by-step case creation wizard
│   ├── case-view/index.tsx              # Single case management
│   ├── compliance-report/index.tsx      # ZK proof summary export
│   ├── jurisdiction-browser/index.tsx   # Compare rules across states
│   ├── counter/index.tsx                # KEEP for now (reference)
│   ├── wallet-ui/index.tsx              # KEEP
│   └── home/index.tsx                   # Redesign as AD landing
├── services/
│   ├── deadline-engine.ts               # Compute deadlines from rule packs
│   ├── rule-loader.ts                   # Load/parse jurisdiction rule packs
│   └── compliance-tracker.ts            # Track step completion, generate alerts
└── lib/
    └── constants.ts                     # Jurisdiction codes, status enums, etc.
```

---

## Phase 1: Smart Contracts (Compact)

The core blockchain layer. Each contract is a single-purpose module.

### 1.1 ⬜ `discovery-core.compact` — Case Lifecycle

**Purpose**: Manage case creation, step tracking, and status transitions. Jurisdiction-agnostic — doesn't know about any specific rules.

**Compact design:**
```compact
pragma language_version >= 0.16 && <= 0.18;
import CompactStandardLibrary;

// PUBLIC STATE — visible to all, proves case exists and compliance status
export ledger caseCount: Counter;
export ledger caseStatuses: Map<Field, Uint<8>>;           // caseId → status enum
export ledger caseJurisdictions: Map<Field, Bytes<8>>;     // caseId → jurisdiction code
export ledger stepCompletionFlags: Map<Field, Boolean>;    // stepHash → completed?
export ledger attestationHashes: Set<Bytes<32>>;           // all proof hashes

// PRIVATE STATE — case details hidden
ledger caseOwners: Map<Field, Opaque<"address">>;          // caseId → owner
ledger stepDeadlines: Map<Field, Field>;                   // stepHash → deadline timestamp
ledger stepStatuses: Map<Field, Uint<8>>;                  // stepHash → detailed status

// WITNESSES
witness getCaller(): Opaque<"address">;
witness computeCaseId(caseNumber: Bytes<32>, jurisdiction: Bytes<8>): Field;
witness computeStepHash(caseId: Field, ruleRef: Bytes<32>): Field;
witness getCurrentTimestamp(): Field;

// CIRCUITS
export circuit createCase(caseNumber: Bytes<32>, jurisdiction: Bytes<8>): Field
export circuit addStep(caseId: Field, ruleRef: Bytes<32>, deadline: Field): Field
export circuit completeStep(caseId: Field, stepHash: Field): Bytes<32>
export circuit getComplianceStatus(caseId: Field): Boolean
```

**Key patterns used:**
- Commitment scheme for case IDs (hash of case number + jurisdiction)
- Step hashes for unique step identification without revealing details
- `disclose` for selective compliance proof export
- Owner-only access via `getCaller()` witness

### 1.2 ⬜ `jurisdiction-registry.compact` — Rule Storage

**Purpose**: On-chain registry of jurisdiction metadata. Rules themselves stored as JSON off-chain; registry stores hashes and version info for auditability.

**Compact design:**
```compact
pragma language_version >= 0.16 && <= 0.18;
import CompactStandardLibrary;

// PUBLIC — which jurisdictions are registered and their versions
export ledger jurisdictionCount: Counter;
export ledger registeredJurisdictions: Set<Bytes<8>>;       // jurisdiction codes
export ledger rulePackHashes: Map<Bytes<8>, Bytes<32>>;     // code → hash of rule JSON
export ledger rulePackVersions: Map<Bytes<8>, Uint<32>>;    // code → version number

// PRIVATE — full rule metadata
ledger rulePackData: Map<Bytes<8>, Field>;                  // code → reference to off-chain data

// ACCESS CONTROL
export ledger registryAdmin: Opaque<"address">;

witness getCaller(): Opaque<"address">;
witness computeRuleHash(jurisdictionCode: Bytes<8>, ruleData: Field): Bytes<32>;

// CIRCUITS
export circuit registerJurisdiction(code: Bytes<8>, ruleHash: Bytes<32>): []
export circuit updateRulePack(code: Bytes<8>, newRuleHash: Bytes<32>, newVersion: Uint<32>): []
export circuit verifyRuleVersion(code: Bytes<8>, expectedHash: Bytes<32>): Boolean
```

**Design rationale:**
- Rules as JSON off-chain (fast to update, no on-chain size limits)
- Hash anchoring on-chain (immutable proof of which rules were applied)
- Version tracking (audit trail: "case used Idaho IRCP v2024.07")
- Admin-controlled updates (governance for rule changes)

### 1.3 ⬜ `compliance-proof.compact` — ZK Attestations

**Purpose**: Generate and verify compliance attestations. The "killer feature" — mathematical proof that discovery obligations were met.

**Compact design:**
```compact
pragma language_version >= 0.16 && <= 0.18;
import CompactStandardLibrary;

// PUBLIC — attestation registry
export ledger attestationCount: Counter;
export ledger attestations: Set<Bytes<32>>;                    // all attestation hashes
export ledger attestationTimestamps: Map<Bytes<32>, Field>;    // hash → timestamp
export ledger attestationScopes: Map<Bytes<32>, Uint<8>>;      // hash → scope (step/phase/case)

// PRIVATE — attestation details
ledger attestationCases: Map<Bytes<32>, Field>;                // hash → caseId
ledger attestationMetadata: Map<Bytes<32>, Field>;             // hash → metadata ref

witness getCaller(): Opaque<"address">;
witness getCurrentTimestamp(): Field;
witness computeAttestationHash(caseId: Field, stepHash: Field, timestamp: Field): Bytes<32>;

// CIRCUITS
export circuit attestStepCompliance(
    caseId: Field, stepHash: Field, deadline: Field
): Bytes<32>
// Proves: step was completed, timestamp <= deadline, generates immutable hash

export circuit attestPhaseCompliance(
    caseId: Field, phaseId: Uint<8>, stepCount: Uint<16>, completedCount: Uint<16>
): Bytes<32>
// Proves: all steps in phase completed

export circuit attestCaseCompliance(caseId: Field): Bytes<32>
// Proves: entire case discovery completed

export circuit verifyAttestation(attestationHash: Bytes<32>): Boolean
// Anyone can verify an attestation exists and check its timestamp

export circuit revealAttestationDetails(attestationHash: Bytes<32>): Field
// Selective disclosure: court can see proof details
```

**ZK magic here:**
- `attestStepCompliance` proves "this step was completed before its deadline" without revealing what the step was or what documents were involved
- Courts verify by checking the attestation hash exists on-chain + its timestamp
- `disclose` used selectively — reveal only what's needed for court submission

### 1.4 ⬜ `expert-witness.compact` — Phase 2

**Purpose**: Med-mal specific expert witness tracking. Separate contract because it has distinct privacy needs (HIPAA, credential verification).

**Deferred to Phase 2** — design spec only for now.

**Will cover:**
- Expert qualification attestation (prove qualifications without revealing identity)
- W-9/I-9 submission tracking (prove collected without revealing tax data)
- Standard of Care documentation status
- Affidavit of merit compliance (Idaho specific)

---

## Phase 2: Deadline Engine & Rule Packs

The off-chain automation brain.

### 2.1 ⬜ Deadline Computation Engine (`services/deadline-engine.ts`)

**Purpose**: Convert relative deadlines from rule packs into absolute dates, respecting business day calculations.

**Core logic:**
```
Input:  triggerEvent (date) + DeadlineSpec (offset, unit, fromEvent)
Output: computedDeadline (date)
Rules:  
  - Calendar days: count all days
  - Business days: exclude weekends + federal/state holidays
  - IRCP Rule 6: Idaho business day computation rules
  - Scheduling order overrides replace computed deadlines
```

**Functions:**
- `computeDeadline(triggerDate, spec, jurisdiction)` → `Date`
- `isBusinessDay(date, jurisdiction)` → `boolean`
- `getHolidays(jurisdiction, year)` → `Date[]`
- `applyOverride(computedDeadline, override)` → `Date`
- `getWarningThresholds(deadline)` → `{ warning: Date, urgent: Date, critical: Date }`

### 2.2 ⬜ Idaho Rule Pack (`rule-packs/idaho-ircp.json`)

**First jurisdiction implementation.** Structured as loadable data module.

**Schema:**
```json
{
  "jurisdictionCode": "ID",
  "jurisdictionName": "Idaho",
  "rulesTitle": "Idaho Rules of Civil Procedure (IRCP)",
  "version": "2024.01",
  "effectiveDate": "2024-01-01",
  "hierarchy": ["federal-frcp", "idaho-ircp"],
  "defaults": {
    "responseDays": 28,
    "businessDayRule": "exclude_weekends_holidays_under_7"
  },
  "rules": [
    {
      "ruleId": "IRCP-26a",
      "ruleRef": "IRCP Rule 26(a)",
      "category": "initial-disclosures",
      "description": "Mandatory initial disclosures",
      "type": "mandatory",
      "deadline": { "offset": 30, "unit": "calendarDays", "fromEvent": "joinder-deadline" },
      "exemptions": [],
      "params": {},
      "dependencies": [],
      "sanctions": "IRCP Rule 37 — motion to compel, expenses, evidence exclusion"
    }
  ],
  "caseTypeOverrides": {
    "med-mal": {
      "exemptRules": [],
      "additionalRules": ["affidavit-of-merit"]
    }
  }
}
```

**Spy validation required** — we'll draft from IRCP research, then have Spy verify every rule, deadline, and exemption.

### 2.3 ⬜ Federal Baseline (`rule-packs/federal-frcp.json`)

**FRCP as the comparison baseline** — Idaho state cases get removed to federal, so we need this for the jurisdiction-switch workflow.

### 2.4 ⏸️ Future Jurisdictions (Post-MVP)

Ohio research archived in `docs/reference/`. Additional jurisdictions (OH, WA, UT, CA, NY) will be added as rule pack JSON files after Idaho is validated and working. No code changes needed — just new data files.

### 2.5 ⬜ Rule Loader Service (`services/rule-loader.ts`)

**Purpose**: Load rule pack JSON, validate schema, merge with county/judge overrides, and feed to the deadline engine.

**Functions:**
- `loadRulePack(jurisdictionCode)` → `JurisdictionRulePack`
- `mergeOverrides(basePack, countyRules?, judgeOrder?)` → `JurisdictionRulePack`
- `getRulesForCaseType(pack, caseType)` → `JurisdictionRule[]`
- `generateStepsForCase(case)` → `DiscoveryStep[]`

---

## Phase 3: Frontend (React)

Replace starter template with AD-specific UI.

### 3.1 ⬜ AD Component Library (`components/ad/`)
Build reusable components before pages:
- **JurisdictionBanner** — always-visible top bar showing active jurisdiction
- **ComplianceTrafficLight** — 🟢🟡🔴 with tooltip showing details
- **StepChecklist** — sortable/filterable list of discovery steps
- **DeadlineCountdown** — days remaining with color escalation
- **OutlierFlag** — collapsible toggle + explanation textarea
- **CaseCard** — dashboard summary with key metrics

### 3.2 ⬜ Dashboard Page (`pages/dashboard/`)
- Active case cards with compliance scores
- Global deadline timeline (nearest 5 deadlines across all cases)
- Compliance aggregate: "X of Y cases fully compliant"
- Quick actions: new case, view overdue items

### 3.3 ⬜ New Case Wizard (`pages/new-case/`)
Multi-step wizard:
1. **Jurisdiction** — select state (auto-loads rules) + optional county
2. **Case Type** — med-mal, contract, employment, etc. (filters rules)
3. **Case Details** — case number, filing date, trial date
4. **Parties** — add plaintiff(s), defendant(s), attorneys
5. **Review** — confirm, deploy contract, generate initial steps
6. **Wallet signature** — single Lace confirmation (hidden complexity)

### 3.4 ⬜ Case View Page (`pages/case-view/`)
- Step-by-step discovery checklist with statuses
- Deadline timeline visualization
- Document production tracker
- Compliance report generation button
- Scheduling order override entry

### 3.5 ⬜ Compliance Report Page (`pages/compliance-report/`)
- ZK proof summary per step
- Exportable PDF with verification QR code
- Attestation hash lookup
- Court-ready formatting (no blockchain terminology)

### 3.6 ⬜ Jurisdiction Browser Page (`pages/jurisdiction-browser/`)
- Side-by-side comparison of 2+ jurisdictions (Idaho vs. Federal for MVP)
- Color-coded differences (interrogatory limits, response days, deposition caps)
- Idaho IRCP vs. FRCP comparison as initial content

### 3.7 ⬜ Navigation & Layout Updates
- Replace "Midnight Starter Template" branding with AutoDiscovery
- Add sidebar navigation (Dashboard, Cases, New Case, Jurisdiction, Settings)
- Update `index.html` title/favicon
- Keep wallet widget in header (connected indicator, not full page)

---

## Phase 4: Integration & Testing

### 4.1 ⬜ Contract Compilation & Deployment
- Compile all 3 Compact contracts (resolve pragma/compiler issues)
- Deploy to Midnight testnet
- Generate TypeScript bindings from compiled output
- Wire up frontend hooks to contract APIs

### 4.2 ⬜ End-to-End Workflow Test
- Create case → add steps → complete steps → generate attestation → verify proof
- Test with Idaho IRCP rule pack (primary focus)
- Test jurisdiction switch (Idaho state → federal removal)

### 4.3 ⬜ Spy Validation
- Walk Spy through Idaho rule pack — verify every rule, deadline, exemption
- Have Spy test the New Case Wizard with a real med-mal scenario
- Collect feedback on workflow accuracy and missing steps

### 4.4 ⬜ Deploy to Vercel
- Configure Vercel deployment (Spy's subscription)
- Set up environment variables
- Custom domain: autodiscovery.legal (if available)

---

## Phase 5: Hackathon Polish (Pre-April 2026)

### 5.1 ⬜ Demo Flow
- Scripted 5-minute demo: "From case creation to compliance proof"
- Show jurisdiction detection → rule loading → step generation → deadline tracking → ZK attestation
- Highlight the "aha moment": prove compliance without revealing case data

### 5.2 ⬜ Build Club Homework Completion
- Customer Analysis Matrix (Week 1) — needs actual data filled in
- Any additional Build Club deliverables

### 5.3 ⬜ Presentation Materials
- Pitch deck (problem → solution → demo → market → team)
- One-pager for judges
- README polish for GitHub showcase

---

## Dependency Graph

```
Phase 0.2 (pragma resolution)
    │
    ├──► Phase 0.3 (TypeScript types) ──► Phase 2 (deadline engine + rule packs)
    │                                          │
    ├──► Phase 0.4 (folder restructure)        │
    │         │                                │
    │         ├──► Phase 1 (contracts)         │
    │         │         │                      │
    │         │         └──────────────────────┼──► Phase 4 (integration)
    │         │                                │         │
    │         └──► Phase 3 (frontend) ─────────┘         └──► Phase 5 (polish)
    │
    └──► All phases need this resolved first
```

---

## Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Pragma/compiler version incompatibility | Blocks all contract work | Test early in Phase 0.2; fallback to starter template version if needed |
| Compact language limitations for complex data | May need to simplify on-chain model | Keep on-chain minimal; heavy logic stays off-chain in TypeScript |
| Idaho IRCP rules inaccuracy | Wrong deadlines = useless product | Spy validates every rule before demo — she's THE Idaho expert |
| Hackathon deadline pressure | Scope creep | MVP = Idaho only, med-mal case type, basic dashboard. Cut features, not quality |
| Lace wallet UX friction | Users struggle to connect | Comprehensive onboarding wizard, error handling, fallback instructions |

---

## Build Order (What Gets Built Next)

**Immediate next steps (this session or next):**

1. **Resolve pragma version** — test `>= 0.16 && <= 0.18` against current SDK
2. **Create TypeScript interfaces** — the data model everything builds on
3. **Scaffold contract files** — create the .compact files with full implementations
4. **Create Idaho rule pack JSON** — first jurisdiction data
5. **Build deadline engine** — the automation core

**Each step is independently valuable** — even if we only finish 1-3 before the hackathon, we have a working contract layer.

---

*AutoDiscovery Build Plan — John + Penny (Feb 2026)*
