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
- Spy's primary jurisdiction — deepest domain expertise on the team
- Idaho Rules of Civil Procedure (IRCP) are well-documented and stable
- Smaller legal market = controlled launch environment
- Idaho State Bar is approachable for early partnership discussions
- Win here = credible proof of concept for every other state

---

### 📋 **Launch Checklist — Idaho**

#### 🔒 Legal & Compliance Checkpoints

- [ ] **IRCP Full Rule Audit** — Map all 84 IRCP rules to AutoDiscovery workflow steps
- [ ] **IRCP Rule Pack v1.0** — Complete `jurisdiction-registry` rule pack for Idaho
- [ ] **Attorney Review** — Have 2 Idaho-licensed attorneys review rule pack for accuracy
- [ ] **Bar Consultation** — Informal outreach to Idaho State Bar (feedback, not approval)
- [ ] **UPL Assessment** — Confirm AutoDiscovery does not constitute unauthorized practice of law
- [ ] **Data Privacy Review** — Confirm IRCP + Idaho state data laws are addressed
- [ ] **Terms of Service** — Include jurisdiction-specific disclaimers for Idaho
- [ ] **Malpractice Insurance Check** — Verify no conflicts with E&O policies for beta users

#### 🛠️ Technical Checkpoints

- [ ] `jurisdiction-registry` Idaho rule pack deployed to Midnight testnet
- [ ] All 9 discovery steps mapped to IRCP deadlines and requirements
- [ ] Expert witness workflow (`W-9/I-9`, SOC) validated for Idaho courts
- [ ] Compliance proof generator tested against 3 Idaho case types:
  - Medical malpractice
  - Contract dispute
  - Personal injury
- [ ] `discovery-core` smart contract tested end-to-end for Idaho cases
- [ ] Email Safety Protocol tested with Idaho court contacts
- [ ] DemoLand environment seeded with Idaho-specific mock cases

#### 🧪 Beta Testing Checkpoints

- [ ] **Recruit 10 Idaho beta users** — Solo practitioners and small firms
- [ ] **Beta period: 60 days** — Minimum before public launch
- [ ] **Weekly feedback sessions** — Spy leads with direct user interviews
- [ ] **Bug threshold** — Zero critical bugs before public launch
- [ ] **Compliance accuracy** — 100% accuracy on IRCP deadline calculations

#### 📣 Go-to-Market Checkpoints

- [ ] Landing page live at `autodiscovery.legal` with Idaho-focused messaging
- [ ] Idaho State Bar newsletter submission (announcement)
- [ ] Outreach to Idaho Association for Justice (IAJ)
- [ ] 3 case studies drafted from beta users
- [ ] Press release to Idaho legal publications

---

### 📊 **Idaho Success Metrics (Gates for Utah Launch)**

| Metric | Target | Minimum Gate |
|--------|--------|--------------|
| **Beta users** | 10 firms | 5 firms |
| **Paying customers** | 25 firms | 10 firms |
| **Monthly Recurring Revenue** | $5,000 | $2,500 |
| **Compliance accuracy** | 100% | 99.5% |
| **User retention (30-day)** | 90% | 80% |
| **NPS score** | 70+ | 50+ |
| **Support tickets (critical)** | 0 | 0 |
| **Attorney endorsements** | 3 | 1 |

> ⚠️ **Hard Gate:** All minimum gate metrics must be met before Utah opens.

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
