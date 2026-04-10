/**
 * deploy_preprod.ts
 *
 * Deploys all 6 AutoDiscovery contracts to the Midnight preprod network
 * and prints a ready-to-paste .env.realdeal block with the contract addresses.
 *
 * Usage:
 *   WALLET_MNEMONIC="word1 word2 ..." npm run deploy-preprod
 *
 * Prerequisites:
 *   - Local proof server running at http://127.0.0.1:6300
 *     (start with: cd autodiscovery-cli && npm run ps-preview, or run Docker manually)
 *   - Wallet funded with tNIGHT/tDUST on preprod
 *     (faucet: https://midnight.network/testnet-faucet)
 */

import path from 'node:path';
import { WebSocket } from 'ws';
import { createLogger } from './logger.js';
import { PreprodConfig, currentDir } from './config.js';
import * as api from './api.js';
import {
  setNetworkId,
} from '@midnight-ntwrk/midnight-js-network-id';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import {
  createDiscoveryCorePrivateState,
  createRegistryPrivateState,
  createCompliancePrivateState,
  createDocumentRegistryPrivateState,
  createAccessControlPrivateState,
  createExpertWitnessPrivateState,
} from '@autodiscovery/contract';
import 'dotenv/config';

// @ts-expect-error: globalThis WebSocket polyfill for Apollo
globalThis.WebSocket = WebSocket;

const MANAGED_DIR = path.resolve(currentDir, '..', '..', 'autodiscovery-contract', 'src', 'managed');

function zkPath(contractName: string) {
  return path.resolve(MANAGED_DIR, contractName);
}

const config = new PreprodConfig();
const logger = await createLogger(config.logDir);
api.setLogger(logger);

const mnemonic = process.env.WALLET_MNEMONIC;
if (!mnemonic) {
  console.error('\n❌  Set WALLET_MNEMONIC env var before running:\n');
  console.error('   WALLET_MNEMONIC="word1 word2 ..." npm run deploy-preprod\n');
  process.exit(1);
}

console.log('\n🚀  AutoDiscovery — Preprod Contract Deployer');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`   Network : preprod`);
console.log(`   Indexer : ${config.indexer}`);
console.log(`   Proof   : ${config.proofServer}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// 1. Build wallet and wait for funds
const walletContext = await api.buildWalletAndWaitForFunds(config, mnemonic);

// 2. Set network ID globally
setNetworkId(config.networkId);

// 3. Build shared providers
const walletAndMidnightProvider = await api.createWalletAndMidnightProvider(walletContext);
const publicDataProvider = indexerPublicDataProvider(config.indexer, config.indexerWS);
const proofProvider = httpClientProofProvider(config.proofServer);

function buildProviders(contractName: string, privateStateId: string, circuits: string[]) {
  return {
    publicDataProvider,
    proofProvider,
    walletProvider: walletAndMidnightProvider,
    midnightProvider: walletAndMidnightProvider,
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: `${contractName}-private-state`,
      signingKeyStoreName: `${contractName}-signing-keys`,
      midnightDbName: `${contractName}-level-db`,
      privateStoragePasswordProvider: () => '1234567890123456',
    }),
    zkConfigProvider: new NodeZkConfigProvider(zkPath(contractName)),
  };
}

const addresses: Record<string, string> = {};

// 4. Deploy all 6 contracts sequentially
console.log('📦  Deploying discovery-core...');
const discoveryCore = await api.deploy(
  buildProviders('discovery-core', 'discoveryCorePrivateState', []) as any,
  createDiscoveryCorePrivateState(),
);
addresses['VITE_CONTRACT_DISCOVERY_CORE'] = discoveryCore.deployTxData.public.contractAddress;
console.log(`   ✅  discovery-core: ${addresses['VITE_CONTRACT_DISCOVERY_CORE']}\n`);

console.log('📦  Deploying jurisdiction-registry...');
const jurisdictionRegistry = await api.deployJurisdictionRegistry(
  buildProviders('jurisdiction-registry', 'jurisdictionRegistryPrivateState', []) as any,
  createRegistryPrivateState(),
);
addresses['VITE_CONTRACT_JURISDICTION_REGISTRY'] = jurisdictionRegistry.deployTxData.public.contractAddress;
console.log(`   ✅  jurisdiction-registry: ${addresses['VITE_CONTRACT_JURISDICTION_REGISTRY']}\n`);

console.log('📦  Deploying compliance-proof...');
const complianceProof = await api.deployComplianceProof(
  buildProviders('compliance-proof', 'complianceProofPrivateState', []) as any,
  createCompliancePrivateState(),
);
addresses['VITE_CONTRACT_COMPLIANCE_PROOF'] = complianceProof.deployTxData.public.contractAddress;
console.log(`   ✅  compliance-proof: ${addresses['VITE_CONTRACT_COMPLIANCE_PROOF']}\n`);

console.log('📦  Deploying document-registry...');
const documentRegistry = await api.deployDocumentRegistry(
  buildProviders('document-registry', 'documentRegistryPrivateState', []) as any,
  createDocumentRegistryPrivateState(),
);
addresses['VITE_CONTRACT_DOCUMENT_REGISTRY'] = documentRegistry.deployTxData.public.contractAddress;
console.log(`   ✅  document-registry: ${addresses['VITE_CONTRACT_DOCUMENT_REGISTRY']}\n`);

console.log('📦  Deploying access-control...');
const accessControl = await api.deployAccessControl(
  buildProviders('access-control', 'accessControlPrivateState', []) as any,
  createAccessControlPrivateState(),
);
addresses['VITE_CONTRACT_ACCESS_CONTROL'] = accessControl.deployTxData.public.contractAddress;
console.log(`   ✅  access-control: ${addresses['VITE_CONTRACT_ACCESS_CONTROL']}\n`);

console.log('📦  Deploying expert-witness...');
const expertWitness = await api.deployExpertWitness(
  buildProviders('expert-witness', 'expertWitnessPrivateState', []) as any,
  createExpertWitnessPrivateState(),
);
addresses['VITE_CONTRACT_EXPERT_WITNESS'] = expertWitness.deployTxData.public.contractAddress;
console.log(`   ✅  expert-witness: ${addresses['VITE_CONTRACT_EXPERT_WITNESS']}\n`);

// 5. Print the .env block
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✅  All contracts deployed! Paste into frontend-realdeal/.env.realdeal:\n');
for (const [key, value] of Object.entries(addresses)) {
  console.log(`${key}=${value}`);
}
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

await api.closeWallet(walletContext);
process.exit(0);
