# Grok Prompt: Discovery Management Data Structure (Ohio Focus)

Copy everything below the line into Grok.

---

I'm building a privacy-preserving legal discovery management platform called AutoDiscovery. I need your help designing the data model and automation structure, starting with Ohio civil procedure as the first jurisdiction implementation.

## Context

Legal discovery is the pre-trial phase where opposing parties in civil litigation exchange evidence. It's governed by different rules in every jurisdiction — federal courts follow FRCP, and each state has its own civil procedure rules. Ohio uses the Ohio Rules of Civil Procedure (Ohio Civ.R.).

The platform will:
- Automate discovery workflow management (step-by-step checklists, deadline tracking, document production tracking)
- Be jurisdiction-aware — a geographic oracle detects which rules apply and loads the correct rule set
- Generate immutable compliance proofs using zero-knowledge cryptography (built on the Midnight blockchain)
- Support selective disclosure — prove compliance without revealing underlying case data
- Eventually scale to multiple jurisdictions (Ohio first, then Idaho, Utah, Washington, New York, California, and federal FRCP)

The smart contracts are written in Compact (Midnight's ZK language), which has public ledger state (visible to all) and private local state (visible only to the owning party). The frontend is React + TypeScript.

## What I Need From You

### 1. Ohio Civil Procedure Discovery Rules Deep Dive

Please provide a structured breakdown of Ohio's discovery rules (Ohio Civ.R. 26-37 primarily), covering:

- **Mandatory initial disclosures** — Does Ohio require them? What must be disclosed and when?
- **Interrogatory rules** — Limits on number? Format requirements? Timing?
- **Request for Production of Documents** — Ohio-specific requirements, timing, objection procedures
- **Deposition rules** — Limits, notice requirements, duration caps
- **Request for Admissions** — Limits, deemed-admitted rules, timing
- **Expert witness disclosure** — Requirements for expert reports, designation deadlines, Standard of Care documentation for medical malpractice
- **Privilege log requirements** — Format, timing, level of specificity required
- **E-discovery rules** — Any Ohio-specific electronic discovery requirements
- **Sanctions for non-compliance** — What happens when discovery obligations aren't met (Ohio Civ.R. 37)
- **Key deadlines and timelines** — Discovery cutoff relative to trial date, response windows for each discovery type
- **Medical malpractice specifics** — Ohio has specific rules for med-mal cases (affidavit of merit, expert requirements). Please detail these.
- **Subpoena rules** — Ohio Civ.R. 45, including interstate subpoenas under UIDDA if Ohio has adopted it

### 2. Data Schema Design

Given the rules above, design a data model that can represent Ohio's discovery process generically enough to extend to other jurisdictions later. I need:

**A. Case Entity**
- What fields define a case in the context of discovery?
- How should jurisdiction be represented (single vs. multi-jurisdiction cases)?
- How should case type (med-mal, contract, employment, etc.) affect the discovery workflow?

**B. Discovery Step / Obligation Entity**
- What's the right granularity for a "discovery step"? Per-rule? Per-action? Per-document?
- How should deadlines be represented (absolute dates vs. relative to triggering events)?
- How should step dependencies be modeled (e.g., "can't file expert report until initial disclosures are complete")?
- What statuses make sense (not started, in progress, completed, overdue, waived, objected)?

**C. Jurisdiction Rule Pack Entity**
- How should jurisdiction rules be structured as data (not hardcoded logic)?
- What fields are needed to represent a rule generically across states?
- How do you handle rules that are parametric (e.g., Utah's tiered discovery by damages amount) vs. binary (yes/no requirement)?
- How should rule versions be tracked (Ohio amends rules periodically)?

**D. Document / Production Entity**
- How should documents be tracked through the production pipeline (identified → reviewed → privileged/produced)?
- Privilege log entry schema
- Bates number tracking
- Metadata needed for chain of custody

**E. Party / Attorney Entity**
- What party information matters for discovery automation?
- How should expert witnesses be modeled (separate from party)?
- W-9/I-9 tracking for expert witnesses

**F. Compliance Attestation Entity**
- What constitutes a provable compliance event?
- What metadata should accompany a zero-knowledge proof of compliance?
- How granular should attestations be (per-step, per-phase, per-case)?

### 3. Automation Triggers

For each major discovery obligation in Ohio, identify:
- **Trigger event** — What starts the clock?
- **Deadline calculation** — How is the deadline computed (business days? calendar days? from what event)?
- **Warning thresholds** — When should the system alert (7 days before? 3 days? 1 day?)
- **Escalation path** — What happens if the deadline passes without action?
- **Dependency chain** — What other steps are blocked until this one completes?

### 4. Ohio vs. Federal Comparison

Since many Ohio cases end up in federal court (diversity jurisdiction), provide a side-by-side comparison of:
- Ohio Civ.R. discovery rules vs. FRCP discovery rules
- Key divergence points where getting the wrong ruleset would cause compliance failure
- How the data model should handle a case that starts in state court and gets removed to federal

### 5. Edge Cases & Pitfalls

What are the non-obvious gotchas in Ohio discovery that would trip up an automation system?
- Local court rules that override state rules?
- Judge-specific scheduling orders that override default timelines?
- Ohio Commercial Docket cases (if applicable)?
- Protective orders and their effect on the workflow?
- Third-party discovery complications?
- Cases involving governmental entities (sovereign immunity effects on discovery)?

### 6. Schema Output Format

Please provide your recommended schema in a format I can translate to:
- **TypeScript interfaces** (for the React frontend and API layer)
- **Compact ledger state** (for the blockchain — what needs to be public vs. private)

For the blockchain split, think about it this way:
- **Public (ledger)**: Case ID, jurisdiction code, compliance status, attestation hashes, timestamps — things that prove compliance without revealing content
- **Private (local/witness)**: Party names, document contents, privilege designations, attorney notes — sensitive case data that should never be on a public ledger

### 7. Scalability Considerations

How should the data model be designed so that adding a second jurisdiction (say Idaho IRCP) requires:
- Adding data (new rule entries) — YES
- Changing schema — NO
- Changing workflow logic — NO (or minimal)
- Changing UI — NO (auto-adapts to loaded rules)

The goal is "rule packs as pluggable data modules" — not hardcoded jurisdiction logic.

## Constraints

- The platform targets paralegals and litigation attorneys at small-to-mid-size firms
- Users are risk-averse and not tech-savvy — the system must be dead simple
- Medical malpractice is the primary use case (highest pain, most complex discovery)
- The blockchain layer must be invisible to users — no crypto terminology in the UX
- Zero-knowledge proofs are used to create immutable compliance records that could be submitted as evidence in court
- The system needs to handle the reality that judges issue scheduling orders that override default rules — the data model must accommodate overrides

## What I DON'T Need

- Don't worry about the blockchain implementation details (I have a Midnight developer handling that)
- Don't design the UI (I have that covered)
- Focus purely on the **data structure, rule representation, automation logic, and Ohio-specific rules**

Please be thorough and cite specific Ohio rule numbers where applicable. I want this to be accurate enough that a retired Ohio paralegal would nod along reading it.
