# 💰 AutoDiscovery — Commercial Model, Overheads & Revenue Analysis

> Sourced from: INVESTOR_ROADMAP.md, PRICING_ANALYSIS.md, docs/product/GTM_STRATEGY.md, docs/product/CUSTOMER_ANALYSIS_MATRIX.md, docs/pitch/PITCH_DECK.md

---

## 1. 🏗️ YOUR COMMERCIAL MODEL

AutoDiscovery operates a **dual-engine commercial model**: **SaaS subscriptions + per-proof transactional revenue**, with two additional future revenue streams.

### Revenue Stream #1 — SaaS Subscriptions (Primary)

Your repo defines **two pricing tiers** — a pitch-deck tier and an investor-roadmap tier. Here's how they compare:

| Tier | Pitch Deck Price | Investor Roadmap Price | Target Customer |
|------|-----------------|----------------------|-----------------|
| **Solo** | $99/mo | $99/mo | Solo attorneys, 1 jurisdiction |
| **Practice / Small Firm** | $399/mo | $299/mo | Small firms, multi-jurisdiction |
| **Mid Firm** | — | $999/mo | Mid-size firms |
| **Enterprise** | $1,499/mo | $2,999/mo | Regional firms, unlimited jurisdictions |
| **Corporate** | — | $4,999/mo | In-house legal departments |

> ⚠️ **Note:** You have a pricing discrepancy between your pitch deck ($399 Practice, $1,499 Enterprise) and your investor roadmap ($299 Small, $999 Mid, $2,999 Enterprise, $4,999 Corporate). You'll want to reconcile these before investor conversations.

### Revenue Stream #2 — ZK Compliance Proofs (Transactional)

| Item | Price | Description |
|------|-------|-------------|
| **Per ZK Proof** | **$25/proof** | Court-ready compliance attestation on Midnight |
| **Year 2 Estimate** | **$75,000/yr** | ~3,000 proofs across 50 Idaho beachhead firms |

This is your **moat revenue** — every proof is a blockchain transaction that competitors cannot replicate.

### Revenue Stream #3 — Compliance Insurance (Future)

| Item | Price | Description |
|------|-------|-------------|
| **Insurance Add-On** | **10% of subscription** | Covers discovery sanction costs |
| **Example (Mid Firm)** | ~$100/mo | Underwritten by partner insurers (ALPS, CNA, AIM) |

### Revenue Stream #4 — API & Data (Future)

| Item | Price | Description |
|------|-------|-------------|
| **API Calls** | **$0.10/call** | Integration with Clio, MyCase, Relativity |
| **Analytics Packages** | Premium pricing | Anonymous compliance insights, benchmark reports |

### Commercial Model Summary Diagram

```
Revenue Engine
├── 💳 SaaS Subscriptions ─────── ~70% of revenue (recurring)
│   ├── Solo:       $99/mo
│   ├── Small:      $299/mo
│   ├── Mid:        $999/mo
│   ├── Enterprise: $2,999/mo
│   └── Corporate:  $4,999/mo
│
├── 🛡️ ZK Compliance Proofs ──── ~20% of revenue (transactional)
│   └── $25/proof (court-ready attestation)
│
├── 📋 Compliance Insurance ──── ~5% of revenue (add-on)
│   └── 10% of subscription fee
│
└── 🔌 API & Analytics ────────── ~5% of revenue (future)
    └── $0.10/API call + premium packages
```

---

## 2. 📊 YOUR OVERHEAD STRUCTURE

Your repo's INVESTOR_ROADMAP.md defines the seed-stage cost structure explicitly:

### Seed Round Allocation ($1.5M)

| Category | Amount | % of Seed | Purpose |
|----------|--------|-----------|---------|
| **Engineering** | $600K | 40% | 4 developers × 12 months |
| **Sales & Marketing** | $450K | 30% | 2 sales reps + marketing spend |
| **Legal & Compliance** | $300K | 20% | Regulatory, patents, insurance |
| **Operations** | $150K | 10% | Office, tools, overhead |

### Estimated Monthly Overhead (Burn Rate)

| Category | Monthly Cost | Annual Cost | Notes |
|----------|-------------|-------------|-------|
| **Engineering Team (4 devs)** | $50,000 | $600,000 | Core product development |
| **Sales Team (2 reps)** | $20,000 | $240,000 | Base salary + benefits |
| **Marketing Spend** | $17,500 | $210,000 | CLE, conferences, content |
| **Legal / Compliance** | $25,000 | $300,000 | UPL memo, patents, bar compliance |
| **Infrastructure (Midnight)** | ~$2,000 | ~$24,000 | Blockchain fees, hosting, CI/CD |
| **Operations / Tools** | $12,500 | $150,000 | Office, SaaS tools, misc |
| **Total Monthly Burn** | **~$127,000** | **~$1,524,000** | |

### Key Overhead Observations

1. **Infrastructure costs are minimal** — TypeScript/Midnight architecture means no expensive per-GB storage like Relativity
2. **Marginal cost per customer ≈ $0** — SaaS model means each new subscriber adds nearly pure margin
3. **Biggest overhead = people** — ~70% of costs are salaries (engineering + sales)
4. **Legal/compliance is front-loaded** — UPL memo, state bar clearances, patent filings are one-time costs that decrease over time

---

## 3. 📈 REVENUE vs. OVERHEAD — THE P&L MODEL

### Your Projected Financial Summary (From Repo)

| Year | Users | ARR | Revenue | Gross Margin | Monthly Burn | Net Position |
|------|-------|-----|---------|--------------|-------------|--------------|
| 2026 | 500   | $500K | $417K | 85% ($354K)  | ~$127K/mo ($1.5M/yr) | -$1.1M (seed-funded) |
| 2027 | 5,000 | $5M  | $4.2M  | 88% ($3.7M)  | ~$200K/mo ($2.4M/yr) | +$1.3M (cash-flow positive) |
| 2028 | 25,000| $25M | $20.8M | 90% ($18.7M) | ~$400K/mo ($4.8M/yr) | +$13.9M (highly profitable) |
| 2029 | 100K  | $100M| $83.3M | 92% ($76.6M) | ~$800K/mo ($9.6M/yr) | +$67M |

### Unit Economics (From GTM_STRATEGY.md & PRICING_ANALYSIS.md)

| Metric | Year 1 | Year 2 | Year 3 | Source |
|--------|--------|--------|--------|--------|
| **CAC (Customer Acquisition Cost)** | <$500 (network) | $2,500 (scaled) | $3,000–$3,500 | GTM_STRATEGY.md / PRICING_ANALYSIS.md |
| **Average Revenue Per Firm** | $350/mo | $350/mo → $667/mo | $1,000/mo | CUSTOMER_ANALYSIS_MATRIX.md |
| **LTV (Lifetime Value)** | $4,200 (12mo) | $50,000 | $80,000–$120,000 | GTM_STRATEGY.md / PRICING_ANALYSIS.md |
| **LTV:CAC Ratio** | **8:1** | **20:1** | **23:1–34:1** | GTM_STRATEGY.md |
| **Payback Period** | <2 months | <4 months | <4 months | Derived |
| **Net Revenue Retention** | >100% | >110% | >110% | GTM_STRATEGY.md |

> ✅ **The 8:1 LTV:CAC ratio in Year 1 is exceptional** — SaaS benchmarks target 3:1 as healthy. You're projecting nearly 3x the healthy minimum from day one.

---

## 4. 🔬 OVERHEAD vs. REVENUE — BREAKEVEN ANALYSIS

### When Do You Break Even?

```
Monthly Breakeven Calculation:
├── Monthly Burn Rate: ~$127,000
├── Average Revenue Per Firm: $350/mo
├── Firms Needed to Break Even: $127,000 ÷ $350 = 363 firms
│
├── Beachhead Target (Year 2): 50 Idaho firms = $17,500 MRR
│   └── Covers 13.8% of burn — still seed-funded
│
├── At 250 firms (End of 2026): $87,500 MRR
│   └── Covers 68.9% of burn — approaching breakeven
│
├── At 363 firms: $127,050 MRR ← BREAKEVEN POINT
│   └── ~Q1 2027 based on your trajectory
│
└── At 1,000 firms: $350,000 MRR = $4.2M ARR
    └── ~170% of overhead — profitable and scaling
```

### Gross Margin Waterfall

| Cost Component | % of Revenue | Notes |
|----------------|-------------|-------|
| **Midnight Network Fees** | ~1–2% | ZK proof generation, on-chain txns |
| **Cloud Infrastructure** | ~2–3% | Hosting, CDN, CI/CD |
| **Payment Processing** | ~2.9% | Stripe/payment gateway |
| **Total COGS** | **~6–8%** | |
| **Gross Margin** | **~92–94%** | |

> Your pitch script claims "97% profit margin" — this is aggressive. The **85–92% gross margin** range in your INVESTOR_ROADMAP.md is more defensible. The difference is that gross margin ≠ net profit margin (which includes all operating expenses).

---

## 5. 🎯 KEY METRICS TO MEASURE OVERHEAD vs. REVENUE

Here's a dashboard framework combining your GTM_STRATEGY.md metrics with financial KPIs:

### Monthly Health Scorecard

| Metric | Formula | Green ✅ | Yellow ⚠️ | Red 🔴 |
|--------|---------|---------|-----------|--------|
| **Burn Multiple** | Net Burn ÷ Net New ARR | <1.5x | 1.5–2.5x | >2.5x |
| **Months of Runway** | Cash ÷ Monthly Burn | >18 mo | 12–18 mo | <12 mo |
| **CAC Payback** | CAC ÷ Monthly ARPU | <3 months | 3–6 months | >6 months |
| **LTV:CAC** | LTV ÷ CAC | >5:1 | 3:1–5:1 | <3:1 |
| **Gross Margin** | (Revenue - COGS) ÷ Revenue | >85% | 75–85% | <75% |
| **MRR Growth Rate** | (MRR₂ - MRR₁) ÷ MRR₁ | >15% MoM | 10–15% MoM | <10% MoM |
| **Net Revenue Retention** | (Start MRR + Expansion - Churn) ÷ Start MRR | >110% | 100–110% | <100% |
| **Rule of 40** | Revenue Growth % + Profit Margin % | >40 | 20–40 | <20 |

### Overhead Efficiency Ratios

| Ratio | Formula | Your Target | Industry SaaS Benchmark |
|-------|---------|-------------|------------------------|
| **Engineering % of Revenue** | Eng Cost ÷ Revenue | Year 1: 144% → Year 3: 7% | 15–25% |
| **Sales & Marketing % of Revenue** | S&M Cost ÷ Revenue | Year 1: 108% → Year 3: 10% | 20–40% |
| **G&A % of Revenue** | G&A Cost ÷ Revenue | Year 1: 36% → Year 3: 3% | 10–15% |
| **Magic Number** | Net New ARR ÷ S&M Spend | Target >1.0 | >0.75 is good |

---

## 6. ⚠️ GAPS & RECOMMENDATIONS

### What's Missing From Your Current Docs

| Gap | Risk | Recommendation |
|-----|------|----------------|
| **No explicit COGS breakdown** | Investors will ask what "85% gross margin" includes | Add a COGS line item: Midnight txn fees, hosting, payment processing |
| **Pricing tier inconsistency** | Pitch deck says $399/$1,499; Investor Roadmap says $299/$999/$2,999/$4,999 | Reconcile to ONE pricing table across all docs |
| **No churn modeling** | All projections assume 0% churn | Add churn scenarios: 5%, 10%, 15% monthly — show how each affects ARR |
| **"97% profit margin" claim** | Not credible at scale; conflates gross margin with net margin | Replace with "85–92% gross margin" (which IS defensible) |
| **No headcount growth plan** | Investors need to see how team scales with revenue | Add: "At $X ARR, hire Y" staffing plan |
| **CAC discrepancy** | GTM_STRATEGY says <$500; PRICING_ANALYSIS says $2,500 | Clarify: $500 is network-driven (Year 1); $2,500 is blended scaled (Year 2+) |

### The Strongest Parts of Your Model

| Strength | Why It Matters |
|----------|---------------|
| **~$0 marginal cost per customer** | SaaS + blockchain = near-zero COGS per subscriber |
| **$0 CAC for first 8 customers** | Network-driven acquisition via Spy's legal contacts is extremely capital-efficient |
| **8:1 LTV:CAC from Year 1** | 3x above the SaaS healthy benchmark of 3:1 |
| **ZK proof revenue = unique moat** | $25/proof is a transactional revenue stream with no competitor equivalent |
| **"Arms race" viral acquisition** | When one side files a ZK proof, opposing counsel becomes a lead at $0 CAC |
| **92% TCO savings vs. traditional stack** | $13,200/yr vs. $165,000/yr = irresistible value proposition |

---

## 7. 📊 VISUAL SUMMARY — YOUR P&L TRAJECTORY

```
Revenue vs. Overhead (Annual)

$25M ─┤                                              ████████ Revenue
      │                                              ████████
$20M ─┤                                              ████████
      │                                              ████████
$15M ─┤                                              ████████
      │                                              ████████
$10M ─┤                                              ████████
      │                                     ████████ ████████
 $5M ─┤                                     ████████ ████████
      │                            ████████ ████████ ████████
      │                   ░░░░░░░░ ████████ ░░░░░░░░ ░░░░░░░░ Overhead
 $2M ─┤          ░░░░░░░░ ████████
 $1M ─┤ ░░░░░░░░ ████████
      │ ████████
   $0 ┼──────────────────────────────────────────────────────
        2026       2027       2028       2029

   ████ = Revenue    ░░░░ = Overhead/Burn

   Breakeven: ~Q1 2027 (~363 firms)
   Cash-flow positive: Mid-2027
   Highly profitable: 2028+
```

---

**Bottom line:** Your commercial model is a **high-margin SaaS + transactional proof hybrid** with near-zero marginal costs, an exceptional LTV:CAC ratio, and a built-in viral acquisition mechanism (the "arms race" dynamic). Your primary overhead risk is **people costs** in the pre-revenue period — which is exactly what the $1.5M seed covers. The model becomes self-sustaining at ~363 paying firms, which your trajectory targets in early-to-mid 2027.

---

*This analysis is cross-referenced from INVESTOR_ROADMAP.md, PRICING_ANALYSIS.md, GTM_STRATEGY.md, CUSTOMER_ANALYSIS_MATRIX.md, and PITCH_DECK.md within the AutoDiscovery repository. All projections should be validated against actual performance data as milestones are reached.