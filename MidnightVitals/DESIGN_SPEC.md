# 🩺 MidnightVitals — UI/UX Design Specification

**Version**: 1.0  
**Last Updated**: Feb 22, 2026

---

## Design Philosophy

1. **Plain English, always.** Every message, label, and status must be understandable by someone who has never used a blockchain.
2. **Show, don't hide.** If something is happening, the user should see it. If something broke, the user should know exactly what and why.
3. **Medical vitals metaphor.** The entire UI is modeled after a hospital vitals monitor: continuous readings, color-coded status, alarms for problems.
4. **Dark mode native.** Designed for dark backgrounds, matching the AutoDiscovery.legal theme.

---

## Toggle Button (🩺)

**Location**: Header bar, between the notification bell and the theme toggle.

**Appearance**:
- Stethoscope icon (Lucide `Stethoscope` or custom SVG)
- 32x32px touch target with 8px padding
- Subtle pulse animation when any vital is in critical state
- Badge dot (red) when there are unresolved critical issues

**Behavior**:
- Click toggles the vitals panel open/closed
- Panel state persists in `localStorage` key `midnight-vitals-open`

---

## Panel Layout

The panel slides up from the bottom of the viewport. It has two sections:

```
┌══════════════════════ drag handle ══════════════════════┐
│                                                         │
│  ┌─── MONITOR BAR ──────────────────────────────────┐  │
│  │                                                   │  │
│  │  [Time Wheel]  [Time Wheel]  [Time Wheel]  [TW]  │  │
│  │  Proof Server  Network       Wallet       Contracts│  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─── CONSOLE LOG ──────────────────────────────────┐  │
│  │                                                   │  │
│  │  [Scrollable natural-language log entries]         │  │
│  │                                                   │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Panel Container

- **Position**: Fixed to bottom of viewport, full width of main content area (not including sidebar)
- **Default height**: 320px
- **Min height**: 200px
- **Max height**: 70vh
- **Background**: `bg-zinc-950/95 backdrop-blur-md`
- **Border**: `border-t border-zinc-800`
- **Animation**: Slide up 300ms ease-out on open, slide down 200ms ease-in on close
- **Resize**: Drag handle at top edge, cursor changes to `ns-resize`
- **Persistence**: Height stored in `localStorage` key `midnight-vitals-height`

### Drag Handle

- **Width**: 48px centered, 4px tall
- **Color**: `bg-zinc-600` with `hover:bg-zinc-400` transition
- **Position**: Top center of panel, with 8px top padding
- **Cursor**: `cursor-ns-resize`

---

## Monitor Bar (Top Section)

A horizontal row of 4 vital monitors, evenly spaced.

### Individual Time Wheel

Each monitor is a card containing:

```
┌──────────────────┐
│                  │
│     ╭─────╮     │
│    ╱  12s  ╲    │    ← Circular SVG arc + seconds counter
│   │         │   │
│    ╲       ╱    │
│     ╰─────╯     │
│                  │
│  Proof Server    │    ← Label
│  🟢 Healthy      │    ← Status with color dot
│  Response: 52ms  │    ← Detail line (latency, count, etc.)
│                  │
│     [↻ Check]    │    ← Manual refresh button
│                  │
└──────────────────┘
```

#### Circular Timer (SVG)

- **Diameter**: 64px
- **Stroke width**: 3px
- **Background track**: `stroke-zinc-800`
- **Progress arc**: Color matches vital status (emerald/amber/red/zinc)
- **Animation**: Arc depletes from 100% to 0% over the check interval, then refills on check
- **Center text**: Seconds until next check (e.g., "12s"), font-mono, 16px
- **Direction**: Clockwise depletion (like a countdown)

#### Status Dot

| Status | Color | Label |
|--------|-------|-------|
| Healthy | `bg-emerald-400` | "Healthy" |
| Warning | `bg-amber-400` | "Slow" or "Degraded" |
| Critical | `bg-red-400` | "Unreachable" or "Down" |
| Unknown | `bg-zinc-500` | "Checking..." |

#### Card Styling

- **Background**: `bg-zinc-900/80`
- **Border**: `border border-zinc-800`
- **Rounded**: `rounded-xl`
- **Padding**: `p-3`
- **Width**: Flex, equal distribution
- **Hover**: Subtle `bg-zinc-800/80` on hover

#### Refresh Button

- **Icon**: `RotateCw` from Lucide (small, 14px)
- **Text**: "Check" next to icon
- **Size**: Small button, `text-xs`
- **Color**: `text-zinc-400 hover:text-white`
- **Behavior**: Triggers immediate health check, resets timer, shows brief spin animation on icon

---

## Console Log (Bottom Section)

A scrollable list of natural-language log entries.

### Container

- **Flex**: Takes remaining space below monitor bar
- **Overflow**: `overflow-y-auto` with custom scrollbar
- **Padding**: `px-4 py-2`
- **Font**: `font-mono text-sm` for timestamps, `font-sans text-sm` for messages

### Log Entry

Each entry renders as:

```
[11:03:22]  You clicked "Create New Case."
            We're now asking the Midnight blockchain to register a new
            case in the discovery-core contract.
```

#### Structure

```html
<div class="log-entry">
  <span class="timestamp">[HH:MM:SS]</span>
  <div class="content">
    <p class="message">Primary message text</p>
    <p class="detail">Optional detail paragraph</p>
    <p class="suggestion">Optional "What to do" text</p>
  </div>
</div>
```

#### Level Colors

| Level | Timestamp Color | Message Color | Left Border |
|-------|----------------|---------------|-------------|
| action | `text-blue-400` | `text-blue-300` | `border-l-2 border-blue-500` |
| info | `text-zinc-500` | `text-zinc-300` | `border-l-2 border-zinc-600` |
| success | `text-emerald-400` | `text-emerald-300` | `border-l-2 border-emerald-500` |
| warning | `text-amber-400` | `text-amber-300` | `border-l-2 border-amber-500` |
| error | `text-red-400` | `text-red-300` | `border-l-2 border-red-500` |

#### Error Entry (Expanded)

Error entries get extra visual treatment:

```
[11:04:38]  Something went wrong.
            The compliance-proof contract rejected this request.
            Reason: "Only the case owner can generate attestations."

            What this means: You're trying to certify compliance for a
            case that was created by a different wallet. You need to be
            logged in with the same wallet that originally created this case.

            What to do: Check which wallet you're connected with, then
            switch to the one that owns this case and try again.
```

- Error entries have a `bg-red-500/5` background
- "What this means" section has slightly dimmer text
- "What to do" section has a subtle icon (Lucide `ArrowRight` or `Lightbulb`)

### Auto-Scroll

- Console auto-scrolls to the newest entry when new entries arrive
- If the user has manually scrolled up, auto-scroll pauses
- A "Jump to latest" button appears at the bottom when auto-scroll is paused
- Clicking "Jump to latest" re-enables auto-scroll

### Console Controls

A thin bar above the console with:
- **Clear** button — clears all log entries
- **Filter** dropdown — All / Actions / Errors / Warnings
- **Entry count** — "47 entries" text label
- **Export** button — Copy all logs to clipboard as text

---

## Responsive Behavior

- **Desktop (>1024px)**: Full panel with 4 time wheels in a row
- **Tablet (768-1024px)**: 2x2 grid for time wheels
- **Mobile (<768px)**: Stacked time wheels, panel takes full width

---

## Animations

| Element | Animation | Duration | Easing |
|---------|-----------|----------|--------|
| Panel open | Slide up from bottom | 300ms | ease-out |
| Panel close | Slide down | 200ms | ease-in |
| Time wheel progress | Continuous depletion | {interval}s | linear |
| Time wheel reset | Quick fill + flash | 300ms | ease-out |
| Status change | Color crossfade | 200ms | ease |
| New log entry | Fade in + slide up | 200ms | ease-out |
| Refresh button spin | 360° rotation | 600ms | ease-in-out |
| Critical pulse | Scale 1→1.05→1 | 1.5s | ease-in-out (infinite) |

---

## Accessibility

- All interactive elements have `aria-label` attributes
- Time wheels have `role="timer"` and `aria-valuenow` / `aria-valuemax`
- Status colors are paired with text labels (not color-only)
- Panel can be toggled with keyboard (Enter/Space on toggle button)
- Console log entries are `role="log"` with `aria-live="polite"`
- Drag handle is keyboard-accessible (arrow keys to resize)

---

## Sound (Future — Opt-In)

- Subtle chime on critical status change (proof server goes down)
- Click sound on manual refresh
- Success tone on diagnostic report completion
- All sounds disabled by default, toggleable in settings
