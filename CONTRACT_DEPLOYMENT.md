# AutoDiscovery Contract Deployment Guide

## Overview

AutoDiscovery consists of **7 smart contracts** (compiled from Compact language):

### The 6 Core Contracts (Required for Production)
1. **discovery-core** - Case/step lifecycle management
2. **discovery-proof** - Compliance attestations
3. **jurisdiction-registry** - Regional legal rules
4. **access-control** - Permission grants/revokes
5. **document-registry** - Document metadata storage
6. **expert-witness** - Expert witness registration

### Bonus Contract
7. **counter** - Simple counter for testing

---

## Prerequisites

### 1. Midnight Wallet Setup
You need a Midnight wallet with test funds on PreProd:

- **Lace Wallet** (recommended) - https://www.lace.io
  - Install browser extension
  - Create/import wallet
  - Switch network to **PreProd**
  - Get test DUST tokens from faucet

- **Get Test Funds**
  ```
  PreProd Faucet: https://faucet.midnight.network
  Enter your wallet address
  Receive test DUST (required for deployment gas)
  ```

### 2. Midnight Developer Environment

```bash
# Install Midnight CLI tools
npm install -g @midnight-ntwrk/cli

# Verify installation
midnight --version
```

### 3. Environment Configuration

Create `.env` in root of AutoDiscovery:
```bash
# Midnight Network
MIDNIGHT_NETWORK=preprod

# Wallet (Lace integration)
# This will be filled interactively during deployment
WALLET_TYPE=lace

# Contract deployment
DEPLOY_LOG_LEVEL=info
```

---

## Step 1: Compile All Contracts

```bash
cd AutoDiscovery

# Compile all 7 contracts from Compact
npm run compact

# Output appears in:
# autodiscovery-contract/src/managed/
# - Each contract gets:
#   - index.ts (compiled contract interface)
#   - circuit.ts (ZK circuit)
#   - keys/ (proving/verification keys)
#   - zkir/ (ZK intermediate representation)

# Verify compilation succeeded
ls -la autodiscovery-contract/src/managed/
```

### Expected Output
```
managed/
├── counter/
│   ├── index.ts
│   ├── circuit.ts
│   ├── keys/
│   └── zkir/
├── discovery-core/
│   ├── index.ts
│   ├── circuit.ts
│   ├── keys/
│   └── zkir/
├── discovery-proof/
├── jurisdiction-registry/
├── access-control/
├── document-registry/
└── expert-witness/
```

---

## Step 2: Create Deployment Script

Create `AutoDiscovery/scripts/deploy-contracts.ts`:

```typescript
#!/usr/bin/env node

import { createLogger } from 'pino';
import { execSync } from 'child_process';
import { promises as fs } from 'fs';
import * as path from 'path';

interface ContractDeployment {
  name: string;
  contractPath: string;
  compiledPath: string;
}

const logger = createLogger();

const contracts: ContractDeployment[] = [
  {
    name: 'counter',
    contractPath: 'autodiscovery-contract/src/counter.compact',
    compiledPath: 'autodiscovery-contract/src/managed/counter',
  },
  {
    name: 'discovery-core',
    contractPath: 'autodiscovery-contract/src/contracts/discovery-core.compact',
    compiledPath: 'autodiscovery-contract/src/managed/discovery-core',
  },
  {
    name: 'discovery-proof',
    contractPath: 'autodiscovery-contract/src/contracts/compliance-proof.compact',
    compiledPath: 'autodiscovery-contract/src/managed/compliance-proof',
  },
  {
    name: 'jurisdiction-registry',
    contractPath: 'autodiscovery-contract/src/contracts/jurisdiction-registry.compact',
    compiledPath: 'autodiscovery-contract/src/managed/jurisdiction-registry',
  },
  {
    name: 'access-control',
    contractPath: 'autodiscovery-contract/src/contracts/access-control.compact',
    compiledPath: 'autodiscovery-contract/src/managed/access-control',
  },
  {
    name: 'document-registry',
    contractPath: 'autodiscovery-contract/src/contracts/document-registry.compact',
    compiledPath: 'autodiscovery-contract/src/managed/document-registry',
  },
  {
    name: 'expert-witness',
    contractPath: 'autodiscovery-contract/src/contracts/expert-witness.compact',
    compiledPath: 'autodiscovery-contract/src/managed/expert-witness',
  },
];

interface DeploymentResult {
  contractName: string;
  contractAddress: string;
  transactionHash: string;
  blockHeight: number;
  deployedAt: string;
}

const deploymentResults: DeploymentResult[] = [];

async function deployContract(contract: ContractDeployment): Promise<void> {
  logger.info(`\n>>> Deploying ${contract.name}...`);

  try {
    // Import compiled contract
    const compiled = await import(
      path.resolve(contract.compiledPath, 'index.js')
    );

    // Use Midnight SDK to deploy
    // NOTE: This requires wallet setup via Lace extension
    const deploymentTx = await deployToMidnight({
      contract: compiled,
      network: 'preprod',
      walletType: 'lace', // Assumes Lace connected
      gasLimit: 5000000,
    });

    const result: DeploymentResult = {
      contractName: contract.name,
      contractAddress: deploymentTx.contractAddress,
      transactionHash: deploymentTx.txHash,
      blockHeight: deploymentTx.blockHeight,
      deployedAt: new Date().toISOString(),
    };

    deploymentResults.push(result);

    logger.info(`✓ ${contract.name} deployed at: ${deploymentTx.contractAddress}`);
  } catch (error) {
    logger.error(`✗ Failed to deploy ${contract.name}:`, error);
    throw error;
  }
}

async function saveDeploymentLog(): Promise<void> {
  const logPath = 'DEPLOYMENT_LOG.json';
  const envPath = '.env.deployed';

  // Save detailed JSON log
  await fs.writeFile(logPath, JSON.stringify(deploymentResults, null, 2));
  logger.info(`✓ Deployment log saved to ${logPath}`);

  // Save env format for easy copy-paste
  let envContent = `# AutoDiscovery Contract Addresses (PreProd)\n`;
  envContent += `# Deployed: ${new Date().toISOString()}\n\n`;

  for (const result of deploymentResults) {
    const envName = `VITE_CONTRACT_${result.contractName.toUpperCase().replace(/-/g, '_')}`;
    envContent += `${envName}=${result.contractAddress}\n`;
  }

  await fs.writeFile(envPath, envContent);
  logger.info(`✓ Environment file saved to ${envPath}`);
  logger.info(`\nCopy these to .env.prod:\n${envContent}`);
}

async function main(): Promise<void> {
  logger.info('=== AutoDiscovery Contract Deployment (PreProd) ===\n');
  logger.info('Prerequisites:');
  logger.info('  ✓ Lace wallet installed and connected');
  logger.info('  ✓ Test DUST funds available on PreProd');
  logger.info('  ✓ Contracts compiled (npm run compact)\n');

  try {
    for (const contract of contracts) {
      await deployContract(contract);
    }

    await saveDeploymentLog();

    logger.info('\n=== Deployment Complete ===\n');
    logger.info('Next steps:');
    logger.info('  1. Review DEPLOYMENT_LOG.json');
    logger.info('  2. Copy addresses from .env.deployed to .env.prod');
    logger.info('  3. Start production with: bash scripts/setup-production.sh');
  } catch (error) {
    logger.error('Deployment failed:', error);
    process.exit(1);
  }
}

main();
```

---

## Step 3: Manual Deployment (Recommended for First-Time)

Since the deployment script uses interactive Lace wallet, deploy manually:

### Using Midnight Explorer UI

1. **Go to Midnight Explorer**
   - Network: PreProd
   - https://explore-preprod.midnight.network

2. **Connect Wallet**
   - Click "Connect Wallet"
   - Select Lace
   - Authorize connection

3. **Deploy Each Contract**
   ```typescript
   // For each contract in src/managed/:
   
   import { CompiledContract } from '@midnight-ntwrk/midnight-js-contracts';
   import * as DiscoveryCore from '@autodiscovery/contract/dist/managed/discovery-core';
   
   const contract = CompiledContract.from(DiscoveryCore);
   const deployed = await contract.deploy({
     name: 'discovery-core',
     initialState: {}, // Empty initial private state
   });
   
   console.log('Deployed at:', deployed.contractAddress);
   ```

### Using CLI Tools

```bash
# Install Midnight CLI
npm install -g @midnight-ntwrk/cli

# Deploy counter first (test deployment)
midnight deploy \
  --contract autodiscovery-contract/src/managed/counter/index.ts \
  --network preprod \
  --wallet lace

# Then deploy core contracts
midnight deploy \
  --contract autodiscovery-contract/src/managed/discovery-core/index.ts \
  --network preprod \
  --wallet lace
```

---

## Step 4: Capture Contract Addresses

After deployment, you'll see output like:

```
✓ counter deployed at: 02fb41f89384c7b8c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
✓ discovery-core deployed at: 03cc52g89494d8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
...
```

**Copy all 6 contract addresses** (exclude counter for production):

```env
VITE_CONTRACT_DISCOVERY_CORE=03cc52g89494d...
VITE_CONTRACT_DISCOVERY_PROOF=04dd63h89505e...
VITE_CONTRACT_DOCUMENT_REGISTRY=05ee74i89616f...
VITE_CONTRACT_ACCESS_CONTROL=06ff85j89727g...
VITE_CONTRACT_JURISDICTION_REGISTRY=07gg96k89838h...
VITE_CONTRACT_EXPERT_WITNESS=08hh07l89949i...
```

---

## Step 5: Verify Deployments

```bash
# Check contract state on PreProd indexer
curl -X POST https://preprod-indexer.midnight.network/api/v1/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{
      contractState(contractAddress: \"03cc52g89494d...\") {
        address
        state
        blockHeight
      }
    }"
  }'

# Expected response:
# {
#   "data": {
#     "contractState": {
#       "address": "03cc52g89494d...",
#       "state": {...},
#       "blockHeight": 123456
#     }
#   }
# }
```

---

## Step 6: Add to Production Environment

```bash
# Copy the deployment log to your env file
cp .env.deployed .env.prod

# Or manually add to .env.prod:
VITE_CONTRACT_DISCOVERY_CORE=...
VITE_CONTRACT_DISCOVERY_PROOF=...
VITE_CONTRACT_DOCUMENT_REGISTRY=...
VITE_CONTRACT_ACCESS_CONTROL=...
VITE_CONTRACT_JURISDICTION_REGISTRY=...
VITE_CONTRACT_EXPERT_WITNESS=...

# Fill in network endpoints
VITE_NODE_URL=https://preprod-node.midnight.network
VITE_INDEXER_URL=https://preprod-indexer.midnight.network/api/v1/graphql
VITE_PROOF_SERVER_URL=https://preprod-proof-server.midnight.network
```

---

## Contract Architecture

### discovery-core
- **Purpose:** Main case and step lifecycle
- **State:** Cases indexed by ID, steps tracked by case
- **Witnesses:** `DiscoveryCoreWitness` validates case/step creation
- **API:** `createCase()`, `createStep()`, `getCase()`, `getSteps()`

### discovery-proof (compliance-proof)
- **Purpose:** Compliance attestations per step
- **State:** Proof records indexed by step ID
- **Witnesses:** `ComplianceProofWitness` validates proof data
- **API:** `attestCompliance()`, `getAttestation()`

### jurisdiction-registry
- **Purpose:** Regional legal rule packs
- **State:** Rule packs indexed by jurisdiction code
- **Witnesses:** `JurisdictionWitness` validates rule pack hash
- **API:** `registerRulePack()`, `getRulePack()`, `verifyRulePack()`

### access-control
- **Purpose:** Permission management
- **State:** Access grants indexed by (user, resource)
- **Witnesses:** `AccessControlWitness` validates permission changes
- **API:** `grantAccess()`, `revokeAccess()`, `hasAccess()`

### document-registry
- **Purpose:** Document metadata
- **State:** Document records indexed by hash
- **Witnesses:** `DocumentWitness` validates document registration
- **API:** `registerDocument()`, `getDocument()`, `updateMetadata()`

### expert-witness
- **Purpose:** Expert witness registry
- **State:** Expert records indexed by ID
- **Witnesses:** `ExpertWitnessWitness` validates expert credentials
- **API:** `registerExpert()`, `getExpert()`, `revokeCredential()`

---

## Troubleshooting

### "Wallet not connected" error
```bash
# Solution: Install and connect Lace wallet
# 1. Open https://www.lace.io
# 2. Install browser extension
# 3. Create wallet or import seed phrase
# 4. Switch to PreProd network
# 5. Reload page and retry
```

### "Insufficient gas" error
```bash
# Solution: Get more test DUST tokens
# 1. Go to https://faucet.midnight.network
# 2. Enter wallet address
# 3. Receive test tokens (may take 1-2 minutes)
# 4. Retry deployment
```

### "Circuit compilation error"
```bash
# Solution: Recompile contracts
npm run compact:all

# Check for errors
npm run typecheck

# Try deploying just counter first
midnight deploy \
  --contract autodiscovery-contract/src/managed/counter/index.ts
```

### "Contract already deployed at this address"
```bash
# Solution: Use a new wallet account or different network
# Each contract can only be deployed once per network
# Create new Lace account → Switch to PreProd → Retry
```

---

## Quick Copy-Paste Template

After deployment, copy this and fill in addresses:

```env
# AutoDiscovery Contract Addresses (PreProd)
VITE_NODE_URL=https://preprod-node.midnight.network
VITE_INDEXER_URL=https://preprod-indexer.midnight.network/api/v1/graphql
VITE_INDEXER_WS=wss://preprod-indexer.midnight.network/api/v1/graphql
VITE_PROOF_SERVER_URL=https://preprod-proof-server.midnight.network

VITE_CONTRACT_DISCOVERY_CORE=<paste_address_here>
VITE_CONTRACT_DISCOVERY_PROOF=<paste_address_here>
VITE_CONTRACT_DOCUMENT_REGISTRY=<paste_address_here>
VITE_CONTRACT_ACCESS_CONTROL=<paste_address_here>
VITE_CONTRACT_JURISDICTION_REGISTRY=<paste_address_here>
VITE_CONTRACT_EXPERT_WITNESS=<paste_address_here>
```

---

## References

- **Midnight Developer Docs:** https://midnight.network/docs
- **Lace Wallet:** https://www.lace.io
- **PreProd Faucet:** https://faucet.midnight.network
- **PreProd Explorer:** https://explore-preprod.midnight.network
- **Contract Compilation:** See `AutoDiscovery/autodiscovery-contract/package.json` scripts
- **Integration Guide:** See `INTEGRATION-FINDINGS.md`

---

**Last Updated:** 2026-05-13
