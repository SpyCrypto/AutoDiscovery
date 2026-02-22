// =============================================================================
// MidnightVitals — Toggle Button Component
// =============================================================================
// The 🩺 stethoscope button that lives in the app header.
// Clicking it opens/closes the vitals panel.
// Shows a red pulse badge when any vital is in critical state.
// =============================================================================

import { useState, useRef, useEffect } from 'react';
import { Stethoscope, ChevronDown, ArrowUp, ArrowLeft, ArrowRight } from 'lucide-react';
import { useVitals } from '../context';
import type { CardPosition } from '../types';


const POSITION_OPTIONS: { value: CardPosition; label: string; icon: typeof ArrowUp }[] = [
  { value: 'top',   label: 'Cards on Top',   icon: ArrowUp },
  { value: 'left',  label: 'Cards on Left',  icon: ArrowLeft },
  { value: 'right', label: 'Cards on Right', icon: ArrowRight },
];


export function VitalsToggleButton() {
  const { state, dispatch } = useVitals();
  const [showSettings, setShowSettings] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Check if any vital is critical — if so, show the alert badge
  const hasCritical = state.monitors.some((m) => m.status === 'critical');

  // Close settings menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <div className="flex items-center">
        {/* Main toggle button */}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_PANEL' })}
          className={`relative p-2 rounded-l-lg transition-colors ${
            state.isOpen
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
          }`}
          aria-label="Toggle MidnightVitals diagnostic panel"
          title="MidnightVitals — Diagnostic Console"
        >
          <Stethoscope className={`w-4 h-4 ${hasCritical ? 'animate-pulse' : ''}`} />

          {/* Critical alert badge */}
          {hasCritical && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 border border-zinc-900 animate-pulse" />
          )}

          {/* "Open" dot indicator when panel is active */}
          {state.isOpen && !hasCritical && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
          )}
        </button>

        {/* Settings chevron */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-r-lg transition-colors border-l border-border/30 ${
            showSettings
              ? 'bg-emerald-500/10 text-emerald-400'
              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
          }`}
          aria-label="Vitals settings"
          title="Card layout settings"
        >
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Settings dropdown */}
      {showSettings && (
        <div className="absolute right-0 top-full mt-1.5 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 py-2 min-w-[180px]">
          <div className="px-3 py-1.5 border-b border-zinc-800">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Card Layout
            </span>
          </div>
          {POSITION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                dispatch({ type: 'SET_CARD_POSITION', position: opt.value });
                setShowSettings(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-[11px] transition-colors ${
                state.cardPosition === opt.value
                  ? 'text-emerald-400 bg-emerald-500/10 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              <opt.icon className="w-3.5 h-3.5" />
              <span>{opt.label}</span>
              {state.cardPosition === opt.value && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
