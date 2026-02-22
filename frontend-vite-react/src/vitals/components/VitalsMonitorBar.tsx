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

  const isVertical = state.cardPosition === 'left' || state.cardPosition === 'right';

  return (
    <div className={
      isVertical
        ? 'flex flex-col gap-1.5 p-2'
        : 'flex items-stretch gap-1.5 px-2 py-1.5 border-b border-zinc-800/80'
    }>
      {state.monitors.map((monitor) => (
        <VitalsTimeWheel
          key={monitor.id}
          label={monitor.label}
          status={monitor.status}
          detailLine={monitor.detailLine}
          lastCheckTimestamp={monitor.lastCheckTimestamp}
          checkIntervalSeconds={monitor.checkIntervalSeconds}
          onRefresh={() => refreshVital(monitor.id)}
          compact={isVertical}
        />
      ))}
    </div>
  );
}
