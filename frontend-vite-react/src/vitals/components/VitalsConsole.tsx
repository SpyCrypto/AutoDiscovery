// =============================================================================
// MidnightVitals — Console Log Component
// =============================================================================
// Scrollable, auto-scrolling natural-language activity log.
// Each entry shows a timestamp, colored by severity level, with optional
// detail and suggestion paragraphs for errors.
// =============================================================================

import { useRef, useEffect, useState } from 'react';
import { Trash2, Copy, ChevronUp, Filter, Lightbulb } from 'lucide-react';
import { useVitals } from '../context';
import type { LogLevel, VitalsLogEntry } from '../types';


// ---------------------------------------------------------------------------
// Level styling
// ---------------------------------------------------------------------------

const LEVEL_STYLES: Record<LogLevel, {
  timestampColor: string;
  messageColor: string;
  borderColor: string;
  bgColor: string;
}> = {
  action:  { timestampColor: 'text-blue-400',    messageColor: 'text-blue-300',    borderColor: 'border-l-blue-500',    bgColor: '' },
  info:    { timestampColor: 'text-zinc-500',     messageColor: 'text-zinc-300',    borderColor: 'border-l-zinc-600',    bgColor: '' },
  success: { timestampColor: 'text-emerald-400',  messageColor: 'text-emerald-300', borderColor: 'border-l-emerald-500', bgColor: '' },
  warning: { timestampColor: 'text-amber-400',    messageColor: 'text-amber-300',   borderColor: 'border-l-amber-500',   bgColor: 'bg-amber-500/5' },
  error:   { timestampColor: 'text-red-400',      messageColor: 'text-red-300',     borderColor: 'border-l-red-500',     bgColor: 'bg-red-500/5' },
};


// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Format a Unix timestamp as HH:MM:SS for the log display.
 */
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Filter display labels for the dropdown.
 */
const FILTER_LABELS: Record<LogLevel | 'all', string> = {
  all: 'All',
  action: 'Actions',
  info: 'Info',
  success: 'Success',
  warning: 'Warnings',
  error: 'Errors',
};


// ---------------------------------------------------------------------------
// Single Log Entry
// ---------------------------------------------------------------------------

function LogEntry({ entry }: { entry: VitalsLogEntry }) {
  const styles = LEVEL_STYLES[entry.level];

  return (
    <div className={`border-l-2 ${styles.borderColor} ${styles.bgColor} pl-3 py-2 transition-all duration-200`}>
      {/* Timestamp + primary message */}
      <div className="flex gap-2">
        <span className={`font-mono text-xs shrink-0 ${styles.timestampColor}`}>
          [{formatTime(entry.timestamp)}]
        </span>
        <div className="min-w-0">
          <p className={`text-sm leading-relaxed ${styles.messageColor} whitespace-pre-wrap`}>
            {entry.message}
          </p>

          {/* Detail paragraph (the "what this means" explanation) */}
          {entry.detail && (
            <p className="text-xs leading-relaxed text-zinc-400 mt-1.5 whitespace-pre-wrap">
              {entry.detail}
            </p>
          )}

          {/* Suggestion paragraph (the "what to do" guidance) */}
          {entry.suggestion && (
            <div className="flex items-start gap-1.5 mt-2">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed text-amber-300/80 whitespace-pre-wrap">
                {entry.suggestion}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


// ---------------------------------------------------------------------------
// Console Component
// ---------------------------------------------------------------------------

export function VitalsConsole() {
  const { state, dispatch } = useVitals();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Filter entries based on active filter
  const filteredEntries = state.logFilter === 'all'
    ? state.logEntries
    : state.logEntries.filter((e) => e.level === state.logFilter);

  // Reversed: newest entries first
  const reversedEntries = [...filteredEntries].reverse();

  // Auto-scroll to top when new entries arrive (newest is on top now)
  useEffect(() => {
    if (autoScroll && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [filteredEntries.length, autoScroll]);

  // Detect manual scroll — if user scrolled away from top, pause auto-scroll
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const isNearTop = container.scrollTop < 50;
    setAutoScroll(isNearTop);
  };

  // Copy all log entries to clipboard as plain text
  const handleCopyLogs = () => {
    const text = reversedEntries
      .map((e) => {
        let line = `[${formatTime(e.timestamp)}] ${e.message}`;
        if (e.detail) line += `\n  ${e.detail}`;
        if (e.suggestion) line += `\n  → ${e.suggestion}`;
        return line;
      })
      .join('\n\n');

    navigator.clipboard.writeText(text).catch(() => {
      // Clipboard API may not be available in all contexts
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Console toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-zinc-800/60 bg-zinc-900/40 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
            Console
          </span>
          <span className="text-[10px] text-zinc-600">
            {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-200 transition-colors px-2 py-1 rounded hover:bg-zinc-700/50"
            >
              <Filter className="w-3 h-3" />
              <span>{FILTER_LABELS[state.logFilter]}</span>
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 py-1 min-w-[100px]">
                {(Object.keys(FILTER_LABELS) as Array<LogLevel | 'all'>).map((filterKey) => (
                  <button
                    key={filterKey}
                    onClick={() => {
                      dispatch({ type: 'SET_LOG_FILTER', filter: filterKey });
                      setShowFilterMenu(false);
                    }}
                    className={`w-full text-left text-[11px] px-3 py-1.5 hover:bg-zinc-800 transition-colors ${
                      state.logFilter === filterKey ? 'text-white font-medium' : 'text-zinc-400'
                    }`}
                  >
                    {FILTER_LABELS[filterKey]}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Copy button */}
          <button
            onClick={handleCopyLogs}
            className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-200 transition-colors px-2 py-1 rounded hover:bg-zinc-700/50"
            aria-label="Copy log to clipboard"
          >
            <Copy className="w-3 h-3" />
          </button>

          {/* Clear button */}
          <button
            onClick={() => dispatch({ type: 'CLEAR_LOG' })}
            className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-200 transition-colors px-2 py-1 rounded hover:bg-zinc-700/50"
            aria-label="Clear console log"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Scrollable log entries — newest on top */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-2 ad-scrollbar"
      >
        {reversedEntries.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs text-zinc-600">
              No log entries yet. Interact with the app to see activity here.
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {reversedEntries.map((entry) => (
              <LogEntry key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </div>

      {/* "Jump to latest" button — visible when auto-scroll is paused */}
      {!autoScroll && filteredEntries.length > 0 && (
        <button
          onClick={() => {
            setAutoScroll(true);
            if (scrollContainerRef.current) {
              scrollContainerRef.current.scrollTop = 0;
            }
          }}
          className="absolute top-12 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[10px] text-zinc-300 bg-zinc-800 border border-zinc-700 px-3 py-1.5 rounded-full shadow-lg hover:bg-zinc-700 transition-colors"
        >
          <ChevronUp className="w-3 h-3" />
          Jump to latest
        </button>
      )}
    </div>
  );
}
