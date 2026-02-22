# 🩺 MidnightVitals — Feature Roadmap

**Version**: 1.0  
**Last Updated**: Feb 22, 2026

---

## Phase 1: Mock Mode for DemoLand (Current Sprint)

The foundation. Everything works with simulated data so we can nail the UI and UX before touching real infrastructure.

### v0.1.0 — Core Panel ✅

- [x] Design documentation and architecture
- [x] Stethoscope toggle button (🩺) in header bar
- [x] Slide-up panel with drag-to-resize handle
- [x] Panel open/closed state persists in localStorage
- [x] Panel height persists in localStorage

### v0.2.0 — Monitor Bar ✅

- [x] Proof Server vital with time wheel
- [x] Network Indexer vital with time wheel
- [x] Wallet Connection vital with time wheel
- [x] Smart Contracts vital with time wheel
- [x] Each wheel shows seconds since last check (circular SVG arc)
- [x] Each wheel has a manual refresh [↻] button
- [x] Status colors: green (healthy), amber (warning), red (critical), gray (unknown)
- [x] Mock provider returns simulated healthy/warning/error states

### v0.3.0 — Console Log ✅

- [x] Scrollable log area with newest entries on top
- [x] Timestamped entries with natural-language messages
- [x] Log levels: action (blue), info (white), success (green), warning (amber), error (red)
- [x] Error entries include "What this means" and "What to do" sections
- [x] `useVitalsLogger()` hook for any component to push log entries
- [x] Granular real-time logging for every UI interaction across all pages
- [x] `VitalsNavigationLogger` component auto-logs route changes

### v0.3.5 — Card Layout Settings ✅

- [x] Settings dropdown on stethoscope button (chevron menu)
- [x] User can choose diagnostic card position: **Top**, **Left**, or **Right**
- [x] **Top**: Slim horizontal pill strip above CLI (default, most space-efficient)
- [x] **Left**: Vertical card column on the left, CLI fills the right
- [x] **Right**: Vertical card column on the right, CLI fills the left
- [x] Card position preference persists in localStorage
- [x] Cards adapt layout (inline pills for top, compact stacked cards for sidebar)
- [x] Smooth transitions between layouts

### v0.4.0 — Self-Diagnostic Report

- [ ] "Run Diagnostics" button that checks everything in sequence
- [ ] Full health report with pass/fail for each component
- [ ] Natural-language summary: "10 out of 12 vitals are healthy"
- [ ] Dependency checks: Docker, Node.js, Compact compiler, npm packages
- [ ] Environment checks: .env variables set, contract addresses present

---

## Phase 2: Live Mode for RealDeal

Connect to real infrastructure. Same UI, real data.

### v0.5.0 — Real Health Checks

- [ ] HTTP GET `http://localhost:6300/version` for proof server ping
- [ ] HTTP GET to indexer URL for network connectivity
- [ ] Wallet extension detection (Midnight-compatible wallets)
- [ ] GraphQL query to indexer for contract state reads
- [ ] Response time measurement (latency display)

### v0.6.0 — Real Activity Logging

- [ ] Hook into realDeal provider layer for contract call logging
- [ ] ZK proof generation timing (start → complete)
- [ ] Transaction submission and confirmation tracking
- [ ] Error translation: map Midnight error codes to natural language
- [ ] Contract-specific event descriptions (case created, document anchored, etc.)

### v0.7.0 — Real Dependency Checks

- [ ] Backend API endpoint to run `docker --version`, `node --version`, etc.
- [ ] npm dependency tree verification
- [ ] .env completeness check (all required vars present)
- [ ] Version compatibility matrix (compiler vs SDK vs proof server)

---

## Phase 3: Standalone Package

Extract from AutoDiscovery.legal into a reusable npm package.

### v1.0.0 — Public Release

- [ ] Extract core types and components to `@midnight-vitals/core`
- [ ] Extract React components to `@midnight-vitals/react`
- [ ] Publish to npm
- [ ] Create starter template / example integration
- [ ] Write integration guide for counter and bboard examples
- [ ] Announce on Midnight Discord and community channels

### v1.1.0 — Plugin System

- [ ] Plugin interface for custom health checks
- [ ] Plugin interface for custom log entry types
- [ ] ADL adapter as reference plugin implementation
- [ ] Documentation for plugin developers

---

## Phase 4: Pro Features (Post-Mainnet)

### v2.0.0 — Pro Dashboard

- [ ] Persistent health history (last 24h, 7d, 30d)
- [ ] Uptime percentage tracking per component
- [ ] Alert rules (e.g., "notify if proof server down > 5 minutes")
- [ ] Email/Slack/webhook notifications
- [ ] Transaction cost tracking (tDUST/DUST usage)
- [ ] Proof generation benchmarking (average time, P95, P99)

### v2.1.0 — Team Features

- [ ] Shared diagnostic sessions (multiple users see same console)
- [ ] Role-based access (admin vs viewer)
- [ ] Diagnostic session recording and playback
- [ ] Export diagnostic report as PDF

### v2.2.0 — Analytics

- [ ] Contract interaction heatmaps (which circuits called most)
- [ ] Gas/cost optimization suggestions
- [ ] Performance trending (is proof generation getting slower?)
- [ ] Network health comparison (preprod vs mainnet)

---

## Phase 5: Enterprise

### v3.0.0 — Enterprise Monitoring

- [ ] 24/7 automated monitoring with SLA
- [ ] Integration with Datadog, Grafana, PagerDuty
- [ ] Custom alerting rules with escalation policies
- [ ] Compliance audit trail (all checks logged with timestamps)
- [ ] White-label option
- [ ] Multi-tenant dashboard (monitor multiple DApps)
- [ ] On-prem deployment option

---

## Ideas Backlog (Unscheduled)

These are ideas that might be valuable but haven't been prioritized yet:

- **Contract state diff viewer** — Show what changed in contract state after a transaction
- **Proof size analyzer** — Visualize ZK proof sizes and optimization opportunities
- **Network mempool viewer** — See pending transactions before confirmation
- **Contract upgrade tracker** — Monitor when contracts are redeployed
- **Community health dashboard** — Aggregate anonymized health data from all MidnightVitals users (opt-in)
- **AI-powered error diagnosis** — Feed error logs to an LLM for natural-language debugging suggestions
- **Mobile companion app** — Get health alerts on your phone
- **Browser extension** — Quick vitals check without opening the DApp
- **Contract interaction simulator** — "Dry run" a transaction before submitting
- **Midnight network status page** — Public status page showing preprod/mainnet health
