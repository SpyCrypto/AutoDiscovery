# Discovery Automation — Protocol Design

> **Branch**: `johnny5i-branch`
> **Started**: February 15, 2026
> **Authors**: John + Cassie

---

## Document Index

| File | Purpose | Lines |
|------|---------|-------|
| [`HOW_SHOULD_WE_PARTITION_THE_DISCOVERY_BLOB.md`](./HOW_SHOULD_WE_PARTITION_THE_DISCOVERY_BLOB.md) | **Master protocol design** — 9-step framework covering 24 universal categories, party attribution, origination, chain-of-custody, memorandums, data dump obfuscation, court transcripts, judge instructions, jury materials, and communications enrichment | ~920 |
| [`DEEP_DIVE_HASHING_STRATEGY.md`](./DEEP_DIVE_HASHING_STRATEGY.md) | **5-level Merkle tree hashing** — page-level through case-root, compound documents, redaction/format/supplement versioning, audio/video segments, on-chain efficiency | ~620 |
| [`TWIN_PROTOCOL.md`](./TWIN_PROTOCOL.md) | **Image + digital pairing** — bond hashing, fidelity scoring, visual feature detection, production rules for digitized physical documents | ~345 |
| [`FOR_LATER_TO_BE_CONSIDERED.md`](./FOR_LATER_TO_BE_CONSIDERED.md) | **Parking lot** — 15 future ideas (privilege logs, redaction tracking, deadline cascades, ESI format disputes, proportionality, insurance integration, etc.) | ~150 |

## How These Documents Relate

```
MASTER PROTOCOL (Partition the Blob)
├── Step 1: Categories (24 types)
│   └── Communications Enrichment → AI metadata extraction
├── Step 2: Party Attribution
│   └── 3P expanded: Witnesses, LEO, Jury, Other
├── Step 3: Origination
│   └── DEEP DIVE: Hashing Strategy (5-level Merkle tree)
│   └── TWIN PROTOCOL (image + digital pairing)
├── Step 4: Chain of Custody
├── Step 5: Memorandum System
├── Step 6: Data Dump Obfuscation
├── Step 7: Court Transcripts (daily audit)
├── Step 8: Judge Instructions
├── Step 9: Jury Materials
│
└── Open Questions (8, 2 resolved)

FOR LATER (15 items for future phases)
```

## Related Architecture Documents (in parent docs/ folder)

| File | Purpose |
|------|---------|
| [`../SMART_CONTRACT_PARTITIONING.md`](../SMART_CONTRACT_PARTITIONING.md) | How the protocol maps to Midnight smart contracts — what's on-chain, off-chain, private, public |
| [`../DEMOLAND_VS_REALDEAL.md`](../DEMOLAND_VS_REALDEAL.md) | Architecture split: mock demo UI vs. production system |
| [`../YUBIKEY_ACCESS_CONTROL.md`](../YUBIKEY_ACCESS_CONTROL.md) | Hardware key integration for access control |
| [`../BUILD_PLAN.md`](../BUILD_PLAN.md) | Full build plan with phases and dependencies |

---

*This folder contains protocol design documents only — no code. Implementation lives in `autodiscovery-contract/` and `frontend-vite-react/`.*
