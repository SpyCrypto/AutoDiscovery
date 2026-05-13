// =============================================================================
// Wallet Setup for Deploy Scripts
// =============================================================================
// Builds wallet providers (walletProvider + midnightProvider) from a hex seed
// using the Midnight WalletFacade. Handles DUST fee payment automatically.
//
// For local undeployed network, use the genesis seed:
//   0000000000000000000000000000000000000000000000000000000000000001
// For testnet, use a funded wallet seed (fund via the testnet faucet).
// =============================================================================

import type { WalletProvider, MidnightProvider } from '@midnight-ntwrk/midnight-js-types';
import { HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk-hd';
import { ZswapSecretKeys, DustSecretKey, LedgerParameters } from '@midnight-ntwrk/ledger-v8';
import { WalletFacade } from '@midnight-ntwrk/wallet-sdk-facade';
import { ShieldedWallet } from '@midnight-ntwrk/wallet-sdk-shielded';
import { DustWallet } from '@midnight-ntwrk/wallet-sdk-dust-wallet';
import { UnshieldedWallet, createKeystore, PublicKey } from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { NoOpTransactionHistoryStorage } from '@midnight-ntwrk/wallet-sdk-abstractions';

export interface NetworkConfig {
  readonly indexerHttp: string;
  readonly indexerWs: string;
  readonly node: string;
  readonly proofServer: string;
  readonly networkId: string;
}

export interface DeployWalletProviders {
  readonly walletProvider: WalletProvider;
  readonly midnightProvider: MidnightProvider;
  readonly storagePassword: () => string;
  readonly dustAddress: string;
  readonly facade: WalletFacade;
}

// ---------------------------------------------------------------------------
// Build wallet providers from a 64-char hex seed using WalletFacade
// ---------------------------------------------------------------------------

export async function buildWalletProviders(
  seedHex: string,
  config: NetworkConfig,
): Promise<DeployWalletProviders> {
  const seedBuf = Buffer.from(seedHex, 'hex');

  // ---------------------------------------------------------------------------
  // Derive HD keys
  // ---------------------------------------------------------------------------
  const hdResult = HDWallet.fromSeed(new Uint8Array(seedBuf));
  if (hdResult.type !== 'seedOk') {
    throw new Error('Failed to initialize HDWallet from seed');
  }

  const derivationResult = hdResult.hdWallet
    .selectAccount(0)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .selectRoles([Roles.Zswap, Roles.NightExternal, Roles.Dust] as any)
    .deriveKeysAt(0);

  if (derivationResult.type !== 'keysDerived') {
    throw new Error('Failed to derive HD keys from seed');
  }

  const zswapKeys = ZswapSecretKeys.fromSeed(derivationResult.keys[Roles.Zswap]);
  const dustKey = DustSecretKey.fromSeed(derivationResult.keys[Roles.Dust]);
  const keystore = createKeystore(derivationResult.keys[Roles.NightExternal], config.networkId);
  const { coinPublicKey, encryptionPublicKey } = zswapKeys;
  const dustAddress = Buffer.from(derivationResult.keys[Roles.Dust]).toString('hex').slice(0, 70);

  // ---------------------------------------------------------------------------
  // WalletFacade configuration
  // ---------------------------------------------------------------------------
  const wsUrl = config.node.replace(/^http/, 'ws');
  const walletConfig = {
    networkId: config.networkId,
    relayURL: new URL(wsUrl),
    provingServerUrl: new URL(config.proofServer),
    indexerClientConnection: {
      indexerHttpUrl: config.indexerHttp,
      indexerWsUrl: config.indexerWs,
    },
    txHistoryStorage: new NoOpTransactionHistoryStorage(),
    costParameters: {
      feeBlocksMargin: 5,
      additionalFeeOverhead: 300_000_000_000_000n,
    },
  };

  console.log('[wallet] Initializing WalletFacade and waiting for sync…');
  const facade = await WalletFacade.init({
    configuration: walletConfig,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shielded: (cfg: any) => ShieldedWallet(cfg).startWithSecretKeys(zswapKeys),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unshielded: (cfg: any) => UnshieldedWallet(cfg).startWithPublicKey(PublicKey.fromKeyStore(keystore)),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dust: (cfg: any) => DustWallet(cfg).startWithSecretKey(dustKey, LedgerParameters.initialParameters().dust),
  });

  await facade.start(zswapKeys, dustKey);
  console.log('[wallet] Waiting for wallet sync…');
  await facade.waitForSyncedState();
  console.log('[wallet] Wallet synced.');

  // ---------------------------------------------------------------------------
  // WalletProvider: delegates fee balancing to WalletFacade
  // ---------------------------------------------------------------------------
  const walletProvider: WalletProvider = {
    getCoinPublicKey: () => coinPublicKey,
    getEncryptionPublicKey: () => encryptionPublicKey,
    balanceTx: async (tx, ttl) => {
      const txTtl = ttl ?? new Date(Date.now() + 10 * 60 * 1000);
      const recipe = await facade.balanceUnboundTransaction(
        tx,
        { shieldedSecretKeys: zswapKeys, dustSecretKey: dustKey },
        { ttl: txTtl },
      );
      return facade.finalizeRecipe(recipe);
    },
  };

  // ---------------------------------------------------------------------------
  // MidnightProvider: submits via WalletFacade (uses wallet-sdk-node-client)
  // ---------------------------------------------------------------------------
  const midnightProvider: MidnightProvider = {
    submitTx: async (tx) => {
      const result = await facade.submitTransaction(tx);
      return typeof result === 'string' ? result : (result as any).txId ?? String(result);
    },
  };

  const storagePassword = () => `ad-${coinPublicKey.slice(0, 16)}`;

  return {
    walletProvider,
    midnightProvider,
    storagePassword,
    dustAddress,
    facade,
  };
}
