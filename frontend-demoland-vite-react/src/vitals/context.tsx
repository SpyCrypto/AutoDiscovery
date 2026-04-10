// =============================================================================
// MidnightVitals — React Context & Provider
// =============================================================================
// Global state management for the vitals module.
// Wraps the entire app and provides access to monitors, log entries,
// panel state, and the vitals provider (mock or live).
// =============================================================================

import {
  createContext, useContext, useReducer, useCallback, useEffect, useRef,
  type ReactNode,
} from 'react';
import type {
  VitalsState, VitalsAction, VitalId, VitalsLogEntry, LogLevel,
  ContractInfo, VitalMonitor, VitalsProviderInterface,
} from './types';
import { MockVitalsProvider } from './mock-vitals-provider';


// ---------------------------------------------------------------------------
// Default monitor definitions (initial state before first check)
// ---------------------------------------------------------------------------

const DEFAULT_MONITORS: VitalMonitor[] = [
  {
    id: 'proof-server',
    label: 'Proof Server',
    status: 'unknown',
    lastCheckTimestamp: null,
    lastResponseTimeMs: null,
    message: 'Waiting for first health check...',
    detailLine: 'Pending',
    checkIntervalSeconds: 20,
  },
  {
    id: 'network',
    label: 'Network',
    status: 'unknown',
    lastCheckTimestamp: null,
    lastResponseTimeMs: null,
    message: 'Waiting for first health check...',
    detailLine: 'Pending',
    checkIntervalSeconds: 20,
  },
  {
    id: 'wallet',
    label: 'Wallet',
    status: 'unknown',
    lastCheckTimestamp: null,
    lastResponseTimeMs: null,
    message: 'Waiting for first health check...',
    detailLine: 'Pending',
    checkIntervalSeconds: 20,
  },
  {
    id: 'contracts',
    label: 'Contracts',
    status: 'unknown',
    lastCheckTimestamp: null,
    lastResponseTimeMs: null,
    message: 'Waiting for first health check...',
    detailLine: 'Pending',
    checkIntervalSeconds: 30,
  },
];


// ---------------------------------------------------------------------------
// Initial State
// ---------------------------------------------------------------------------

/** Helper to restore a JSON value from localStorage or return a fallback */
function restoreJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const INITIAL_STATE: VitalsState = {
  isOpen: false,
  panelHeight: 320,
  panelWidth: 700,
  cardPosition: (localStorage.getItem('midnight-vitals-card-position') as VitalsState['cardPosition']) || 'top',
  panelMode: (localStorage.getItem('midnight-vitals-panel-mode') as VitalsState['panelMode']) || 'docked',
  panelPosition: restoreJson('midnight-vitals-panel-pos', { x: 100, y: 100 }),
  monitors: DEFAULT_MONITORS,
  logEntries: [],
  logFilter: 'all',
  isRunningDiagnostic: false,
};


// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function vitalsReducer(state: VitalsState, action: VitalsAction): VitalsState {
  switch (action.type) {
    case 'TOGGLE_PANEL':
      return { ...state, isOpen: !state.isOpen };

    case 'SET_PANEL_HEIGHT':
      return { ...state, panelHeight: action.height };

    case 'UPDATE_MONITOR':
      return {
        ...state,
        monitors: state.monitors.map((m) =>
          m.id === action.id ? { ...m, ...action.update } : m
        ),
      };

    case 'ADD_LOG_ENTRY': {
      // Keep max 500 entries, prune oldest when exceeded
      const newEntries = [...state.logEntries, action.entry];
      if (newEntries.length > 500) {
        newEntries.splice(0, newEntries.length - 500);
      }
      return { ...state, logEntries: newEntries };
    }
    case 'CLEAR_LOG':
      return { ...state, logEntries: [] };

    case 'SET_LOG_FILTER':
      return { ...state, logFilter: action.filter };

    case 'SET_RUNNING_DIAGNOSTIC':
      return { ...state, isRunningDiagnostic: action.running };

    case 'SET_CARD_POSITION':
      localStorage.setItem('midnight-vitals-card-position', action.position);
      return { ...state, cardPosition: action.position };

    case 'SET_PANEL_MODE':
      localStorage.setItem('midnight-vitals-panel-mode', action.mode);
      return { ...state, panelMode: action.mode };

    case 'SET_PANEL_POSITION':
      localStorage.setItem('midnight-vitals-panel-pos', JSON.stringify({ x: action.x, y: action.y }));
      return { ...state, panelPosition: { x: action.x, y: action.y } };

    case 'SET_PANEL_WIDTH':
      localStorage.setItem('midnight-vitals-panel-width', String(action.width));
      return { ...state, panelWidth: action.width };

    default:
      return state;
  }
}


// ---------------------------------------------------------------------------
// Context Shape
// ---------------------------------------------------------------------------

interface VitalsContextValue {
  state: VitalsState;
  dispatch: React.Dispatch<VitalsAction>;
  // Convenience methods for logging
  log: (level: LogLevel, message: string, detail?: string, suggestion?: string) => void;
  logError: (message: string, reason: string, explanation: string, suggestion: string) => void;
  // Manual refresh for a specific vital
  refreshVital: (id: VitalId) => void;
  // Run full diagnostic
  runDiagnostic: () => Promise<void>;
}

const VitalsContext = createContext<VitalsContextValue | null>(null);


// ---------------------------------------------------------------------------
// Provider Component
// ---------------------------------------------------------------------------

interface VitalsProviderProps {
  children: ReactNode;
  mode?: 'mock' | 'live';
  proofServerUrl?: string;
  indexerUrl?: string;
  contracts?: ContractInfo[];
  checkInterval?: number;       // Seconds between auto-checks (default 20)
}

let logIdCounter = 0;
function generateLogId(): string {
  logIdCounter += 1;
  return `vitals-log-${Date.now()}-${logIdCounter}`;
}

export function VitalsProvider({
  children,
  mode = 'mock',
  contracts = [],
  checkInterval = 20,
}: VitalsProviderProps) {
  const [state, dispatch] = useReducer(vitalsReducer, {
    ...INITIAL_STATE,
    // Restore panel state from localStorage if available
    isOpen: localStorage.getItem('midnight-vitals-open') === 'true',
    panelHeight: parseInt(localStorage.getItem('midnight-vitals-height') || '320', 10),
    panelWidth: parseInt(localStorage.getItem('midnight-vitals-panel-width') || '700', 10),
  });

  // Create the appropriate provider based on mode
  const providerRef = useRef<VitalsProviderInterface>(
    mode === 'mock' ? new MockVitalsProvider() : new MockVitalsProvider() // TODO: LiveVitalsProvider
  );

  // Persist panel state to localStorage
  useEffect(() => {
    localStorage.setItem('midnight-vitals-open', String(state.isOpen));
  }, [state.isOpen]);

  useEffect(() => {
    localStorage.setItem('midnight-vitals-height', String(state.panelHeight));
  }, [state.panelHeight]);

  // -----------------------------------------------------------------------
  // Logging helpers
  // -----------------------------------------------------------------------

  const log = useCallback((level: LogLevel, message: string, detail?: string, suggestion?: string) => {
    const entry: VitalsLogEntry = {
      id: generateLogId(),
      timestamp: Date.now(),
      level,
      message,
      detail,
      suggestion,
    };
    dispatch({ type: 'ADD_LOG_ENTRY', entry });
  }, []);

  const logError = useCallback((message: string, reason: string, explanation: string, suggestion: string) => {
    const entry: VitalsLogEntry = {
      id: generateLogId(),
      timestamp: Date.now(),
      level: 'error',
      message: `${message}\n${reason}`,
      detail: explanation,
      suggestion,
    };
    dispatch({ type: 'ADD_LOG_ENTRY', entry });
  }, []);

  // -----------------------------------------------------------------------
  // Health check runner for a single vital
  // -----------------------------------------------------------------------

  const runCheck = useCallback(async (vitalId: VitalId) => {
    const provider = providerRef.current;
    let result;

    switch (vitalId) {
      case 'proof-server':
        result = await provider.checkProofServer();
        break;
      case 'network':
        result = await provider.checkNetwork();
        break;
      case 'wallet':
        result = await provider.checkWallet();
        break;
      case 'contracts':
        result = await provider.checkContracts(contracts);
        break;
    }

    dispatch({
      type: 'UPDATE_MONITOR',
      id: vitalId,
      update: {
        status: result.status,
        message: result.message,
        detailLine: result.detailLine,
        lastResponseTimeMs: result.responseTimeMs,
        lastCheckTimestamp: Date.now(),
      },
    });
  }, [contracts]);

  // -----------------------------------------------------------------------
  // Manual refresh
  // -----------------------------------------------------------------------

  const refreshVital = useCallback((id: VitalId) => {
    runCheck(id);
  }, [runCheck]);

  // -----------------------------------------------------------------------
  // Full diagnostic
  // -----------------------------------------------------------------------

  const runDiagnostic = useCallback(async () => {
    dispatch({ type: 'SET_RUNNING_DIAGNOSTIC', running: true });
    log('info', 'Running full diagnostic check. This will test every component...');

    // Run all checks
    await runCheck('proof-server');
    await runCheck('network');
    await runCheck('wallet');
    await runCheck('contracts');

    // Check dependencies
    const deps = await providerRef.current.checkDependencies();
    const allPassed = deps.every((d) => d.installed);

    // Log results
    deps.forEach((dep) => {
      log(dep.installed ? 'success' : 'warning', dep.message);
    });

    const healthyCount = state.monitors.filter((m) => m.status === 'healthy').length;
    const total = state.monitors.length + deps.length;
    const healthyTotal = healthyCount + deps.filter((d) => d.installed).length;

    log(
      allPassed && healthyCount === state.monitors.length ? 'success' : 'warning',
      `Diagnostic complete. ${healthyTotal} out of ${total} checks passed.`
    );

    dispatch({ type: 'SET_RUNNING_DIAGNOSTIC', running: false });
  }, [log, runCheck, state.monitors]);

  // -----------------------------------------------------------------------
  // Auto-check timers
  // -----------------------------------------------------------------------

  useEffect(() => {
    // Run initial checks immediately
    runCheck('proof-server');
    runCheck('network');
    runCheck('wallet');
    runCheck('contracts');

    // Set up periodic checks
    const intervalId = setInterval(() => {
      runCheck('proof-server');
      runCheck('network');
      runCheck('wallet');
      runCheck('contracts');
    }, checkInterval * 1000);

    return () => clearInterval(intervalId);
  }, [checkInterval, runCheck]);

  // -----------------------------------------------------------------------
  // Welcome log entry on mount
  // -----------------------------------------------------------------------

  useEffect(() => {
    log('info',
      'MidnightVitals is active. Monitoring proof server, network, wallet, and contracts.',
      'Health checks run automatically every 20 seconds. You can also click the refresh button on any monitor for an instant check.'
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------------------------------------------------
  // Context value
  // -----------------------------------------------------------------------

  const contextValue: VitalsContextValue = {
    state,
    dispatch,
    log,
    logError,
    refreshVital,
    runDiagnostic,
  };

  return (
    <VitalsContext.Provider value={contextValue}>
      {children}
    </VitalsContext.Provider>
  );
}


// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/**
 * Access the full vitals context. Throws if used outside VitalsProvider.
 */
export function useVitals(): VitalsContextValue {
  const context = useContext(VitalsContext);
  if (!context) {
    throw new Error('useVitals must be used within a <VitalsProvider>');
  }
  return context;
}

/**
 * Convenience hook for logging only.
 * Use this in components that just need to push log entries.
 */
export function useVitalsLogger() {
  const { log, logError } = useVitals();
  return {
    log,
    logError,
    action: (message: string, detail?: string) => log('action', message, detail),
    info: (message: string, detail?: string) => log('info', message, detail),
    success: (message: string, detail?: string) => log('success', message, detail),
    warn: (message: string, detail?: string) => log('warning', message, detail),
    error: (message: string, detail?: string) => log('error', message, detail),
  };
}
