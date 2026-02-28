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
- Spy has existing research depth on Utah rules from prior jurisdiction work
- Doubles TAM with minimal new engineering — Idaho template carries ~80% over
- ~14,000 licensed Utah attorneys; 3rd District (Salt Lake) is the largest market

---

### 🏛️ **Utah Court System — Structure AutoDiscovery Must Support**

Utah has **8 Judicial Districts** under the Utah Supreme Court:

| District | Counties | Seat | Notes |
|----------|----------|------|-------|
| **1st** | Cache, Rich, Box Elder | Logan | Northern Utah |
| **2nd** | Weber, Davis, Morgan | Ogden | Wasatch Front |
| **3rd** | Salt Lake, Summit, Tooele | Salt Lake City | **Highest volume — primary target** |
| **4th** | Utah, Wasatch, Juab | Provo | Utah County — fast-growing |
| **5th** | Iron, Beaver, Washington | Cedar City / St. George | Southern Utah |
| **6th** | Sevier, Piute, Sanpete, Wayne, Millard, Garfield, Kane | Richfield | Rural |
| **7th** | Carbon, Emery, Grand, San Juan | Price | Eastern Utah |
| **8th** | Duchesne, Uintah, Daggard | Vernal | Uinta Basin |

> **AutoDiscovery v1.0 (Utah) targets:** 3rd District (Salt Lake County) primary, 4th District (Utah County) secondary.

---

### � **URCP Discovery Rules — Divergence Map from IRCP**

Utah Rules of Civil Procedure (URCP) were substantially revised in 2004 and track the federal model closely — but diverge from IRCP in several important areas AutoDiscovery must handle correctly.

#### Core Discovery Rules — URCP vs IRCP Comparison

| Rule | URCP | IRCP | Key Difference |
|------|------|------|----------------|
| **Initial Disclosures** | URCP 26(a)(1) — 14 days | IRCP 26(a)(1) — 14 days | ✅ Identical |
| **Interrogatory Limit** | URCP 33 — 25 limit | IRCP 33 — 25 limit | ✅ Identical |
| **Interrogatory Response** | URCP 33 — 28 days | IRCP 33 — 28 days | ✅ Identical |
| **RFP Response** | URCP 34 — 28 days | IRCP 34 — 28 days | ✅ Identical |
| **RFA Response** | URCP 36 — 28 days | IRCP 36 — 28 days | ✅ Identical |
| **Expert Disclosures** | URCP 26(a)(4) — per scheduling order | IRCP 26(a)(2) — per scheduling order | ⚠️ Rule number differs |
| **Proportionality** | URCP 26(b)(1) — explicit proportionality | IRCP 26(b)(1) — same | ✅ Substantially identical |
| **Protective Orders** | URCP 26(c) | IRCP 26(c) | ✅ Identical |
| **Sanctions** | URCP 37 | IRCP 37 | ✅ Substantially identical |
| **Tier System** | **URCP 26(c)(3) — Tiered discovery by case type** | No tier system | ⚠️ **MAJOR DIFFERENCE — see below** |

#### ⚠️ URCP Tier System — Critical Utah-Specific Implementation

Utah's most significant divergence from Idaho: **URCP 26(c)(3) establishes a mandatory discovery tier system** based on the amount in controversy:

| Tier | Amount in Controversy | Discovery Limits | AutoDiscovery Implementation |
|------|----------------------|-----------------|------------------------------|
| **Tier 1** | Under $50,000 | 10 interrogatories, 3 depositions, no experts | Simplified workflow; flag if case type suggests higher value |
| **Tier 2** | $50,000–$300,000 | 20 interrogatories, 5 depositions | Standard workflow |
| **Tier 3** | Over $300,000 | 40 interrogatories, no deposition limit | Full workflow |

> ⚠️ AutoDiscovery must prompt for Utah tier designation at case creation and enforce correct limits per tier throughout the workflow.

#### ⏰ URCP Deadline Table

| Deadline | Trigger | Days | Notes |
|----------|---------|------|-------|
| **Initial disclosures** | Scheduling conference | +14 days | URCP 26(a)(1) — same as IRCP |
| **Interrogatory responses** | Service | +28 days | URCP 33 |
| **RFP responses** | Service | +28 days | URCP 34 |
| **RFA responses** | Service | +28 days | URCP 36; failure = admitted |
| **Expert disclosures (plaintiff)** | Per scheduling order | Usually 60–90 days pre-trial | URCP 26(a)(4) |
| **Expert disclosures (defendant)** | After plaintiff's | +14 days | URCP 26(a)(4) — shorter than IRCP's +30 |
| **Rebuttal experts** | After defendant's | +14 days | URCP 26(a)(4) |
| **Discovery cutoff** | Per scheduling order | Per judge's order | URCP 16 |
| **Pretrial disclosures** | Before trial | -28 days | URCP 26(a)(5) |

> ⚠️ **Key difference:** Utah's defendant expert rebuttal window is **+14 days** (Idaho is +30). This must be coded as a fork in the rule pack.

---

### ⚖️ **Utah UPL Analysis**

| Authority | Provision | Relevance |
|-----------|-----------|-----------|
| **Utah Code § 78A-9-103** | Definition of practice of law | AutoDiscovery must fall outside this definition |
| **Utah Code § 78A-9-102** | UPL prohibition | Civil and criminal penalties |
| **Utah RPC 5.5** | Multi-jurisdictional practice | Out-of-state attorney access |
| **Utah RPC 1.1** | Competence includes technology | Supports use |
| **Utah State Bar Ethics Hotline** | (801) 531-9077 | Submit informal inquiry pre-launch |

> Same safe harbor argument as Idaho applies. Memo required. Submit USB Ethics Hotline inquiry before beta launch.

---

### 🔒 **Utah Data Privacy Requirements**

| Law | Requirement | AutoDiscovery Compliance |
|-----|-------------|--------------------------|
| **Utah Consumer Privacy Act (UCPA)** | Effective Dec 31, 2023 — consumer data rights | AutoDiscovery stores hashes only; no personal data in ledger |
| **Utah Code § 13-44-202** | Data breach notification — 30 days | Midnight architecture satisfies; breach protocol documented |
| **Utah RPC 1.6** | Confidentiality | Private ledger + selective disclosure satisfies |
| **HIPAA (Federal)** | Medical records | Client-side handling; AutoDiscovery holds hashes only |

---

### 📋 **Full Launch Checklist — Utah**

#### � Legal & Compliance

**Rule Mapping**
- [ ] URCP vs IRCP full divergence map — document every difference
- [ ] URCP Tier System (26(c)(3)) implemented in `jurisdiction-registry` Utah rule pack
- [ ] Utah defendant expert rebuttal window (+14 days) forked correctly from Idaho (+30 days)
- [ ] 3rd District (Salt Lake County) local rules mapped
- [ ] Utah medical malpractice rules reviewed (Utah Code § 78B-3-401 et seq.)

**Attorney Review**
- [ ] Utah-licensed civil litigation attorney reviews URCP deadline table
- [ ] Written attestation stored in `docs/jurisdictions/utah/`

**UPL & Ethics**
- [ ] UPL memo from Utah-licensed attorney
- [ ] USB Ethics Hotline inquiry submitted: (801) 531-9077
- [ ] In-app disclaimer updated to include Utah

**Multi-State**
- [ ] Multi-state case test: case filed in Utah, prior discovery from Idaho — no rule bleed
- [ ] Tier system does not bleed into Idaho cases

#### 🛠️ Technical
- [ ] `jurisdiction-registry` Utah rule pack v1.0 deployed to testnet
- [ ] URCP Tier System prompt implemented at Utah case creation
- [ ] Tier-specific discovery limits enforced throughout workflow
- [ ] Expert rebuttal deadline fork (+14 days UT vs +30 days ID) unit-tested
- [ ] Jurisdiction comparison view: side-by-side ID vs UT rule display in UI
- [ ] Multi-jurisdiction regression: all Idaho cases still pass after Utah deploy
- [ ] DemoLand seeded with 3 Salt Lake County mock cases (Tier 2 and Tier 3)

#### 🧪 Beta Testing
- [ ] Recruit 8 Utah beta users — target Salt Lake County civil litigators
- [ ] 45-day beta period
- [ ] At least 1 Tier 1, 1 Tier 2, 1 Tier 3 case tested end-to-end
- [ ] Zero deadline errors on URCP tier limits

#### 📣 Go-to-Market
- [ ] Utah State Bar *Utah Bar Journal* — submit product announcement
- [ ] Utah Association for Justice (UAJ) outreach
- [ ] Utah State Bar CLE Committee — propose CLE on discovery automation
- [ ] LinkedIn content targeting Utah attorney audience

---

### 📊 **Utah Success Metrics (Gates for Washington)**

| Metric | Target | Minimum Gate |
|--------|--------|--------------|
| **New Utah customers** | 30 firms | 15 firms |
| **Combined MRR (ID+UT)** | $15,000 | $8,000 |
| **URCP deadline accuracy** | 100% | 100% — non-negotiable |
| **Tier system accuracy** | 100% | 100% — non-negotiable |
| **Multi-state case tests passed** | 10 | 5 |
| **Zero jurisdiction bleed errors** | 100% | 100% |
| **UPL memo on file** | Required | Required |

---

## 🌲 PHASE 3 — Washington (Q4 2026)

### 🎯 **Why Washington Third**
- Completes the Pacific Northwest trifecta (ID, UT, WA)
- Washington Civil Rules (CR) introduce first meaningful complexity divergence — validates modular rule pack architecture
- ~40,000 licensed Washington attorneys; King County (Seattle) is a major legal tech hub
- Seattle firms are tech-forward and early adopters — high conversion potential
- Largest market of the three Pacific Northwest states

---

### 🏛️ **Washington Court System — Structure AutoDiscovery Must Support**

Washington has **Superior Courts in each of its 39 counties**, organized under the Washington Supreme Court. Key markets:

| Court | County | Seat | Notes |
|-------|--------|------|-------|
| **King County Superior Court** | King | Seattle | **Highest volume — primary target** |
| **Pierce County Superior Court** | Pierce | Tacoma | 2nd largest |
| **Snohomish County Superior Court** | Snohomish | Everett | North of Seattle |
| **Spokane County Superior Court** | Spokane | Spokane | Eastern WA hub |
| **Clark County Superior Court** | Clark | Vancouver | Portland metro spillover |
| **Thurston County Superior Court** | Thurston | Olympia | State government cases |

> **AutoDiscovery v1.0 (Washington) targets:** King County primary, Pierce and Snohomish secondary.

---

### 📜 **Washington CR Discovery Rules — Divergence Map**

Washington Superior Court Civil Rules (CR) diverge from IRCP in several significant areas:

#### Core Discovery Rules — CR vs IRCP Comparison

| Rule | WA CR | IRCP | Key Difference |
|------|-------|------|----------------|
| **Initial Disclosures** | CR 26(a) — required | IRCP 26(a)(1) | ✅ Substantially similar |
| **Interrogatory Limit** | **CR 33 — 40 limit** | IRCP 33 — 25 limit | ⚠️ **WA allows 40; Idaho only 25** |
| **Interrogatory Response** | CR 33 — 30 days | IRCP 33 — 28 days | ⚠️ **WA = 30 days; Idaho = 28 days** |
| **RFP Response** | CR 34 — 30 days | IRCP 34 — 28 days | ⚠️ **WA = 30 days; Idaho = 28 days** |
| **RFA Response** | CR 36 — 30 days | IRCP 36 — 28 days | ⚠️ **WA = 30 days; Idaho = 28 days** |
| **Expert Disclosures** | CR 26(b)(5) — per order | IRCP 26(a)(2) — per order | ⚠️ Rule structure differs |
| **ESI Production** | CR 34 + KCLCR Standing Order | IRCP 34 | ⚠️ King County has specific ESI standing order |
| **Proportionality** | CR 26(b) | IRCP 26(b)(1) | ✅ Similar |
| **Sanctions** | CR 37 | IRCP 37 | ✅ Substantially similar |
| **Deposition by Remote Means** | CR 30(b)(7) — explicit | IRCP 30 | ⚠️ WA has specific remote deposition rules |

> ⚠️ **Critical:** Washington's response deadline for all written discovery is **30 days**, not 28. All deadline calculations must fork here — this affects interrogatories, RFPs, and RFAs simultaneously.

#### ⏰ Washington CR Deadline Table

| Deadline | Trigger | Days | Notes |
|----------|---------|------|-------|
| **Initial disclosures** | Scheduling conference | +14 days | CR 26(a) |
| **Interrogatory responses** | Service | **+30 days** | CR 33 — 2 more days than Idaho/Utah |
| **RFP responses** | Service | **+30 days** | CR 34 |
| **RFA responses** | Service | **+30 days** | CR 36; failure = admitted |
| **Expert disclosures (plaintiff)** | Per scheduling order | Per judge | CR 26(b)(5) |
| **Expert disclosures (defendant)** | After plaintiff's | Per judge | CR 26(b)(5) |
| **Discovery cutoff** | Per scheduling order | Per judge | CR 16 |
| **Pretrial disclosures** | Before trial | -30 days | CR 26(a) |
| **Deposition notice** | Before deposition | Reasonable (~10 days) | CR 30 |

---

### 🏙️ **King County Local Rules — Critical for Seattle Market**

King County Superior Court has its own Local Civil Rules (KCLCR) that layer on top of Washington CR:

| Local Rule | Topic | Implementation |
|------------|-------|----------------|
| **KCLCR 16** | Case scheduling | Mandatory scheduling order — auto-ingest deadlines |
| **KCLCR 26** | Discovery | King County ESI Standing Order — TIFF or native production |
| **KCLCR 30** | Depositions | Remote deposition protocol — document location |
| **KCLCR 37** | Discovery disputes | Joint statement of evidence dispute required before motion |
| **KCLCR 40** | Trial assignment | Trial date tracking |
| **ESI Standing Order** | Electronic discovery | Specific metadata, format, and deduplication requirements |

> **Action:** Obtain current KCLCR from `kingcounty.gov/courts/superior-court`. ESI Standing Order is updated periodically — monitor for changes.

---

### ⚖️ **Washington UPL Analysis**

| Authority | Provision | Relevance |
|-----------|-----------|-----------|
| **RCW 2.48.180** | UPL prohibition — criminal misdemeanor | AutoDiscovery must not constitute practice of law |
| **APR 12** | Limited Practice Officer rules | Defines permitted non-attorney activities |
| **Washington RPC 5.5** | Multi-jurisdictional practice | Out-of-state attorney access |
| **Washington RPC 1.1** | Competence includes technology | Supports use |
| **WSBA Ethics Line** | (206) 727-8284 | Submit informal inquiry pre-launch |

> Same safe harbor argument as Idaho/Utah applies. Memo required. WSBA Ethics Line inquiry before beta.

---

### 🔒 **Washington Data Privacy — Strongest in the Pacific NW**

Washington has some of the most aggressive state privacy laws in the US:

| Law | Requirement | AutoDiscovery Compliance |
|-----|-------------|--------------------------|
| **Washington Privacy Act (WPA)** | Comprehensive consumer data rights (effective July 31, 2023) | Hash-only ledger; no personal data stored |
| **My Health MY Data Act (MHMDA)** | Strict health data protections (effective March 31, 2024) | Medical case data handled client-side only |
| **RCW 19.255.010** | Data breach notification — 30 days | Midnight architecture satisfies; breach protocol documented |
| **Washington RPC 1.6** | Attorney confidentiality | ZK selective disclosure satisfies |
| **HIPAA (Federal)** | Medical records | Client-side; AutoDiscovery holds hashes only |

> ⚠️ **Washington's My Health MY Data Act** is broader than HIPAA and covers health information even when handled by non-covered entities. Confirm medical case data never touches AutoDiscovery's servers.

---

### 📋 **Full Launch Checklist — Washington**

#### � Legal & Compliance

**Rule Mapping**
- [ ] CR vs IRCP full divergence map — all differences documented
- [ ] 30-day response deadline fork implemented (CR 33/34/36 vs IRCP 28 days)
- [ ] 40-interrogatory limit implemented for Washington (vs 25 in ID/UT)
- [ ] King County KCLCR local rules and ESI Standing Order mapped
- [ ] Remote deposition rules (CR 30(b)(7)) implemented

**Attorney Review**
- [ ] Washington-licensed civil litigator reviews CR deadline table
- [ ] King County practitioner reviews KCLCR local rules specifically
- [ ] Written attestation stored in `docs/jurisdictions/washington/`

**UPL & Ethics**
- [ ] UPL memo from Washington-licensed attorney
- [ ] WSBA Ethics Line inquiry submitted: (206) 727-8284
- [ ] In-app disclaimer updated to include Washington

**Privacy**
- [ ] Washington Privacy Act compliance confirmed
- [ ] My Health MY Data Act analysis documented for medical cases
- [ ] RCW 19.255.010 breach protocol documented

#### 🛠️ Technical
- [ ] `jurisdiction-registry` Washington rule pack v1.0 deployed to testnet
- [ ] 30-day response deadlines implemented and unit-tested for CR 33/34/36
- [ ] 40-interrogatory limit enforced for WA cases
- [ ] King County ESI Standing Order production format implemented
- [ ] KCLCR joint statement requirement flagged before discovery dispute motion
- [ ] Multi-state regression: all Idaho and Utah cases still pass
- [ ] DemoLand seeded with 3 King County mock cases (civil, employment, PI)
- [ ] King County court clerk contacts seeded in Email Safety Protocol

#### 🧪 Beta Testing
- [ ] Recruit 10 Washington beta users — target King County civil litigators
- [ ] 45-day beta period
- [ ] At least 1 ESI-heavy case tested end-to-end with King County ESI Standing Order
- [ ] Zero deadline errors on CR 30-day response windows

#### 📣 Go-to-Market
- [ ] WSBA *Washington State Bar News* — submit product announcement
- [ ] Washington State Bar CLE Committee — propose discovery automation CLE
- [ ] WSBA Technology Committee — demo invitation
- [ ] Washington Association for Justice (WSTLA) outreach

---

### 📊 **Washington Success Metrics (Gates for California)**

| Metric | Target | Minimum Gate |
|--------|--------|--------------|
| **New WA customers** | 50 firms | 25 firms |
| **Combined MRR (ID+UT+WA)** | $40,000 | $25,000 |
| **CR deadline accuracy (30-day)** | 100% | 100% — non-negotiable |
| **King County ESI compliance** | 100% | 100% — non-negotiable |
| **Multi-state regression tests** | All pass | All pass |
| **Enterprise inquiries** | 5 | 2 |
| **WA Privacy compliance audit** | Required | Required |

---

## 🌴 PHASE 4 — California (Q1 2027)

### 🎯 **Why California Fourth**
- Largest legal market in the US (~150,000 licensed attorneys; ~1 in 4 US lawyers)
- CCP (California Code of Civil Procedure) is the most complex US civil discovery system
- Successfully launching in CA validates AutoDiscovery for every remaining major market
- CCPA/CPRA compliance here proves the platform's privacy architecture to enterprise buyers
- CA launch generates national press and enterprise pipeline for NY, TX, FL

---

### 🏛️ **California Court System — Structure AutoDiscovery Must Support**

California has **58 Superior Courts** (one per county) plus Courts of Appeal (6 Districts) and the California Supreme Court. Primary targets:

| Court | County | Seat | Notes |
|-------|--------|------|-------|
| **Los Angeles Superior Court** | Los Angeles | Los Angeles | **Largest trial court in the US** |
| **San Francisco Superior Court** | San Francisco | San Francisco | Tech + financial sector cases |
| **San Diego Superior Court** | San Diego | San Diego | Large civil docket |
| **Orange County Superior Court** | Orange | Santa Ana | High-value commercial litigation |
| **Sacramento Superior Court** | Sacramento | Sacramento | State government litigation |
| **Alameda County Superior Court** | Alameda | Oakland | Bay Area overflow |
| **Santa Clara Superior Court** | Santa Clara | San Jose | Silicon Valley IP + employment |

> **AutoDiscovery v1.0 (California) targets:** LA Superior primary, SF and San Diego secondary. Santa Clara for tech sector enterprise.

---

### 📜 **California CCP Discovery Rules — Divergence Map**

California's discovery system (CCP §§ 2016.010–2036.050) is structurally different from the IRCP/URCP/CR federal model — it uses its own statutory framework, not numbered civil rules. AutoDiscovery must map CCP sections, not rule numbers.

#### Core Discovery — CCP vs IRCP Comparison

| Discovery Type | CCP Section | IRCP Equivalent | Key Difference |
|----------------|-------------|-----------------|----------------|
| **Initial Disclosures** | None required | IRCP 26(a)(1) | ⚠️ **California has NO mandatory initial disclosures** |
| **Form Interrogatories** | CCP § 2030.010 | IRCP 33 | ⚠️ Unlimited form interrogatories using Judicial Council forms |
| **Special Interrogatories** | CCP § 2030.030 | IRCP 33 | ⚠️ **35 limit** (vs 25 in Idaho); propound in sets |
| **Interrogatory Response** | CCP § 2030.260 | IRCP 33 | ⚠️ **30 days** from service (not 28) |
| **Inspection Demands (RFP)** | CCP § 2031.010 | IRCP 34 | ⚠️ **30 days** from service |
| **Requests for Admission** | CCP § 2033.010 | IRCP 36 | ⚠️ **30 days**; no numerical limit |
| **Depositions** | CCP § 2025.010 | IRCP 30 | ⚠️ **35-deposition limit per side** absent court order |
| **Physical/Mental Exams** | CCP § 2032.010 | IRCP 35 | ✅ Similar |
| **Expert Witness Exchange** | CCP § 2034.010 | IRCP 26(a)(2) | ⚠️ **Simultaneous exchange** — both parties exchange on same day (no sequential) |
| **Expert Cutoff** | CCP § 2034.230 | IRCP 26(a)(2) | ⚠️ 50 days before trial for demand; 20 days to exchange after demand |
| **Discovery Cutoff** | CCP § 2024.020 | Per scheduling order | ⚠️ **30 days before initial trial date** — statutory, not judge-set |
| **ESI** | CCP § 2031.280 | IRCP 34 | ⚠️ California-specific ESI production form requirements |

> ⚠️ **Three critical California-specific implementations required:**
> 1. **No initial disclosures workflow** — CA cases skip this step entirely
> 2. **Simultaneous expert exchange** — both sides exchange on the same day
> 3. **Statutory discovery cutoff** — 30 days before trial, by statute, not court order

#### ⏰ California CCP Deadline Table

| Deadline | Trigger | Days | Notes |
|----------|---------|------|-------|
| **Initial disclosures** | — | N/A | **Not required in California** |
| **Interrogatory responses** | Service | **+30 days** | CCP § 2030.260 |
| **RFP responses** | Service | **+30 days** | CCP § 2031.260 |
| **RFA responses** | Service | **+30 days** | CCP § 2033.250 |
| **Expert demand** | Before cutoff | -50 days before trial | CCP § 2034.220 |
| **Expert exchange** | After demand served | +20 days | CCP § 2034.230 — **simultaneous** |
| **Discovery cutoff** | Trial date | -30 days | CCP § 2024.020 — **statutory** |
| **Motion to compel** | After response due | +45 days | CCP § 2030.300 |
| **Deposition notice** | Before deposition | +10 days minimum | CCP § 2025.270 |

---

### 📋 **California Judicial Council Forms — Key Differentiator**

California mandates Judicial Council forms for many discovery functions. AutoDiscovery auto-populating these is a major competitive differentiator:

| Form | Purpose | AutoDiscovery Implementation |
|------|---------|------------------------------|
| **DISC-001** | Form Interrogatories — General | Auto-populate and serve |
| **DISC-002** | Form Interrogatories — Limited Civil | Tier-aware auto-selection |
| **DISC-003** | Form Interrogatories — Employment | Employment case workflow trigger |
| **DISC-004** | Form Interrogatories — Construction | Construction case workflow trigger |
| **DISC-010** | Requests for Admission | Auto-populate standard RFAs |
| **DISC-020** | Form Interrogatories — Unlawful Detainer | UD case workflow |
| **ER-100** | Expert Witness Declaration | Expert witness module auto-population |
| **AT-140** | Substitution of Attorney | Attorney change tracking |

---

### 🔒 **California Privacy Laws — Most Complex in the US**

| Law | Requirement | AutoDiscovery Compliance |
|-----|-------------|--------------------------|
| **CCPA (Civil Code § 1798.100)** | Consumer data access and deletion rights | Hash-only ledger; no consumer personal data stored |
| **CPRA (Prop 24, eff. Jan 1 2023)** | Expanded CCPA + sensitive personal information category | Confirmed: AutoDiscovery stores no SPI |
| **California Privacy Rights Act** | Right to correct, limit use of SPI | N/A — no SPI stored |
| **Health & Safety Code § 123110** | Patient medical records access (30 days) | Client-side; AutoDiscovery holds hashes only |
| **Civil Code § 1798.82** | Data breach notification — 72 hours (most aggressive in US) | Midnight architecture + incident response plan documented |
| **California RPC 1.6** | Attorney confidentiality | ZK selective disclosure satisfies |
| **HIPAA + CMIA** | Medical records + California Medical Information Act | Client-side handling; dual compliance confirmed |

> ⚠️ California's breach notification window is **72 hours** — the most aggressive in the US. Incident response plan must be documented and rehearsed before CA launch.

---

### ⚖️ **California UPL Analysis**

| Authority | Provision | Relevance |
|-----------|-----------|-----------|
| **Business & Professions Code § 6125** | Only licensed CA attorneys may practice law | AutoDiscovery must not constitute practice of law |
| **Business & Professions Code § 6126** | UPL — criminal felony (not just misdemeanor) | ⚠️ Higher stakes than Idaho/Utah/WA |
| **California RPC 5.5** | Multi-jurisdictional practice | Out-of-state attorney access |
| **California RPC 1.1** | Competence includes technology | Supports use |
| **State Bar Ethics Hotline** | (800) 238-4427 | Submit inquiry pre-launch |

> ⚠️ California UPL is a **felony**, not a misdemeanor. UPL memo and State Bar Ethics Hotline inquiry are mandatory gates — no exceptions.

---

### 📋 **Full Launch Checklist — California**

#### 🔒 Legal & Compliance

**Rule Mapping**
- [ ] CCP §§ 2016–2036 full discovery statute audit
- [ ] "No initial disclosures" workflow implemented for CA case type
- [ ] Simultaneous expert exchange workflow implemented (CCP § 2034.230)
- [ ] Statutory 30-day discovery cutoff implemented (CCP § 2024.020)
- [ ] 35 special interrogatory limit implemented
- [ ] 35-deposition-per-side limit implemented
- [ ] LA Superior, SF Superior, San Diego Superior local rules mapped
- [ ] Judicial Council forms (DISC-001 through DISC-020) mapped and implemented
- [ ] California medical malpractice rules (CCP § 364 — 90-day notice) mapped

**Attorney Review**
- [ ] CA-licensed civil litigator reviews CCP deadline table
- [ ] CA-licensed attorney reviews Judicial Council form implementations
- [ ] LA-based practitioner reviews LASC local rules specifically
- [ ] Written attestations stored in `docs/jurisdictions/california/`

**UPL & Ethics**
- [ ] UPL memo from California-licensed attorney — felony exposure noted
- [ ] State Bar Ethics Hotline inquiry submitted: (800) 238-4427
- [ ] In-app disclaimer updated to include California

**Privacy**
- [ ] CCPA/CPRA compliance audit completed
- [ ] 72-hour breach notification protocol documented and rehearsed
- [ ] CMIA analysis for medical cases documented

#### 🛠️ Technical
- [ ] `jurisdiction-registry` California rule pack v1.0 deployed to testnet
- [ ] No-initial-disclosure workflow implemented and tested
- [ ] Simultaneous expert exchange logic implemented
- [ ] Statutory 30-day discovery cutoff auto-calculated from trial date
- [ ] Judicial Council form auto-population for DISC-001, DISC-010, ER-100
- [ ] Multi-county local rule layer: LA, SF, San Diego supported
- [ ] Multi-state regression: all ID, UT, WA cases still pass
- [ ] DemoLand seeded with 5 California mock cases (LA, SF, San Diego venues)

#### 🧪 Beta Testing
- [ ] Recruit 15 California beta users — LA and SF firms prioritized
- [ ] 60-day beta period (larger market = longer validation)
- [ ] At least 1 Judicial Council form auto-population tested end-to-end
- [ ] At least 1 simultaneous expert exchange case tested
- [ ] Zero errors on statutory 30-day discovery cutoff calculation

#### 📣 Go-to-Market
- [ ] State Bar of California *California Lawyer* — submit product announcement
- [ ] CAALA (Consumer Attorneys Association of LA) outreach
- [ ] SFTLA (San Francisco Trial Lawyers Association) outreach
- [ ] State Bar of California CLE — propose discovery automation CLE
- [ ] ABA TECHSHOW presence (Chicago) — California is a major attendee base

---

### 📊 **California Success Metrics (Gates for New York)**

| Metric | Target | Minimum Gate |
|--------|--------|--------------|
| **New CA customers** | 200 firms | 75 firms |
| **Combined MRR** | $150,000 | $80,000 |
| **CCP deadline accuracy** | 100% | 100% — non-negotiable |
| **Judicial Council form accuracy** | 100% | 100% — non-negotiable |
| **Local rules coverage** | LA + SF + SD | LA + SF |
| **CCPA audit passed** | Required | Required |
| **UPL memo on file** | Required | Required |
| **Enterprise accounts** | 10 | 3 |

---

## 🗽 PHASE 5 — New York (Q2 2027)

### 🎯 **Why New York Fifth**
- **38,000+ cases dismissed in NYC in 2024** — largest single-market discovery failure in the US
- NYC conviction rate dropped from 50% to 25% linked to discovery failures — national press magnet
- CPLR is the most cited jurisdiction in AutoDiscovery's pitch materials
- Highest average sanction values in the US
- ~180,000 licensed New York attorneys — 2nd largest legal market after California
- NYC enterprise success enables national Big Law and corporate legal department sales

---

### 🏛️ **New York Court System — Structure AutoDiscovery Must Support**

New York's court system is uniquely complex — multiple trial court types with overlapping jurisdiction:

| Court | Jurisdiction | Notes |
|-------|-------------|-------|
| **Supreme Court (NYC)** | General jurisdiction — unlimited civil | **Primary target** — misleadingly named; it's the trial court |
| **Supreme Court (Upstate)** | General jurisdiction outside NYC | Albany, Buffalo, Rochester markets |
| **Civil Court of the City of NY** | Claims up to $25,000 | NYC small claims civil docket |
| **County Court** | Upstate counties — felony + civil >$0 | Outside NYC general jurisdiction |
| **Court of Claims** | Claims against NY State | State government litigation |
| **Surrogate's Court** | Estates and trusts | Probate discovery |
| **Family Court** | Family matters | Limited discovery |

#### 4 Appellate Divisions — Each With Distinct Local Rules

| Department | Geographic Coverage | Key Markets |
|------------|--------------------|----|
| **1st Dept** | Manhattan, Bronx | NYC — BigLaw, financial, commercial |
| **2nd Dept** | Brooklyn, Queens, Staten Island, Long Island, Lower Hudson | NYC boroughs + suburbs |
| **3rd Dept** | Rest of upstate NY (excl. 4th Dept) | Albany, Capital Region |
| **4th Dept** | Western NY | Buffalo, Rochester, Syracuse |

> **AutoDiscovery v1.0 (New York) targets:** Supreme Court NYC (1st and 2nd Dept) primary; upstate Supreme Courts secondary.

---

### 📜 **CPLR Discovery Rules — Divergence Map**

New York's Civil Practice Law and Rules (CPLR) Article 31 governs discovery. It diverges significantly from the federal model used by Idaho/Utah/Washington:

#### Core Discovery — CPLR vs IRCP Comparison

| Discovery Type | CPLR | IRCP Equivalent | Key Difference |
|----------------|------|-----------------|----------------|
| **Initial Disclosures** | CPLR 3101(a) — "full disclosure" standard | IRCP 26(a)(1) | ⚠️ NY uses broader "material and necessary" standard; no initial disclosure form |
| **Interrogatories** | CPLR 3130 — **NYC: 25 limit**; upstate: unlimited by default | IRCP 33 — 25 limit | ⚠️ NYC cap = 25; upstate varies by local rule |
| **Interrogatory Response** | CPLR 3133 — **20 days** | IRCP 33 — 28 days | ⚠️ **NY = 20 days — significantly shorter** |
| **Document Demands (RFP)** | CPLR 3120 — **20 days** response | IRCP 34 — 28 days | ⚠️ **NY = 20 days** |
| **Notices to Admit (RFA)** | CPLR 3123 — **20 days** response | IRCP 36 — 28 days | ⚠️ **NY = 20 days**; failure = admitted |
| **Depositions** | CPLR 3106 — 20 days notice | IRCP 30 | ⚠️ 20-day deposition notice |
| **Physical/Mental Exams** | CPLR 3121 | IRCP 35 | ✅ Substantially similar |
| **Expert Disclosure** | CPLR 3101(d) — **no deadline by statute**; per scheduling order | IRCP 26(a)(2) | ⚠️ Expert disclosure timing set by court order only; no statutory default |
| **Discovery Cutoff** | Per Note of Issue / Preliminary Conference Order | Per scheduling order | ⚠️ Note of Issue filing triggers discovery close |
| **Preliminary Conference** | Uniform Rules § 202.12 — required in Supreme Court | IRCP 16 | ⚠️ Mandatory preliminary conference — generates all downstream deadlines |
| **Compliance Conference** | Uniform Rules § 202.19 | N/A | ⚠️ NY-specific status conference mid-discovery |

> ⚠️ **Critical: New York's response deadlines are 20 days** for interrogatories, document demands, and notices to admit — the shortest of any state AutoDiscovery supports. Every deadline fork must reflect this.

#### ⏰ New York CPLR Deadline Table

| Deadline | Trigger | Days | Notes |
|----------|---------|------|-------|
| **Interrogatory responses** | Service | **+20 days** | CPLR 3133 — shortest in platform |
| **Document demand responses** | Service | **+20 days** | CPLR 3120 |
| **Notice to admit responses** | Service | **+20 days** | CPLR 3123; failure = admitted |
| **Deposition notice** | Before deposition | +20 days minimum | CPLR 3106 |
| **Bill of particulars** | After demand | +30 days | CPLR 3042 |
| **Expert disclosure** | Per court order | Per scheduling order | CPLR 3101(d) — no statutory default |
| **Note of Issue** | After discovery complete | Per scheduling order | Triggers discovery close |
| **Preliminary conference** | After RJI filed | ~45 days | Uniform Rules § 202.12 |
| **Compliance conference** | Mid-discovery | Per court order | Uniform Rules § 202.19 |

---

### 📄 **NYSCEF — New York State Courts Electronic Filing**

NYSCEF (New York State Courts Electronic Filing) is mandatory in most NYC Supreme Court matters and affects deadline calculations:

| NYSCEF Rule | Impact | AutoDiscovery Implementation |
|-------------|--------|------------------------------|
| **E-filed documents served via NYSCEF** | Service timestamp = NYSCEF filing time | Deadline calculations must use NYSCEF timestamp, not postal service |
| **After-hours NYSCEF filing** | Filed after 11:59 PM = filed next business day | AutoDiscovery must calculate from next business day |
| **System unavailability** | NYSCEF outage = extended deadline | Alert users when NYSCEF status uncertain |
| **Mandatory e-filing counties** | NYC (NY, Kings, Queens, Bronx, Richmond), Albany, Westchester, Erie, and growing | Flag mandatory e-filing at case creation |
| **Optional e-filing counties** | Remaining counties — parties opt in | Track e-filing consent status |

> **Action:** Monitor NYSCEF mandatory county expansion — list grows regularly. Subscribe to OCA (Office of Court Administration) notices.

---

### 🏛️ **NYC Uniform Rules — Commercial Division**

For high-value commercial cases (Commercial Division of Supreme Court), additional rules apply:

| Uniform Rule | Topic | Implementation |
|--------------|-------|----------------|
| **§ 202.70(g) Rule 8** | Interrogatories limited to 25 in Commercial Division | Enforce 25-limit flag for commercial cases |
| **§ 202.70(g) Rule 11-d** | ESI disclosure requirements | ESI protocol mandatory in Commercial Division |
| **§ 202.70(g) Rule 14** | Expert disclosure — Commercial Division specifics | Expert module adjustment for Commercial Division |

---

### ⚖️ **New York UPL Analysis**

| Authority | Provision | Relevance |
|-----------|-----------|-----------|
| **Judiciary Law § 478** | UPL prohibition — criminal misdemeanor | AutoDiscovery must not constitute practice of law |
| **Judiciary Law § 476-a** | Attorney General may seek injunction against UPL | AG enforcement risk |
| **NY RPC 5.5** | Multi-jurisdictional practice | Out-of-state attorney access |
| **NY RPC 1.1** | Competence includes technology | Supports use |
| **NYSBA Ethics Hotline** | (800) 342-3661 | Submit informal inquiry pre-launch |

---

### 🔒 **New York Privacy & Data Security**

| Law | Requirement | AutoDiscovery Compliance |
|-----|-------------|--------------------------|
| **NY SHIELD Act (Gen. Bus. Law § 899-bb)** | Expanded data breach notification; reasonable security required | Midnight ZK architecture satisfies reasonable security standard |
| **NY SHIELD Act — Notification** | Data breach notification — most expedient time (no fixed window) | Incident response plan documented |
| **NYCPA (proposed 2024)** | NYC Consumer Privacy Act — pending | Monitor; may require updates if enacted |
| **NY RPC 1.6** | Attorney confidentiality | ZK selective disclosure satisfies |
| **HIPAA (Federal)** | Medical records | Client-side; AutoDiscovery holds hashes only |

---

### 📋 **Full Launch Checklist — New York**

#### 🔒 Legal & Compliance

**Rule Mapping**
- [ ] CPLR Article 31 full audit
- [ ] 20-day response deadline implemented for interrogatories, document demands, notices to admit
- [ ] NYC 25-interrogatory limit implemented
- [ ] Preliminary conference workflow implemented (Uniform Rules § 202.12)
- [ ] Note of Issue trigger logic implemented (closes discovery)
- [ ] NYSCEF timestamp-based deadline calculations implemented
- [ ] NYSCEF mandatory county list current and flagged at case creation
- [ ] 4 Appellate Division local rule variants mapped (1st, 2nd, 3rd, 4th Dept)
- [ ] Commercial Division rules (§ 202.70) mapped for high-value cases

**Attorney Review**
- [ ] NYC-licensed litigator reviews CPLR deadline table — 20-day windows specifically
- [ ] NYSCEF practitioner reviews e-filing deadline logic
- [ ] Written attestations stored in `docs/jurisdictions/new-york/`

**UPL & Ethics**
- [ ] UPL memo from New York-licensed attorney
- [ ] NYSBA Ethics Hotline inquiry submitted: (800) 342-3661
- [ ] In-app disclaimer updated to include New York

**Privacy**
- [ ] NY SHIELD Act compliance confirmed
- [ ] Incident response plan documented (no fixed notification window — "most expedient")
- [ ] NYCPA monitoring note added to compliance calendar

#### 🛠️ Technical
- [ ] `jurisdiction-registry` New York rule pack v1.0 deployed to testnet
- [ ] 20-day response deadline implemented and unit-tested (CPLR 3120/3133/3123)
- [ ] NYSCEF timestamp logic implemented for service date calculations
- [ ] Mandatory NYSCEF county list maintained and flagged at case creation
- [ ] Preliminary conference deadline auto-triggered after RJI filing
- [ ] Note of Issue logic: discovery closes on filing
- [ ] Commercial Division flag at case creation — triggers § 202.70 rules
- [ ] Multi-state regression: all ID, UT, WA, CA cases still pass
- [ ] DemoLand seeded with 5 NY mock cases (NYC Supreme, Commercial Division)
- [ ] NYC court clerk contacts seeded in Email Safety Protocol (1st and 2nd Dept)

#### 🧪 Beta Testing
- [ ] Recruit 15 New York beta users — Manhattan and Brooklyn firms prioritized
- [ ] 60-day beta period
- [ ] At least 1 NYSCEF e-filing deadline scenario tested end-to-end
- [ ] At least 1 Commercial Division case tested
- [ ] Zero errors on 20-day response deadline calculations

#### 📣 Go-to-Market
- [ ] NYSBA *New York State Bar Journal* — submit product announcement
- [ ] NYSBA Committee on Technology — demo invitation
- [ ] NYTLA (New York Trial Lawyers Association) outreach
- [ ] LegalWeek New York conference — booth or speaking slot
- [ ] NYC Bar Association CLE — propose discovery automation CLE
- [ ] Target press: *New York Law Journal*, *Law360*, *Above the Law*

---

### 📊 **New York Success Metrics (Gates for National Expansion)**

| Metric | Target | Minimum Gate |
|--------|--------|--------------|
| **New NY customers** | 300 firms | 100 firms |
| **Combined MRR** | $400,000 | $200,000 |
| **CPLR 20-day deadline accuracy** | 100% | 100% — non-negotiable |
| **NYSCEF timestamp logic accuracy** | 100% | 100% — non-negotiable |
| **NYC-specific case tests passed** | 20 | 10 |
| **Enterprise accounts** | 25 | 10 |
| **Press coverage** | 3 publications | 1 publication |
| **UPL memo on file** | Required | Required |

---

## ⚙️ PHASE 6 — Ohio, Texas, Florida, Illinois (Q3–Q4 2027)

### Batch Expansion Model
By Phase 6 the state launch template is proven. Shifts to a **parallel batch model**:
- 2 states launched simultaneously per quarter
- Template reuse reduces launch time from 90 days → 45 days per state
- Dedicated **Jurisdiction Research Team** (2 hires) handles rule audits
- Law firm partner relationships in each state replace individual solo attorney reviews
- All 5 prior states must pass full regression before any Phase 6 state goes live

---

### 🏛️ **Ohio (Q3 2027)**

Ohio was partially researched during project inception — fast-track candidate.

| Item | Detail |
|------|--------|
| **Rules** | Ohio Rules of Civil Procedure (Ohio Civ.R.) |
| **Key Markets** | Franklin County (Columbus), Cuyahoga County (Cleveland), Hamilton County (Cincinnati) |
| **Court Structure** | Common Pleas Courts in each of 88 counties |
| **Primary Target** | Franklin County Common Pleas — Columbus |
| **Bar Contact** | Ohio State Bar Association (OSBA) Ethics Line: (800) 282-6556 |
| **UPL Statute** | Ohio Rev. Code § 4705.01 — criminal misdemeanor |

**Key Rule Divergences from IRCP:**

| Rule | Ohio Civ.R. | IRCP | Difference |
|------|------------|------|------------|
| **Interrogatory limit** | Ohio Civ.R. 33 — **40 limit** | IRCP 33 — 25 | ⚠️ Ohio allows 40 |
| **Interrogatory response** | Ohio Civ.R. 33 — **28 days** | IRCP 33 — 28 days | ✅ Same |
| **RFP response** | Ohio Civ.R. 34 — **28 days** | IRCP 34 — 28 days | ✅ Same |
| **RFA response** | Ohio Civ.R. 36 — **28 days** | IRCP 36 — 28 days | ✅ Same |
| **Expert disclosure** | Ohio Civ.R. 26(E) — per scheduling order | IRCP 26(a)(2) | ✅ Similar |
| **Sanctions** | Ohio Civ.R. 37 | IRCP 37 | ✅ Similar |

**Launch Checklist (Ohio):**
- [ ] Ohio Civ.R. full audit — divergences from IRCP documented
- [ ] 40-interrogatory limit implemented for Ohio cases
- [ ] Franklin County local rules mapped
- [ ] Ohio-licensed attorney review and sign-off
- [ ] OSBA Ethics Line inquiry submitted
- [ ] Ohio medical malpractice rules (Ohio Rev. Code § 2305.113) reviewed
- [ ] `jurisdiction-registry` Ohio rule pack v1.0 deployed
- [ ] DemoLand seeded with 2 Ohio mock cases (Columbus venue)

---

### 🤠 **Texas (Q3 2027)**

Largest state by civil litigation volume outside CA/NY. Complex local rules demand careful implementation.

| Item | Detail |
|------|--------|
| **Rules** | Texas Rules of Civil Procedure (TRCP) |
| **Key Markets** | Harris County (Houston), Dallas County, Travis County (Austin), Bexar County (San Antonio) |
| **Court Structure** | District Courts + County Courts at Law in each county |
| **Primary Target** | Harris County District Court (Houston) — highest civil volume |
| **Bar Contact** | State Bar of Texas Ethics Hotline: (800) 532-3947 |
| **UPL Statute** | Texas Gov't Code § 81.102 — criminal misdemeanor |

**Key Rule Divergences from IRCP:**

| Rule | TRCP | IRCP | Difference |
|------|------|------|------------|
| **Initial disclosures** | TRCP 194 — required; **30 days** after appearance | IRCP 26(a)(1) | ⚠️ Texas triggers on appearance, not scheduling conference |
| **Interrogatory limit** | TRCP 197 — **25 limit** | IRCP 33 — 25 | ✅ Same |
| **Interrogatory response** | TRCP 197 — **30 days** | IRCP 33 — 28 days | ⚠️ 30 days in Texas |
| **RFP response** | TRCP 196 — **30 days** | IRCP 34 — 28 days | ⚠️ 30 days |
| **RFA response** | TRCP 198 — **30 days** | IRCP 36 — 28 days | ⚠️ 30 days; failure = admitted |
| **Expert disclosure** | TRCP 195 — **90 days before trial** (plaintiff); 60 days (defendant) | IRCP 26(a)(2) | ⚠️ Statutory deadlines — not court-set |
| **Discovery control plan** | TRCP 190 — Level 1/2/3 tiered system (similar to Utah) | No tier | ⚠️ Texas has its own tier system |

> ⚠️ Texas has **two critical unique features**: (1) initial disclosures triggered by appearance date, not scheduling conference; (2) a Level 1/2/3 discovery control plan that mirrors Utah's tier system but uses different thresholds.

**Texas Discovery Control Plan Tiers:**

| Level | Criteria | Limits |
|-------|----------|--------|
| **Level 1** | Cases seeking ≤ $250,000 | 6 hours total deposition time; simplified |
| **Level 2** | Default (most cases) | 50 hours deposition; 25 interrogatories |
| **Level 3** | Court order required | Unlimited — set by court order |

**Launch Checklist (Texas):**
- [ ] TRCP full audit — all divergences documented
- [ ] Texas Discovery Control Plan (Level 1/2/3) implemented at case creation
- [ ] Initial disclosure trigger: appearance date (not scheduling conference)
- [ ] 30-day response deadlines implemented for TRCP 196/197/198
- [ ] Statutory expert deadlines implemented (90/60 days before trial)
- [ ] Harris County (Houston) local rules mapped; Dallas County secondary
- [ ] Texas-licensed attorney review and sign-off
- [ ] State Bar of Texas Ethics Hotline inquiry: (800) 532-3947
- [ ] Texas medical liability rules (Tex. Civ. Prac. & Rem. Code § 74) reviewed
- [ ] `jurisdiction-registry` Texas rule pack v1.0 deployed
- [ ] DemoLand seeded with 3 Texas mock cases (Houston, Dallas, Austin)

---

### ☀️ **Florida (Q4 2027)**

High malpractice litigation volume — strong AutoDiscovery value proposition.

| Item | Detail |
|------|--------|
| **Rules** | Florida Rules of Civil Procedure (Fla. R. Civ. P.) |
| **Key Markets** | Miami-Dade County, Broward County (Fort Lauderdale), Orange County (Orlando), Hillsborough County (Tampa) |
| **Court Structure** | Circuit Courts in each of 20 Judicial Circuits |
| **Primary Target** | 11th Circuit (Miami-Dade) — highest civil volume |
| **Bar Contact** | Florida Bar Ethics Hotline: (800) 235-8619 |
| **UPL Statute** | Fla. Stat. § 454.23 — criminal felony (same level as California) |

**Key Rule Divergences from IRCP:**

| Rule | Fla. R. Civ. P. | IRCP | Difference |
|------|----------------|------|------------|
| **Initial disclosures** | Rule 1.280(a) — required within **30 days** of service of process | IRCP 26(a)(1) | ⚠️ Triggered by service of process, not scheduling conference |
| **Interrogatory limit** | Rule 1.340 — **30 limit** | IRCP 33 — 25 | ⚠️ Florida allows 30 |
| **Interrogatory response** | Rule 1.340 — **30 days** | IRCP 33 — 28 days | ⚠️ 30 days |
| **RFP response** | Rule 1.350 — **30 days** | IRCP 34 — 28 days | ⚠️ 30 days |
| **RFA response** | Rule 1.370 — **30 days** | IRCP 36 — 28 days | ⚠️ 30 days; failure = admitted |
| **Expert disclosure** | Rule 1.280(b)(5) — per scheduling order | IRCP 26(a)(2) | ✅ Similar |
| **Case management** | Rule 1.200 — mandatory case management conference | IRCP 16 | ✅ Similar |

> ⚠️ Florida UPL is a **felony** (same as California). Mandatory UPL memo and Florida Bar Ethics Hotline inquiry before launch — no exceptions.

**Launch Checklist (Florida):**
- [ ] Fla. R. Civ. P. full audit
- [ ] Initial disclosure trigger: service of process date (not scheduling conference)
- [ ] 30-interrogatory limit implemented
- [ ] 30-day response deadlines for Rule 1.340/1.350/1.370
- [ ] 11th Circuit (Miami-Dade) local rules mapped; 17th Circuit (Broward) secondary
- [ ] Florida-licensed attorney review — felony UPL exposure noted in memo
- [ ] Florida Bar Ethics Hotline inquiry: (800) 235-8619
- [ ] Florida medical malpractice pre-suit investigation requirements (Fla. Stat. § 766.106) reviewed
- [ ] `jurisdiction-registry` Florida rule pack v1.0 deployed
- [ ] DemoLand seeded with 2 Florida mock cases (Miami, Tampa)

---

### 🌆 **Illinois (Q4 2027)**

Chicago is a major legal hub. Cook County local rules are notably complex.

| Item | Detail |
|------|--------|
| **Rules** | Illinois Supreme Court Rules (Ill. S. Ct. R.) + Illinois Code of Civil Procedure (735 ILCS 5) |
| **Key Markets** | Cook County (Chicago), DuPage County, Lake County |
| **Court Structure** | Circuit Courts in each of 24 judicial circuits |
| **Primary Target** | Cook County Circuit Court — largest in Illinois |
| **Bar Contact** | ISBA (Illinois State Bar Association) Ethics Hotline: (800) 252-8908 |
| **UPL Statute** | 705 ILCS 205/1 — criminal misdemeanor |

**Key Rule Divergences from IRCP:**

| Rule | Illinois | IRCP | Difference |
|------|----------|------|------------|
| **Initial disclosures** | Ill. S. Ct. R. 222 — required in cases ≤ $50,000 (simplified); Rule 213 for experts | IRCP 26(a)(1) | ⚠️ Two separate disclosure systems by case value |
| **Interrogatory limit** | Ill. S. Ct. R. 213 — **30 limit** (Supreme Court Rule 213(c)) | IRCP 33 — 25 | ⚠️ 30 interrogatories |
| **Interrogatory response** | 735 ILCS 5/2-2-1 — **28 days** | IRCP 33 — 28 days | ✅ Same |
| **RFP response** | Ill. S. Ct. R. 214 — **28 days** | IRCP 34 — 28 days | ✅ Same |
| **RFA response** | Ill. S. Ct. R. 216 — **28 days** | IRCP 36 — 28 days | ✅ Same |
| **Expert disclosure** | Ill. S. Ct. R. 213(f) — **90 days before trial** statutory | IRCP 26(a)(2) | ⚠️ Statutory deadline — not court-set |
| **Rebuttal experts** | Ill. S. Ct. R. 213(f)(2) — **60 days before trial** | IRCP 26(a)(2) | ⚠️ Statutory deadline |

**Launch Checklist (Illinois):**
- [ ] Illinois S. Ct. Rules + 735 ILCS 5 discovery provisions full audit
- [ ] 30-interrogatory limit implemented for Illinois cases
- [ ] Dual disclosure system (Rule 222 vs Rule 213) implemented by case value
- [ ] Statutory expert deadlines (90/60 days before trial) implemented
- [ ] Cook County Circuit Court local rules mapped (complex — allocate extra time)
- [ ] Illinois-licensed attorney review and sign-off
- [ ] ISBA Ethics Hotline inquiry: (800) 252-8908
- [ ] Illinois medical malpractice requirements (735 ILCS 5/2-622 affidavit) reviewed
- [ ] `jurisdiction-registry` Illinois rule pack v1.0 deployed
- [ ] DemoLand seeded with 2 Illinois mock cases (Chicago — Cook County)

---

### 📊 **Phase 6 Combined Success Metrics (Gates for Phase 7)**

| Metric | Target | Minimum Gate |
|--------|--------|--------------|
| **New customers (all 4 states)** | 500 firms | 200 firms |
| **Combined MRR (all states)** | $2,000,000 | $1,000,000 |
| **All state deadline accuracy** | 100% | 100% — non-negotiable |
| **All UPL memos on file** | 4 of 4 | 4 of 4 |
| **Enterprise accounts** | 50 | 20 |
| **Jurisdiction Research Team hired** | 2 FTE | 1 FTE |
| **45-day average launch cycle** | Target | 60-day max |

---

## 🇺🇸 PHASE 7 — Remaining 40 States & FRCP (2028)

### National Coverage Model

By Phase 7 the 45-day state launch template is fully optimized. The Jurisdiction Research Team runs parallel batch pipelines. The goal is **full 50-state + FRCP coverage by end of 2028**.

**Prioritization criteria for remaining states:**
1. **Litigation volume** — civil cases filed per year (public NCSC court statistics)
2. **Average case value** — higher value = more sanction risk = more AutoDiscovery value
3. **Bar association receptivity** — states with active legal tech committees move faster
4. **Rule complexity** — simpler rules (close to FRCP model) are batched together
5. **Geographic clustering** — states in same region share bar association relationships

---

### 📦 Batch A — Western States (Q1 2028)

| State | Rules | Primary Market | Notable Complexity | FRCP Similarity |
|-------|-------|---------------|-------------------|-----------------|
| **Colorado** | Colo. R. Civ. P. | Denver (Denver District Court) | Denver County local rules; ESI protocols | High — closely tracks FRCP |
| **Nevada** | NRCP | Las Vegas (Clark County), Reno (Washoe County) | Nevada adopted revised NRCP in 2019 closely tracking FRCP | Very high |
| **Arizona** | Ariz. R. Civ. P. | Maricopa County (Phoenix) | Arizona added mandatory initial disclosure with substantive documents in 2018 — major divergence | Medium |
| **New Mexico** | NMRA | Bernalillo County (Albuquerque) | NMRA tracks FRCP closely; small market but geographically adjacent to TX/CO | High |

**Batch A Key Divergences:**
- **Arizona** mandatory initial disclosure includes actual documents (not just lists) — unique in US, must build document attachment to initial disclosure step
- **Colorado** has local patent rules and complex commercial division rules (similar to NY Commercial Division)
- **Nevada** 2019 NRCP overhaul closely mirrors FRCP — fastest launch candidate in Batch A

**Batch A Checklist:**
- [ ] NRCP (Nevada) audit — fast track, very close to FRCP
- [ ] Arizona mandatory initial disclosure with documents implemented
- [ ] Colorado District Court commercial division rules mapped
- [ ] New Mexico NMRA audit
- [ ] 4 state UPL memos + bar ethics inquiries
- [ ] 4 state-licensed attorney reviews
- [ ] All 4 rule packs deployed and regression tested

---

### 📦 Batch B — Southeast States (Q2 2028)

| State | Rules | Primary Market | Notable Complexity | FRCP Similarity |
|-------|-------|---------------|-------------------|-----------------|
| **Georgia** | Ga. Code Ann. | Fulton County (Atlanta) | Georgia still uses some older discovery structures; Atlanta local rules complex | Medium |
| **North Carolina** | NC R. Civ. P. | Mecklenburg County (Charlotte), Wake County (Raleigh) | NC tracks FRCP closely post-2011 amendments | High |
| **South Carolina** | SC R. Civ. P. | Richland County (Columbia), Charleston County | Tracks FRCP closely; smaller market | High |
| **Virginia** | Va. Sup. Ct. R. | Fairfax County, City of Richmond | Virginia has **no mandatory initial disclosures** in state court (unlike federal); unique e-discovery rules | Medium |

**Batch B Key Divergences:**
- **Virginia** has no mandatory initial disclosures in state court — similar to California's omission
- **Georgia** uses a "Certificate of Service" filing requirement unique to state
- **North Carolina** and **South Carolina** are closest to FRCP — fast-track candidates

**Batch B Checklist:**
- [ ] Virginia no-initial-disclosure workflow (same pattern as California)
- [ ] Georgia certificate of service requirement implemented
- [ ] NC + SC audits — FRCP-adjacent, accelerated timeline
- [ ] 4 state UPL memos + bar ethics inquiries
- [ ] All 4 rule packs deployed and regression tested

---

### 📦 Batch C — Northeast States (Q2 2028)

| State | Rules | Primary Market | Notable Complexity | FRCP Similarity |
|-------|-------|---------------|-------------------|-----------------|
| **Pennsylvania** | Pa. R. Civ. P. | Philadelphia County, Allegheny County (Pittsburgh) | Philadelphia local rules complex; discovery responses **20 days** (similar to NY) | Medium |
| **New Jersey** | N.J. Ct. R. | Essex County (Newark), Bergen County | NJ tracks FRCP closely; mandatory case management | High |
| **Connecticut** | Conn. Practice Book | Hartford County, Fairfield County | CT uses Practice Book rules (not separate civil rules); unique structure | Medium |
| **Massachusetts** | Mass. R. Civ. P. | Suffolk County (Boston) | Tracks FRCP; strong legal tech community in Boston | High |

**Batch C Key Divergences:**
- **Pennsylvania** Philadelphia discovery response deadline is **20 days** — same as New York, must fork
- **Connecticut** Practice Book structure is unique — rules are numbered differently from other states
- **New Jersey** has mandatory **Case Management Conference** within 90 days of first answer

**Batch C Checklist:**
- [ ] Pennsylvania Philadelphia 20-day response deadline implemented
- [ ] Connecticut Practice Book rule numbering mapped to AutoDiscovery workflow
- [ ] NJ mandatory case management conference workflow
- [ ] MA audit — FRCP-adjacent, fast track
- [ ] 4 state UPL memos + bar ethics inquiries
- [ ] All 4 rule packs deployed and regression tested

---

### 📦 Batch D — Midwest States (Q3 2028)

| State | Rules | Primary Market | Notable Complexity | FRCP Similarity |
|-------|-------|---------------|-------------------|-----------------|
| **Michigan** | MCR | Wayne County (Detroit), Kent County (Grand Rapids) | Michigan Court Rules track FRCP; Detroit local rules | High |
| **Wisconsin** | Wis. Stat. ch. 804 | Milwaukee County, Dane County (Madison) | Wisconsin discovery statutes (not separate rules) — different structure | Medium |
| **Minnesota** | Minn. R. Civ. P. | Hennepin County (Minneapolis), Ramsey County (St. Paul) | Tracks FRCP closely; mandatory ADR before trial | High |
| **Missouri** | Mo. R. Civ. P. | Jackson County (Kansas City), St. Louis City | Missouri has no mandatory initial disclosures in state court | Medium |

**Batch D Key Divergences:**
- **Wisconsin** discovery is governed by statutes (ch. 804), not separate civil rules — unique structure similar to California
- **Missouri** no mandatory initial disclosures — same fork as California/Virginia
- **Minnesota** mandatory ADR (Alternative Dispute Resolution) before trial — track ADR deadlines

**Batch D Checklist:**
- [ ] Wisconsin ch. 804 statutory discovery audit (similar approach to CCP)
- [ ] Missouri no-initial-disclosure workflow
- [ ] Minnesota ADR deadline tracking implemented
- [ ] Michigan MCR audit — FRCP-adjacent, fast track
- [ ] 4 state UPL memos + bar ethics inquiries
- [ ] All 4 rule packs deployed and regression tested

---

### 📦 Batch E — Remaining 22 States (Q3–Q4 2028)

| Group | States | Approach |
|-------|--------|---------|
| **Mountain/Plains** | MT, ID (fed), WY, ND, SD, NE, KS | FRCP-adjacent; fast track |
| **Southern** | AL, MS, LA, AR, TN, KY, WV | Moderate complexity; local rules vary |
| **New England** | ME, VT, NH, RI | Small markets; FRCP-adjacent |
| **Mid-Atlantic** | MD, DE | Moderate; Delaware corporate law complex |
| **Pacific** | OR, HI, AK | Oregon tracks WA closely; HI and AK small markets |

> **Batch E Strategy:** Pair each state with a Jurisdiction Research Team member. Use the 45-day template. States that closely track FRCP (MT, WY, OR) are completed in 30 days. States with unique structures (LA — civil law system; DE — Court of Chancery) get extended timelines.

**Batch E Special Notes:**
- **Louisiana** — only US state using civil law (Napoleonic Code) tradition; La. Code Civ. P. diverges fundamentally — allocate **90 days** and a Louisiana-specific attorney review
- **Delaware** — Court of Chancery handles corporate disputes; unique discovery rules for equity proceedings
- **Oregon** — closely tracks Washington CR (already built); fast-track estimate: 20 days

---

### ⚖️ **Federal (FRCP) — All Federal District Courts (Q4 2028)**

Adding FRCP support unlocks every federal case filed by AutoDiscovery users — the largest single rule pack addition.

| Item | Detail |
|------|--------|
| **Rules** | Federal Rules of Civil Procedure (FRCP) — currently at Dec. 1, 2023 amendments |
| **Governing Body** | Judicial Conference of the United States — Rules Advisory Committees |
| **Scope** | All 94 Federal District Courts |
| **Local Rule Complexity** | Each of 94 districts has its own local rules — major implementation effort |
| **E-filing system** | CM/ECF (Case Management/Electronic Case Files) — affects service timestamp logic |
| **ESI** | Sedona Conference Principles apply; many districts have ESI standing orders |

**Key FRCP Discovery Rules (already form the basis of IRCP/URCP):**

| Rule | Title | AutoDiscovery Impact |
|------|-------|---------------------|
| **FRCP 16** | Scheduling | Foundation already built in Idaho |
| **FRCP 26(a)(1)** | Initial Disclosures — 14 days | Same as IRCP — minimal delta |
| **FRCP 26(a)(2)** | Expert Disclosures | Same as IRCP — minimal delta |
| **FRCP 26(b)(1)** | Proportionality | Same as IRCP — minimal delta |
| **FRCP 33** | Interrogatories — 25 limit, 30-day response | ⚠️ FRCP = **30 days** (IRCP = 28) |
| **FRCP 34** | RFP — 30-day response | ⚠️ FRCP = **30 days** (IRCP = 28) |
| **FRCP 36** | RFA — 30-day response | ⚠️ FRCP = **30 days** (IRCP = 28) |
| **FRCP 37** | Sanctions | Same as IRCP |

> ⚠️ FRCP response deadlines are **30 days** (not 28 like Idaho). A small but critical fork.

**FRCP Launch Checklist:**
- [ ] FRCP rule pack audit — delta from IRCP documented
- [ ] 30-day response deadline fork implemented for FRCP 33/34/36
- [ ] CM/ECF timestamp logic implemented (mirrors NYSCEF approach)
- [ ] 10 representative federal district local rules mapped (SDNY, CDCA, NDIL, SDTX, EDPA priority)
- [ ] Local rule monitoring system: subscribe to all 94 district court rule update notifications
- [ ] Federal-licensed attorney review (any admitted to federal district bar)
- [ ] `jurisdiction-registry` FRCP rule pack v1.0 deployed

---

### 📊 **Phase 7 Success Metrics (National Coverage Complete)**

| Metric | Target | Minimum Gate |
|--------|--------|--------------|
| **States active** | 50 + FRCP | 45 states |
| **Total paying customers** | 10,000 firms | 5,000 firms |
| **Monthly Recurring Revenue** | $5,000,000 | $2,500,000 |
| **All state deadline accuracy** | 100% | 100% — non-negotiable |
| **All UPL memos on file** | 50 of 50 | 50 of 50 |
| **Louisiana civil law rule pack** | Complete | Complete |
| **FRCP + 10 district local rules** | Complete | Complete |
| **Annual full re-audit cycle** | Active | Active |

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
