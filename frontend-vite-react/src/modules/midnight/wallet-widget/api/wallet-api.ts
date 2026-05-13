// =============================================================================
// Midnight Wallet API
// =============================================================================
// Wraps the @midnight-ntwrk/dapp-connector-api browser injection.
// The Lace wallet extension injects `window.midnight.mnLace` when installed.
// =============================================================================

export type WalletStatus =
  | 'not_installed'
  | 'not_connected'
  | 'connecting'
  | 'connected'
  | 'error';

export interface ServiceUriConfig {
  proverServerUri?: string;
  indexerUri?: string;
  indexerWsUri?: string;
  nodeUri?: string;
  networkId?: string;
  nodeConfig?: {
    networkId: string;
  };
}

export interface WalletStateSnapshot {
  address: string;
  coinPublicKey?: string;
  encryptionPublicKey?: string;
  balances?: Record<string, string>;
}

export interface DAppConnectorWalletAPI {
  state(): Promise<WalletStateSnapshot>;
  serviceSetting(): Promise<ServiceUriConfig>;
  balanceAndProveTransaction(tx: unknown, newCoins: unknown): Promise<unknown>;
  submitTransaction(tx: unknown): Promise<string>;
  proveTransaction(params: unknown): Promise<unknown>;
}

interface MidnightLaceConnector {
  enable(): Promise<DAppConnectorWalletAPI>;
  isEnabled(): Promise<boolean>;
  apiVersion: string;
  name: string;
  icon: string;
}

type WindowWithMidnight = Window &
  typeof globalThis & {
    midnight?: {
      mnLace?: MidnightLaceConnector;
    };
  };

// ---------------------------------------------------------------------------
// Detection
// ---------------------------------------------------------------------------

export function isMidnightWalletAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    (window as WindowWithMidnight).midnight?.mnLace !== undefined
  );
}

export async function isMidnightWalletEnabled(): Promise<boolean> {
  const connector = (window as WindowWithMidnight).midnight?.mnLace;
  if (!connector) return false;
  try {
    return await connector.isEnabled();
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Connection
// ---------------------------------------------------------------------------

export async function connectMidnightWallet(): Promise<DAppConnectorWalletAPI> {
  const connector = (window as WindowWithMidnight).midnight?.mnLace;

  if (!connector) {
    throw new WalletNotInstalledError();
  }

  try {
    const api = await connector.enable();
    return api;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (message.toLowerCase().includes('user declined') || message.toLowerCase().includes('rejected')) {
      throw new WalletConnectionRejectedError();
    }
    throw new WalletConnectionError(message);
  }
}

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

export interface WalletInfo {
  address: string;
  coinPublicKey: string | null;
  balanceTDUST: string | null;
  networkId: string | null;
  serviceUris: ServiceUriConfig;
}

export async function fetchWalletInfo(api: DAppConnectorWalletAPI): Promise<WalletInfo> {
  const [snapshot, serviceUris] = await Promise.all([
    api.state(),
    api.serviceSetting(),
  ]);

  const tDUST = snapshot.balances?.['tDUST'] ?? snapshot.balances?.['TDUST'] ?? null;

  return {
    address: snapshot.address,
    coinPublicKey: snapshot.coinPublicKey ?? null,
    balanceTDUST: tDUST,
    networkId: serviceUris.networkId ?? serviceUris.nodeConfig?.networkId ?? null,
    serviceUris,
  };
}

// ---------------------------------------------------------------------------
// Wallet Connection State (full shape used by context)
// ---------------------------------------------------------------------------

export interface WalletConnection {
  status: WalletStatus;
  api: DAppConnectorWalletAPI | null;
  info: WalletInfo | null;
  error: string | null;
}

export const DISCONNECTED_WALLET: WalletConnection = {
  status: 'not_connected',
  api: null,
  info: null,
  error: null,
};

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class WalletNotInstalledError extends Error {
  constructor() {
    super(
      'Midnight Lace wallet extension not found. ' +
      'Please install the Midnight Lace extension from the Chrome Web Store and refresh this page.',
    );
    this.name = 'WalletNotInstalledError';
  }
}

export class WalletConnectionRejectedError extends Error {
  constructor() {
    super('Wallet connection was declined. Please approve the connection request in your Midnight Lace wallet.');
    this.name = 'WalletConnectionRejectedError';
  }
}

export class WalletConnectionError extends Error {
  constructor(detail: string) {
    super(`Wallet connection failed: ${detail}`);
    this.name = 'WalletConnectionError';
  }
}
