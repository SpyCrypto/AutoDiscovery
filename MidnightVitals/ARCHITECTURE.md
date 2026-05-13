# 🩺 MidnightVitals — Architecture

**Version**: 0.1.0  
**Last Updated**: Feb 22, 2026

---

## Overview

MidnightVitals is a pluggable diagnostic module for Midnight blockchain DApps. It has two main responsibilities:

1. **Health Monitoring** — Continuously check the status of every component in the Midnight stack
2. **Activity Logging** — Record and explain every user action and blockchain interaction in plain English

The module is designed to be **mode-agnostic**: it works with mock data for demos and real data for production, with identical UI and behavior.

---

## Module Structure

```
src/vitals/
├── components/
│   ├── VitalsPanel.tsx           # Main slide-up panel (resizable container)
│   ├── VitalsMonitorBar.tsx      # Top bar: status indicators + time wheels
│   ├── VitalsTimeWheel.tsx       # Individual circular countdown timer
│   ├── VitalsConsole.tsx         # Scrollable natural-language activity log
│   └── VitalsToggleButton.tsx    # The 🩺 stethoscope button
├── hooks/
│   ├── useVitalsLogger.ts        # Hook to push log entries from anywhere
│   └── useVitalsMonitors.ts      # Hook for monitor state management
├── context/
│   └── VitalsContext.tsx          # React context for global vitals state
├── providers/
│   ├── mock-vitals-provider.ts   # Simulated health checks for demoLand
│   └── live-vitals-provider.ts   # Real HTTP pings for realDeal (future)
├── types.ts                      # TypeScript interfaces and types
├── messages.ts                   # Natural-language message templates
└── index.ts                      # Barrel exports
```

---

## Core Concepts

### 1. Vitals Monitor

A "vital" is a single health metric. Each vital has:

```typescript
interface VitalMonitor {
  id: string;                        // e.g., "proof-server"
  label: string;                     // e.g., "Proof Server"
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  lastCheckTimestamp: number;         // Unix ms of last successful check
  lastResponseTimeMs: number | null;  // Latency of last check
  message: string;                   // Human-readable status explanation
  checkIntervalSeconds: number;       // How often to auto-check
}
```

### 2. Console Log Entry

Every event in the app produces a log entry:

```typescript
interface VitalsLogEntry {
  id: string;                        // Unique ID
  timestamp: number;                 // Unix ms
  level: 'action' | 'info' | 'success' | 'warning' | 'error';
  message: string;                   // Primary natural-language message
  detail?: string;                   // Optional explanation paragraph
  suggestion?: string;               // Optional "what to do" guidance
}
```

### 3. Vitals Provider Interface

Both mock and live providers implement the same interface:

```typescript
interface VitalsProvider {
  checkProofServer(): Promise<VitalCheckResult>;
  checkNetworkIndexer(): Promise<VitalCheckResult>;
  checkWalletConnection(): Promise<VitalCheckResult>;
  checkContractStatus(contractId: string): Promise<VitalCheckResult>;
  checkDependencies(): Promise<DependencyCheckResult[]>;
  runFullDiagnostic(): Promise<DiagnosticReport>;
}
```

---

## Data Flow

```
User Action (clicks button, navigates, etc.)
    │
    ▼
useVitalsLogger().log('action', 'You clicked Create New Case.')
    │
    ▼
VitalsContext (global state)
    │
    ├──► VitalsConsole (renders log entry in scrollable list)
    │
    └──► VitalsMonitorBar (updates if action triggers a health check)
```

```
Timer (every 20 seconds)
    │
    ▼
VitalsProvider.checkProofServer()
    │
    ├── Mock: Returns simulated healthy/unhealthy with fake latency
    │
    └── Live: HTTP GET http://localhost:6300/version
                │
                ├── 200 OK → { status: 'healthy', responseTime: 52 }
                │
                └── Timeout/Error → { status: 'critical', message: '...' }
    │
    ▼
VitalsContext updates monitor state
    │
    ▼
VitalsTimeWheel resets countdown, shows new status color
```

---

## UI Layout

The VitalsPanel is a bottom-anchored, resizable overlay:

```
┌──────────────────────────────────────────────────────────┐
│  YOUR APP CONTENT (Dashboard, Cases, Documents, etc.)    │
│                                                          │
│                                                          │
│                                                          │
├═══════════════ drag handle to resize ════════════════════╡
│  🩺 MONITOR BAR                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ ◯ 12s    │ │ ◯  8s    │ │ ◯ --     │ │ ◯ 15s    │   │
│  │ Proof    │ │ Network  │ │ Wallet   │ │ Contracts│   │
│  │ Server   │ │ Indexer  │ │          │ │          │   │
│  │ 🟢 52ms  │ │ 🟢 34ms  │ │ 🟡 none  │ │ 🟢 6/6   │   │
│  │ [↻]      │ │ [↻]      │ │ [↻]      │ │ [↻]      │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
├──────────────────────────────────────────────────────────┤
│  CONSOLE LOG                                             │
│                                                          │
│  [11:03:22] You clicked "Create New Case."               │
│             We're now asking the Midnight blockchain to   │
│             register a new case in the discovery-core     │
│             contract.                                     │
│                                                          │
│  [11:03:24] Building a zero-knowledge proof on your      │
│             machine. This is the step where your private  │
│             case details stay local — only the proof that │
│             you did it correctly gets sent to the network.│
│             This usually takes 15-30 seconds. Hang tight. │
│                                                          │
│  [11:03:47] Proof built successfully. Took 23 seconds.   │
│             Now sending it to the Midnight preprod network│
│             for confirmation.                             │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Time Wheel

Each monitor has a circular progress indicator (SVG arc) that:
- Fills from 0% to 100% over the check interval (e.g., 20 seconds)
- Shows seconds remaining until next auto-check in the center
- Color matches the vital's status (green/yellow/red/gray)
- Has a manual refresh button [↻] that triggers an immediate check and resets the timer

### Resizable Panel

- The panel has a drag handle at the top edge
- Users can drag to resize (taller shows more log history, shorter saves screen space)
- Minimum height: ~200px (monitor bar + 3 log lines)
- Maximum height: 70% of viewport
- Panel state (open/closed, height) persists in localStorage

---

## Color Coding

| Status | Color | Tailwind Class | Meaning |
|--------|-------|---------------|---------|
| Healthy | Green | `text-emerald-400` | Component is running and responsive |
| Warning | Amber | `text-amber-400` | Component is running but slow or degraded |
| Critical | Red | `text-red-400` | Component is down or unreachable |
| Unknown | Gray | `text-zinc-500` | Haven't checked yet or check is in progress |

---

## Mock vs Live Provider

### Mock Provider (demoLand)

The mock provider simulates realistic behavior:
- Proof server: Always healthy, random latency 30-80ms
- Network: Always healthy, random latency 20-60ms
- Wallet: Reflects the demo login state
- Contracts: All 6 show as "deployed" with mock addresses
- Dependencies: All show as installed
- Occasionally injects a warning or error for demo purposes

### Live Provider (realDeal — future)

The live provider makes real HTTP requests:
- Proof server: `GET http://localhost:6300/version`
- Network indexer: `GET {INDEXER_URL}/api/` or GraphQL query
- Wallet: Checks Midnight wallet extension state
- Contracts: Queries indexer for contract state by address
- Dependencies: Exec commands via backend API

---

## Integration Points

MidnightVitals hooks into the DApp at these points:

1. **App.tsx** — `<VitalsProvider>` wraps the app
2. **Layout** — `<VitalsToggleButton>` in the header, `<VitalsPanel>` at bottom
3. **Every user action** — Components call `useVitalsLogger().log()` to record events
4. **Provider layer** — When providers make contract calls, they log through vitals

---

## Future: Standalone Package

When extracted to its own npm package, the architecture becomes:

```
@midnight-vitals/core          — Types, context, hooks, base components
@midnight-vitals/react         — React component library
@midnight-vitals/providers     — Mock + live provider implementations
@midnight-vitals/adl-adapter   — AutoDiscovery.legal specific adapters
```

Other Midnight DApp developers would install `@midnight-vitals/core` and `@midnight-vitals/react`, then implement their own adapters for their specific contracts.
