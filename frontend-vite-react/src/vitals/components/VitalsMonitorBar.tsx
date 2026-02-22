// =============================================================================
// MidnightVitals — Monitor Bar Component
// =============================================================================
// Horizontal row of time wheels at the top of the vitals panel.
// Shows all 4 vital monitors side by side with their countdown timers.
// =============================================================================

import { useVitals } from '../context';
import { VitalsTimeWheel } from './VitalsTimeWheel';


export function VitalsMonitorBar() {
  const { state, refreshVital } = useVitals();

  return (
    <div className="grid grid-cols-2 gap-2 p-1">
      {state.monitors.map((monitor) => (
        <VitalsTimeWheel
          key={monitor.id}
          label={monitor.label}
          status={monitor.status}
          detailLine={monitor.detailLine}
          lastCheckTimestamp={monitor.lastCheckTimestamp}
          checkIntervalSeconds={monitor.checkIntervalSeconds}
          onRefresh={() => refreshVital(monitor.id)}
        />
      ))}
    </div>
  );
}
