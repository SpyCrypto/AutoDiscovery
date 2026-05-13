// =============================================================================
// AutoDiscovery Contract Deploy Script
// =============================================================================
// Deploys all 4 AutoDiscovery contracts to the configured Midnight network
// and writes the resulting addresses back to frontend-vite-react/.env.realdeal
//
// NETWORKS:
//   undeployed (local)   → requires: docker compose up
//   preview  (testnet)   → proof-server still runs locally; indexer is hosted
//   preprod  (testnet)   → proof-server still runs locally; indexer is hosted
//
// SETUP:
//   1. Set DEPLOYER_SEED in .env.realdeal (64-char hex seed, NOT a mnemonic)
//   2. Fund the wallet address printed during deploy (from faucet for preview/preprod)
//   3. Run: npm run deploy
//
// HOW DEPLOYER SEED WORKS:
//   The seed derives HD keys (Dust, Zswap, NightExternal) for paying tx fees.
//   For local (undeployed) network, any 64-char hex seed works.
//   For testnet, fund the derived Dust address first.
// =============================================================================

import 'dotenv/config';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';

import {
  Contract as DiscoveryCoreContract,
} from '../managed/discovery-core/contract/index.js';
import {
  Contract as JurisdictionRegistryContract,
} from '../managed/jurisdiction-registry/contract/index.js';
import {
  Contract as ComplianceProofContract,
} from '../managed/compliance-proof/contract/index.js';
import {
  Contract as DocumentRegistryContract,
} from '../managed/document-registry/contract/index.js';

import {
  discoveryCoreWitnesses,
  createDiscoveryCorePrivateState,
} from '../witnesses/discovery-witnesses.js';
import {
  complianceWitnesses,
  createCompliancePrivateState,
} from '../witnesses/compliance-witnesses.js';
import {
  documentRegistryWitnesses,
  createDocumentRegistryPrivateState,
} from '../witnesses/document-witnesses.js';

import { buildWalletProviders, type DeployWalletProviders } from './wallet-setup.js';

// ---------------------------------------------------------------------------
// Network configuration
// ---------------------------------------------------------------------------

const NETWORK = (process.env.MIDNIGHT_NETWORK ?? 'undeployed') as
  | 'undeployed'
  | 'preview'
  | 'preprod';

const NETWORK_CONFIG = {
  undeployed: {
    indexerHttp: 'http://localhost:8088/api/v3/graphql',
    indexerWs: 'ws://localhost:8088/api/v3/graphql/ws',
    node: 'http://localhost:9944',
    proofServer: 'http://localhost:6300',
  },
  preview: {
    indexerHttp: 'https://indexer.preview.midnight.network/api/v3/graphql',
    indexerWs: 'wss://indexer.preview.midnight.network/api/v3/graphql/ws',
    node: 'https://rpc.preview.midnight.network',
    proofServer: process.env.VITE_PROOF_SERVER_URL ?? 'http://localhost:6300',
  },
  preprod: {
    indexerHttp: 'https://indexer.preprod.midnight.network/api/v3/graphql',
    indexerWs: 'wss://indexer.preprod.midnight.network/api/v3/graphql/ws',
    node: 'https://rpc.preprod.midnight.network',
    proofServer: process.env.VITE_PROOF_SERVER_URL ?? 'http://localhost:6300',
  },
} as const;

const CONFIG = NETWORK_CONFIG[NETWORK];
const ZK_KEYS_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'managed');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');

// ---------------------------------------------------------------------------
// Provider factory
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildProviders(contractId: string, wallet: DeployWalletProviders): any {
  return {
    publicDataProvider: indexerPublicDataProvider(CONFIG.indexerHttp, CONFIG.indexerWs),
    proofProvider: httpClientProofProvider(CONFIG.proofServer),
    zkConfigProvider: new NodeZkConfigProvider(path.join(ZK_KEYS_DIR, contractId, 'keys')),
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: `ad-${contractId}-ps`,
      privateStoragePasswordProvider: wallet.storagePassword,
    }),
    walletProvider: wallet.walletProvider,
    midnightProvider: wallet.midnightProvider,
  };
}

// ---------------------------------------------------------------------------
// .env.realdeal updater
// ---------------------------------------------------------------------------

function updateEnvFile(envPath: string, updates: Record<string, string>): void {
  let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^(${key}=).*$`, 'm');
    content = regex.test(content)
      ? content.replace(regex, `$1${value}`)
      : content + `\n${key}=${value}`;
  }
  fs.writeFileSync(envPath, content, 'utf8');
  console.log(`[deploy] Updated ${path.basename(envPath)} with contract addresses`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║     AutoDiscovery Contract Deployment             ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  setNetworkId(NETWORK);
  console.log(`[deploy] Network:      ${NETWORK}`);
  console.log(`[deploy] Indexer:      ${CONFIG.indexerHttp}`);
  console.log(`[deploy] Proof server: ${CONFIG.proofServer}`);

  const seed = process.env.DEPLOYER_SEED;
  if (!seed) {
    throw new Error(
      'DEPLOYER_SEED not set. Add a 64-char hex seed to .env.realdeal or environment.\n' +
      'For testnet, fund the printed wallet address from https://faucet.preprod.midnight.network/',
    );
  }

  console.log('[deploy] Building wallet from seed…');
  const wallet = await buildWalletProviders(seed, CONFIG);
  console.log(`[deploy] Deployer Dust address: ${wallet.dustAddress}\n`);

  // 1. Discovery Core
  console.log('[deploy] Deploying discovery-core…');
  const discoveryDeployed = await deployContract(
    buildProviders('discovery-core', wallet),
    {
      contract: new DiscoveryCoreContract(discoveryCoreWitnesses),
      privateStateId: 'ad-discovery-core-v1',
      initialPrivateState: createDiscoveryCorePrivateState(),
    },
  );
  const discoveryCoreAddress = discoveryDeployed.deployTxData.public.contractAddress;
  console.log(`[deploy] ✓ discovery-core: ${discoveryCoreAddress}`);

  // 2. Jurisdiction Registry (no private state — witnesses map is empty)
  console.log('[deploy] Deploying jurisdiction-registry…');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jurisdictionDeployed = await (deployContract as any)(
    buildProviders('jurisdiction-registry', wallet),
    { contract: new JurisdictionRegistryContract({}) },
  );
  const jurisdictionAddress = jurisdictionDeployed.deployTxData.public.contractAddress;
  console.log(`[deploy] ✓ jurisdiction-registry: ${jurisdictionAddress}`);

  // 3. Compliance Proof
  console.log('[deploy] Deploying compliance-proof…');
  const complianceDeployed = await deployContract(
    buildProviders('compliance-proof', wallet),
    {
      contract: new ComplianceProofContract(complianceWitnesses),
      privateStateId: 'ad-compliance-proof-v1',
      initialPrivateState: createCompliancePrivateState(),
    },
  );
  const complianceAddress = complianceDeployed.deployTxData.public.contractAddress;
  console.log(`[deploy] ✓ compliance-proof: ${complianceAddress}`);

  // 4. Document Registry
  console.log('[deploy] Deploying document-registry…');
  const documentDeployed = await deployContract(
    buildProviders('document-registry', wallet),
    {
      contract: new DocumentRegistryContract(documentRegistryWitnesses),
      privateStateId: 'ad-document-registry-v1',
      initialPrivateState: createDocumentRegistryPrivateState(),
    },
  );
  const documentAddress = documentDeployed.deployTxData.public.contractAddress;
  console.log(`[deploy] ✓ document-registry: ${documentAddress}`);

  // Summary
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║  Deployment Complete — Contract Addresses:        ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`VITE_CONTRACT_DISCOVERY_CORE=${discoveryCoreAddress}`);
  console.log(`VITE_CONTRACT_JURISDICTION_REGISTRY=${jurisdictionAddress}`);
  console.log(`VITE_CONTRACT_COMPLIANCE_PROOF=${complianceAddress}`);
  console.log(`VITE_CONTRACT_DOCUMENT_REGISTRY=${documentAddress}`);

  const envPath = path.join(ROOT, 'frontend-vite-react', '.env.realdeal');
  if (fs.existsSync(envPath)) {
    updateEnvFile(envPath, {
      VITE_CONTRACT_DISCOVERY_CORE: discoveryCoreAddress,
      VITE_CONTRACT_JURISDICTION_REGISTRY: jurisdictionAddress,
      VITE_CONTRACT_COMPLIANCE_PROOF: complianceAddress,
      VITE_CONTRACT_DOCUMENT_REGISTRY: documentAddress,
    });
  }

  console.log('\n[deploy] → Next step: register Idaho IRCP rule pack:');
  console.log('   npm run register-jurisdictions');
}

main().catch((err) => {
  console.error('\n[deploy] FAILED:', err?.message ?? err);
  process.exit(1);
});
