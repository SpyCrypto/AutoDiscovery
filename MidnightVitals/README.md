# 🩺 MidnightVitals — AutoDiscovery.legal Integration

**The working, integrated version of MidnightVitals inside the AutoDiscovery.legal DApp.**

---

## What Is This Folder?

This is the **documentation and roadmap** for the MidnightVitals module as it lives inside AutoDiscovery.legal. The actual source code is at `frontend-vite-react/src/vitals/`.

There are **two MidnightVitals repos** — here's how they relate:

| Repo | Purpose | Contains |
|------|---------|----------|
| **This folder** (`AutoDiscovery/MidnightVitals/`) | Integrated version — embedded in ADL for demoLand and realDeal | Docs, roadmap, integration notes |
| **[bytewizard42i/MidnightVitals](https://github.com/bytewizard42i/MidnightVitals)** | Future standalone package — for any Midnight DApp admin to install | Docs, architecture, will eventually hold extracted source |

### Key Principle: Non-Interference

MidnightVitals is integrated into AutoDiscovery.legal but **must never interfere** with demoLand or realDeal operation. It's designed to be completely shut off:

- **Remove `<VitalsProvider>`** from the app wrapper → the entire module disappears (no hooks fire, no health checks run, no UI renders)
- **Remove `<VitalsPanel />`** → no panel, but hooks still work silently (useful for headless logging)
- **Remove `<VitalsToggleButton />`** → no toggle in header, but panel can still be opened programmatically
- **Remove all `useVitalsInteraction()` calls** → no hover/click tracking, but everything else keeps working
- **Comment out the `<VitalsNavigationLogger />`** → no route-change logging

Each piece is independently removable. If MidnightVitals ever causes any issue — performance, layout, console noise — any layer can be disabled without touching the rest of the ADL codebase.

---

## What It Does

MidnightVitals is a real-time CLI diagnostic console that monitors your wallet, proof server, smart contracts, and network connection with timed health pings — while logging every physical interaction on your UI (hovers, clicks, and their outputs) in a human-readable console. Built to help debug and verify the DApp while being assured all dependencies are running and configured correctly.

### Feature Summary

- **Health monitoring** — Proof server, network indexer, wallet, smart contracts pinged on 20–30s intervals with animated SVG countdown timers
- **Natural-language console** — every action, health check, and blockchain interaction logged in plain English
- **Interaction tracking** — debounced hover + immediate click logging via `useVitalsInteraction()`
- **Moveable panel** — dock at the bottom or float anywhere on screen, resizable in both modes
- **Card layout options** — cards on top, left, or right of the console
- **Mock & Live modes** — simulated data for demoLand, real HTTP pings for realDeal (same UI)
- **Full localStorage persistence** — panel state, position, size, mode, card layout all survive reloads

---

## Source Location

```
frontend-vite-react/src/vitals/
├── components/
│   ├── VitalsPanel.tsx              # Docked + floating panel with drag-to-move/resize
│   ├── VitalsMonitorBar.tsx         # 4 vital monitors (horizontal or vertical layout)
│   ├── VitalsTimeWheel.tsx          # SVG countdown ring (inline pill or stacked card)
│   ├── VitalsConsole.tsx            # Scrollable CLI log (newest on top, filterable)
│   ├── VitalsToggleButton.tsx       # 🩺 button + settings dropdown (card layout + panel mode)
│   └── VitalsNavigationLogger.tsx   # Auto-logs route changes
├── context.tsx                      # React context, reducer, provider wrapper
├── mock-vitals-provider.ts          # Simulated health checks for demo mode
├── useVitalsInteraction.ts          # Hover/click tracking hook
├── types.ts                         # All TypeScript interfaces
├── messages.ts                      # Natural-language message templates
└── index.ts                         # Barrel exports
```

---

## How to Disable

### Full removal (no trace)
Remove `<VitalsProvider>` from the app wrapper in `ad-layout.tsx`. Everything stops — no health checks, no logging, no UI.

### Panel only (keep logging for debugging)
Remove `<VitalsPanel />` and `<VitalsToggleButton />`. Hooks like `useVitalsLogger()` still work — entries go into context state but nothing renders. Useful for headless log capture.

### Interaction tracking only
Remove all `useVitalsInteraction()` imports and calls across pages. Health monitoring and console logging keep working normally.

---

## Current Version

**v0.3.8** — Fully integrated with:
- All demoLand pages wired for interaction tracking (layout, dashboard, login, search, compliance, settings, case-contacts)
- Floating panel mode with drag-to-move and corner resize
- Card layout settings (top/left/right) via settings dropdown
- Mock provider for simulated health checks

---

## Roadmap

See [FEATURE_ROADMAP.md](./FEATURE_ROADMAP.md) for the full plan.

---

## Standalone Package

The standalone repo at [bytewizard42i/MidnightVitals](https://github.com/bytewizard42i/MidnightVitals) is where this module will eventually be extracted as an npm package for other Midnight DApp developers. That work is tracked in Phase 2 of the roadmap.

---

Built by John (SpyCrypto) with Penny 🎀 as part of the AutoDiscovery.legal ecosystem.
