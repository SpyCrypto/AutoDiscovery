# AutoDiscovery — Jurisdiction Deep Dive & Automation Metrics

> **Research Document for Build Club**  
> **Project:** AutoDiscovery.legal  
> **Purpose:** Define jurisdiction-specific rules, interstate conflicts, and 20 automatable metrics

---

## Executive Summary

This document provides a deep dive into discovery rules across our target jurisdictions (Idaho, Utah, Washington, New York, California, Federal), identifies interstate discovery conflicts, defines 20 key metrics for automation, and outlines chain of custody/provenance requirements that can be immutably recorded on Midnight.

---

## Part 1: Jurisdiction Case Law & Rule Analysis

### 1.1 Idaho — IRCP (Idaho Rules of Civil Procedure)

**Key Rules:**
- **IRCP 26** — General discovery provisions; mandatory initial disclosures
- **IRCP 37** — Sanctions for failure to cooperate in discovery

**Sanctions Framework:**
- Failure to supplement discovery responses → evidence/witness exclusion
- Failure to comply with Rule 16 scheduling order → automatic exclusion
- Court may exclude testimony of undisclosed witnesses
- Certification violations → mandatory sanctions

**Notable Case Law Patterns:**
- Idaho courts strictly enforce disclosure deadlines
- Unique local rules with shorter timelines for some disclosures
- Less e-discovery-specific guidance than larger states

**Key Differences:**
- Smaller bar = more informal discovery practices
- Less written guidance on ESI (Electronically Stored Information)
- Courts may be less familiar with blockchain/tech evidence

---

### 1.2 Utah — URCP (Utah Rules of Civil Procedure)

**Key Rules:**
- **URCP 26** — Discovery scope and limits; **tiered discovery system**
- **URCP 37** — Statement of discovery issues; sanctions

**Unique Feature: Tiered Discovery**

| Tier | Damages Claimed | Discovery Limits |
|------|-----------------|------------------|
| Tier 1 | ≤ $50,000 | 0 interrogatories, 5 depositions (3 hrs each) |
| Tier 2 | $50,001 - $300,000 | 10 interrogatories, 5 depositions (7 hrs each) |
| Tier 3 | > $300,000 | 20 interrogatories, 10 depositions (unlimited) |

**Critical:** Pleading that qualifies for Tier 1 or Tier 2 = **waiver of right to recover damages above tier limits**

**Sanctions Framework:**
- Statement of discovery issues may result in additional discovery at offending party's expense
- Monetary sanctions, costs, and attorney fees available
- After time limitation expires, case presumed ready for trial

**Key Differences:**
- Tiered system requires upfront damages assessment
- More structured than other states
- Automatic presumptions based on tier selection

---

### 1.3 Washington — CR (Civil Rules)

**Key Rules:**
- **CR 26** — General discovery provisions
- **CR 37** — Failure to make discovery; sanctions
- **King County LCR 26/37** — Local rules (major jurisdiction)

**E-Discovery Focus:**
- Specific e-discovery protocols
- Meet-and-confer requirements before discovery disputes
- All discovery must be completed **56 calendar days before trial** (King County)

**Spoliation Case Law:**
- *New Opinion by Washington Court of Appeals (2023)* — Limits on spoliation sanctions
- No duty to preserve absent: contractual duty, foreseeable litigation duty, or "eve of litigation" disposal
- Must show intentional disposal after preservation request

**Key Differences:**
- Strong e-discovery protocols
- Local rules vary significantly by county
- More developed spoliation jurisprudence

---

### 1.4 New York — CPLR (Civil Practice Law and Rules)

**Key Rules:**
- **CPLR Article 31** — Disclosure
- **CPLR 3126** — Penalties for refusal to comply with disclosure
- **Commercial Division Rule 11-a/b** — Discovery limits and privilege logs

**Commercial Division Specifics:**
- Only **25 interrogatories** (including subparts) allowed
- Mandatory initial disclosures similar to FRCP 26
- **Categorical privilege logs** preferred (Rule 11-b)
- Aggressive timelines; courts expect efficiency

**Sanctions Framework (CPLR 3126):**
- Court may strike pleadings
- Preclude evidence
- Dismiss action or counterclaims
- "Willful failure to disclose" standard

**Case Law:**
- *O'Rourke v Hammerstein Ballroom* — Discovery sanctions including dismissal for non-compliance
- Second Department regularly upholds dismissal for discovery abuses

**Key Differences:**
- Commercial Division has most sophisticated e-discovery practices
- Categorical privilege logs (not document-by-document)
- Higher expectations for technology use
- Aggressive judicial management

---

### 1.5 California — CCP (Code of Civil Procedure)

**Key Rules:**
- **CCP §§ 2016.010-2036.050** — Civil Discovery Act
- **CCP §§ 2023.010-2023.040** — Sanctions provisions
- **NEW (2024): Mandatory Initial Disclosures**

**Major 2024 Change:**
- California now requires **mandatory initial disclosures** (broader than FRCP 26)
- Disclosures must be verified
- Failure to comply → **mandatory $1,000 sanctions** (minimum)
- Bad faith conduct → potential reporting to State Bar

**Sanctions Framework:**
- Monetary sanctions
- Issue sanctions (prohibit supporting/opposing claims)
- Evidence sanctions (prohibit introducing evidence)
- Terminating sanctions (dismiss action)
- Contempt sanctions

**Case Law:**
- *City of Los Angeles v PricewaterhouseCoopers* — California Supreme Court confirmed inherent authority to impose monetary sanctions for discovery misconduct
- $2.5 million sanction upheld for discovery abuse

**Key Differences:**
- Broadest initial disclosure requirements
- Mandatory sanctions with reporting to State Bar
- Complex proportionality rules
- Most extensive e-discovery requirements in state courts

---

### 1.6 Federal — FRCP (Federal Rules of Civil Procedure)

**Key Rules:**
- **FRCP 26** — Duty to Disclose; General Provisions
- **FRCP 37** — Failure to Make Disclosures; Sanctions
- **FRCP 45** — Subpoenas (including interstate)

**Initial Disclosures (FRCP 26(a)(1)):**
1. Names of individuals likely to have discoverable information
2. Documents and ESI in party's possession
3. Damages computation with supporting documents
4. Insurance agreements

**Expert Disclosure (FRCP 26(a)(2)):**
- Written report required for retained experts
- Must include: all opinions, basis/reasons, data considered, exhibits, qualifications, compensation, prior testimony

**Preservation Obligations:**
- Duty to preserve arises when litigation is reasonably anticipated
- FRCP 37(e) governs ESI spoliation sanctions
- "Good faith" test for ESI preservation

**Key Differences:**
- Uniform across all federal courts
- Most developed e-discovery jurisprudence
- Proportionality explicitly required
- Safe harbor for good-faith ESI loss

---

## Part 2: Interstate Discovery — UIDDA & Conflicts

### 2.1 Uniform Interstate Depositions and Discovery Act (UIDDA)

**Adopted by:** 47 states + DC + US Virgin Islands (Missouri pending)

**How It Works:**
1. Obtain subpoena form in county where witness is located
2. Present to county clerk in discovery state
3. Clerk issues local subpoena
4. Serve witness

**Key Benefits:**
- No need for pro hac vice admission
- No appearance in discovery state
- Standardized process across UIDDA states

**All our target jurisdictions have adopted UIDDA:**
- ✅ Idaho
- ✅ Utah
- ✅ Washington
- ✅ New York
- ✅ California

### 2.2 Interstate Conflict Scenarios

| Scenario | Conflict | Resolution |
|----------|----------|------------|
| **NY ↔ ID** | NY Commercial Division limits (25 interrogatories) vs. Idaho general limits | Discovery state rules apply for subpoenas; trial state for scope |
| **NY ↔ CA** | Both have mandatory disclosures but different scope/timing | Must comply with stricter of two if case spans both |
| **CA ↔ UT** | CA mandatory disclosures vs. Utah tiered discovery | Tiered limits may conflict with CA's broader disclosure requirements |
| **Federal ↔ State** | FRCP 26 vs. state discovery rules | Federal courts apply state privilege law in diversity cases (FRE 501) |
| **Multi-state defendant** | Different preservation duties | Must preserve under most stringent standard |

### 2.3 Privilege in Interstate Cases

**Federal Rule of Evidence 501:**
> "In a civil case, state law governs privilege regarding a claim or defense for which state law supplies the rule of decision."

**Implication:** AutoDiscovery must track which state's privilege law applies, not just discovery rules.

---

## Part 3: 20 Automation Metrics for Jurisdiction-Aware Discovery

These metrics can be tracked, automated, and proven via ZK proofs on Midnight:

### Category A: Deadline Management

| # | Metric | Description | Jurisdiction Variance |
|---|--------|-------------|----------------------|
| 1 | **Initial Disclosure Deadline** | Days after Rule 26(f) conference or answer | CA=60 days; Federal=14 days after 26(f); varies by state |
| 2 | **Expert Disclosure Deadline** | Days before trial for expert reports | Federal=90 days; states vary widely |
| 3 | **Rebuttal Expert Deadline** | Days after initial expert disclosure | Federal=30 days; state rules differ |
| 4 | **Discovery Cutoff Date** | Final date for all discovery completion | WA=56 days before trial; others vary |
| 5 | **Supplementation Deadline** | Ongoing duty to supplement vs. point-in-time | Federal=ongoing; some states have cutoffs |

### Category B: Disclosure Requirements

| # | Metric | Description | Jurisdiction Variance |
|---|--------|-------------|----------------------|
| 6 | **Mandatory Disclosure Scope** | What must be disclosed without request | CA=broadest; ID=narrowest; Federal=moderate |
| 7 | **Verification Requirement** | Whether disclosures must be verified | CA=yes (mandatory); most states=no |
| 8 | **Interrogatory Limits** | Maximum number allowed | NY Commercial=25; Utah Tier 1=0; Federal=25 |
| 9 | **Deposition Limits** | Number and duration allowed | Utah tiered; Federal=10/7hrs; varies |
| 10 | **Document Production Format** | Native vs. PDF vs. TIFF requirements | Varies by local rule and court order |

### Category C: Compliance Tracking

| # | Metric | Description | Jurisdiction Variance |
|---|--------|-------------|----------------------|
| 11 | **Privilege Log Format** | Document-by-document vs. categorical | NY=categorical preferred; Federal=varies |
| 12 | **Meet-and-Confer Requirement** | Mandatory pre-motion conference | WA=strict; most states=required; timing varies |
| 13 | **ESI Preservation Trigger** | When duty to preserve arises | "Reasonable anticipation" vs. "notice" |
| 14 | **Proportionality Standard** | Cost/burden vs. need analysis | Federal=explicit; state adoption varies |
| 15 | **Sanctions Threshold** | Willful vs. negligent vs. strict liability | CA=mandatory $1K; others=discretionary |

### Category D: Expert Witness Compliance

| # | Metric | Description | Jurisdiction Variance |
|---|--------|-------------|----------------------|
| 16 | **Expert Report Requirements** | Full report vs. summary vs. none | Federal=full report for retained; states vary |
| 17 | **Expert Deposition Timing** | When expert can be deposed | After report; varies by jurisdiction |
| 18 | **W-9/I-9 Collection** | Tax/employment verification for experts | Universal requirement; timing varies |
| 19 | **Standard of Care (SOC) Documentation** | Medical malpractice expert requirements | State-specific medical malpractice rules |

### Category E: Chain of Custody & Provenance

| # | Metric | Description | Jurisdiction Variance |
|---|--------|-------------|----------------------|
| 20 | **Authentication Method** | How digital evidence is authenticated | FRE 901/902; state equivalents vary |

---

## Part 4: Chain of Custody & Provenance — Blockchain Implementation

### 4.1 Five Requirements for Digital Chain of Custody

Based on forensic research (Blockchain-Based Chain of Custody for Evidence Management):

| Requirement | Definition | AutoDiscovery Implementation |
|-------------|------------|------------------------------|
| **Integrity** | Evidence not altered during transfer | Hash verification at each handoff; ZK proof of unchanged state |
| **Traceability** | Evidence traced from collection to destruction | Immutable timeline on Midnight ledger |
| **Authentication** | All handlers provide irrefutable identity proof | Wallet signatures for each access event |
| **Verifiability** | Entire process verifiable by all parties | Selective disclosure to courts/opposing counsel |
| **Security** | Changeovers cannot be altered | Private state immutability; no rollback |

### 4.2 Provenance Events to Record

Each event becomes an immutable record with timestamp, actor, and ZK proof:

```
┌─────────────────────────────────────────────────────────────┐
│                    Evidence Lifecycle                        │
├─────────────────────────────────────────────────────────────┤
│  1. COLLECTION      → Who, when, where, how                 │
│  2. PRESERVATION    → Hold notice issued, acknowledged      │
│  3. PROCESSING      → Format conversion, deduplication      │
│  4. REVIEW          → Attorney eyes-on, privilege flags     │
│  5. PRODUCTION      → Bates numbering, redactions           │
│  6. TRANSMISSION    → Delivery to opposing counsel          │
│  7. AUTHENTICATION  → Certification for court               │
│  8. PRESENTATION    → Exhibit marking, admission            │
│  9. ARCHIVAL        → Post-litigation retention             │
│  10. DESTRUCTION    → Retention period expiry               │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 ZK Proof Assertions

AutoDiscovery can generate ZK proofs asserting:

- ✅ "This document was in continuous custody since [date]"
- ✅ "This document has not been modified since [hash at time T]"
- ✅ "All handlers were authenticated attorneys/paralegals"
- ✅ "Privilege review was completed before production"
- ✅ "Document was produced within [X] days of request"
- ✅ "Proper jurisdiction rules were applied" (via jurisdiction rule pack)

---

## Part 5: Innovative Ideas You Might Not Be Considering

### 5.1 🔮 Predictive Sanctions Risk Scoring

**Concept:** Real-time risk score based on:
- Days until deadline
- Percentage of disclosures complete
- Historical sanctions rates in jurisdiction
- Judge-specific enforcement patterns

**Implementation:** ML model trained on case law; score updates as case progresses.

**Value:** "Your sanctions risk is currently 7.2/10. Complete expert disclosures to reduce to 3.1/10."

---

### 5.2 🔗 Cross-Jurisdiction Rule Conflict Detection

**Concept:** When case spans multiple jurisdictions, automatically detect conflicts:
- "Utah Tier 2 limits (10 interrogatories) conflict with California's broader disclosure requirements"
- "NY categorical privilege log format may not satisfy Federal document-by-document requirements"

**Implementation:** Rule engine that compares jurisdiction rule sets and flags conflicts.

**Value:** Prevents compliance in one jurisdiction from causing violation in another.

---

### 5.3 📜 Immutable Legal Hold Acknowledgment

**Concept:** When litigation hold is issued:
1. Custodian receives hold notice via AutoDiscovery
2. Custodian signs acknowledgment with wallet
3. Acknowledgment is ZK-proven and timestamped
4. Immutable record proves custodian was notified

**Value:** Eliminates "I never received the hold notice" defense in spoliation claims.

---

### 5.4 🏛️ Court-Specific Judge Profiles

**Concept:** Track judge-specific preferences and rulings:
- "Judge Smith requires meet-and-confer letter before any discovery motion"
- "Judge Jones has granted 85% of privilege log objections in categorical format"
- "Median time to rule on discovery motions: 12 days"

**Implementation:** Scrape court dockets; build judge profiles; recommend strategy.

**Value:** Tailor discovery approach to specific judge's known preferences.

---

### 5.5 🤝 Bilateral Discovery Agreements (Smart Contracts)

**Concept:** Parties can negotiate discovery terms as a smart contract:
- "Both parties agree to 15 interrogatories instead of statutory 25"
- "Expert reports due 60 days before trial instead of 90"
- "ESI production in native format only"

**Implementation:** Compact smart contract that both parties sign; terms enforced automatically.

**Value:** Self-enforcing discovery agreements with immutable proof of consent.

---

### 5.6 🔍 Privilege Log Automation

**Concept:** AI-assisted privilege review that:
1. Flags likely privileged documents
2. Generates privilege log entries automatically
3. Uses categorical format where permitted
4. Creates ZK proof that review was completed

**Implementation:** NLP model trained on privilege patterns; human-in-the-loop confirmation.

**Value:** Reduces privilege log creation from days to hours.

---

### 5.7 ⚖️ Proportionality Calculator

**Concept:** For ESI discovery requests, calculate:
- Estimated cost to produce
- Estimated burden (person-hours)
- Relevance score based on claims/defenses
- Proportionality recommendation

**Implementation:** Integrates with client's document management; provides objective metrics for proportionality disputes.

**Value:** "Producing 2.3M documents would cost $847,000 and require 4,200 hours. Recommend narrowing to [specific terms]."

---

### 5.8 🌐 Witness Location-Aware Routing

**Concept:** Beyond case jurisdiction, track witness locations for:
- UIDDA subpoena routing
- Service of process requirements
- Deposition location rules (some states require in-state)

**Implementation:** Witness location → automatic rule lookup → correct procedure displayed.

**Value:** "Witness is in Idaho. UIDDA applies. Here's the correct subpoena form."

---

### 5.9 📊 Discovery Analytics Dashboard

**Concept:** Real-time visibility into:
- Documents reviewed vs. remaining
- Privilege calls made
- Production volume trends
- Cost tracking per custodian
- Deadline countdown

**Implementation:** Unified dashboard pulling from all case data.

**Value:** Partners can see case status at a glance; clients get transparency.

---

### 5.10 🏆 Compliance Certification NFTs

**Concept:** Upon case completion, issue NFT certifying:
- "All discovery obligations met"
- "No sanctions imposed"
- "Chain of custody verified"

**Implementation:** Minted on Midnight; portable reputation for attorneys/firms.

**Value:** Builds verifiable compliance reputation; useful for malpractice insurance negotiations.

---

## Part 6: Interstate Conflict Matrix

### 6.1 Disclosure Requirement Conflicts

| State A | State B | Conflict | AutoDiscovery Resolution |
|---------|---------|----------|--------------------------|
| CA | UT | CA mandatory disclosures broader than UT tiered limits | Alert: "CA disclosure requirements exceed UT tier limits. Recommend full CA compliance." |
| NY | ID | NY Commercial Division interrogatory limit (25) vs. ID general | Track both; apply stricter limit |
| CA | Federal | CA disclosures must be verified; Federal does not require | Apply CA verification standard for federal cases with CA parties |
| UT | Federal | UT tier damages waiver doesn't apply in federal | Alert: "Federal court. UT tier waiver not applicable." |

### 6.2 Privilege Law Conflicts

| Scenario | Issue | Resolution |
|----------|-------|------------|
| Diversity case (NY plaintiff vs. CA defendant) | Which state's privilege law? | FRE 501: State law supplies rule of decision |
| Multi-state trade secret | Different privilege definitions | Most protective standard recommended |
| Attorney work product | State vs. federal definitions | Track both; flag differences |

---

## Summary

AutoDiscovery addresses a **fragmented, high-stakes compliance landscape** where:

1. **Each jurisdiction has different rules** — 6 rule sets in Phase 1 alone
2. **Interstate cases compound complexity** — UIDDA helps but conflicts remain
3. **20 key metrics can be automated** — Deadlines, disclosures, compliance, chain of custody
4. **Blockchain solves provenance** — Immutable proof of proper handling
5. **Innovation opportunities abound** — Predictive risk, conflict detection, smart agreements

**The opportunity:** No existing tool provides jurisdiction-aware automation with immutable compliance proofs. AutoDiscovery + Midnight fills this gap.

---

*Prepared for Midnight Build Club — Week 1 Deep Dive*  
*AutoDiscovery.legal — Privacy meets compliance.*
