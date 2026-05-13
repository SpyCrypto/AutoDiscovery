// =============================================================================
// MidnightVitals — Main Panel Component
// =============================================================================
// The diagnostic panel that contains the monitor bar and console log.
// Supports two modes:
//   • Docked  — fixed to the bottom of the viewport, resizable vertically
//   • Floating — free-positioned window the user can drag anywhere on screen,
//                resizable in both dimensions
// Mode, position, and size all persist to localStorage.
// =============================================================================

import { useRef, useCallback, useEffect } from 'react';
import { Activity, Stethoscope, Move, PanelBottom } from 'lucide-react';
import { useVitals } from '../context';
import { VitalsMonitorBar } from './VitalsMonitorBar';
import { VitalsConsole } from './VitalsConsole';


// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MIN_PANEL_HEIGHT = 200;
const MIN_PANEL_WIDTH = 420;
const MAX_PANEL_HEIGHT_RATIO = 0.7; // 70% of viewport
const FLOATING_EDGE_PADDING = 16;   // Keep panel at least this far from screen edges


// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function VitalsPanel() {
  const { state, dispatch, runDiagnostic } = useVitals();
  const panelRef = useRef<HTMLDivElement>(null);

  // --- Resize (vertical for docked, corner for floating) ---
  const isResizingRef = useRef(false);
  const resizeStartRef = useRef({ x: 0, y: 0 });
  const resizeStartSizeRef = useRef({ w: 0, h: 0 });

  // --- Drag-to-move (floating mode only) ---
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, panelX: 0, panelY: 0 });

  const isFloating = state.panelMode === 'floating';

  // -----------------------------------------------------------------------
  // Drag-to-resize (docked mode: vertical only)
  // -----------------------------------------------------------------------

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    resizeStartRef.current = { x: e.clientX, y: e.clientY };
    resizeStartSizeRef.current = { w: state.panelWidth, h: state.panelHeight };
    document.body.style.cursor = isFloating ? 'nwse-resize' : 'ns-resize';
    document.body.style.userSelect = 'none';
  }, [state.panelHeight, state.panelWidth, isFloating]);

  // -----------------------------------------------------------------------
  // Drag-to-move (floating mode title bar)
  // -----------------------------------------------------------------------

  const handleMoveStart = useCallback((e: React.MouseEvent) => {
    if (!isFloating) return;
    e.preventDefault();
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      panelX: state.panelPosition.x,
      panelY: state.panelPosition.y,
    };
    document.body.style.cursor = 'grabbing';
    document.body.style.userSelect = 'none';
  }, [isFloating, state.panelPosition]);

  // -----------------------------------------------------------------------
  // Global mousemove / mouseup handlers
  // -----------------------------------------------------------------------

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // --- Resize ---
      if (isResizingRef.current) {
        if (isFloating) {
          // Floating mode: resize both width and height from bottom-right corner
          const deltaX = e.clientX - resizeStartRef.current.x;
          const deltaY = e.clientY - resizeStartRef.current.y;
          const maxH = window.innerHeight * MAX_PANEL_HEIGHT_RATIO;
          const maxW = window.innerWidth - state.panelPosition.x - FLOATING_EDGE_PADDING;
          const newW = Math.min(maxW, Math.max(MIN_PANEL_WIDTH, resizeStartSizeRef.current.w + deltaX));
          const newH = Math.min(maxH, Math.max(MIN_PANEL_HEIGHT, resizeStartSizeRef.current.h + deltaY));
          dispatch({ type: 'SET_PANEL_WIDTH', width: newW });
          dispatch({ type: 'SET_PANEL_HEIGHT', height: newH });
        } else {
          // Docked mode: resize height only (drag up to grow)
          const deltaY = resizeStartRef.current.y - e.clientY;
          const maxHeight = window.innerHeight * MAX_PANEL_HEIGHT_RATIO;
          const newHeight = Math.min(maxHeight, Math.max(MIN_PANEL_HEIGHT, resizeStartSizeRef.current.h + deltaY));
          dispatch({ type: 'SET_PANEL_HEIGHT', height: newHeight });
        }
      }

      // --- Move ---
      if (isDraggingRef.current) {
        const deltaX = e.clientX - dragStartRef.current.mouseX;
        const deltaY = e.clientY - dragStartRef.current.mouseY;
        // Clamp position so panel stays on-screen
        const newX = Math.max(
          FLOATING_EDGE_PADDING,
          Math.min(window.innerWidth - MIN_PANEL_WIDTH, dragStartRef.current.panelX + deltaX),
        );
        const newY = Math.max(
          FLOATING_EDGE_PADDING,
          Math.min(window.innerHeight - MIN_PANEL_HEIGHT, dragStartRef.current.panelY + deltaY),
        );
        dispatch({ type: 'SET_PANEL_POSITION', x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      if (isResizingRef.current || isDraggingRef.current) {
        isResizingRef.current = false;
        isDraggingRef.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dispatch, isFloating, state.panelPosition]);

  // -----------------------------------------------------------------------
  // Toggle between docked and floating
  // -----------------------------------------------------------------------

  const toggleMode = useCallback(() => {
    if (isFloating) {
      dispatch({ type: 'SET_PANEL_MODE', mode: 'docked' });
    } else {
      // When switching to floating, center the panel nicely
      const x = Math.max(FLOATING_EDGE_PADDING, Math.round((window.innerWidth - state.panelWidth) / 2));
      const y = Math.max(FLOATING_EDGE_PADDING, Math.round((window.innerHeight - state.panelHeight) / 2));
      dispatch({ type: 'SET_PANEL_POSITION', x, y });
      dispatch({ type: 'SET_PANEL_MODE', mode: 'floating' });
    }
  }, [isFloating, dispatch, state.panelWidth, state.panelHeight]);

  // -----------------------------------------------------------------------
  // Don't render if panel is closed
  // -----------------------------------------------------------------------

  if (!state.isOpen) return null;

  // Count critical vitals for the header badge
  const criticalCount = state.monitors.filter((m) => m.status === 'critical').length;

  // -----------------------------------------------------------------------
  // Shared content: header + body (used in both modes)
  // -----------------------------------------------------------------------

  const headerContent = (
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

      <div className="flex items-center gap-1.5">
        {/* Run Diagnostics */}
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

        {/* Float / Dock toggle */}
        <button
          onClick={toggleMode}
          className="flex items-center gap-1 text-[10px] text-zinc-400 hover:text-zinc-100 transition-colors px-2 py-1 rounded-lg hover:bg-zinc-700/50"
          title={isFloating ? 'Dock to bottom' : 'Float — drag anywhere'}
        >
          {isFloating ? (
            <><PanelBottom className="w-3.5 h-3.5" /> Dock</>
          ) : (
            <><Move className="w-3.5 h-3.5" /> Float</>
          )}
        </button>

        {/* Close */}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_PANEL' })}
          className="text-[10px] text-zinc-500 hover:text-zinc-200 transition-colors px-2 py-1 rounded hover:bg-zinc-700/50"
        >
          Close
        </button>
      </div>
    </div>
  );

  const bodyContent = state.cardPosition === 'top' ? (
    <>
      <VitalsMonitorBar />
      <div className="flex-1 min-h-0 relative">
        <VitalsConsole />
      </div>
    </>
  ) : (
    <div className={`flex-1 min-h-0 flex ${state.cardPosition === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className="w-[220px] shrink-0 border-zinc-800/80 overflow-y-auto ad-scrollbar"
        style={{ borderRightWidth: state.cardPosition === 'left' ? 1 : 0, borderLeftWidth: state.cardPosition === 'right' ? 1 : 0, borderStyle: 'solid', borderColor: 'rgb(39 39 42 / 0.8)' }}
      >
        <VitalsMonitorBar />
      </div>
      <div className="flex-1 min-h-0 relative">
        <VitalsConsole />
      </div>
    </div>
  );

  // =====================================================================
  // FLOATING MODE
  // =====================================================================

  if (isFloating) {
    return (
      <div
        ref={panelRef}
        className="fixed z-50 bg-zinc-950/95 backdrop-blur-md border border-zinc-700 rounded-xl flex flex-col shadow-2xl shadow-black/60 overflow-hidden"
        style={{
          top: `${state.panelPosition.y}px`,
          left: `${state.panelPosition.x}px`,
          width: `${state.panelWidth}px`,
          height: `${state.panelHeight}px`,
        }}
      >
        {/* Draggable title bar */}
        <div
          onMouseDown={handleMoveStart}
          className="flex items-center justify-center py-1 cursor-grab active:cursor-grabbing group shrink-0 bg-zinc-900/80"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 rounded-full bg-zinc-700 group-hover:bg-zinc-500 transition-colors" />
            <Move className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
            <div className="w-8 h-1 rounded-full bg-zinc-700 group-hover:bg-zinc-500 transition-colors" />
          </div>
        </div>

        {headerContent}
        {bodyContent}

        {/* Bottom-right resize handle */}
        <div
          onMouseDown={handleResizeStart}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-10 group"
        >
          {/* Visual resize grip (three diagonal lines) */}
          <svg className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" viewBox="0 0 16 16">
            <line x1="14" y1="6" x2="6" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="14" y1="10" x2="10" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="14" y1="14" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    );
  }

  // =====================================================================
  // DOCKED MODE (default — fixed to bottom)
  // =====================================================================

  return (
    <div
      ref={panelRef}
      className="fixed bottom-0 left-[68px] right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 flex flex-col shadow-2xl shadow-black/40"
      style={{ height: `${state.panelHeight}px` }}
    >
      {/* Drag-to-resize handle (vertical only) */}
      <div
        onMouseDown={handleResizeStart}
        className="flex items-center justify-center py-1.5 cursor-ns-resize group shrink-0"
      >
        <div className="w-12 h-1 rounded-full bg-zinc-700 group-hover:bg-zinc-500 transition-colors" />
      </div>

      {headerContent}
      {bodyContent}
    </div>
  );
}
