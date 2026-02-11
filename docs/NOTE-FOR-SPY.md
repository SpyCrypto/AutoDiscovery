# Hey Spy! — Build Plan Notes from John & Penny

> **Date**: February 10, 2026
> **From**: John (via Penny, his AI dev assistant on the ASUS Pro Art laptop)

---

## What's Happened This Week

We've been doing a deep dive into the architecture for AutoDiscovery. Here's a quick summary of what we've done:

1. **Grok Review** — John fed a detailed prompt into Grok asking for a data schema for automating discovery management. We used Ohio as a test case for the schema design exercise. That research is archived in `docs/reference/` for later use — **Idaho is our primary focus now.**

2. **Data Model** — We've converged on a 6-entity data model that both Penny and Grok independently agreed on:
   - **Case** — Case metadata, jurisdiction, type, parties, scheduling overrides
   - **DiscoveryStep** — Individual obligations with deadlines, dependencies, statuses
   - **JurisdictionRulePack** — Loadable data modules per state (rules as data, not hardcoded logic)
   - **Document** — Production tracking, Bates numbers, privilege logs, chain of custody
   - **Party** — Plaintiffs, defendants, attorneys, expert witnesses, W-9/I-9 tracking
   - **ComplianceAttestation** — ZK proof records that can be submitted as court evidence

3. **Smart Contract Architecture** — Four modular Compact contracts on Midnight:
   - `discovery-core.compact` — Case lifecycle (create, add steps, complete steps, attest)
   - `jurisdiction-registry.compact` — On-chain registry of rule pack hashes for audit trail
   - `compliance-proof.compact` — ZK attestation generation (the "killer feature")
   - `expert-witness.compact` — Phase 2, med-mal specific expert management

4. **Jurisdiction Rollout Order** — Confirmed:
   1. **Idaho** (your home turf — MVP and hackathon focus. We need you to validate the IRCP rules!)
   2. Ohio (later — Grok research archived for when we get there)
   3. Washington
   4. Utah
   5. California
   6. New York

   **Idaho is the ONLY jurisdiction we're building for right now.** Everything else comes after it's working.

5. **Build Plan** — Full plan is in `docs/BUILD_PLAN.md`. It covers 5 phases from foundation through hackathon polish.

---

## What We Need From You

### The Big Ask: Idaho IRCP Validation

Before John starts building the Idaho rule pack, we need your expert eyes on the rules. We're going to create a JSON data file that encodes every discovery rule, deadline, exemption, and sanction for Idaho. **If any rule is wrong, the whole system is wrong.**

Specifically, we need you to review/provide:

1. **Idaho IRCP Rules 26-37** — Are the following accurate for Idaho?
   - Mandatory initial disclosure requirements and timing
   - Interrogatory limits and response windows
   - Request for Production timing and requirements
   - Deposition limits and notice requirements
   - Request for Admissions limits and deemed-admitted rules
   - Expert witness disclosure deadlines
   - Privilege log requirements
   - E-discovery rules (if any Idaho-specific)
   - Sanctions under IRCP Rule 37

2. **Medical Malpractice Specifics for Idaho**
   - Is there an affidavit of merit requirement (like Ohio's)?
   - Any med-mal exemptions from standard discovery?
   - Expert witness requirements specific to med-mal?
   - Standard of Care documentation requirements?

3. **Local Court Rules**
   - Do specific Idaho counties (Ada, Canyon, etc.) have local rules that override IRCP?
   - Are there judge-specific scheduling order patterns you've seen?

4. **Edge Cases You've Encountered**
   - Multi-jurisdiction cases involving Idaho
   - UIDDA (interstate subpoena) usage in Idaho
   - Cases removed from Idaho state court to federal
   - Any discovery pitfalls you've seen attorneys trip on

5. **General Schema Feedback** — Based on your experience:
   - Does the 6-entity model (Case, Step, Rule Pack, Document, Party, Attestation) capture how discovery actually works?
   - Are we missing any discovery steps that should be tracked?
   - Is the automation trigger model (trigger → deadline → warning → escalation) realistic?

---

## How to Respond

**Please write your responses in the file `SPY-RESPONSE-to-build-plan.md` in the `docs/` folder (same level as this file).** John will read it before he starts building.

Don't worry about formatting perfectly — bullet points, notes, corrections, "this is wrong because..." — all great. The more real-world detail you can give us, the better the system will be.

---

## The Vision (Quick Reminder)

We're building a system where a paralegal can:
1. Open a case → select "Idaho, med-mal"
2. The system auto-generates every discovery step, deadline, and checklist item
3. Traffic lights show compliance status at a glance (🟢🟡🔴)
4. When steps are completed, the blockchain generates immutable ZK proofs
5. Those proofs can be submitted to court as evidence of proper discovery compliance

**No blockchain terminology visible to the user.** It should feel like practice management software, not a crypto app.

---

Thanks, Spy! Your domain expertise is what makes this real, not theoretical.

— John & Penny 🎀
