// =============================================================================
// MidnightVitals — Barrel Exports
// =============================================================================
// Single entry point for the entire vitals module.
// Import everything from '@/vitals' or './vitals'.
// =============================================================================

// Context & hooks
export { VitalsProvider, useVitals, useVitalsLogger } from './context';

// Components
export { VitalsPanel } from './components/VitalsPanel';
export { VitalsToggleButton } from './components/VitalsToggleButton';
export { VitalsMonitorBar } from './components/VitalsMonitorBar';
export { VitalsTimeWheel } from './components/VitalsTimeWheel';
export { VitalsConsole } from './components/VitalsConsole';
export { VitalsNavigationLogger } from './components/VitalsNavigationLogger';

// Types
export type {
  VitalStatus,
  VitalId,
  VitalMonitor,
  VitalCheckResult,
  LogLevel,
  VitalsLogEntry,
  ContractInfo,
  DependencyCheckResult,
  DiagnosticReport,
  VitalsProviderInterface,
  VitalsState,
  VitalsAction,
  CardPosition,
} from './types';

// Messages (for custom integrations)
export {
  PROOF_SERVER_MESSAGES,
  NETWORK_MESSAGES,
  WALLET_MESSAGES,
  CONTRACT_MESSAGES,
  DEPENDENCY_MESSAGES,
  ACTIVITY_MESSAGES,
} from './messages';

// Providers
export { MockVitalsProvider } from './mock-vitals-provider';
