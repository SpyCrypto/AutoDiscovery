// =============================================================================
// Wallet Setup for Deploy Scripts
// =============================================================================
// Builds wallet providers (walletProvider + midnightProvider) from a hex seed
// using the Midnight wallet SDK. These are required by deployContract().
//
// The WalletFacade implements BOTH WalletProvider AND MidnightProvider:
//   WalletProvider  → balanceTx(), getCoinPublicKey(), getEncryptionPublicKey()
//   MidnightProvider → submitTx()
// =============================================================================

import type { WalletProvider, MidnightProvider } from '@midnight-ntwrk/midnight-js-types';
import { HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk-hd';
import { ZswapSecretKeys, DustSecretKey } from '@midnight-ntwrk/ledger-v6';
import WebSocket from 'ws';

export interface NetworkConfig {
  readonly indexerHttp: string;
  readonly indexerWs: string;
  readonly node: string;
  readonly proofServer: string;
}

export interface DeployWalletProviders {
  readonly walletProvider: WalletProvider;
  readonly midnightProvider: MidnightProvider;
  readonly storagePassword: () => string;
  readonly dustAddress: string;
}

// ---------------------------------------------------------------------------
// Build wallet providers from a 64-char hex seed
// ---------------------------------------------------------------------------

export async function buildWalletProviders(
  seedHex: string,
  config: NetworkConfig,
): Promise<DeployWalletProviders> {
  const seedBuf = Buffer.from(seedHex, 'hex');

  // ---------------------------------------------------------------------------
  // Derive HD keys for Zswap (ZK identity) and Dust (fee payment)
  // ---------------------------------------------------------------------------
  const hdResult = HDWallet.fromSeed(new Uint8Array(seedBuf));
  if (hdResult.type !== 'seedOk') {
    throw new Error('Failed to initialize HDWallet from seed');
  }

  const accountKey = hdResult.hdWallet.selectAccount(0);

  const zswapRoleKey = accountKey.selectRole(Roles.Zswap).deriveKeyAt(0);
  const dustRoleKey = accountKey.selectRole(Roles.Dust).deriveKeyAt(0);

  if (zswapRoleKey.type !== 'keyDerived' || dustRoleKey.type !== 'keyDerived') {
    throw new Error('Failed to derive HD keys from seed');
  }

  // ZSwap keys → coin public key for ZK operations
  const zswapKeys = ZswapSecretKeys.fromSeed(zswapRoleKey.key);
  const { coinPublicKey, encryptionPublicKey } = zswapKeys;

  // Derive dust address for display (fund this on testnet)
  DustSecretKey.fromSeed(dustRoleKey.key); // validate derivation works
  const dustAddress = Buffer.from(dustRoleKey.key).toString('hex').slice(0, 70);

  // ---------------------------------------------------------------------------
  // WalletProvider — provides keys and balances transactions
  //
  // balanceTx: For a local 'undeployed' network (dev mode), we return
  // NothingToProve since the local node doesn't require fee proofs.
  // For testnet, this needs to be replaced with actual DUST fee attachment
  // using a synced DustWallet. See DEPLOY.md for instructions.
  // ---------------------------------------------------------------------------
  const walletProvider: WalletProvider = {
    getCoinPublicKey: () => coinPublicKey,
    getEncryptionPublicKey: () => encryptionPublicKey,
    balanceTx: async (tx) => {
      return {
        type: 'NothingToProve' as const,
        transaction: tx,
      } as any;
    },
  };

  // ---------------------------------------------------------------------------
  // MidnightProvider — submits finalized transactions to the network
  //
  // For local dev: node listens on ws://localhost:9944 (WebSocket RPC)
  // For testnet: wss://rpc.preprod.midnight.network
  //
  // The actual submission format depends on the Midnight node RPC spec.
  // The indexer HTTP endpoint (graphql) does NOT accept raw tx submission.
  // Tx submission must go through the node's polkadot-compatible RPC endpoint.
  // ---------------------------------------------------------------------------
  const midnightProvider: MidnightProvider = {
    submitTx: async (tx) => {
      const wsUrl = config.node.replace(/^http/, 'ws');
      return new Promise((resolve, reject) => {
        const ws = new WebSocket(wsUrl);
        ws.once('open', () => {
          const txBytes = (tx as any).serialize?.() ?? (tx as any).bytes ?? JSON.stringify(tx);
          ws.send(JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'author_submitExtrinsic',
            params: [
              typeof txBytes === 'string' ? txBytes : Buffer.from(txBytes).toString('hex'),
            ],
          }));
        });
        ws.once('message', (data: string) => {
          ws.close();
          try {
            const resp = JSON.parse(data.toString()) as { result?: string; error?: unknown };
            if (resp.error) reject(new Error(JSON.stringify(resp.error)));
            else resolve(resp.result ?? '');
          } catch (e) {
            reject(e);
          }
        });
        ws.once('error', reject);
      });
    },
  };

  const storagePassword = () => `ad-${coinPublicKey.slice(0, 16)}`;

  return {
    walletProvider,
    midnightProvider,
    storagePassword,
    dustAddress,
  };
}
