// =============================================================================
// MidnightVitals — Interaction Tracking Hook
// =============================================================================
// Provides hover and click logging for any UI element. Hover events are
// debounced (same element won't log more than once per cooldown period)
// to avoid spamming the console. Click events always log immediately.
//
// Usage:
//   const track = useVitalsInteraction();
//   <button {...track('Sign In button')}>Sign In</button>
//
// Or selectively:
//   <div onMouseEnter={track.hover('Stat Card: Active Cases')}>
//   <button onClick={track.click('Create Case button')}>
// =============================================================================

import { useCallback, useRef } from 'react';
import { useVitals } from './context';
import type { LogLevel } from './types';


// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Minimum milliseconds between hover logs for the SAME label */
const HOVER_DEBOUNCE_MS = 3000;

/** Default log level for hover events */
const HOVER_LOG_LEVEL: LogLevel = 'info';

/** Default log level for click events */
const CLICK_LOG_LEVEL: LogLevel = 'action';


// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Returns interaction tracking utilities for hover and click logging.
 *
 * The main `track(label)` function returns an object with both
 * `onMouseEnter` and `onClick` handlers — spread it onto any element:
 *
 *   <button {...track('Sign In button')}>Sign In</button>
 *
 * For finer control, use `track.hover(label)` or `track.click(label)`
 * to get individual event handler functions:
 *
 *   <div onMouseEnter={track.hover('Stats panel')}>
 *   <button onClick={track.click('Submit')}>
 */
export function useVitalsInteraction() {
  const { log } = useVitals();

  // Map of label → last hover log timestamp for debouncing
  const hoverTimestampsRef = useRef<Map<string, number>>(new Map());

  // -----------------------------------------------------------------------
  // Hover handler factory (debounced per label)
  // -----------------------------------------------------------------------
  const createHoverHandler = useCallback(
    (label: string) => {
      return () => {
        const now = Date.now();
        const lastTime = hoverTimestampsRef.current.get(label) || 0;

        // Only log if enough time has passed since the last hover log for this label
        if (now - lastTime >= HOVER_DEBOUNCE_MS) {
          hoverTimestampsRef.current.set(label, now);
          log(HOVER_LOG_LEVEL, `Hovered over "${label}".`);
        }
      };
    },
    [log],
  );

  // -----------------------------------------------------------------------
  // Click handler factory (always fires)
  // -----------------------------------------------------------------------
  const createClickHandler = useCallback(
    (label: string) => {
      return () => {
        log(CLICK_LOG_LEVEL, `Clicked "${label}".`);
      };
    },
    [log],
  );

  // -----------------------------------------------------------------------
  // Combined tracker — returns props to spread onto an element
  // -----------------------------------------------------------------------
  const track = useCallback(
    (label: string) => ({
      onMouseEnter: createHoverHandler(label),
      onClick: createClickHandler(label),
    }),
    [createHoverHandler, createClickHandler],
  ) as TrackFunction;

  // Attach individual factories as properties on the track function
  track.hover = createHoverHandler;
  track.click = createClickHandler;

  return track;
}


// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TrackFunction {
  /**
   * Returns { onMouseEnter, onClick } props to spread onto an element.
   * Both hover and click will be logged.
   */
  (label: string): {
    onMouseEnter: () => void;
    onClick: () => void;
  };

  /**
   * Returns just an onMouseEnter handler (debounced).
   * Use when you only want hover logging, or the element already has an onClick.
   */
  hover: (label: string) => () => void;

  /**
   * Returns just an onClick handler.
   * Use when you only want click logging, or the element already has an onMouseEnter.
   */
  click: (label: string) => () => void;
}
