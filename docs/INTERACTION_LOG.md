# AutoDiscovery — Interaction Log

> **Project journal** — records key prompts, decisions, and milestones from John + Penny dev sessions.
> Updated before each push to maintain a running record of how the project evolved.

---

## Session: February 10, 2026 (Evening)

### Context
First real build session after planning/research phase. Spy's feedback already received.

### Key Interactions

**John**: Create note file for Spy in grok folder and response template.
- **Action**: Created `docs/grok-data-structure-review/03-NOTE-FOR-SPY.md` and `04-SPY-RESPONSE-to-build-plan.md`
- **Outcome**: Spy filled in her response with Idaho IRCP details, med-mal specifics, and edge cases

**John**: Is AD-DEEP-DIVE-FOR-REVIEW.md no longer relevant? If so remove please.
- **Action**: Removed obsolete file (superseded by newer docs)

**John**: I goofed, let's take all data from Ohio and stick it in a file. I want Idaho and Idaho discovery law to be the primary focus.
- **Action**: Archived Ohio Grok data to `docs/reference/OHIO-GROK-PROMPT.md` and `OHIO-GROK-RESPONSE.md`. Revamped `BUILD_PLAN.md` to be Idaho-primary. Updated all docs.
- **Decision**: Jurisdiction rollout order locked: **Idaho → Ohio → Washington → Utah → California → New York**

**John**: Let's lock that order in. What should we work on first? Do you want to start making the folders for the compact smart contracts and begin making a skeleton?
- **Action**: Scaffolded `autodiscovery-contract/src/contracts/` with 4 skeleton Compact files:
  - `discovery-core.compact` — case lifecycle, step tracking
  - `jurisdiction-registry.compact` — on-chain rule pack registry
  - `compliance-proof.compact` — ZK attestation generation
  - `expert-witness.compact` — Phase 2 skeleton (med-mal experts)
- **Decision**: Used pragma `>= 0.16 && <= 0.18` (MCP recommended). Kept existing `counter.compact` (pragma `>= 0.19`) as reference.

### Commits
- `feat: create note for Spy + response template`
- `chore: remove obsolete deep dive doc`
- `refactor: archive Ohio data, restructure docs for Idaho-primary`
- `feat(contracts): scaffold AD smart contract structure + witness files`

---

## Session: February 11, 2026 (Early Morning)

### Context
Continuing from scaffold. Spy's feedback incorporated. TypeScript data model is the focus.

### Key Interactions

**John**: I hear there is an MCP that will allow our Windsurf to speak to another Windsurf instance, is this true?
- **Action**: Researched Agent-MCP (github.com/rinadelph/Agent-MCP) — multi-agent collaboration framework using MCP. Full deep dive conducted.
- **Outcome**: Comprehensive write-up created. Not adopted yet — bookmarked for future evaluation.

**John**: Let me think on it, please do a deep dive and shall we add it to PixyPi?
- **Action**: Created `AGENT_MCP_DEEP_DIVE.md` in PixyPi/myAlice and pushed. Covers architecture, setup for our family, pros/cons, open questions, and recommended adoption path.
- **Decision**: Don't rush. Test on Chuck with Cassie first if/when John decides to proceed.

**John**: Can you check out the ft bifrost bridge repo I just forked in GitHub?
- **Note**: GitHub MCP auth failing ("Bad credentials"). Worked around by fetching README directly via URL.
- **Action**: Reviewed `bytewizard42i/ft-bifrost-bridge_johns-copy`. It's a Bitcoin↔Cardano bridge by FluidTokens/ZkFold/Lantr using SPO consensus. Catalyst Fund 14 funded (739K ADA). AGPL licensed. In final dev phase.
- **Decision**: Not relevant to AutoDiscovery. Nice ecosystem reference fork. Parked.

**John**: I'm a little tired, can we pick up again tomorrow? In the meantime feel free to work on whatever part of ADL that you feel is appropriate.
- **Action**: Built the entire 6-entity TypeScript data model (Phase 0.3):
  - `enums.ts` — 11 enums covering all status types, categories, roles
  - `case.ts` — Case entity with disposition + appeal tracking (Spy's request)
  - `discovery-step.ts` — DiscoveryStep with supplementation + set number tracking
  - `jurisdiction-rule-pack.ts` — Typed RuleParams union, damages cap, statute of limitations
  - `document.ts` — Document tracking with PHI, Bates numbers, privilege log
  - `party.ts` — Party with attorney, expert, third-party support + UIDDA
  - `compliance-attestation.ts` — ZK proof metadata, selective disclosure, verification
  - `deadline.ts` — DeadlineSpec (relative), ComputedDeadline (absolute), overrides, holidays
  - `index.ts` — Barrel export wiring everything together
- **Spy feedback incorporated throughout**: warning→deadline→escalation flow, no Affidavit of Merit in Idaho, no county overrides, UIDDA under IRCP 45(j), disposition tracking for reform analysis, set number error prevention, insurance carrier audience

**John**: What law firms might be our first clients? Perhaps firms with a history of failure to comply? Could we compel them through a judge for a pilot program?
- **Action**: Developed comprehensive adoption strategy covering 4 client tiers (defense firms, plaintiff solos, insurance carriers, sanctioned firms), court-ordered pilot mechanism via IRCP Rule 16, network effect dynamics, bar association CLE channel, and go-to-market sequence.

**John**: Can you add an adoption strategy file and an interaction log?
- **Action**: Created `docs/ADOPTION_STRATEGY.md` and `docs/INTERACTION_LOG.md` (this file).
- **Decision**: Interaction log to be updated before each push going forward.

### Commits
- `feat(contracts): scaffold AD smart contract structure + witness files`
- `feat(types): implement 6-entity TypeScript data model — Phase 0.3 complete`
- `docs: adoption strategy + interaction log` *(this commit)*

### Decisions Made This Session
| Decision | Rationale |
|----------|-----------|
| Agent-MCP bookmarked, not adopted | Works but adds complexity + cost; current PixyPi system is sufficient for now |
| Bifrost Bridge parked | BTC↔Cardano bridge — not relevant to AD |
| GitHub MCP auth needs fix | PAT token not picked up by Windsurf; needs restart or token refresh |
| 6-entity model is DONE | All types strongly typed, Spy feedback incorporated, ready for rule pack + deadline engine |
| Adoption strategy: insurance carriers are the force multiplier | One carrier partnership = hundreds of firm adoptions |
| Court-ordered pilot via IRCP Rule 16 | Judges have case management authority to mandate compliance tools |

### Open Items for Next Session
- Create Idaho IRCP rule pack JSON (needs Spy validation)
- Resolve pragma/compiler version (test compilation)
- Build deadline computation engine
- Fix GitHub MCP PAT authentication
- Customer Analysis Matrix (Build Club homework) — incorporate adoption strategy data

---

**John**: What law firms might be our first clients? Perhaps firms with a history of failure to comply? Could we compel them through a judge for a pilot program?
- **Action**: Discussed 4 client tiers, court-ordered pilot via IRCP Rule 16, insurance carrier force multiplier, network effects, CLE channel
- **Decision**: Insurance carriers (MedPro, TheDoctorsGroup, MIEC) are the highest-leverage channel

**John**: Can you add an adoption strategy file and an interaction log?
- **Action**: Created `docs/ADOPTION_STRATEGY.md` and `docs/INTERACTION_LOG.md`
- **Decision**: Interaction log updated before each push going forward (standing protocol)

**John**: I really want to fix our connection to GitHub.
- **Action**: Diagnosed GitHub MCP auth. Token is set and valid (curl returns 200 from api.github.com). MCP still failing with "Bad credentials" — likely Windsurf not passing the env var to the MCP process. Needs Windsurf restart or MCP config fix.

**John**: I want to talk about automating discovery categorization and labeling — AI agents to auto-categorize, label, group, and dynamically assemble delivery packets from a data dump. Is this a reasonable goal?
- **Action**: Discussed feasibility in depth. Document classification, semantic search, and metadata extraction are production-ready. Privilege detection and jurisdiction-aware assembly are medium difficulty. The ZK-proven compliance proof layer is our unique differentiator vs. existing e-discovery tools (Relativity, Logikcull, Everlaw).
- **Decision**: Idea saved to `docs/Ai-for-parsing-of-data-dump.md` for future implementation. Not building now — focus stays on core platform first.

**John**: I'd like to work a little more. What is next? Please continue with our build plan as you see fit.
- **Action**: Researched actual Idaho IRCP rules from official source (isc.idaho.gov). Fetched and analyzed Rules 2.2, 26, 30, 33, 34, 35, 36, 37, and 45(j). Built comprehensive `idaho-ircp.json` rule pack.
- **Key finding**: Idaho IRCP Rule 26(a) does NOT have FRCP-style mandatory initial disclosures — they're court-ordered via Rule 16 scheduling orders, not automatic. Flagged for Spy validation.
- **Rules documented**: 12 rules covering initial disclosures, interrogatories (40 max), production, depositions (no limit!), admissions (deemed admitted trap), expert disclosure, privilege log, supplementation, UIDDA subpoenas, physical examination, med-mal standard of care, and sanctions.
- **Also included**: Time computation (Rule 2.2), statute of limitations, damages cap ($509,013.28), comparative negligence, and a Spy validation checklist.

### Commits (continued)
- `docs: adoption strategy + interaction log`
- `docs: AI data dump parsing concept + interaction log update`
- `feat(rule-packs): Idaho IRCP rule pack — first jurisdiction data`

**John**: Shared "shock and awe" stats from Alice about discovery sanctions. Requested a cited pitch fodder file.
- **Action**: Verified every stat Alice provided against primary sources. Fetched actual IRCP rules, Duke Law Journal study (Willoughby et al.), FJC surveys, Logikcull sanctions history, Minerva 2024 case law trends, and individual case opinions. Built comprehensive `PITCH_FODDER.md` with:
  - 10 copy-ready pain bullets with citations
  - Top monetary sanctions (Qualcomm $8.57M, Wachtel $6.72M, Grange Mutual $5.4M, SNET $5.89M)
  - Mean ($704K) / median ($40K) sanction amounts from 78 published awards
  - Sanctions trend data (23% grant rate in 2007 → 63% in 2014 → 36% in 2018)
  - 2024 case law trends (mobile device, AI content, hyperlinked files)
  - eDiscovery market size ($27.6B projected by 2030)
  - Idaho-specific angles and Spy's real-world pain points
  - Quick calculator hook for website/pitch
  - Full bibliography with 11 citations
- **Note**: Corrected Alice's $8.83M Grange Mutual figure — actual sanctions were $5.4M default judgment (6th Circuit). Pioneer Hi-Bred v. Monsanto $8.2M figure could not be independently verified as a sanctions amount — omitted from final file.

### Commits (continued)
- `docs: pitch fodder — cited shock & awe stats for selling autodiscovery.legal`

**John**: Shared Grok's expanded deep dive with more case law, systemic stats, and a draft one-pager/synopsis. Requested full merge, deeper research, one-pager and 1000-word synopsis.
- **Action**: Verified all new Grok data points against primary sources. Merged Alice + Grok + Penny research into comprehensive 8-part PITCH_FODDER.md:
  - Part I: Core stats (cited & verified)
  - Part II: 10 landmark cases with full citations (added Coleman v Morgan Stanley $1.58B, Zubulake $29.3M, DR Distributors $2.5M, Captive Alternatives dismissed, Paisley Park, Skanska)
  - Part III: Systemic impact (vanishing trial, criminal cases 60% longer, budget data)
  - Part IV: AutoDiscovery differentiator
  - Part V: 15 copy-ready pain bullets
  - Part VI: Idaho-specific & Spy angles
  - Part VII: Shareable one-pager
  - Part VIII: 1,000-word shareable synopsis
  - Full bibliography: 21 primary sources
  - Grok/Alice corrections table (internal reference)
- **Key corrections**: Grange Mutual was $5.4M not $8.83M; Pioneer Hi-Bred unverifiable (omitted); Captive Alternatives was 2023 not 2024; Grok fabricated "early adopter" stats (removed); RAND $1.8M is narrow sample (caveated).
- `docs: pitch fodder v2 — deep dive merge with one-pager + 1000-word synopsis` *(this commit)*

---

*Log maintained by Penny 🎀 — updated before each push*
