// =============================================================================
// Jurisdiction Registration Script
// =============================================================================
// Calls registerNewJurisdiction on the deployed jurisdiction-registry contract
// for each rule pack in src/rule-packs/. Currently registers Idaho IRCP.
//
// USAGE:
//   npm run register-jurisdictions          # local undeployed (default)
//   MIDNIGHT_NETWORK=preview npm run register-jurisdictions
//
// PREREQUISITES:
//   Contracts must already be deployed. Run: npm run deploy:local
// =============================================================================

import 'dotenv/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

import { pipe } from 'effect';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';

import { Contract as JurisdictionRegistryContract } from '../managed/jurisdiction-registry/contract/index.js';
import { buildWalletProviders } from './wallet-setup.js';

// ---------------------------------------------------------------------------
// Network configuration
// ---------------------------------------------------------------------------

const NETWORK = (process.env.MIDNIGHT_NETWORK ?? 'undeployed') as
  | 'undeployed'
  | 'preview'
  | 'preprod';

const GENESIS_SEED = '0000000000000000000000000000000000000000000000000000000000000001';

const NETWORK_CONFIG = {
  undeployed: {
    networkId: 'undeployed',
    indexerHttp: 'http://localhost:8088/api/v3/graphql',
    indexerWs: 'ws://localhost:8088/api/v3/graphql/ws',
    node: 'http://localhost:9944',
    proofServer: 'http://localhost:6300',
  },
  preview: {
    networkId: 'preview',
    indexerHttp: 'https://indexer.preview.midnight.network/api/v3/graphql',
    indexerWs: 'wss://indexer.preview.midnight.network/api/v3/graphql/ws',
    node: 'https://rpc.preview.midnight.network',
    proofServer: process.env.VITE_PROOF_SERVER_URL ?? 'http://localhost:6300',
  },
  preprod: {
    networkId: 'preprod',
    indexerHttp: 'https://indexer.preprod.midnight.network/api/v3/graphql',
    indexerWs: 'wss://indexer.preprod.midnight.network/api/v3/graphql/ws',
    node: 'https://rpc.preprod.midnight.network',
    proofServer: process.env.VITE_PROOF_SERVER_URL ?? 'http://localhost:6300',
  },
} as const;

const CONFIG = NETWORK_CONFIG[NETWORK];
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ZK_KEYS_DIR = path.resolve(__dirname, '..', 'managed');
const RULE_PACKS_DIR = path.resolve(__dirname, '..', 'rule-packs');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Pad/truncate a string to exactly 8 bytes for Bytes<8> */
function toBytes8(s: string): Uint8Array {
  const buf = Buffer.alloc(8, 0);
  Buffer.from(s, 'utf8').copy(buf, 0, 0, 8);
  return new Uint8Array(buf);
}

/** SHA-256 hash of a Buffer → Uint8Array<32> */
function sha256(data: Buffer): Uint8Array {
  return new Uint8Array(crypto.createHash('sha256').update(data).digest());
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║     Jurisdiction Registration                      ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  setNetworkId(NETWORK);
  console.log(`[register] Network:      ${NETWORK}`);
  console.log(`[register] Indexer:      ${CONFIG.indexerHttp}`);
  console.log(`[register] Proof server: ${CONFIG.proofServer}`);

  // Read contract address from environment
  const contractAddress = process.env.VITE_CONTRACT_JURISDICTION_REGISTRY;
  if (!contractAddress) {
    throw new Error(
      'VITE_CONTRACT_JURISDICTION_REGISTRY not set. Run npm run deploy:local first.',
    );
  }
  console.log(`[register] Contract:     ${contractAddress}\n`);

  // Build wallet
  // For undeployed (local) network, always use genesis seed — only genesis wallet has funds.
  // For testnet, use DEPLOYER_SEED from .env.realdeal.
  const rawSeed = process.env.DEPLOYER_SEED;
  const seed =
    NETWORK === 'undeployed' ? GENESIS_SEED
    : rawSeed && rawSeed.length === 64 ? rawSeed
    : (() => { throw new Error('DEPLOYER_SEED must be a 64-char hex string.'); })();
  console.log('[register] Building wallet…');
  const wallet = await buildWalletProviders(seed, CONFIG);

  // Build providers
  const zkConfigProvider = new NodeZkConfigProvider(
    path.join(ZK_KEYS_DIR, 'jurisdiction-registry'),
  );
  const providers = {
    publicDataProvider: indexerPublicDataProvider(CONFIG.indexerHttp, CONFIG.indexerWs),
    proofProvider: httpClientProofProvider(CONFIG.proofServer, zkConfigProvider),
    zkConfigProvider,
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'jr-reg-ps',
      privateStoragePasswordProvider: wallet.storagePassword,
      accountId: wallet.dustAddress,
    }),
    walletProvider: wallet.walletProvider,
    midnightProvider: wallet.midnightProvider,
  };

  // Build compiled contract
  const compiledContract = pipe(
    CompiledContract.make('jurisdiction-registry', JurisdictionRegistryContract),
    CompiledContract.withVacantWitnesses,
    CompiledContract.withCompiledFileAssets(path.join(ZK_KEYS_DIR, 'jurisdiction-registry')),
  );

  // Find deployed contract
  console.log('[register] Connecting to deployed contract…');
  const deployed = await findDeployedContract(providers as any, {
    contractAddress,
    compiledContract,
    privateStateId: 'jr-reg-ps',
    initialPrivateState: {},
  });
  console.log('[register] Connected.\n');

  // Enumerate rule packs and register each
  const rulePackFiles = fs
    .readdirSync(RULE_PACKS_DIR)
    .filter((f) => f.endsWith('.json'));

  for (const rulePackFile of rulePackFiles) {
    const rulePackPath = path.join(RULE_PACKS_DIR, rulePackFile);
    const rulePackData = fs.readFileSync(rulePackPath);
    const rulePackJson = JSON.parse(rulePackData.toString());

    const jurisdictionCode = rulePackJson.jurisdictionCode as string;
    const jurisdictionName = rulePackJson.jurisdictionName as string;
    const version = rulePackJson.version as string;

    const codeBytes = toBytes8(jurisdictionCode);
    const hashBytes = sha256(rulePackData);

    console.log(`[register] Registering ${jurisdictionName} (${jurisdictionCode}) v${version}…`);
    console.log(`[register]   Code bytes: ${Buffer.from(codeBytes).toString('hex')}`);
    console.log(`[register]   Rule pack hash: ${Buffer.from(hashBytes).toString('hex')}`);

    const txData = await deployed.callTx.registerNewJurisdiction(codeBytes, hashBytes);
    console.log(
      `[register] ✓ ${jurisdictionCode} registered — tx: ${txData.public.txHash ?? txData.public.txId}`,
    );
  }

  console.log('\n[register] All jurisdictions registered successfully.');
  process.exit(0);
}

main().catch((err) => {
  console.error('\n[register] FAILED:', err?.message ?? err);
  process.exit(1);
});
