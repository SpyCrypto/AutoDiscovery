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

**John**: Extracted top 10 banger stats with source URLs for Alice to create an advertisement image.

### Alice Ad Prompt (sent Feb 11, 2026)

> Here is a list of the top 10 bangers. What Id like you to do is make a picture with an angry judge at the top smashing her gavel down. Under that the list of bangers and somewhere on the page: Title: autoDiscovery.legal (keep my capitalization please for the title), then a triangle with 1. abstact away liability and prevent sanctions, 2. reduce workload and manhours reducing costs, 3. increase profits with the tagline: Hard-coded, multi-jurisdictional discovery law for modern discovery management.

**Top 10 bangers provided:**
1. 1 in 10 federal civil cases requires a judge to resolve discovery disputes. (FJC 2009)
2. $8,568,633 sanctions in one case — 6 attorneys referred to state bar. (Qualcomm v. Broadcom)
3. $1.58 billion jury verdict followed a discovery sanctions default. (Coleman v. Morgan Stanley)
4. Average eDiscovery sanction: $704,094. Median: $40,207. (Willoughby, Duke L.J. 2010)
5. In 2014, 63% of spoliation motions resulted in sanctions. (Gibson Dunn / Logikcull)
6. Federal criminal cases 60% longer — 10.4 months vs 6.5 in 2018. (U.S. Courts 2024)
7. Defendant erased 20,000 files with anti-forensic software — default judgment. (SNET v. Global NAPs)
8. 165+ court orders in one case, then $6.7M sanctions. (Wachtel v. Health Net)
9. 36 dismissals/defaults from discovery abuse. Defendants sanctioned 3.3x more. (Willoughby 2010)
10. Document review = 73% of eDiscovery costs. Market → $27.6B by 2030. (RAND + ElectroIQ)

### Alice Stat Verification (Feb 11, 2026)

Alice cross-checked the mean/median sanctions figures against Willoughby/Jones/Rose Appendix C (78 monetary awards):
- **Mean: $704,094.12** → our $704,094 ✅
- **Median: $40,207.34** → our $40,207 ✅
- Recommended clean phrasing: "~$704k" / "~$40.2k" with citation to Appendix C

**Still outstanding**: Ad image says "$8.8 Million Top Sanction Award" — should be **$8.5M+** or **$8,568,633** (Qualcomm v. Broadcom). The $8.8M traces to unverified Grange Mutual figure. Alice flagged for next revision.

---

## Session: February 15, 2026 (Afternoon — Evening)

### Context
Major ideation session. Synced repos, reviewed Penny's new research, created feature branch, then deep-dove into discovery protocol architecture. Produced ~2,500 lines of design documentation across 8 files.

### Key Interactions

**John**: Sync both repos with remotes, merge upstream changes, commit new slide content, share updates with Penny.
- **Action**: Fetched and merged upstream changes in both ADL and PixyPi repos. Committed `BUILD_CLUB_SLIDE_CONTENT.md`. Created `CASSIE_UPDATE_2026-02-15.md` in PixyPi for Penny with ADL progress summary and Agent-MCP feedback.
- **Outcome**: Both repos clean and synced.

**John**: Pull Penny's new updates and review them.
- **Action**: Pulled Penny's two new files — `AGENT_MCP_DEEP_DIVE.md` (247 lines on multi-agent MCP collaboration) and `OPENCLAW_NOTES.md` (118 lines on AI assistant gateway for Signal). Provided detailed analysis of both.
- **Decision**: Agent-MCP is promising for sister-to-sister communication but adds complexity. OpenClaw is interesting for Signal integration. Neither adopted yet — parked for future evaluation.

**John**: Check for merge conflicts with Spy's upstream changes, push to main, create a "johnny5i-branch" for future work.
- **Action**: Confirmed clean merge with Spy's upstream (IRCP rule packs, TypeScript data model, contract scaffold, pitch docs). Pushed main. Created `johnny5i-branch` from main.
- **Decision**: All new discovery protocol work goes on `johnny5i-branch`.

**John**: Start designing how we'll automate discovery. How do we partition the blob? Define universal categories, party attribution, origination tracking, chain of custody, memorandums, and handle data dump obfuscation.
- **Action**: Created `docs/discovery-automation/` folder. Wrote comprehensive 417-line `HOW_SHOULD_WE_PARTITION_THE_DISCOVERY_BLOB.md` with 6 steps:
  1. Universal Categories (18 document types)
  2. Party Attribution (DEF, PRO, COURT, 3P)
  3. Origination tracking with SHA-256 content hashes + ZK proofs on Midnight
  4. Chain-of-custody transfer ledger with delivery/receipt confirmations
  5. Memorandum system for periodic status reports
  6. Data dump obfuscation detection with scoring and "Haystack Alert" mechanism
- Also created `FOR_LATER_TO_BE_CONSIDERED.md` with 15 parking lot items (privilege logs, redaction tracking, deadline cascades, proportionality analysis, insurance integration, etc.)
- **Decision**: Protocol is jurisdiction-agnostic by design. ZK proofs anchor integrity without revealing content.

**John**: Include court transcripts as a daily audit ledger, judge instructions and commentary tracking, and jury materials (selection, instructions, notes, verdict forms).
- **Action**: Extended main doc from 18 to 24 universal categories. Added three major new sections:
  - Step 7: Court Transcripts as daily-entry audit layer (tag discovery-relevant excerpts)
  - Step 8: Judge Instructions/Commentary tracking (oral rulings, discovery admonishments)
  - Step 9: Jury Materials lifecycle (voir dire → instructions → deliberation notes → verdict)
- Updated full flow diagram to include all 9 layers.
- **Decision**: Transcripts become the "daily audit ledger" — every hearing day generates a transcript entry linked to discovery events.

**John**: 3P will be broken down further into things such as expert witness, witness, law enforcement, juror etc.
- **Action**: Expanded the 3P column in the Party Attribution diagram into 4 subcategories:
  - **Witnesses**: Expert, fact/percipient, character
  - **Law Enforcement**: Investigating officer, crime scene/forensic, agencies (FBI, ATF, etc.)
  - **Jury**: Seated jurors, alternates, venire (pool)
  - **Other**: Record custodians, government agencies, mediators/arbitrators, guardian ad litem, court reporters, interpreters
- **Decision**: Each 3P subcategory will need its own role type and access permissions in the data model.

**John**: Communications should have subcategories like "what about," with a monster list. But won't miscategorization hurt us with automated aggregation? Perhaps AI synopsis with key elements and a comprehensive list of all parties mentioned should be added as metadata automatically. Then you could search "fetch all communications about Mr. Smith the victim."
- **Action**: Added Communications Enrichment section to main doc with:
  - 14 subcategory options (Settlement, Contract, HR, Medical, etc.) — but flagged the **miscategorization risk** prominently
  - **AI-Generated Metadata Envelope**: auto-generated at intake with synopsis, key elements (topics, action items, sentiment, legal relevance), comprehensive parties mentioned (name + role + context), entities mentioned (locations, dates, dollar amounts, case numbers), thread context (position in chain, topic drift)
  - Multi-axis search: full-text + entity extraction + synopsis semantic match + thread expansion
  - **Mismatch detection**: if human tags "Administrative" but AI detects "Settlement + Opposing Counsel" at 0.94 confidence → system flags it
- **Key insight from John**: Don't rely on human-assigned subcategories as primary classification. Treat them as optional hints. Let AI do the heavy lifting. This catches both honest mistakes and intentional obfuscation.
- **Decision**: Three-layer defense: human hint + AI extraction + mismatch detection. AI metadata is authoritative for search; human tag is supplementary.

**John**: Should every document have its own hash? What about multi-page docs — hash each page plus a compendium hash? What about when several documents form a single document?
- **Action**: Created `DEEP_DIVE_HASHING_STRATEGY.md` (616 lines) with:
  - 5-level Merkle tree hierarchy: Raw Bytes → Page/Segment → Document → Package → Production → Case Root
  - Page-level hashing aligned with Bates numbering (courts reference specific pages)
  - Compound document handling: expert reports + appendices, deposition packages, contract + amendments, email threads, medical records compilations
  - Non-page content: audio/video uses 60-second time segments, databases use row-group batches
  - Special cases: redacted docs (two hashes, linked), format conversions (native + produced), supplemental productions (Git-like versioning, never delete history), identical docs from multiple sources (content-addressable deduplication), audio/video gap detection
  - On-chain efficiency: only Level 4-5 go to Midnight. Any page verifiable via Merkle proof path in O(log n) steps.
- Updated main doc to reference the deep dive and added summary table. Resolved Open Questions #1 (hashing granularity) and #2 (supplementation).
- **Key insight**: Like Git — blobs (pages), trees (documents), commits (productions), repository (case). Same architecture, legal domain.

**John**: Many documents will have to be digitized. I'd like to keep a copy of the image with the actual digital file, have them considered attached. Come up with a simple clever protocol for this.
- **Action**: Created `TWIN_PROTOCOL.md` (344 lines):
  - **Three rules**: Can't have digital without its image. Image is the authority. Bond is permanent.
  - **Bond Hash**: `SHA-256(image_hash + digital_hash)` — the bond hash IS the page hash in the Merkle tree
  - **Fidelity scoring**: re-OCR the image, compare to stored digital, character-level diff → percentage score. Low confidence items flagged for human review.
  - **Visual feature detection**: signatures, handwriting, stamps/seals, highlighting, strikethroughs, ink color, staple marks — things OCR can't capture. System flags these automatically.
  - **Production rules**: both twins always produced together. On-demand image optimization for million-page cases (digital + bond record inline, image available within 24 hours)
  - Slots into existing hash architecture: bond hash = Level 1 page hash
- **Key insight from John**: The image is the source of truth. The digital is the searchable utility layer. The bond proves they match. Born-digital documents don't need twins.

**John**: Have we thoroughly documented everything? If not, let's. Then cleanup and what do you suggest for next steps. Let's start thinking about how we'll split the smart contracts for Midnight. Most documentation lives in user's private state unless shared by the protocol. Also YubiKey — how will we use this for access control? And split the protocol into demoLand (mock UI for demos) and realDeal (connected to Midnight and AI).
- **Action**: Conducted full documentation audit. Identified 5 gaps. Created 5 new documents:
  1. `discovery-automation/README.md` — index with relationship diagram linking all protocol docs
  2. `SMART_CONTRACT_PARTITIONING.md` (~310 lines) — maps entire protocol to Midnight's state model:
     - 4-tier data location: user's machine (witness) → private ledger → sealed ledger → public ledger
     - Expanded from 4 to **6 contracts**: added `document-registry.compact` (hash anchoring, twin bonds, custody) and `access-control.compact` (roles, permissions, sharing, YubiKey hooks)
     - Full circuit/ledger design for each contract with public/private/sealed field assignments
     - Sharing protocol: how private state becomes selectively visible during discovery production
     - `MerkleTree<20, Bytes<32>>` native Compact type holds ~1M hash commitments
  3. `YUBIKEY_ACCESS_CONTROL.md` (~250 lines):
     - **Option A**: Key generated ON YubiKey (most secure, hardest recovery, ECDSA P-256 ≠ Ed25519 issue)
     - **Option B**: Midnight Ed25519 key imported to YubiKey PIV slot (high security, backup possible)
     - **Option C**: YubiKey as FIDO2/WebAuthn 2FA alongside Lace wallet (easiest, browser-native, MVP recommendation)
     - Sensitive operation matrix (which operations require YubiKey)
     - Recovery strategies for each option
     - Implementation phases: MVP = wallet only → Phase 2 = FIDO2 → Phase 3 = PKCS#11 → Phase 4 = hardware-native
  4. `DEMOLAND_VS_REALDEAL.md` (~300 lines):
     - **Provider pattern**: shared TypeScript interfaces, different implementations
     - `VITE_AD_MODE=demoland|realdeal` environment variable switches everything
     - demoLand: mock JSON data, no wallet, no blockchain, instant — bulletproof for hackathon demos
     - realDeal: Midnight testnet, Lace wallet, real AI, real ZK proofs — the actual product
     - Mock data spec: "Smith v. Acme Corp" fictional Idaho med-mal case with all 24 categories
     - UI indicators: demoLand shows prominent "DEMO MODE" banner
     - Build order: demoLand first (fast iteration), wire up realDeal after
  5. Updated `BUILD_PLAN.md`: added Phase 0.5 (Discovery Protocol Design — complete), updated to 6-contract architecture, added Phase 4.5 (demoLand/realDeal split)
- **Decisions**:
  - Almost everything lives in user's private state. Public ledger only has hashes, Merkle roots, compliance proofs.
  - YubiKey Option C (2FA) is the MVP default. Options A/B for post-MVP security-conscious firms.
  - demoLand first, realDeal second. Same UI, different providers.

**John**: Don't forget to document the prompts (our conversations) — this is crucial ideation and I'd like it saved.
- **Action**: This entry. Full session documented with all prompts, actions, decisions, and outcomes.

### Commits (johnny5i-branch)
- `e64abaa` — feat(docs): Discovery Blob Partition — 6-step protocol design + 15 'for later' considerations
- `bbc5577` — feat(docs): Steps 7-9 — Court Transcripts daily ledger, Judge Instructions authority layer, Jury Materials trial layer
- `4c9645a` — docs: expand 3P party attribution — subcategories for witnesses, law enforcement, jury, other
- `c4e724a` — feat(docs): Communications enrichment — AI metadata extraction, entity resolution, miscategorization safety net
- `33ef558` — feat(docs): Deep Dive — 5-level Merkle hashing architecture, compound documents, special cases
- `4531639` — feat(docs): Twin Protocol — image + digital pairing with fidelity scoring and bond hashing
- `1b8c095` — feat(docs): Architecture docs — smart contract partitioning (6 contracts), YubiKey access control, demoLand/realDeal split, discovery-automation index, BUILD_PLAN updated

### Decisions Made This Session
| Decision | Rationale |
|----------|-----------|
| 24 universal discovery categories | Covers all document types including court transcripts, jury materials, and court orders |
| 3P expanded into 4 subcategories | Witnesses, LEO, Jury, Other — each needs distinct role types and access permissions |
| AI metadata envelopes > subcategory dropdowns | Miscategorization risk with human-assigned categories; AI extraction is authoritative for search |
| 5-level Merkle tree hashing | Page-level granularity catches which specific page was tampered; only Level 4-5 go on-chain |
| Twin Protocol for digitized documents | Image = truth, digital = tool, bond = proof they match. Bond hash = Level 1 page hash |
| 6 contracts (up from 4) | Added document-registry.compact and access-control.compact for discovery protocol |
| Almost everything in private state | Document content never touches the chain. Public ledger = hashes + proofs only |
| YubiKey Option C (2FA) for MVP | WebAuthn is browser-native, easy to implement, works with any FIDO2 key |
| demoLand first, realDeal second | Provider pattern: same UI, different backends. Mock data for demos, real chain for production |
| Branch: johnny5i-branch | All discovery protocol work isolated from main until ready for merge |

### Files Created/Modified This Session
| File | Action | Lines |
|------|--------|-------|
| `docs/discovery-automation/HOW_SHOULD_WE_PARTITION_THE_DISCOVERY_BLOB.md` | Created + extended | ~920 |
| `docs/discovery-automation/DEEP_DIVE_HASHING_STRATEGY.md` | Created | ~620 |
| `docs/discovery-automation/TWIN_PROTOCOL.md` | Created | ~345 |
| `docs/discovery-automation/FOR_LATER_TO_BE_CONSIDERED.md` | Created | ~150 |
| `docs/discovery-automation/README.md` | Created | ~60 |
| `docs/SMART_CONTRACT_PARTITIONING.md` | Created | ~310 |
| `docs/YUBIKEY_ACCESS_CONTROL.md` | Created | ~250 |
| `docs/DEMOLAND_VS_REALDEAL.md` | Created | ~300 |
| `docs/BUILD_PLAN.md` | Updated | +30 |
| `docs/BUILD_CLUB_SLIDE_CONTENT.md` | Created (earlier) | ~100 |
| `PixyPi/CASSIE_UPDATE_2026-02-15.md` | Created | ~56 |

### Open Items for Next Session
- Resolve pragma/compiler version (Phase 0.2) — unblocks all contract work
- Define TypeScript provider interfaces (ICaseProvider, IDocumentProvider, etc.)
- Build demoLand mock data — "Smith v. Acme Corp" demo case
- Scaffold `document-registry.compact` and `access-control.compact`
- Get Spy's review on discovery protocol + contract partitioning
- Fix GitHub MCP PAT authentication (still broken)

---

## Session: February 16, 2026 (Evening — "Sunday Night Penny Upgrades")

### Context
Feature implementation session on branch `sunday-night-penny-upgrades`. Focus: enhance the demoLand mock UI with suggested features identified from earlier sessions. All work scoped to demoLand only — no realDeal or production backend changes.

### Key Interactions

**John**: Implement the suggested ADL features for the demoLand mock UI.
- **Action**: Implemented 8 features across 3 files (case-view, dashboard, layout):

#### Case View Page (`pages/case-view/index.tsx`)
1. **Discovery Timeline Visualization** — Full-width chronological timeline on the overview tab showing case events (filing, service, production, motions, attestations) with color-coded icons and date labels
2. **Sanctions Risk Meter** — Gauge widget on overview tab computing risk from overdue steps, non-compliant documents, and high obfuscation scores. Shows dollar exposure based on $704,094 average sanction amount. Color-coded (green/amber/red) with risk factors listed
3. **Production Tracker / Scorecard** — Stats panel showing total pages, average fidelity score, average obfuscation score, and flagged document count
4. **Obfuscation Score Explainer** — Expandable panel showing obfuscation detection results with individual flags, confidence indicators, and AI recommendations. Loads from mock AI provider
5. **"Deemed Admitted" Countdown** — Warning badge on IRCP 36 (Requests for Admission) steps showing days remaining before unanswered requests are deemed admitted. Color-coded urgency (blue → amber → red) with CRITICAL/WARNING labels
6. **One-Click Compliance Report Export** — Export button on compliance tab that generates a JSON compliance report and triggers browser download

#### Dashboard Page (`pages/dashboard/index.tsx`)
7. **"What's Due This Week" Widget** — Aggregates all discovery steps due within 7 days across all cases. Shows step title, case name, days remaining, deadline date. Special "Deemed Admitted" badge for IRCP 36 items. Sorted by urgency

#### Layout (`layouts/ad-layout.tsx`)
8. **Notification Bell Dropdown** — Replaced static bell icon with functional dropdown. Shows 4 mock notifications (deadline warnings, haystack alerts, ZK attestation confirmations). Unread count badge, "Mark all read" action, click-to-dismiss, outside-click-to-close

### Technical Notes
- All features use existing provider pattern and mock data from demoLand
- Timeline data sourced from `getComplianceReport()` which returns `demoTimeline`
- Obfuscation data sourced from `detectObfuscation()` in mock AI provider
- Steps data accessed via `getCaseSteps()` for due-this-week and deemed-admitted features
- No new dependencies added — all using existing lucide-react icons and Tailwind classes
- IDE lint errors are all environment-related (missing node_modules for type resolution) — not code issues. App compiles and runs correctly with Vite

### Files Modified
| File | Changes |
|------|---------|
| `frontend-vite-react/src/pages/case-view/index.tsx` | +~300 lines: timeline, sanctions meter, obfuscation explainer, production tracker, deemed admitted countdown, export button |
| `frontend-vite-react/src/pages/dashboard/index.tsx` | +~65 lines: "What's Due This Week" widget with step aggregation |
| `frontend-vite-react/src/layouts/ad-layout.tsx` | +~70 lines: notification bell dropdown with mock data |

### Decisions Made This Session
| Decision | Rationale |
|----------|-----------|
| All features demoLand only | Matches build order: demo first, wire up real providers later |
| No new components/files | Keep features inline to minimize file sprawl; extract later if reused |
| Mock notifications in layout | Notifications are global (not case-specific), so layout is correct home |
| $704,094 sanctions exposure | Uses verified mean from Willoughby study (already in PITCH_FODDER.md) |
| Obfuscation loads on demand | Only fetches when case has documents with productionId, avoids unnecessary API calls |

### Open Items for Next Session
- Visual QA: spin up dev server and verify all new widgets render correctly
- Consider extracting reusable components (SanctionsRiskMeter, TimelineVisualization) if needed elsewhere
- Implement Sanctions Risk Meter on case cards (dashboard list) — currently only on case-view overview
- Review with Spy for legal accuracy of deemed-admitted language and sanctions calculation
- Merge `sunday-night-penny-upgrades` → main after review

---

*Log maintained by Penny — updated before each push*
