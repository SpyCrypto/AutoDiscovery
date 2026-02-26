# AutoDiscovery.legal — Documentation Index

**Last Updated**: February 25, 2026

---

## Folder Structure

```
docs/
├── pitch-deck-week3.html         ← THE DECK (open in browser or serve via HTTP)
├── pitch-deck-week3.pdf          ← PDF export of the deck (13 slides)
├── generate-pdf.mjs              ← Puppeteer script to regenerate the PDF
│
├── pitch/                        ← Pitch content, scripts, VC research
│   ├── PITCH_DECK.md             ← Full deck content in markdown
│   ├── PITCH_VIDEO_SCRIPT.md     ← 3-minute video script (13 slides)
│   ├── PITCH_FODDER.md           ← Raw material and talking points
│   ├── PITCH_DECK_NOTION.md      ← Notion-formatted version
│   ├── BUILD_CLUB_SLIDE_CONTENT.md
│   ├── VC_PORTFOLIO_INSIGHTS_FOR_ADL.md
│   ├── WEEK_3_HOMEWORK.md
│   └── INVESTOR_VC_ROADMAP.md        ← Investor & VC roadmap (market, financials, exit)
│
├── architecture/                 ← Technical architecture and build plans
│   ├── BUILD_PLAN.md             ← Master build plan (phases, milestones)
│   ├── SMART_CONTRACT_PARTITIONING.md  ← How the 6 contracts are split
│   ├── JOHNS_SMART_CONTRACT_ACTION_PLAN.md
│   ├── DEMOLAND_VS_REALDEAL.md   ← Demo mode vs real blockchain mode
│   ├── WHAT_IT_MEANS_TO_DEPLOY.md
│   ├── GEOZ_ARCHITECTURE.md      ← Geographic zone system
│   └── YUBIKEY_ACCESS_CONTROL.md ← Hardware key auth design
│
├── product/                      ← Product specs, market research, features
│   ├── PROJECT_OVERVIEW.md       ← High-level product overview
│   ├── WHITE_PAPER.md            ← Full white paper
│   ├── ADOPTION_STRATEGY.md      ← Go-to-market plan
│   ├── CUSTOMER_ANALYSIS_MATRIX.md / .pdf
│   ├── JURISDICTION_DEEP_DIVE.md ← State-by-state rule analysis
│   ├── UI_DESIGN_NOTES.md        ← Frontend design decisions
│   ├── EMAIL_SAFETY_PROTOCOL.md  ← Email safety feature spec
│   ├── CASE_CONTACTS_FEATURE.md  ← Contact management feature spec
│   └── Ai-for-parsing-of-data-dump.md  ← AI doc parsing feature
│
├── team/                         ← Team info, notes, communication
│   ├── TEAM_SPY.md               ← Spy's background and role
│   ├── NOTE-FOR-SPY.md           ← Notes/messages for Spy
│   ├── SPY-RESPONSE-to-build-plan.md
│   └── INTERACTION_LOG.md        ← Session log / decision history
│
├── discovery-automation/         ← Deep technical docs on discovery logic
│   ├── README.md
│   ├── DEEP_DIVE_HASHING_STRATEGY.md
│   ├── HOW_SHOULD_WE_PARTITION_THE_DISCOVERY_BLOB.md
│   ├── TWIN_PROTOCOL.md
│   └── FOR_LATER_TO_BE_CONSIDERED.md
│
└── reference/                    ← External research and references
    ├── OHIO-GROK-PROMPT.md
    └── OHIO-GROK-RESPONSE.md
```

## Quick Links

- **Serve the deck locally**: `python3 -m http.server 8080` (from the ADL repo root)
- **Regenerate PDF**: `node docs/generate-pdf.mjs` (needs server running on 8080)
- **Deployment guide**: See `/home/js/utils_Midnight/preProd-Wallets/README_WALLET_SETUP.md`
- **RealDeal punch list**: See `frontend-realdeal/REALDEAL_PUNCH_LIST.md`
