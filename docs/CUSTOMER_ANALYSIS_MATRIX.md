<div align="center">

<span style="font-size: 80%">Introducing:</span>

# AutoDiscovery.legal

### Customer Analysis Matrix

**Midnight Build Club — Cohort 0**

---

*Automated discovery compliance: build once, comply everywhere.*

---

**Team**

**Spy** — Domain Expert · 20-Year Complex Litigation Paralegal · Published Government Researcher
[@SpyCrypto](https://github.com/SpyCrypto)

**John** — 4x Midnight Hackathon Winner · Founder, EnterpriseZK Labs LLC · Blockchain Architect
[@bytewizard42i](https://github.com/bytewizard42i)

---

</div>

## The One-Liner

> **AutoDiscovery turns the most adversarial, evidence-demanding environment on earth — the courtroom — into the proving ground for Midnight's privacy-preserving blockchain.**

---

### Evidence Methodology

Every claim in this document is tagged with its evidence basis:

| Tag | Meaning |
|-----|---------|
| `[domain expertise]` | Direct knowledge from 20 years of complex litigation practice |
| `[desk research]` | Published data, case law, or industry reports (see References) |
| `[assumption]` | Hypothesis to be validated through customer interviews in Weeks 2–3 |

This transparency helps prioritize validation efforts and distinguishes what we *know* from what we *believe*.

---

## I. THE PROBLEM LANDSCAPE

### A World of Fragmented Rules

Legal discovery — the pre-trial exchange of evidence — is one of the most error-prone, high-stakes processes in the US legal system. Every jurisdiction writes its own rulebook.

```
                    ┌─────────────────────────────────┐
                    │     DISCOVERY RULE UNIVERSE      │
                    └─────────────────────────────────┘
                                   │
            ┌──────────────────────┼──────────────────────┐
            ▼                      ▼                      ▼
     ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
     │   FEDERAL    │       │    STATE     │       │ SPECIALIZED │
     │    FRCP      │       │  50 unique   │       │ Bankruptcy, │
     │  (uniform)   │       │  rule sets   │       │ Family, etc │
     └─────────────┘       └─────────────┘       └─────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
              ┌──────────┐  ┌──────────┐  ┌──────────┐
              │  Idaho   │  │   Utah   │  │   Wash   │
              │  IRCP    │  │   URCP   │  │    CR    │
              │ unique   │  │  tiered  │  │ e-disc   │
              │ timelines│  │ by value │  │ protocols│
              └──────────┘  └──────────┘  └──────────┘
```

An attorney handling a medical malpractice case in Boise follows completely different discovery rules than one in Salt Lake City — different deadlines, different disclosure requirements, different expert witness designation procedures. Get any of them wrong, and the consequences are severe.

### What Failure Looks Like — Real Cases

| Case | What Went Wrong | Consequence |
|------|----------------|-------------|
| *Zubulake v. UBS Warburg* (S.D.N.Y. 2003–04) | Failure to preserve electronic evidence during discovery | Adverse inference instruction; compensatory + punitive verdict `[desk research: ABA Journal, Wikipedia]` |
| *Qualcomm v. Broadcom* (S.D. Cal. 2008) | Withheld 46,000+ discoverable documents | $8,568,633 in sanctions; 6 attorneys referred to California State Bar `[desk research: Law360, eDiscoveryLaw.com]` |
| *Pennypack Woods v. Narberth* (3d Cir.) | Destroyed evidence after duty to preserve arose | Case-dispositive sanctions |
| *City of LA v. PricewaterhouseCoopers* (Cal. 2022) | Egregious discovery abuse | Post-dismissal sanctions upheld on appeal |
| ***State v. Kohberger* (Idaho, Ada County CR01-24-31665)** | **68 TB of discovery produced in disorganized fashion; 25 experts listed but only 5 reports provided** | **Defense motion to compel + sanctions; motion for continuance; trial delay arguments; AG office diverted resources specifically to manage discovery burden** `[desk research: Newsweek, Idaho News, KTVB, court filings]` |
| ***Gem State Roofing v. United Components* (Idaho Supreme Court, 2021)** | **Defendant withheld requested discovery; third-party subpoenas revealed hundreds of pages never produced; defendant claimed emails were "routinely deleted"; after court order to comply, still produced no new documents** | **Motion to compel granted; discovery described as "particularly contentious"; persistent non-compliance shaped the entire appeal** `[desk research: 168 Idaho 820, 488 P.3d 488]` |
| ***Raymond v. Idaho State Police* (Idaho Supreme Court, 2019)** | **State police destroyed/concealed evidence that officer was DUI when he killed a motorist; threatened witnesses to prevent disclosure** | **Idaho Supreme Court created an entirely new tort — "intentional interference with a prospective civil action by spoliation of evidence" — landmark precedent** `[desk research: 451 P.3d 17]` |
| ***Sanders v. University of Idaho* (D. Idaho, 2022)** | **University destroyed interview notes from a climate review despite knowing litigation was anticipated; failed to implement litigation hold** | **Federal court granted spoliation sanctions; established that duty to preserve attaches when litigation is reasonably foreseeable** `[desk research: 634 F. Supp. 3d 936]` |
| ***Erickson v. Erickson* (Idaho Supreme Court, 2022)** | **Trial counsel violated mandatory disclosure requirements and discovery rules during divorce proceedings** | **Idaho Supreme Court addressed proper standards for discovery sanctions against counsel; reversed and remanded** `[desk research: Docket 48335, 521 P.3d 1089]` |

These are not edge cases. **Missed deadlines are the #1 complaint in legal malpractice claims**, and **discovery errors are one of four recognized categories** of attorney malpractice `[desk research: TLIE]`. The problem is systemic.

### Spotlight: *State v. Kohberger* — Why AutoDiscovery Exists

The 2022 University of Idaho quadruple homicide case is the most high-profile criminal prosecution in Idaho history — and a masterclass in discovery chaos. It happened in **our beachhead jurisdiction**.

```
╔══════════════════════════════════════════════════════════════════╗
║           STATE v. KOHBERGER — DISCOVERY BREAKDOWN               ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║   68 TERABYTES of discovery produced                             ║
║   = ~17 million photos OR 68,000 hours of video                  ║
║                                                                  ║
║   25 prosecution experts listed                                  ║
║    └── Only 5 had reports disclosed to defense                   ║
║                                                                  ║
║   Discovery described as:                                        ║
║    • "extremely disorganized" (defense motion, Dec 2024)         ║
║    • "slow, disorganized and tedious" (defense reply, Mar 2025)  ║
║    • "unorganized and overwhelming" (trial brief, Apr 2025)      ║
║                                                                  ║
║   Defense filed:                                                 ║
║    • Motion to compel complete expert disclosures                ║
║    • Motion for sanctions against prosecution                    ║
║    • Motion for continuance (trial delay)                        ║
║                                                                  ║
║   Idaho AG's office diverted attorneys specifically to let        ║
║   Latah County prosecutors "concentrate on discovery"            ║
║                                                                  ║
║   Outcome: Guilty plea June 2025 · 4 life sentences July 2025   ║
╚══════════════════════════════════════════════════════════════════╝
```

**What AutoDiscovery would have changed:**

| Kohberger Problem | AutoDiscovery Solution |
|-------------------|----------------------|
| 68 TB dumped without organization | **Automated jurisdiction-aware indexing** — documents tagged by IRCP rule relevance at intake |
| Expert disclosures incomplete (5 of 25) | **Deadline tracking with automated alerts** — every expert disclosure deadline calendared with escalation |
| "Disorganized and tedious" production | **Structured workflow engine** — documents produced in compliance with IRCP disclosure requirements |
| Defense couldn't review before trial | **Audit trail + search** — every document timestamped, categorized, and searchable on delivery |
| AG diverted resources to manage discovery | **Automated compliance proofs** — ZK attestations prove production completeness without manual review |
| No verifiable record of what was produced when | **Immutable Midnight ledger** — court can independently verify production timeline |

> **The Kohberger case proves that even in the highest-stakes prosecution imaginable — a quadruple homicide capital case with unlimited state resources — discovery still breaks down.** If Idaho's AG office can't manage document production smoothly, what chance does a solo practitioner or small firm have? `[domain expertise + desk research]`

This is not a hypothetical. This is Idaho. This is now. This is why we're building AutoDiscovery.

### The Cost of Getting It Wrong

```
╔══════════════════════════════════════════════════════════════════╗
║                    DISCOVERY FAILURE CASCADE                     ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║   Wrong Jurisdiction Rules Applied                               ║
║        │                                                         ║
║        ├──▶ Missed Disclosure Deadline                           ║
║        │        │                                                ║
║        │        ├──▶ Evidence Suppressed                         ║
║        │        │        │                                       ║
║        │        │        └──▶ Case Dismissed or Lost             ║
║        │        │                   │                            ║
║        │        │                   └──▶ Malpractice Suit        ║
║        │        │                           │                    ║
║        │        │                           └──▶ Bar Complaint   ║
║        │        │                                   │            ║
║        │        │                                   └──▶ Career  ║
║        │        │                                        Over    ║
║        │        └──▶ Sanctions ($10K - $8.5M+)                   ║
║        │                                                         ║
║        └──▶ Privilege Waived (irrevocable)                       ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## II. WHO FEELS THIS PAIN

### The Discovery Workflow Chain

Three roles touch discovery daily. Each experiences the problem differently — and each must be convinced differently.

```
┌──────────────────────────────────────────────────────────────────┐
│                    DECISION-MAKING CHAIN                         │
│                                                                  │
│   PARALEGAL              ASSOCIATE              PARTNER          │
│   ─────────              ─────────              ───────          │
│   Does the work          Reviews the work       Bears the risk   │
│   Wants: speed,          Wants: accuracy,       Wants: firm-wide │
│   fewer errors           less rework            standardization  │
│                                                                  │
│   ● Daily user           ● Approver             ● Budget holder  │
│   ● Evangelist           ● Quality gate         ● Decision maker │
│   ● Bottom-up            ● Middle-out           ● Top-down       │
│     adoption               validation             purchase       │
└──────────────────────────────────────────────────────────────────┘
```

### Target Segments

| Attribute | Segment A: Paralegals | Segment B: Solo/Small Firm Attorneys | Segment C: Regional Firm Partners |
|-----------|----------------------|-------------------------------------|-----------------------------------|
| **Size** | ~350,000 in US `[desk research: BLS]` | ~350,000 solo; ~160,000 small firm `[desk research: ABA 2025 NLPS — 1.37M total US attorneys; solo = ~40% of all firms]` | ~50,000 at multi-office firms `[assumption]` |
| **Age** | 30–55 | 35–60 | 40–65 |
| **Income** | $45K–$75K | $80K–$250K+ | $200K–$1M+ |
| **Jurisdiction exposure** | 1–2 states | 1–3 states | 2–5+ states |
| **Tech comfort** | High (daily Clio, Westlaw, Relativity) | Moderate (MyCase, basic tools) | Low–Moderate (delegates tech) |
| **Purchase authority** | Recommender | Self (solo) or Recommender | Final decision maker |
| **Key motivation** | Reduce errors, protect reputation | Save time, avoid bar complaints | Reduce liability, cut insurance |
| **Adoption path** | Tries it → shows attorney | Finds it → adopts immediately | Paralegal recommends → approves |

### Psychographic Profile: The Legal Mind

| Dimension | Implication for AutoDiscovery |
|-----------|-------------------------------|
| **Risk-averse by training** | Position as liability *reduction*, not innovation `[domain expertise]` |
| **Precedent-driven** | Show existing legal tech adoption curves; cite court acceptance |
| **Skeptical of hype** | Never say "blockchain" first — lead with compliance, reveal infrastructure later `[domain expertise]` |
| **Peer-influenced** | One bar association endorsement > 100 ads |
| **Ethically bound** | Confidentiality isn't optional — it's a professional obligation (ABA Model Rules 1.6) `[desk research]` |

---

## III. CUSTOMER PERSONAS

### Sarah — Senior Paralegal

```
┌────────────────────────────────────────────────────────────────┐
│  SARAH CHEN  ·  Senior Litigation Paralegal  ·  Boise, Idaho  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Age: 42        Firm: 15-attorney med-mal practice             │
│  Experience: 18 years complex litigation                       │
│  Tools: Clio, Westlaw, Adobe Acrobat, Outlook                  │
│                                                                │
│  DAILY REALITY                                                 │
│  ────────────                                                  │
│  6:30 AM  Check IRCP deadlines against case calendar           │
│  8:00 AM  Draft discovery responses for 3 active cases         │
│  10:00 AM  Research Utah URCP — new multi-state case           │
│  1:00 PM  Compile privilege log (manually, in Excel)           │
│  3:00 PM  Chase down expert witness W-9 documentation          │
│  5:00 PM  Double-check everything — one error is catastrophic  │
│                                                                │
│  "I spend hours researching which rules apply. One missed      │
│   deadline could end a case — and my career."                  │
│                                                                │
│  WHAT SHE NEEDS                        WHAT SHE FEARS          │
│  ─────────────────                     ────────────────         │
│  ✓ Automated jurisdiction lookup       ✗ "New tech" that       │
│  ✓ Deadline tracking she can trust       breaks mid-case       │
│  ✓ Proof she followed the rules        ✗ Learning curve that   │
│  ✓ One system for ID + UT + WA           slows her down        │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Mark — Solo Practitioner

```
┌────────────────────────────────────────────────────────────────┐
│  MARK REEVES  ·  Solo Attorney  ·  Salt Lake City, Utah       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Age: 52        Practice: PI + contract disputes               │
│  Experience: 25 years (formerly BigLaw)                        │
│  Tools: MyCase, minimal research tools                         │
│                                                                │
│  "I know the law. But keeping track of every procedural        │
│   deadline across 15 active cases — with no paralegal —        │
│   is a nightmare."                                             │
│                                                                │
│  UTAH-SPECIFIC PAIN                                            │
│  ──────────────────                                            │
│  Utah's tiered discovery (URCP Rule 26) assigns different      │
│  disclosure levels based on case value:                        │
│    Tier 1: <$50K   → Standard fact discovery only              │
│    Tier 2: $50K-$300K → Expanded discovery                     │
│    Tier 3: >$300K  → Extraordinary discovery                   │
│  Mark handles cases across all three tiers simultaneously.     │
│                                                                │
│  CONVERSION TRIGGER: "It does the jurisdiction lookup for me?" │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### David — Litigation Partner

```
┌────────────────────────────────────────────────────────────────┐
│  DAVID OKAFOR  ·  Litigation Partner  ·  Spokane, Washington  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Age: 48        Firm: Regional, offices in ID/UT/WA            │
│  Supervises: 8 associates, 4 paralegals                        │
│  Tools: NetDocuments, Relativity, Westlaw                      │
│                                                                │
│  "Three states. Three rule sets. Twelve people who could       │
│   make a compliance error that I'm personally liable for."     │
│                                                                │
│  WHAT KEEPS HIM UP AT NIGHT          WHAT WOULD SELL HIM      │
│  ────────────────────────────         ──────────────────        │
│  • Associate applies WA rules         • "Reduces malpractice  │
│    to an ID case                         insurance premiums"   │
│  • Privilege accidentally waived       • "Immutable proof your │
│  • No way to prove team followed         firm was compliant"   │
│    correct procedures                  • "One workflow for all │
│  • Malpractice insurance rising           three jurisdictions" │
│                                                                │
│  CONVERSION TRIGGER: "Our malpractice carrier gave us a        │
│                       discount for using it."                  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## IV. PAIN INTENSITY HEAT MAP

Each pain point scored on three axes: **severity** (career/case impact), **frequency** (how often it occurs), and **current solution gap** (how poorly existing tools address it).

```
                        SEVERITY ──────────────────────────▶
                        Low                              Critical
                    ┌─────────┬─────────┬─────────┬─────────┐
         Rare       │         │         │         │ Privlg  │
                    │         │         │         │ waiver  │
                    ├─────────┼─────────┼─────────┼─────────┤
  F      Occasional │         │         │ E-disc  │ Wrong   │
  R                 │         │         │ spoltn  │ jurisd  │
  E                 ├─────────┼─────────┼─────────┼─────────┤
  Q      Monthly    │         │ Expert  │ Incmplt │ Multi-  │
  U                 │         │ witness │ disclos │ jurisd  │
  E                 ├─────────┼─────────┼─────────┼─────────┤
  N      Weekly+    │         │         │ No audt │ Missed  │
  C                 │         │         │ trail   │ deadlns │
  Y                 └─────────┴─────────┴─────────┴─────────┘

  ■ Top-right quadrant = AutoDiscovery's primary targets
  ■ Every item in the rightmost column can end a career
```

### Quantified Impact + Willingness to Pay

| Pain Point | Annual Cost per Firm | Firms Affected | WTP Signal | Evidence |
|------------|---------------------|----------------|------------|----------|
| **Missed deadlines** | $50K–$500K (sanctions + lost cases) | ~40% of small/mid firms annually | **5/5** — #1 malpractice trigger | `[desk research: TLIE]` |
| **Wrong jurisdiction rules** | $25K–$2M (retrials, malpractice) | ~15% of multi-state practices | **5/5** — liability exposure | `[domain expertise]` |
| **No compliance audit trail** | $10K–$50K (insurance premium uplift) | Nearly all firms | **4/5** — insurance discount driver | `[assumption]` |
| **Multi-jurisdiction complexity** | 200+ paralegal hours/year wasted | ~25% of firms handle multi-state | **3/5** — time savings | `[assumption]` |

> **Key Insight:** Compliance audit trail ranks moderate in direct pain but high in WTP — malpractice carriers may offer premium discounts for provable compliance, making the *buyer* the insurance company, not just the firm. `[assumption — validate Week 3]`

---

## V. JURISDICTION DEEP DIVE

### Phase 1 Target Matrix

| | Idaho IRCP | Utah URCP | Washington CR | New York CPLR | California CCP |
|---|:---:|:---:|:---:|:---:|:---:|
| **Initial Disclosures** | Required | Required (tiered) | Required | Required | Required |
| **Discovery Tiers** | No | Yes (3 tiers by $ value) | No | No | Proportionality rules |
| **E-Discovery Protocol** | Basic | Moderate | Detailed | Aggressive | Extensive |
| **Expert Designation** | 120 days pre-trial | Per tier schedule | 60 days pre-trial | CPLR §3101(d) | CCP §2034 |
| **Privilege Log** | Required | Required | Required | Required (strict) | Required (strict) |
| **Meet-and-Confer** | Informal | Required | Required (formal) | Required | Required (formal) |
| **Sanctions Authority** | IRCP 37 | URCP 37 | CR 37 | CPLR §3126 | CCP §2023.030 |
| **Regulation Intensity** | ●●○○○ | ●●●○○ | ●●●○○ | ●●●●○ | ●●●●● |

### Why These Five First

```
  Idaho ──── Spy's home jurisdiction; deepest domain expertise
    │
    ├── Utah ──── Adjacent state; tiered rules create unique complexity
    │
    ├── Washington ──── Completes Pacific NW tri-state corridor
    │
    ├── New York ──── Largest litigation market; proves scalability
    │
    └── California ──── Most complex rules; ultimate stress test
```

### Privacy Regulations Intersecting Discovery

| Regulation | Impact | AutoDiscovery Response |
|------------|--------|------------------------|
| **HIPAA** | Medical records in malpractice cases require strict handling | ZK proofs verify compliance without exposing PHI |
| **Attorney-Client Privilege** | Must be identified, logged, and protected | Automated privilege detection + immutable log |
| **Work Product Doctrine** | Must exclude from production | Selective disclosure — prove existence, withhold content |
| **State Privacy Laws** | Varying PII protections by jurisdiction | Jurisdiction rule packs load state-specific privacy rules |

---

## VI. COMPETITIVE LANDSCAPE

### The Gap Nobody Has Filled

```
                   Jurisdiction-Aware ──────────────────────▶
                   None                               Automated
               ┌───────────┬───────────┬───────────┬───────────┐
  Privacy      │           │           │           │           │
  &  ZK        │           │           │           │   AUTO    │
  Proofs       │           │           │           │ DISCOVERY │
               ├───────────┼───────────┼───────────┼───────────┤
               │           │           │ Westlaw   │           │
  Research     │           │           │ CaseText  │           │
  Only         │           │           │ (passive) │           │
               ├───────────┼───────────┼───────────┼───────────┤
               │           │ Clio      │           │           │
  Basic        │           │ MyCase    │ Relativity│           │
  Calendar     │           │           │ Logikcull │           │
               ├───────────┼───────────┼───────────┼───────────┤
               │ Manual    │           │           │           │
  None         │ (Excel,   │           │           │           │
               │ Outlook)  │           │           │           │
               └───────────┴───────────┴───────────┴───────────┘
```

**AutoDiscovery occupies an empty quadrant.** No existing solution combines:
- Automated jurisdiction detection
- Privacy-preserving compliance proofs
- Immutable audit trails admissible in court
- Selective disclosure for opposing counsel

| Competitor | Strengths | What They Lack |
|------------|-----------|----------------|
| **Relativity** | Market leader in e-discovery document review | Enterprise-only pricing ($150K+/yr); no jurisdiction automation |
| **Logikcull** | Self-service e-discovery | No multi-jurisdiction rule engine; no privacy proofs |
| **Westlaw / CaseText** | Best-in-class legal research | Passive — tells you the rules, doesn't enforce them |
| **Clio / MyCase** | Practice management + basic calendaring | No compliance verification; no audit trail |
| **Everchron** | Timeline & discovery management | No jurisdiction awareness; no blockchain layer |

---

## VII. THE MARKET

### Legal Tech Is a $32B Industry — and Accelerating

| Metric | Value | Source |
|--------|-------|--------|
| **Global Legal Tech Market (2025)** | $32.2B | Research Nester |
| **Projected (2035)** | $77.7B | 9.2% CAGR |
| **E-Discovery Segment** | Largest and fastest-growing | Fortune Business Insights |
| **US Legal Tech Growth** | Leading globally due to AI/automation adoption | Grand View Research |

### Our Addressable Market

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  TAM  ─────────────────────────────────────────  $5.0B          │
│  US legal technology market                                     │
│                                                                 │
│    SAM  ──────────────────────────────────  $500M                │
│    Litigation support & discovery tools                         │
│                                                                 │
│      SOM  ────────────────────────  $10M                        │
│      Small/mid firms in Phase 1                                 │
│      jurisdictions (ID, UT, WA)                                 │
│                                                                 │
│        Beachhead  ────────  $1.5M                               │
│        Med-mal firms in Idaho                                   │
│        with multi-state cases                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Revenue Model

| Tier | Target | Pricing | Value Proposition |
|------|--------|---------|-------------------|
| **Solo** | Solo attorneys (Mark) | $99/mo | Jurisdiction automation for 1 state |
| **Practice** | Small firms (Sarah's firm) | $399/mo | Multi-jurisdiction + team workflows |
| **Enterprise** | Regional firms (David's firm) | $1,499/mo | Unlimited jurisdictions + compliance proofs + API |
| **Compliance Proof** | Per-attestation (any tier) | $25/proof | ZK compliance proof for court submission |

### Unit Economics (Year 2 Target)

| Metric | Projection |
|--------|------------|
| **Beachhead customers** | 50 firms (Idaho med-mal) |
| **Average Revenue per Firm** | $350/mo |
| **Monthly Recurring Revenue** | $17,500 |
| **Annual Recurring Revenue** | $210,000 |
| **Compliance Proof Revenue** | $75,000/yr (est. 3,000 proofs) |
| **Total Year 2 Revenue** | ~$285,000 |

---

## VIII. THE MIDNIGHT ADVANTAGE

### Why This Can Only Be Built on Midnight

| Requirement | Why Traditional Tech Fails | How Midnight Solves It |
|-------------|---------------------------|------------------------|
| **Prove compliance without revealing case details** | Public blockchains expose everything; databases can be altered | ZK proofs verify compliance while case data stays private |
| **Create court-admissible records** | Databases can be edited; timestamps can be faked | Immutable ledger that courts can independently verify |
| **Share only what opposing counsel needs** | Binary choice: share everything or nothing | Selective disclosure at the data field level |
| **Detect jurisdiction automatically** | Manual lookup error-prone and time-consuming | Jurisdiction selected at case creation based on filing court; rule pack auto-loaded |
| **Handle privileged information** | Any system that "sees" privileged data risks waiver | Zero-knowledge architecture never exposes raw content |

### What Must Be True

These are the critical assumptions underpinning AutoDiscovery. Each must be validated for the product to succeed.

| # | Assumption | Risk Level | Validation Plan | Timeline |
|---|-----------|------------|-----------------|----------|
| 1 | Courts will accept ZK proofs as compliance evidence | **High** | Research court precedent for blockchain evidence; consult with judges in Phase 1 jurisdictions | Weeks 3–5 |
| 2 | Paralegals will adopt a new tool into their existing workflow | **Medium** | User testing with 5–10 paralegals via Spy's professional network `[domain expertise]` | Weeks 2–4 |
| 3 | Attorneys will pay for compliance automation vs. manual processes | **Medium** | Semi-structured interviews with 3–5 solo/small firm attorneys in Idaho `[assumption]` | Weeks 2–3 |
| 4 | Modular rule packs can be selected and loaded reliably at case creation | **Low** | Filing court determines jurisdiction; rule pack loaded automatically | Weeks 2–4 |
| 5 | Malpractice insurers will recognize ZK compliance proofs for premium discounts | **Medium** | Outreach to 2–3 malpractice carriers in Idaho/Utah `[assumption]` | Weeks 5–7 |
| 6 | Modular rule packs can accurately encode jurisdiction-specific rules | **Low** | Encode IRCP as pilot rule pack; validate with practicing Idaho attorneys `[domain expertise]` | Weeks 3–6 |

### Jurisdiction Determination: Simple by Design

AutoDiscovery does **not** need a geolocation oracle to determine jurisdiction. The filing court determines which rules apply — and the attorney knows this at case creation. The `jurisdiction-registry` contract simply loads the correct modular rule pack based on the court selected.

```
┌─────────────────────────────────────────────────────────────────┐
│             JURISDICTION RULE PACK LOADING                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐     ┌──────────────┐     ┌───────────────────┐   │
│  │ Filing   │────▶│ Jurisdiction │────▶│  Rule Pack        │   │
│  │ Court    │     │ Registry     │     │  Loader           │   │
│  │ (known)  │     │ (on-chain)   │     │                   │   │
│  └──────────┘     └──────────────┘     └───────────────────┘   │
│                                         │              │
│                                         ▼              │
│                              ┌────────────────────────┐  │
│                              │ Loads correct rules:   │  │
│                              │ • IRCP (Idaho)         │  │
│                              │ • URCP (Utah)          │  │
│                              │ • CR (Washington)      │  │
│                              │ • FRCP (Federal)       │  │
│                              └────────────────────────┘  │
│                                                                 │
│  Result: "This case follows Idaho IRCP rules"                   │
│  No oracle needed — the attorney knows the filing court.        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

> **Note:** Our companion project [GeoZ](https://github.com/bytewizard42i/GeoZ_us_app_Midnight-Oracle) (GeoZ.us / GeoZ.app) is a standalone privacy-preserving geolocation oracle on Midnight — a separate protocol by the same team, not a dependency of AutoDiscovery.

---

## IX. THE BIGGER PICTURE — BLOCKCHAIN LEGITIMIZATION

### The Precedent Thesis

Courts guard precedent fiercely because they understand its power.

> *In a collections case, the plaintiff asked the judge: "Could you simply ask the defendant under oath if they were on active military duty?" (required by the Servicemembers Civil Relief Act).*
>
> *The judge refused, calling the suggestion "slippery" — because allowing testimony to substitute for proper due diligence would set a precedent with far-reaching implications for every future case.*

**The inverse is equally powerful.** Once a court accepts a ZK compliance proof as factual record, that acceptance becomes binding precedent.

### The Legitimization Cascade

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   STAGE 1 ──▶ Courts accept AutoDiscovery compliance proofs     ║
║               as factual record in discovery disputes            ║
║                           │                                      ║
║   STAGE 2 ──▶ Legal precedent established:                      ║
║               "ZK proofs are admissible evidence"                ║
║                           │                                      ║
║   STAGE 3 ──▶ Other legal applications adopt the pattern:       ║
║               contract execution, title transfer, IP filing      ║
║                           │                                      ║
║   STAGE 4 ──▶ Regulated industries follow the courts:           ║
║               healthcare (HIPAA), finance (SOX), insurance       ║
║                           │                                      ║
║   STAGE 5 ──▶ Midnight becomes the trust infrastructure         ║
║               for compliance worldwide                           ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

### Why Courts Are the Ultimate Proving Ground

| Characteristic | Why It Matters |
|----------------|----------------|
| **Adversarial by design** | Both sides attack every piece of evidence — if ZK proofs survive cross-examination, they survive anything |
| **Precedent-binding** | One ruling creates a template for thousands of future cases |
| **Highest evidence bar** | Federal Rules of Evidence are the strictest standard for admissibility |
| **Public trust anchor** | Society defers to courts on questions of truth and legitimacy |

> *"If blockchain can survive the scrutiny of the legal system — the most adversarial, evidence-demanding environment on earth — it can survive anywhere."*

---

## X. GO-TO-MARKET STRATEGY

### Phase 1: The Idaho Beachhead

```
Quarter    Action                                  Goal
───────    ──────                                  ────
Q2 2026    MVP launch — Idaho IRCP rules           5 beta firms
           Medical malpractice focus
           Spy's network as direct channel

Q3 2026    Utah URCP + Washington CR added         15 firms
           Bar association presentations
           First compliance proof filed in court

Q4 2026    Idaho State Bar CLE accreditation       40 firms
           Partnership with 1 malpractice carrier
           Case study: "Discovery sanctions avoided"

Q1 2027    NY + CA rule packs                      100 firms
           Federal FRCP integration
           Enterprise tier launch
```

### Adoption Flywheel

```
                    ┌──────────────┐
                    │   Paralegal  │
                    │   discovers  │
                    │  AutoDiscovery│
                    └──────┬───────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Shows it to │───────────────┐
                    │  supervising │               │
                    │   attorney   │               │
                    └──────┬───────┘               │
                           │                       │
                           ▼                       ▼
                    ┌──────────────┐       ┌──────────────┐
                    │   Attorney   │       │  Compliance  │
                    │   adopts     │       │  proof filed  │
                    │   firm-wide  │       │  in court     │
                    └──────┬───────┘       └──────┬───────┘
                           │                       │
                           ▼                       ▼
                    ┌──────────────┐       ┌──────────────┐
                    │  Malpractice │       │   Precedent  │
                    │  carrier     │       │   set for ZK │
                    │  gives       │       │   admissibty │
                    │  discount    │       │              │
                    └──────┬───────┘       └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  Other firms │
                    │  adopt for   │
                    │  insurance   │
                    │  savings     │
                    └──────────────┘
```

### Channel Strategy

| Channel | Target Persona | Approach |
|---------|---------------|----------|
| **Spy's professional network** | Paralegals in Idaho | Direct outreach; demo at paralegal associations |
| **CLE presentations** | Attorneys (all segments) | "Discovery Compliance in the Digital Age" — earn CLE credits |
| **Bar association partnerships** | State bar members | Endorsed tool listing; co-branded compliance guides |
| **Malpractice insurance carriers** | Partners/firm owners | Position as risk-reduction tool; negotiate premium discounts |
| **Legal conferences** | Early adopters | ABA TECHSHOW, LegalTech NYC, state bar conventions |

---

## XI. VALIDATION ROADMAP

| Step | Method | Target | Timeline |
|------|--------|--------|----------|
| **1** | Interviews with Idaho paralegals | 5 practitioners from Spy's network | Week 2–3 |
| **2** | Interviews with Utah solo attorneys | 3 solo practitioners handling tiered discovery | Week 3–4 |
| **3** | Discovery sanctions case study compilation | 10 documented cases with quantified costs | Week 2–4 |
| **4** | Idaho IRCP workflow mapping | Full discovery process in Miro → smart contract spec | Week 3–5 |
| **5** | Beta firm identification | 3 firms willing to pilot | Week 5–6 |
| **6** | Malpractice carrier outreach | 2 carriers to discuss risk-reduction pricing | Week 6–8 |

---

## XII. TEAM STRENGTHS

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   SPY                                    JOHN                   │
│   ───                                    ────                   │
│   20 years complex litigation            4x Midnight Hackathon  │
│   Published gov't researcher               winner               │
│   Idaho/Utah/Washington expertise        Full-stack developer   │
│   Professional network = pipeline        Blockchain architect   │
│                                          Founder, EnterpriseZK  │
│                                            Labs LLC             │
│                                                                 │
│              ┌─────────────────────────┐                        │
│              │     INTERSECTION        │                        │
│              │                         │                        │
│              │  Domain + Code          │                        │
│              │  = Products that work   │                        │
│              │    in the real world    │                        │
│              │                         │                        │
│              │  Spy designs workflows  │                        │
│              │  John implements them   │                        │
│              │  Both validate with     │                        │
│              │  real practitioners     │                        │
│              └─────────────────────────┘                        │
│                                                                 │
│   "We don't theorize about legal pain.                          │
│    We've lived it, documented it, and now we're solving it."    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## XIII. SUCCESS METRICS

| Milestone | KPI | Target | Timeframe |
|-----------|-----|--------|-----------|
| **MVP** | Working Idaho IRCP workflow with wallet | Functional demo | April 2026 (hackathon) |
| **First Proof** | ZK compliance proof generated on Midnight testnet | 1 proof | Q2 2026 |
| **Beta** | Firms actively using AutoDiscovery | 5 firms | Q3 2026 |
| **Court Filing** | Compliance proof submitted as exhibit | 1 filing | Q4 2026 |
| **Revenue** | Monthly recurring revenue | $5K MRR | Q1 2027 |
| **Precedent** | Court accepts ZK proof as admissible | 1 ruling | 2027 |

---

## XIV. SUMMARY

AutoDiscovery sits at the intersection of **urgent legal pain** and **unprecedented technology capability**.

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   THE PROBLEM          THE SOLUTION          THE IMPACT          ║
║   ───────────          ────────────          ──────────          ║
║                                                                  ║
║   Discovery            Automated             Courts accept       ║
║   non-compliance       jurisdiction-          ZK proofs as        ║
║   costs firms          aware workflows        factual record      ║
║   millions and         on Midnight's                              ║
║   ends careers         privacy-preserving     Every regulated     ║
║                        blockchain             industry follows    ║
║                                                                  ║
║   $32B legal tech      Automated discovery    Midnight becomes    ║
║   market with          compliance:            the global trust    ║
║   zero privacy-        build once,            infrastructure      ║
║   aware solutions      comply everywhere      for compliance      ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

**We're not building a legal tool.** We're building the bridge between the legal system and blockchain — and once that bridge exists, every regulated industry in the world will cross it.

---

<div align="center">

**AutoDiscovery.legal**

*Privacy meets compliance.*

Built on Midnight Network

---

Prepared for Midnight Build Club — Cohort 0
February 2026

</div>

---

## References

| # | Source | Citation |
|---|--------|----------|
| 1 | ABA 2025 Profile of the Legal Profession | 1.37M US attorneys (2025), up from 1.35M in 2024. [americanbar.org/news/profile-legal-profession](https://www.americanbar.org/news/profile-legal-profession/) |
| 2 | Bureau of Labor Statistics (May 2024) | ~350,000 US paralegals; median wage $61,010. [bls.gov/ooh/legal/paralegals-and-legal-assistants](https://www.bls.gov/ooh/legal/paralegals-and-legal-assistants.htm) |
| 3 | Thomson Reuters, State of US Small Law Firms (2023) | Solo practices = ~40% of all firms; firms with <6 attorneys = 75%+. |
| 4 | Research Nester | Global legal technology market $32.2B (2025), projected $77.7B by 2035, 9.2% CAGR. |
| 5 | Fortune Business Insights | E-discovery is the largest and fastest-growing legal tech segment. |
| 6 | Grand View Research | US legal tech market leads globally due to AI/automation adoption. |
| 7 | *Zubulake v. UBS Warburg*, 229 F.R.D. 422 (S.D.N.Y. 2004) | Landmark e-discovery case. Adverse inference instruction for failure to preserve electronic evidence. Jury awarded compensatory + punitive damages. [ABA Journal retrospective](https://www.abajournal.com/magazine/article/looking_back_on_zubulake_10_years_later) |
| 8 | *Qualcomm v. Broadcom*, 2008 WL 66932 (S.D. Cal. 2008) | $8,568,633 in sanctions; 6 attorneys referred to California State Bar for withholding 46,000+ documents. [Law360](https://www.law360.com/articles/43412); [eDiscoveryLaw.com](https://www.ediscoverylaw.com/2008/01/08/court-sanctions-qualcomm-8568633/) |
| 9 | *Pennypack Woods Civic Ass'n v. Narberth* (3d Cir.) | Case-dispositive sanctions for spoliation of evidence after duty to preserve arose. |
| 10 | *City of Los Angeles v. PricewaterhouseCoopers* (Cal. 2022) | Post-dismissal sanctions upheld on appeal for egregious discovery abuse. |
| 11 | Texas Lawyers' Insurance Exchange (TLIE) | Missed deadlines = #1 legal malpractice complaint. Discovery errors are one of 4 recognized malpractice categories. [tlie.org](https://www.tlie.org/resource/4-common-mistakes-that-can-lead-to-a-legal-malpractice-suit) |
| 12 | *State v. Kohberger*, Ada County CR01-24-31665 (Idaho 2024–25) | 68 TB of disorganized discovery; defense motions to compel, for sanctions, and for continuance; AG diverted resources to manage discovery burden. Guilty plea June 2025, 4 life sentences July 2025. [Newsweek](https://www.newsweek.com/bryan-kohberger-trial-update-idaho-murders-lawyer-response-2010410); [Idaho News/CBS2](https://idahonews.com/news/local/state-claims-kohberger-defense-is-seeking-a-perpetual-continuance-ahead-of-murder-trial); [Idaho AG](https://www.ag.idaho.gov/newsroom/attorney-general-labrador-commends-life-sentences-for-bryan-kohberger/); [Court filings via coi.isc.idaho.gov](https://coi.isc.idaho.gov/docs/CR01-24-31665/2025/041425+Defendants+Trial+Brief.pdf) |
| 13 | ABA Model Rules of Professional Conduct, Rule 1.6 | Duty of confidentiality — attorneys must not reveal client information without informed consent. |
| 14 | Federal Rules of Civil Procedure, Rules 26, 37 | Rule 26: mandatory disclosures and discovery scope. Rule 37: sanctions for discovery failures. |
| 15 | FindLaw, State of Small Law Firms (2023) | 77% of small law firms spend too much time on administrative tasks. |
| 16 | Above the Law (2024) | 39% of law firms experienced a security breach; 97% have invested in cybersecurity. |
| 17 | *Gem State Roofing v. United Components*, 168 Idaho 820, 488 P.3d 488 (2021) | Defendant withheld discovery; third-party subpoenas revealed hundreds of undisclosed pages; defendant claimed routine email deletion; discovery described as "particularly contentious." [Justia](https://law.justia.com/cases/idaho/supreme-court-civil/2021/47484.html) |
| 18 | *Raymond v. Idaho State Police*, 451 P.3d 17 (Idaho 2019) | Landmark: Idaho Supreme Court created new tort of "intentional interference with a prospective civil action by spoliation of evidence" after state police destroyed/concealed DUI evidence in fatal accident. [MWL Law analysis](https://www.mwl-law.com/idaho-now-recognizes-third-party-independent-tort-of-spoliation/) |
| 19 | *Sanders v. University of Idaho*, 634 F. Supp. 3d 936 (D. Idaho 2022) | Federal court granted spoliation sanctions after university destroyed interview notes despite foreseeable litigation; failed to implement litigation hold. [Jackson Lewis analysis](https://www.jacksonlewis.com/insights/duty-preserve-evidence-covers-climate-review-higher-educational-institution-idaho-court-rules) |
| 20 | *Erickson v. Erickson*, 521 P.3d 1089, Docket 48335 (Idaho 2022) | Idaho Supreme Court addressed proper standards for discovery sanctions against trial counsel; reversed and remanded for improper sanctions assessment. [Justia](https://law.justia.com/cases/idaho/supreme-court-civil/2022/48335.html) |

---

## Glossary

| Abbreviation | Definition |
|-------------|-----------|
| ABA | American Bar Association |
| ARR | Annual Recurring Revenue |
| CAGR | Compound Annual Growth Rate |
| CCP | California Code of Civil Procedure |
| CLE | Continuing Legal Education |
| CPLR | New York Civil Practice Law and Rules |
| CR | Washington Civil Rules |
| dApp | Decentralized Application |
| ESI | Electronically Stored Information |
| FRCP | Federal Rules of Civil Procedure |
| GeoZ | Privacy-preserving geolocation oracle on Midnight — [companion project](https://github.com/bytewizard42i/GeoZ_us_app_Midnight-Oracle) (not a dependency of AutoDiscovery) |
| GTM | Go-to-Market |
| IRCP | Idaho Rules of Civil Procedure |
| KPI | Key Performance Indicator |
| MRR | Monthly Recurring Revenue |
| MVP | Minimum Viable Product |
| SAM | Serviceable Addressable Market |
| SOM | Serviceable Obtainable Market |
| TAM | Total Addressable Market |
| URCP | Utah Rules of Civil Procedure |
| WTP | Willingness to Pay |
| ZK | Zero-Knowledge (Proof) |
