# 🗺️ AutoDiscovery — State-by-State Rollout Strategy

> **Idaho first. Then everywhere. One jurisdiction at a time.**

---

## 📋 Overview

This document defines the phased, state-by-state launch strategy for AutoDiscovery — starting in **Idaho** as the anchor jurisdiction and expanding methodically across the US. Each state is treated as its own product release with discrete compliance checkpoints, legal validation gates, and measurable success criteria before the next state is opened.

The modular `jurisdiction-registry` smart contract is built for exactly this model: **add new rule packs without code changes.**

---

## 🏗️ Rollout Philosophy

| Principle | Description |
|-----------|-------------|
| **Depth before breadth** | Own Idaho completely before opening Utah |
| **Validate before replicate** | Each state launch proves the template for the next |
| **Legal-first sequencing** | Compliance checkpoints gate every expansion |
| **Metrics-driven gates** | No new state opens without prior state hitting KPIs |
| **Modular by design** | Rule packs are pluggable — architecture never changes |

---

## 🗓️ Master Expansion Timeline

```
2026 Q2 ──── Idaho (Anchor Launch)
2026 Q3 ──── Utah
2026 Q4 ──── Washington
2027 Q1 ──── California
2027 Q2 ──── New York
2027 Q3 ──── Ohio + Texas
2027 Q4 ──── Florida + Illinois
2028 Q1-Q4 ─ Remaining US states (batch rollout)
2028 Q4 ──── Federal (FRCP) — All Federal District Courts
2029+ ─────── International (UK, Canada, Australia)
```

---

## 🥔 PHASE 1 — Idaho Anchor Launch (Q2 2026)

### 🎯 **Why Idaho First**
- Spy's primary jurisdiction — 20+ years complex litigation paralegal experience here
- IRCP (adopted July 1, 2016, modeled on 2015 federal amendments) is well-documented and stable
- ~6,000 ISB members — small enough to move fast, significant enough to prove the model
- Idaho State Bar is approachable and has an active Technology Committee
- Win here = credible, domain-expert-backed proof of concept for every subsequent state

---

### 🏛️ **Idaho Court System — Structure AutoDiscovery Must Support**

Idaho has **7 Judicial Districts**, each with its own District Court and local rules that layer on top of IRCP:

| District | Counties | Seat | Notes |
|----------|----------|------|-------|
| **1st** | Shoshone, Kootenai, Benewah, Boundary, Bonner | Coeur d'Alene | High case volume, Kootenai County |
| **2nd** | Nez Perce, Lewis, Latah, Clearwater, Idaho | Lewiston / Moscow | University of Idaho — complex civil matters |
| **3rd** | Adams, Canyon, Gem, Owyhee, Payette, Washington | Caldwell | Canyon County — 2nd largest in ID |
| **4th** | Ada, Boise, Elmore, Valley | Boise | **Highest volume** — primary target market |
| **5th** | Blaine, Camas, Cassia, Gooding, Jerome, Lincoln, Minidoka, Twin Falls | Twin Falls | Sun Valley — complex real estate/injury |
| **6th** | Bear Lake, Bannock, Caribou, Franklin, Oneida, Power | Pocatello | ISU area |
| **7th** | Bingham, Bonneville, Butte, Clark, Custer, Fremont, Jefferson, Lemhi, Madison, Teton | Idaho Falls | Eastern Idaho hub |

> **AutoDiscovery v1.0 targets:** 4th District (Ada County / Boise) as primary, 3rd and 6th as secondary.

---

### 📜 **IRCP Discovery Rules — Detailed Mapping**

The Idaho Rules of Civil Procedure were comprehensively revised effective **July 1, 2016**, closely following the 2015 Federal Rules amendments. AutoDiscovery must correctly implement every rule below.

#### Core Discovery Rules to Implement

| Rule | Title | Key AutoDiscovery Function |
|------|-------|---------------------------|
| **IRCP 16** | Pretrial Conferences; Scheduling | Scheduling order ingestion — sets all downstream deadlines |
| **IRCP 26(a)(1)** | Initial Disclosures | Auto-trigger at case creation; 14-day deadline from scheduling conference |
| **IRCP 26(a)(2)** | Expert Witness Disclosures | Expert designation workflow; SOC documentation; W-9/I-9 collection |
| **IRCP 26(a)(3)** | Pretrial Disclosures | Final exhibit/witness lists; 30 days before trial |
| **IRCP 26(b)(1)** | Scope of Discovery | Proportionality analysis for document requests |
| **IRCP 26(b)(2)** | Limitations on Discovery | ESI not reasonably accessible — cost-shifting analysis |
| **IRCP 26(b)(3)** | Trial Preparation — Work Product | Privilege log generation and management |
| **IRCP 26(c)** | Protective Orders | Protective order request workflow |
| **IRCP 26(f)** | Conference of the Parties | Meet-and-confer scheduling and documentation |
| **IRCP 33** | Interrogatories | 25-interrogatory limit; 28-day response deadline |
| **IRCP 34** | Requests for Production | Document/ESI production; 28-day response deadline |
| **IRCP 35** | Physical/Mental Examinations | Independent medical examination (IME) workflows |
| **IRCP 36** | Requests for Admission | 28-day response; deemed admitted on failure |
| **IRCP 37** | Sanctions for Discovery Failures | Sanction risk flags and compliance alerts |
| **IRCP 45** | Subpoenas | Third-party document subpoena tracking |

#### ⏰ IRCP Deadline Table — AutoDiscovery Must Calculate All of These

| Deadline | Trigger | Days | Notes |
|----------|---------|------|-------|
| **Initial disclosures** | Scheduling conference | +14 days | IRCP 26(a)(1) |
| **Interrogatory responses** | Service of interrogatories | +28 days | IRCP 33; extendable by stipulation |
| **RFP responses** | Service of RFP | +28 days | IRCP 34 |
| **RFA responses** | Service of RFA | +28 days | IRCP 36; failure = admitted |
| **Expert disclosures (plaintiff)** | Per scheduling order | Usually 90 days pre-trial | IRCP 26(a)(2) |
| **Expert disclosures (defendant)** | After plaintiff's | +30 days | IRCP 26(a)(2) |
| **Rebuttal experts** | After defendant's disclosure | +30 days | IRCP 26(a)(2) |
| **Pretrial disclosures** | Before trial | -30 days | IRCP 26(a)(3) |
| **Discovery cutoff** | Per scheduling order | Usually -90 days from trial | Set by district judge |
| **Deposition notice** | Before deposition | Reasonable (~14 days) | IRCP 30 |
| **Deposition objections** | After transcript | +30 days | IRCP 32 |

> ⚠️ **Critical:** Failure to serve timely RFA responses results in automatic admission (IRCP 36(a)(3)). AutoDiscovery must flag this deadline with **CRITICAL** alert level.

---

### ⚖️ **Idaho UPL Analysis — Detailed Assessment**

This is a legal gate. AutoDiscovery **cannot launch** until this analysis is complete and documented.

#### Governing Statutes & Rules

| Authority | Provision | Relevance |
|-----------|-----------|-----------|
| **Idaho Code § 3-104** | Only licensed attorneys may practice law in Idaho | AutoDiscovery must not constitute "practice of law" |
| **Idaho Code § 3-420** | Unauthorized practice is a misdemeanor | Criminal exposure if UPL occurs |
| **ISB Rule 5.5** | Multi-jurisdictional practice | Governs out-of-state attorney use |
| **Idaho RPC 1.1** | Competence includes technology | Supports attorney use of AutoDiscovery |
| **Idaho RPC 5.3** | Supervision of non-lawyer assistants | AutoDiscovery = non-lawyer tool under attorney supervision |

#### UPL Safe Harbor Analysis

AutoDiscovery avoids UPL under Idaho law because:

1. **Tool, not advisor** — AutoDiscovery enforces rules set by the Idaho legislature; it does not give legal advice
2. **Attorney supervision** — The attorney of record retains all judgment and discretion; AutoDiscovery surfaces deadlines, the attorney decides strategy
3. **Scrivener function** — Populating forms and calculating deadlines is a scrivener function, not legal practice (analogous to court-approved legal form software)
4. **Precedent** — The ISB has found that legal software tools (Clio, Westlaw, etc.) do not constitute UPL when used under attorney supervision

#### Required UPL Documentation (Pre-Launch Gate)
- [ ] Written UPL memo from Idaho-licensed attorney confirming safe harbor
- [ ] ToS language affirming AutoDiscovery is a tool, not legal counsel
- [ ] In-app disclaimer: *"AutoDiscovery is a compliance automation tool. It does not constitute legal advice. All decisions remain with the supervising attorney."*
- [ ] ISB Ethics Opinion inquiry (informal) — confirm no objection

---

### 🏥 **Idaho Medical Malpractice — Primary Use Case Deep Dive**

Medical malpractice is AutoDiscovery's anchor use case. Idaho has specific statutory requirements beyond IRCP:

#### Governing Statutes

| Statute | Provision | AutoDiscovery Implementation |
|---------|-----------|------------------------------|
| **Idaho Code § 6-1001** | Medical Malpractice Act scope | Case type flag — triggers malpractice workflow |
| **Idaho Code § 6-1003** | Pre-litigation screening panel required | Panel request tracking + deadline |
| **Idaho Code § 6-1004** | Panel composition | Expert witness management — panel member tracking |
| **Idaho Code § 6-1007** | Expert affidavit of merit | Auto-flag at case creation — affidavit deadline |
| **Idaho Code § 6-1603** | Non-economic damage cap: $250,000 | Case valuation flag |
| **Idaho Code § 5-219(4)** | Statute of limitations: 2 years from discovery | SOL calculator — alert if approaching |

#### Medical Malpractice Discovery Checklist (Idaho-Specific)

- [ ] **Pre-litigation panel** — Track submission, composition, and 180-day review period
- [ ] **Expert affidavit of merit** — Must be filed at complaint; track deadline
- [ ] **Standard of Care (SOC)** expert identification and documentation
- [ ] **Expert W-9/I-9** collection workflow (existing in `expert-witness` contract)
- [ ] **IME scheduling** — Independent Medical Examination under IRCP 35
- [ ] **HIPAA authorization** tracking — Idaho follows federal HIPAA; document patient authorizations
- [ ] **Medical records request** deadlines — 30-day response under Idaho Code § 9-420A
- [ ] **Privilege log** for any withheld provider communications

---

### 🗂️ **Idaho District Local Rules — Mapping Required**

Each judicial district adds local rules on top of IRCP. AutoDiscovery must handle at least the **4th District** at launch:

#### 4th District (Ada County / Boise) — Priority

| Local Rule | Topic | Implementation |
|------------|-------|----------------|
| **IDLR 16** | Case Management Orders | Auto-ingest scheduling order deadlines |
| **IDLR 26** | ESI Protocol | Default ESI production format (TIFF/native) |
| **IDLR 37** | Discovery Disputes | Required meet-and-confer documentation before motion |
| **CV-1 Standing Order** | Case scheduling | Some judges issue standing orders — flag for manual entry |

> **Action:** Obtain current 4th District local rules from `adacounty.id.gov/district-court`. Verify annually.

---

### 🔒 **Idaho Data Privacy & Security Requirements**

| Law / Rule | Requirement | AutoDiscovery Compliance |
|------------|-------------|--------------------------|
| **Idaho Code § 28-51-104** | Data breach notification within 30 days | Midnight private ledger = encrypted at rest; breach protocol documented |
| **Idaho Code § 28-51-105** | Reasonable security measures required | ZK architecture + Lace wallet key management satisfies this |
| **HIPAA (Federal)** | Medical records — covered entity rules | AutoDiscovery does not store PHI; document handling is client-side |
| **Idaho RPC 1.6** | Attorney duty of confidentiality | Selective disclosure + private ledger satisfies this |
| **Idaho RPC 1.15** | Safekeeping of client property | Documents on client's machine; AutoDiscovery holds only hashes |

---

### � **Full Launch Checklist — Idaho (Expanded)**

#### 🔒 Legal & Compliance Checkpoints

**Rule Mapping**
- [ ] IRCP Rules 16, 26, 33, 34, 35, 36, 37, 45 — full implementation audit
- [ ] All IRCP deadline tables above entered into `jurisdiction-registry` Idaho rule pack
- [ ] 4th District (Ada County) local rules mapped and implemented
- [ ] Medical malpractice statutory requirements (§ 6-1001 through § 6-1012) mapped

**Attorney Review**
- [ ] Idaho-licensed civil litigation attorney reviews IRCP deadline table (accuracy sign-off)
- [ ] Idaho-licensed medical malpractice attorney reviews malpractice workflow (accuracy sign-off)
- [ ] Both reviewers sign written attestation — stored in `docs/jurisdictions/idaho/`

**UPL & Ethics**
- [ ] UPL memo from Idaho attorney — confirms AutoDiscovery is a tool, not legal practice
- [ ] ISB informal inquiry submitted (Ethics Hotline: (208) 334-4500)
- [ ] ToS reviewed by Idaho attorney for enforceability
- [ ] In-app disclaimer language finalized and implemented

**Data & Privacy**
- [ ] Idaho Code § 28-51-104 breach notification procedure documented
- [ ] HIPAA handling confirmed: AutoDiscovery stores hashes, not PHI
- [ ] Idaho RPC 1.6 confidentiality analysis documented

**Insurance**
- [ ] Verify beta user E&O policies are not voided by use of third-party compliance tools
- [ ] Obtain confirmation from ALPS or ISB that attorney E&O covers AutoDiscovery-assisted work

#### 🛠️ Technical Checkpoints

- [ ] `jurisdiction-registry` Idaho rule pack v1.0 deployed to Midnight testnet
- [ ] All IRCP deadlines from the table above coded and unit-tested
- [ ] RFA auto-admission warning implemented (CRITICAL alert level)
- [ ] Medical malpractice workflow implemented (panel tracking, SOC, affidavit)
- [ ] Expert witness module (`W-9/I-9`, SOC) validated for Idaho requirements
- [ ] 4th District local rule ESI production format (TIFF/native) implemented
- [ ] `discovery-core` smart contract tested end-to-end for:
  - [ ] Medical malpractice (4th District)
  - [ ] Personal injury (4th District)
  - [ ] Contract dispute (4th District)
- [ ] Email Safety Protocol contacts seeded with Idaho court clerk addresses
- [ ] DemoLand seeded with 5 realistic Idaho mock cases (Boise venue)
- [ ] Idaho SOL calculator implemented (2-year med mal; 4-year contract)

#### 🧪 Beta Testing Checkpoints

- [ ] Recruit 10 Idaho beta users — target Ada County civil litigators and med mal practitioners
- [ ] Beta period: **60 days minimum** before public launch
- [ ] Weekly feedback sessions led by Spy (domain expert)
- [ ] Zero critical bugs gate — no launch with P0/P1 open
- [ ] 100% accuracy on every IRCP deadline calculation in the table above
- [ ] At least 1 full mock medical malpractice case run end-to-end by beta user
- [ ] Beta user survey: NPS ≥ 50 before proceeding

#### 📣 Go-to-Market Checkpoints

- [ ] `autodiscovery.legal` live with Idaho-specific landing page ("Built for Idaho practitioners")
- [ ] Idaho State Bar *The Advocate* newsletter — submit product announcement
- [ ] Idaho Association for Justice (IAJ) outreach — request member newsletter placement
- [ ] Idaho State Bar CLE Committee — propose 1-hour CLE: "Discovery Automation & Compliance"
- [ ] Outreach to ISB Technology Committee for informal demo
- [ ] 3 attorney case studies drafted from beta users (with permission)
- [ ] Press release to Idaho legal publications: *The Advocate*, Idaho Business Review
- [ ] LinkedIn content targeting Idaho attorney audience (Spy as author)

---

### 📊 **Idaho Success Metrics (Gates for Utah Launch)**

| Metric | Target | Minimum Gate |
|--------|--------|--------------|
| **Beta users** | 10 firms | 5 firms |
| **Paying customers** | 25 firms | 10 firms |
| **Monthly Recurring Revenue** | $5,000 | $2,500 |
| **IRCP deadline accuracy** | 100% | 100% — non-negotiable |
| **Med mal workflow accuracy** | 100% | 100% — non-negotiable |
| **User retention (30-day)** | 90% | 80% |
| **NPS score** | 70+ | 50+ |
| **Critical bugs open** | 0 | 0 |
| **Attorney endorsements (named)** | 3 | 1 |
| **UPL memo on file** | Required | Required |
| **ISB inquiry response on file** | Required | Preferred |

> ⚠️ **Hard Gate:** All minimum gate metrics must be met before Utah opens.
> ⚠️ **Double Hard Gate:** Deadline accuracy is 100% non-negotiable. A single wrong IRCP deadline is a direct malpractice vector for our users.

---

## 🏔️ PHASE 2 — Utah (Q3 2026)

### 🎯 **Why Utah Second**
- Adjacent to Idaho — many Pacific Northwest firms practice in both states
- URCP closely mirrors IRCP with known, documented divergence points
- Spy has research depth on Utah rules
- Doubles TAM with minimal new engineering

### 📋 **Utah-Specific Checkpoints**

#### 🔒 Legal & Compliance
- [ ] **URCP vs IRCP Divergence Map** — Document every rule difference
- [ ] **URCP Rule Pack v1.0** — Build on Idaho template, fork where rules diverge
- [ ] **Utah-licensed attorney review** — 1 attorney minimum
- [ ] **Utah State Bar** — Informal outreach (same UPL review as Idaho)
- [ ] **Multi-state case handling** — Test case spanning ID + UT jurisdictions

#### 🛠️ Technical
- [ ] `jurisdiction-registry` Utah rule pack deployed
- [ ] **Fork logic** tested — same case, different state, different deadlines correctly applied
- [ ] **Jurisdiction comparison view** — Side-by-side ID vs UT rule display in UI
- [ ] Multi-jurisdiction workflow stress test (case filed in UT, evidence from ID)

#### 📊 **Utah Success Metrics (Gates for Washington)**

| Metric | Target | Minimum Gate |
|--------|--------|--------------|
| **New Utah customers** | 30 firms | 15 firms |
| **Combined MRR (ID+UT)** | $15,000 | $8,000 |
| **Multi-state case tests** | 10 passed | 5 passed |
| **Zero jurisdiction bleed errors** | 100% | 100% |

---

## 🌲 PHASE 3 — Washington (Q4 2026)

### 🎯 **Why Washington Third**
- Completes the Pacific Northwest trifecta (ID, UT, WA)
- Washington Civil Rules (CR) introduce new complexity — important test
- Seattle legal market is tech-forward and receptive to legal tech
- Largest market of the three Pacific Northwest states

### 📋 **Washington-Specific Checkpoints**

#### 🔒 Legal & Compliance
- [ ] **WA CR Full Rule Audit** — Washington Civil Rules differ meaningfully from IRCP/URCP
- [ ] **King County Local Rules** — Map Seattle-specific local court rules
- [ ] **WA Rule Pack v1.0** — Includes CR + King County Local Rules
- [ ] **Washington State Bar** — Outreach via WSBA Technology Committee
- [ ] **Washington licensed attorney review** — 2 attorneys (one King County practitioner)
- [ ] **E-discovery specifics** — WA has distinct ESI protocols; validate handling

#### 🛠️ Technical
- [ ] **Local rule layer** — Architecture supports state rules + local court rules simultaneously
- [ ] **King County court contacts** seeded in DemoLand
- [ ] **ESI protocol** validated in document-registry contract

#### 📊 **Washington Success Metrics (Gates for California)**

| Metric | Target | Minimum Gate |
|--------|--------|--------------|
| **New WA customers** | 50 firms | 25 firms |
| **Combined MRR (ID+UT+WA)** | $40,000 | $25,000 |
| **Local rules accuracy** | 100% | 99.5% |
| **Enterprise inquiries** | 5 | 2 |

---

## 🌴 PHASE 4 — California (Q1 2027)

### 🎯 **Why California Fourth**
- Largest legal market in the US (~150,000 licensed attorneys)
- CCP (Code of Civil Procedure) is the most complex US civil rules system
- Successfully launching in CA validates the platform for all major markets
- CA launch generates credibility for NY, TX, FL

### 📋 **California-Specific Checkpoints**

#### 🔒 Legal & Compliance
- [ ] **CCP Full Audit** — California Code of Civil Procedure (comprehensive)
- [ ] **Judicial Council Forms** — Map all mandatory Judicial Council forms
- [ ] **Local Rules Matrix** — LA Superior, SF Superior, SD Superior, Orange County
- [ ] **CCPA Compliance** — California Consumer Privacy Act data handling review
- [ ] **California Bar** — State Bar of California tech sandbox inquiry
- [ ] **3 CA-licensed attorneys** review rule pack
- [ ] **Proposition 65 / CCPA / CPRA** — Full California privacy law compliance audit
- [ ] **E-discovery ESI Standing Order** compliance for key California districts

#### 🛠️ Technical
- [ ] **Multi-county local rule support** — Architecture handles county-level rule variations
- [ ] **Judicial Council form auto-population** — Key differentiation for CA market
- [ ] **CCPA data handling** implemented in private ledger layer

#### 📊 **California Success Metrics (Gates for New York)**

| Metric | Target | Minimum Gate |
|--------|--------|--------------|
| **New CA customers** | 200 firms | 75 firms |
| **Combined MRR** | $150,000 | $80,000 |
| **Local rules coverage** | 4 major counties | 2 counties |
| **CCPA audit passed** | Required | Required |
| **Enterprise accounts** | 10 | 3 |

---

## 🗽 PHASE 5 — New York (Q2 2027)

### 🎯 **Why New York Fifth**
- 38,000+ cases dismissed in NYC in 2024 — the single most compelling market
- CPLR is the most cited jurisdiction in AutoDiscovery's pitch materials
- Highest average sanction values in the US
- NYC success enables national enterprise sales

### 📋 **New York-Specific Checkpoints**

#### 🔒 Legal & Compliance
- [ ] **CPLR Full Audit** — Civil Practice Law and Rules
- [ ] **NYC Local Rules** — New York City Civil Court, Supreme Court NYC
- [ ] **NYSCEF integration** — New York State Courts Electronic Filing system review
- [ ] **NY State Bar** — NYSBA Committee on Technology outreach
- [ ] **2 NY-licensed attorneys** review rule pack
- [ ] **NY Privacy Law** — NY SHIELD Act data compliance
- [ ] **Appellate Division rules** — Each of the 4 Departments has local rules

#### 🛠️ Technical
- [ ] **NYSCEF-aware** deadline logic (e-filing timestamps)
- [ ] **4 Appellate Division** local rule variants supported

#### 📊 **New York Success Metrics (Gates for National Expansion)**

| Metric | Target | Minimum Gate |
|--------|--------|--------------|
| **New NY customers** | 300 firms | 100 firms |
| **Combined MRR** | $400,000 | $200,000 |
| **NYC-specific case tests** | 20 passed | 10 passed |
| **Enterprise accounts** | 25 | 10 |
| **Press coverage** | 3 publications | 1 publication |

---

## ⚙️ PHASE 6 — Ohio, Texas, Florida, Illinois (Q3–Q4 2027)

### Batch Expansion Model
By Phase 6 the state launch template is proven. Shifts to a **parallel batch model**:
- 2 states launched simultaneously per quarter
- Template reuse reduces launch time from 90 days → 45 days per state
- Dedicated **Jurisdiction Research Team** (2 hires) handles rule audits
- Law firm partners in each state replace individual attorney reviews

| State | Rules | Key Market | Notable Complexity |
|-------|-------|-----------|-------------------|
| **Ohio** | Ohio Civ.R. | Cleveland, Columbus | Already researched — fast track |
| **Texas** | TRCP | Dallas, Houston, Austin | Large market, complex local rules |
| **Florida** | FRCP (FL) | Miami, Orlando, Tampa | High malpractice market |
| **Illinois** | Ill. S. Ct. Rules | Chicago | Cook County local rules complexity |

---

## 🇺🇸 PHASE 7 — Remaining 40 States & FRCP (2028)

### National Coverage Model

**Prioritization criteria for remaining states:**
1. **Litigation volume** (number of civil cases filed per year)
2. **Average case value** (higher = more sanction risk = more value)
3. **Bar association receptivity** (partnership potential)
4. **Rule complexity** (simpler states batched together)

| Batch | States | Target Quarter |
|-------|--------|----------------|
| **Batch A** | CO, NV, AZ, NM | Q1 2028 |
| **Batch B** | GA, NC, SC, VA | Q2 2028 |
| **Batch C** | PA, NJ, CT, MA | Q2 2028 |
| **Batch D** | MI, WI, MN, MO | Q3 2028 |
| **Batch E** | Remaining 22 states | Q3–Q4 2028 |
| **Federal (FRCP)** | All Federal Districts | Q4 2028 |

---

## 🔄 State Launch Template (Reusable for Every State)

Each state follows this standardized 8-week launch sprint:

```
Week 1-2:  Rule Audit
           ├── Pull current state civil procedure rules
           ├── Map all rules to AutoDiscovery 9-step protocol
           ├── Document divergence from prior states
           └── Identify local county/district rule layers

Week 3-4:  Rule Pack Build
           ├── Develop jurisdiction-registry rule pack
           ├── Code deadline calculation logic
           ├── Map mandatory forms (if any)
           └── Unit test all deadline scenarios

Week 5:    Legal Review
           ├── 1-2 state-licensed attorney reviews
           ├── UPL confirmation
           ├── Privacy law spot check
           └── Resolve all red-flag findings

Week 6:    QA & Integration Testing
           ├── End-to-end test: 3 case types per state
           ├── Multi-state conflict testing
           ├── Regression test all prior states
           └── DemoLand case seeds updated

Week 7:    Soft Launch (Invite-Only)
           ├── Recruit 5-10 beta users in state
           ├── 14-day monitored trial
           ├── Daily feedback collection
           └── Critical bug fix window

Week 8:    Public Launch
           ├── State enabled in production
           ├── Bar association announcement
           ├── Press release
           └── Sales team notified
```

---

## ⚖️ Ongoing Compliance Infrastructure

### 🔔 Rule Change Monitoring

| Mechanism | Frequency | Responsible |
|-----------|-----------|-------------|
| **State legislature bill tracking** | Weekly | Spy (legal) |
| **State bar rule change alerts** | Real-time | Automated RSS feed |
| **Court local rule updates** | Monthly | Jurisdiction Research Team |
| **FRCP Advisory Committee** | Quarterly | Legal lead |
| **Annual full rule re-audit** | Yearly | Both team members |

### 🚨 Rule Change Response SLA

| Change Type | Response Time | Action |
|-------------|--------------|--------|
| **Emergency rule change** | 24 hours | Hotfix rule pack |
| **Deadline modification** | 72 hours | Rule pack update |
| **New mandatory form** | 1 week | Form integration |
| **Major rule overhaul** | 30 days | Full rule pack re-audit |

---

## 📊 Platform-Wide Success Metrics Dashboard

### 🎯 Quarterly KPIs (All States Combined)

| Metric | Q2 2026 | Q4 2026 | Q2 2027 | Q4 2027 |
|--------|---------|---------|---------|---------|
| **States Active** | 1 (ID) | 3 (ID/UT/WA) | 5 (+ CA/NY) | 9 |
| **Paying Customers** | 25 | 200 | 1,000 | 5,000 |
| **MRR** | $5K | $40K | $400K | $2M |
| **Compliance Accuracy** | 100% | 100% | 100% | 100% |
| **NPS** | 70+ | 72+ | 75+ | 78+ |
| **Critical Bugs** | 0 | 0 | 0 | 0 |

> ⚠️ **Compliance Accuracy is a non-negotiable 100% hard floor across all phases. A single missed deadline or wrong rule applied is a legal liability.**

---

## 🚧 Risk Register

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Rule change mid-deployment** | High | High | Real-time monitoring + 24hr hotfix SLA |
| **UPL challenge in new state** | Medium | High | State-by-state UPL review before launch |
| **Rule pack error causes sanction** | Low | Critical | Attorney review gate + compliance insurance |
| **State bar opposition** | Low | Medium | Early informal outreach, not approval-dependent |
| **Multi-state conflict logic error** | Medium | High | Dedicated multi-state regression test suite |
| **Competitor copies rule pack model** | Medium | Medium | Technical moat via ZK proofs + Midnight |
| **Key person risk (Spy)** | Low | High | Document all rule pack decisions in detail |

---

## 🤝 State Partnership Strategy

### Bar Association Engagement Model

| Stage | Action | Goal |
|-------|--------|------|
| **Pre-launch** | Informal outreach, no ask | Awareness, avoid opposition |
| **Soft launch** | Demo invite to bar tech committee | Feedback, credibility |
| **Post-launch** | CLE presentation offer | Endorsement pipeline |
| **Mature state** | Bar-sponsored webinar | Official endorsement |
| **Long-term** | Preferred vendor status | Distribution channel |

### Law School Partnerships
- Partner with law school clinics for beta users in each state
- Offer free access to law school legal aid programs
- Academic research partnerships for jurisdiction data

---

## 📁 Deliverables Per State Launch

Each state launch produces the following artifacts committed to the repo:

```
docs/jurisdictions/[state]/
├── rule-pack-v1.0.md          # Human-readable rule pack documentation
├── ircp-divergence-map.md     # Differences from prior states
├── attorney-review-sign-off.md # Attorney review record (redacted)
├── upl-assessment.md          # UPL legal memo
├── launch-checklist.md        # Completed launch checklist
└── success-metrics-report.md  # Post-launch metrics (30/60/90 day)
```

---

<div align="center">

## 🚀 **Idaho is just the beginning.**

*One state. One proof. One precedent.*  
*Then we replicate it everywhere.*

**Built on Midnight Network — Privacy meets compliance.** 🌙

</div>

---

*This strategy is a living document. Update after each state launch with lessons learned.*  
*Last updated: February 2026*
