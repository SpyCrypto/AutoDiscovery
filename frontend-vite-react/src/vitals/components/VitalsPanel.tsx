// =============================================================================
// MidnightVitals — Main Panel Component
// =============================================================================
// The slide-up panel that contains the monitor bar and console log.
// Resizable via a drag handle at the top. Anchored to the bottom of the
// main content area.
// =============================================================================

import { useRef, useCallback, useEffect } from 'react';
import { Activity, Stethoscope } from 'lucide-react';
import { useVitals } from '../context';
import { VitalsMonitorBar } from './VitalsMonitorBar';
import { VitalsConsole } from './VitalsConsole';


// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MIN_PANEL_HEIGHT = 200;
const MAX_PANEL_HEIGHT_RATIO = 0.7; // 70% of viewport


// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function VitalsPanel() {
  const { state, dispatch, runDiagnostic } = useVitals();
  const panelRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  // -----------------------------------------------------------------------
  // Drag-to-resize logic
  // -----------------------------------------------------------------------

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = state.panelHeight;
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';
  }, [state.panelHeight]);

  useEffect(() => {
    const handleDragMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;

      // Dragging UP increases height (startY was lower on screen)
      const deltaY = startYRef.current - e.clientY;
      const maxHeight = window.innerHeight * MAX_PANEL_HEIGHT_RATIO;
      const newHeight = Math.min(maxHeight, Math.max(MIN_PANEL_HEIGHT, startHeightRef.current + deltaY));

      dispatch({ type: 'SET_PANEL_HEIGHT', height: newHeight });
    };

    const handleDragEnd = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [dispatch]);

  // -----------------------------------------------------------------------
  // Don't render if panel is closed
  // -----------------------------------------------------------------------

  if (!state.isOpen) return null;

  // Count critical vitals for the header badge
  const criticalCount = state.monitors.filter((m) => m.status === 'critical').length;

  return (
    <div
      ref={panelRef}
      className="fixed bottom-0 left-[68px] right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 flex flex-col shadow-2xl shadow-black/40"
      style={{ height: `${state.panelHeight}px` }}
    >
      {/* Drag handle */}
      <div
        onMouseDown={handleDragStart}
        className="flex items-center justify-center py-1.5 cursor-ns-resize group shrink-0"
      >
        <div className="w-12 h-1 rounded-full bg-zinc-700 group-hover:bg-zinc-500 transition-colors" />
      </div>

      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-1 border-b border-zinc-800/60 shrink-0">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            MidnightVitals
          </span>
          {criticalCount > 0 && (
            <span className="text-[9px] font-bold text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full">
              {criticalCount} critical
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Run Diagnostics button */}
          <button
            onClick={runDiagnostic}
            disabled={state.isRunningDiagnostic}
            className={`flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1 rounded-lg transition-colors ${
              state.isRunningDiagnostic
                ? 'text-zinc-500 bg-zinc-800 cursor-wait'
                : 'text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20'
            }`}
          >
            <Activity className={`w-3 h-3 ${state.isRunningDiagnostic ? 'animate-pulse' : ''}`} />
            {state.isRunningDiagnostic ? 'Running...' : 'Run Diagnostics'}
          </button>

          {/* Close panel button */}
          <button
            onClick={() => dispatch({ type: 'TOGGLE_PANEL' })}
            className="text-[10px] text-zinc-500 hover:text-zinc-200 transition-colors px-2 py-1 rounded hover:bg-zinc-700/50"
          >
            Close
          </button>
        </div>
      </div>

      {/* Combined content area: floating cards + wrapping CLI output */}
      <div className="flex-1 min-h-0 relative">
        <VitalsConsole
          floatingHeader={<VitalsMonitorBar />}
        />
      </div>
    </div>
  );
}
