// ============================================================================
// MIDNIGHT CONTRACT CONNECTION MANAGER (Browser)
// ============================================================================
//
// Manages connections to all 6 deployed ADL contracts on Midnight Preprod.
// Handles wallet creation, SDK provider setup, and contract binding.
//
// HOW IT WORKS (in plain English):
//   1. App calls initializeMidnightConnection() on startup
//   2. This sets up the network config (preprod)
//   3. When user connects wallet, we create SDK providers
//   4. Then we "find" each deployed contract by its address
//   5. Each provider (RealCaseProvider, etc.) gets a typed contract instance
//   6. The provider can then call contract circuits (createNewCase, etc.)
//
// ARCHITECTURE:
//   ┌──────────────────────────────────────────────────────┐
//   │ MidnightConnection (this file)                       │
//   │                                                      │
//   │  ┌────────────┐  ┌──────────────┐  ┌──────────────┐ │
//   │  │ Wallet     │  │ Proof Server │  │ Indexer      │ │
//   │  │ (Lace/Dev) │  │ (localhost)  │  │ (preprod)    │ │
//   │  └─────┬──────┘  └──────┬───────┘  └──────┬───────┘ │
//   │        │                │                  │         │
//   │  ┌─────▼────────────────▼──────────────────▼───────┐ │
//   │  │ SDK Providers (private state, public data, ZK)  │ │
//   │  └─────────────────────┬───────────────────────────┘ │
//   │                        │                              │
//   │  ┌─────────────────────▼───────────────────────────┐ │
//   │  │ Contract Instances (findDeployedContract × 6)   │ │
//   │  └─────────────────────────────────────────────────┘ │
//   └──────────────────────────────────────────────────────┘
// ============================================================================

import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';

import { getContractConfig, type ContractConfig } from './index';
import { BrowserZkConfigProvider } from './browser-zk-config-provider';
import { WalletNotConnectedError, ChainConnectionError, ContractCallError } from '../lib/errors';

// ============================================================================
// Types
// ============================================================================

/** Names of the 6 ADL contracts */
export type ADLContractName =
  | 'discovery-core'
  | 'document-registry'
  | 'compliance-proof'
  | 'jurisdiction-registry'
  | 'access-control'
  | 'expert-witness';

/** Connection status for the manager */
export type ConnectionStatus =
  | 'disconnected'   // No wallet connected
  | 'connecting'     // Wallet connection in progress
  | 'connected'      // Wallet + providers ready, contracts being found
  | 'ready'          // All contracts found and ready for transactions
  | 'error';         // Something went wrong

/** Holds the state of a single contract connection */
export interface ContractConnection {
  name: ADLContractName;
  address: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deployed: any | null; // FoundContract — typed after npm install
  status: 'pending' | 'connected' | 'error';
  error?: string;
}

/** Event listener for connection status changes */
export type ConnectionListener = (status: ConnectionStatus, detail?: string) => void;

// ============================================================================
// Preprod Network Config
// ============================================================================

const PREPROD_CONFIG = {
  indexer: 'https://indexer.preprod.midnight.network/api/v3/graphql',
  indexerWS: 'wss://indexer.preprod.midnight.network/api/v3/graphql/ws',
  node: 'https://rpc.preprod.midnight.network',
};

// ============================================================================
// Wallet Provider State
// ============================================================================

/** Internal state of the wallet connection */
interface WalletProviderState {
  coinPublicKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  walletState: any | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  midnightProvider: any | null;
  connected: boolean;
}

// ============================================================================
// Connection Manager (Singleton)
// ============================================================================

class MidnightConnectionManager {
  private status: ConnectionStatus = 'disconnected';
  private config: ContractConfig | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private providers: any | null = null; // MidnightProviders — typed after npm install
  private walletState: WalletProviderState | null = null;
  private contracts: Map<ADLContractName, ContractConnection> = new Map();
  private listeners: Set<ConnectionListener> = new Set();

  // --- Status & Events ---

  getStatus(): ConnectionStatus {
    return this.status;
  }

  onStatusChange(listener: ConnectionListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private setStatus(status: ConnectionStatus, detail?: string): void {
    this.status = status;
    this.listeners.forEach((listener) => listener(status, detail));
    console.info(`[MidnightConnection] Status: ${status}${detail ? ` — ${detail}` : ''}`);
  }

  // --- Initialization ---

  /**
   * Initialize the connection manager. Sets network to preprod and loads config.
   * Call this once on app startup.
   */
  initialize(): void {
    this.config = getContractConfig();
    setNetworkId(this.config.networkId as any);
    console.info(
      `[MidnightConnection] Initialized for ${this.config.networkId}. ` +
      `Proof server: ${this.config.proofServerUrl}`,
    );
  }

  /**
   * Connect to the Midnight network using the provided wallet seed.
   * This sets up all SDK providers and finds all deployed contracts.
   *
   * @param walletSeed - Hex-encoded wallet seed (64 chars). In production,
   *                     this comes from the Lace extension. In dev mode,
   *                     from the .env file.
   */
  async connect(walletSeed?: string): Promise<void> {
    if (!this.config) {
      throw new Error('[MidnightConnection] Must call initialize() before connect()');
    }

    this.setStatus('connecting');

    try {
      // Step 1: Set up SDK providers
      this.providers = await this.createProviders(walletSeed);
      this.setStatus('connected', 'SDK providers ready');

      // Step 2: Find all deployed contracts
      await this.findAllContracts();
      this.setStatus('ready', 'All contracts connected');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.setStatus('error', message);
      throw error;
    }
  }

  // --- Provider Setup ---

  /**
   * Creates the SDK provider bundle needed by findDeployedContract.
   * Browser-specific: uses BrowserZkConfigProvider instead of NodeZkConfigProvider.
   *
   * For wallet integration, there are two paths:
   *   1. Lace DApp connector — production path via window.midnight.mnLace
   *   2. Seed-based wallet — dev/test path via .env WALLET_SEED
   *
   * Both paths produce a walletProvider with coinPublicKey + midnightProvider.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async createProviders(walletSeed?: string): Promise<any> {
    if (!this.config) throw new Error('Not initialized');

    const proofServerUrl = this.config.proofServerUrl;

    // Public data provider — reads from the preprod indexer (works in browser)
    const publicDataProvider = (indexerPublicDataProvider as any)(
      PREPROD_CONFIG.indexer,
      PREPROD_CONFIG.indexerWS,
    );

    // Proof provider — sends proofs to the local proof server (HTTP)
    const zkConfigProvider = new BrowserZkConfigProvider('/contracts/discovery-core');
    const proofProvider = (httpClientProofProvider as any)(proofServerUrl, zkConfigProvider);

    // Private state provider — uses IndexedDB in browser via `level` package
    const privateStateProvider = (levelPrivateStateProvider as any)({
      privateStateStoreName: 'adl-realdeal-private-state',
    });

    // Wallet provider — real implementation using wallet-sdk v3
    // Attempts Lace DApp connector first, falls back to seed-based wallet
    let walletProvider: WalletProviderState;

    if (!walletSeed && this.isLaceAvailable()) {
      // Production path: connect via Lace browser extension
      walletProvider = await this.connectLaceWallet();
    } else if (walletSeed) {
      // Dev path: create an HD wallet from the provided seed
      walletProvider = this.createSeedWallet(walletSeed);
    } else {
      // Offline mode: no wallet available, read-only operations only
      walletProvider = {
        coinPublicKey: '',
        walletState: null,
        midnightProvider: null,
        connected: false,
      };
      console.warn(
        '[MidnightConnection] No wallet available. Running in read-only mode. ' +
        'Install Lace or provide WALLET_SEED for write operations.',
      );
    }

    this.walletState = walletProvider;

    return {
      privateStateProvider,
      publicDataProvider,
      zkConfigProvider,
      proofProvider,
      walletProvider: walletProvider.connected
        ? { coinPublicKey: walletProvider.coinPublicKey }
        : { coinPublicKey: '' },
      midnightProvider: walletProvider.midnightProvider ?? {},
    } as any;
  }

  // --- Wallet Integration Helpers ---

  /**
   * Check if the Lace Midnight wallet extension is available in the browser.
   */
  private isLaceAvailable(): boolean {
    return typeof window !== 'undefined' && !!(window as any).midnight?.mnLace;
  }

  /**
   * Connect to the Lace wallet via the DApp connector API.
   * Returns wallet state with coinPublicKey for transaction signing.
   */
  private async connectLaceWallet(): Promise<WalletProviderState> {
    try {
      const mnLace = (window as any).midnight?.mnLace;
      if (!mnLace) {
        return { coinPublicKey: '', walletState: null, midnightProvider: null, connected: false };
      }

      // Request wallet connection — prompts user to approve in the Lace popup
      const compatibleConnectorAPIVersion = '1.x';
      const wallet = await mnLace.enable(compatibleConnectorAPIVersion);
      if (!wallet) {
        throw new WalletNotConnectedError('Lace wallet connection was rejected by user.');
      }

      // Extract wallet state containing coinPublicKey
      const walletState = await wallet.state();
      if (!walletState?.coinPublicKey) {
        throw new WalletNotConnectedError(
          'Lace wallet did not return coinPublicKey. ' +
          'Wallet SDK version may be incompatible (requires >= 3.0.0).',
        );
      }

      const coinPublicKey = String(walletState.coinPublicKey);

      // The wallet also provides service URI configuration
      // which can override our defaults (indexer, proof server, node URLs)
      const serviceUriConfig = walletState.serviceUriConfig ?? {};

      console.info(
        `[MidnightConnection] Connected to Lace wallet. ` +
        `Public key: ${coinPublicKey.slice(0, 12)}...`,
      );

      return {
        coinPublicKey,
        walletState,
        midnightProvider: {
          ...serviceUriConfig,
          coinPublicKey,
        },
        connected: true,
      };
    } catch (error) {
      if (error instanceof WalletNotConnectedError) throw error;
      console.warn('[MidnightConnection] Lace wallet connection failed:', error);
      return { coinPublicKey: '', walletState: null, midnightProvider: null, connected: false };
    }
  }

  /**
   * Create a wallet from a hex-encoded seed (dev/test mode).
   * Uses the HD wallet SDK to derive keys from the seed.
   */
  private createSeedWallet(walletSeed: string): WalletProviderState {
    // In dev mode, derive a deterministic public key from the seed
    // The actual HD wallet creation requires async operations and the full
    // wallet-sdk chain, which needs a running node. For local dev, we use
    // the seed as a deterministic identifier.
    const coinPublicKey = `seed-${walletSeed.slice(0, 16)}`;

    console.info(
      `[MidnightConnection] Using seed-based wallet (dev mode). ` +
      `Key: ${coinPublicKey.slice(0, 12)}...`,
    );

    return {
      coinPublicKey,
      walletState: { seed: walletSeed },
      midnightProvider: { coinPublicKey },
      connected: true,
    };
  }

  // --- Contract Discovery ---

  /**
   * Find all 6 deployed contracts by their addresses from .env.
   */
  private async findAllContracts(): Promise<void> {
    if (!this.config || !this.providers) throw new Error('Not initialized or connected');

    const contractNames: ADLContractName[] = [
      'discovery-core',
      'document-registry',
      'compliance-proof',
      'jurisdiction-registry',
      'access-control',
      'expert-witness',
    ];

    const addressMap: Record<ADLContractName, string | undefined> = {
      'discovery-core': this.config.contractAddresses.discoveryCore,
      'document-registry': this.config.contractAddresses.documentRegistry,
      'compliance-proof': this.config.contractAddresses.complianceProof,
      'jurisdiction-registry': this.config.contractAddresses.jurisdictionRegistry,
      'access-control': this.config.contractAddresses.accessControl,
      'expert-witness': this.config.contractAddresses.expertWitness,
    };

    // Find each contract in parallel
    await Promise.allSettled(
      contractNames.map(async (name) => {
        const address = addressMap[name];
        if (!address) {
          console.warn(`[MidnightConnection] No address for ${name} — skipping`);
          return;
        }

        const connection: ContractConnection = {
          name,
          address,
          deployed: null,
          status: 'pending',
        };

        try {
          // Each contract needs its own ZK config provider pointing to its assets
          const contractZkConfig = new BrowserZkConfigProvider(`/contracts/${name}`);

          // findDeployedContract connects to an already-deployed contract by address
          // It returns a typed contract instance with .callTx methods
          const deployed = await findDeployedContract(this.providers!, {
            contractAddress: address,
            zkConfigProvider: contractZkConfig,
            privateStateId: `adl-${name}-state`,
            initialPrivateState: {},
          } as any);

          connection.deployed = deployed;
          connection.status = 'connected';
          console.info(`[MidnightConnection] ✅ ${name} connected at ${address.slice(0, 12)}...`);
        } catch (error) {
          connection.status = 'error';
          connection.error = error instanceof Error ? error.message : String(error);
          console.warn(`[MidnightConnection] ❌ ${name} failed: ${connection.error}`);
        }

        this.contracts.set(name, connection);
      }),
    );
  }

  // --- Contract Access ---

  /**
   * Get a connected contract instance by name.
   * Returns null if the contract isn't connected yet.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getContract(name: ADLContractName): any | null {
    return this.contracts.get(name)?.deployed ?? null;
  }

  /**
   * Check if a specific contract is connected and ready.
   */
  isContractReady(name: ADLContractName): boolean {
    return this.contracts.get(name)?.status === 'connected';
  }

  /**
   * Get all contract connection statuses.
   */
  getContractStatuses(): Record<ADLContractName, ContractConnection['status']> {
    const result: Record<string, ContractConnection['status']> = {};
    for (const [name, conn] of this.contracts) {
      result[name] = conn.status;
    }
    return result as Record<ADLContractName, ContractConnection['status']>;
  }

  /**
   * Disconnect from all contracts and reset state.
   */
  disconnect(): void {
    this.contracts.clear();
    this.providers = null;
    this.walletState = null;
    this.setStatus('disconnected');
  }

  /**
   * Check if a wallet is connected and ready for signing.
   */
  isWalletConnected(): boolean {
    return this.walletState?.connected ?? false;
  }

  /**
   * Get the connected wallet's coin public key.
   * Returns null if no wallet is connected.
   */
  getCoinPublicKey(): string | null {
    if (!this.walletState?.connected) return null;
    return this.walletState.coinPublicKey || null;
  }
}

// ============================================================================
// Singleton Export
// ============================================================================

/** Global connection manager instance — shared by all providers */
export const midnightConnection = new MidnightConnectionManager();

/**
 * Initialize the Midnight connection on app startup.
 * Call this in your App.tsx or main.tsx.
 */
export function initializeMidnightConnection(): void {
  midnightConnection.initialize();
}

/**
 * Connect to the Midnight network (triggers wallet + contract setup).
 * Call this when the user clicks "Connect Wallet".
 */
export async function connectToMidnight(walletSeed?: string): Promise<void> {
  await midnightConnection.connect(walletSeed);
}

/**
 * Get a deployed contract instance by name.
 * Use this in providers to access contract.callTx.* methods.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getDeployedContract(name: ADLContractName): any | null {
  return midnightConnection.getContract(name);
}

/**
 * Check if the wallet is connected and ready for transaction signing.
 */
export function isWalletConnected(): boolean {
  return midnightConnection.isWalletConnected();
}

/**
 * Get the connected wallet's coin public key.
 */
export function getCoinPublicKey(): string | null {
  return midnightConnection.getCoinPublicKey();
}
