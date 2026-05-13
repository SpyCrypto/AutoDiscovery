// =============================================================================
// MidnightVitals — Mock Provider for DemoLand
// =============================================================================
// Simulates realistic health check responses for the demo UI.
// Returns randomized latencies and occasionally injects warnings/errors
// to demonstrate the full range of UI states.
// =============================================================================

import type {
  VitalsProviderInterface,
  VitalCheckResult,
  DependencyCheckResult,
  ContractInfo,
} from './types';
import {
  PROOF_SERVER_MESSAGES,
  NETWORK_MESSAGES,
  WALLET_MESSAGES,
  CONTRACT_MESSAGES,
  DEPENDENCY_MESSAGES,
} from './messages';


/**
 * Generates a random integer between min and max (inclusive).
 */
function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Simulates a network delay before returning a result.
 */
function simulateDelay(minMs: number, maxMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, randomBetween(minMs, maxMs)));
}


/**
 * Mock implementation of the vitals provider.
 * Returns simulated healthy/warning/error states with realistic timings.
 *
 * In demoLand, the proof server and network are "always" up (95% of the time).
 * Occasionally injects a slow response or error to show what those states look like.
 */
export class MockVitalsProvider implements VitalsProviderInterface {

  // Track whether we have a simulated "session" (user logged in)
  private hasWalletConnection: boolean = false;

  /**
   * Call this when the demo user logs in or out, so the wallet
   * vital reflects the current session state.
   */
  setWalletConnected(connected: boolean, displayName?: string) {
    this.hasWalletConnection = connected;
    this.walletDisplayName = displayName || '';
  }

  private walletDisplayName: string = '';

  // -------------------------------------------------------------------------
  // Proof Server Check
  // -------------------------------------------------------------------------
  async checkProofServer(): Promise<VitalCheckResult> {
    await simulateDelay(50, 200);

    // 90% healthy, 7% slow, 3% down
    const roll = Math.random();

    if (roll < 0.90) {
      const responseTime = randomBetween(30, 80);
      return {
        status: 'healthy',
        message: PROOF_SERVER_MESSAGES.healthy(responseTime),
        detailLine: `Response: ${responseTime}ms`,
        responseTimeMs: responseTime,
      };
    } else if (roll < 0.97) {
      const responseTime = randomBetween(200, 500);
      return {
        status: 'warning',
        message: PROOF_SERVER_MESSAGES.healthySlow(responseTime),
        detailLine: `Slow: ${responseTime}ms`,
        responseTimeMs: responseTime,
      };
    } else {
      return {
        status: 'critical',
        message: PROOF_SERVER_MESSAGES.critical,
        detailLine: 'Unreachable',
        responseTimeMs: null,
      };
    }
  }

  // -------------------------------------------------------------------------
  // Network / Indexer Check
  // -------------------------------------------------------------------------
  async checkNetwork(): Promise<VitalCheckResult> {
    await simulateDelay(50, 200);

    // 92% healthy, 5% slow, 3% down
    const roll = Math.random();

    if (roll < 0.92) {
      const responseTime = randomBetween(20, 60);
      return {
        status: 'healthy',
        message: NETWORK_MESSAGES.healthy(responseTime),
        detailLine: `Response: ${responseTime}ms`,
        responseTimeMs: responseTime,
      };
    } else if (roll < 0.97) {
      const responseTime = randomBetween(150, 400);
      return {
        status: 'warning',
        message: NETWORK_MESSAGES.healthySlow(responseTime),
        detailLine: `Slow: ${responseTime}ms`,
        responseTimeMs: responseTime,
      };
    } else {
      return {
        status: 'critical',
        message: NETWORK_MESSAGES.critical,
        detailLine: 'Unreachable',
        responseTimeMs: null,
      };
    }
  }

  // -------------------------------------------------------------------------
  // Wallet Check
  // -------------------------------------------------------------------------
  async checkWallet(): Promise<VitalCheckResult> {
    await simulateDelay(10, 50);

    if (this.hasWalletConnection) {
      return {
        status: 'healthy',
        message: WALLET_MESSAGES.healthy(this.walletDisplayName),
        detailLine: `Connected`,
        responseTimeMs: null,
      };
    } else {
      return {
        status: 'warning',
        message: WALLET_MESSAGES.warning,
        detailLine: 'Not connected',
        responseTimeMs: null,
      };
    }
  }

  // -------------------------------------------------------------------------
  // Contracts Check
  // -------------------------------------------------------------------------
  async checkContracts(contracts: ContractInfo[]): Promise<VitalCheckResult> {
    await simulateDelay(80, 250);

    // In mock mode, pretend all contracts with non-empty addresses are deployed
    const total = contracts.length;
    const deployed = contracts.filter((c) => c.address && c.address.length > 0).length;

    if (deployed === total && total > 0) {
      return {
        status: 'healthy',
        message: CONTRACT_MESSAGES.allHealthy(total),
        detailLine: `${deployed}/${total} deployed`,
        responseTimeMs: randomBetween(30, 80),
      };
    } else if (deployed > 0) {
      return {
        status: 'warning',
        message: CONTRACT_MESSAGES.someDeployed(deployed, total),
        detailLine: `${deployed}/${total} deployed`,
        responseTimeMs: randomBetween(30, 80),
      };
    } else {
      return {
        status: 'critical',
        message: CONTRACT_MESSAGES.noneDeployed,
        detailLine: `0/${total} deployed`,
        responseTimeMs: null,
      };
    }
  }

  // -------------------------------------------------------------------------
  // Dependencies Check
  // -------------------------------------------------------------------------
  async checkDependencies(): Promise<DependencyCheckResult[]> {
    await simulateDelay(100, 300);

    // In mock mode, simulate a realistic dev environment
    return [
      {
        name: 'Docker',
        installed: true,
        version: '27.5.1',
        message: DEPENDENCY_MESSAGES.dockerInstalled('27.5.1'),
      },
      {
        name: 'Node.js',
        installed: true,
        version: '20.11.0',
        message: DEPENDENCY_MESSAGES.nodeInstalled('20.11.0'),
      },
      {
        name: 'Compact Compiler',
        installed: true,
        version: '0.29.0',
        message: DEPENDENCY_MESSAGES.compactInstalled('0.29.0'),
      },
      {
        name: 'npm Packages',
        installed: true,
        version: null,
        message: DEPENDENCY_MESSAGES.npmComplete,
      },
    ];
  }
}
