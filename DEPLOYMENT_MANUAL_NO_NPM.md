# 🎯 MANUAL DEPLOYMENT - No npm Errors (Simplest)

**If npm and Docker are giving errors, use this completely manual approach.**

---

## What You Need

1. **Midnight CLI** (command-line tool)
2. **Your wallet mnemonic** (24 words from Lace)
3. **Contract files** (already compiled in your repo)

---

## ⚠️ Know Your Limitations

This approach requires:
- Understanding command-line basics
- Following exact steps
- Having Midnight SDK installed separately

---

## Step 1: Check If Midnight CLI is Installed

```powershell
midnight --version
```

**If you see a version number:** ✅ You have it

**If error "command not found":** ❌ Need to install

### Install Midnight CLI

```powershell
# Option A: Using npm (if npm works)
npm install -g @midnight-ntwrk/cli

# Option B: Download pre-built binary
# https://midnight.network/downloads
```

---

## Step 2: Get Your Contract Files

Your 6 compiled contracts are at:

```
AutoDiscovery\autodiscovery-contract\src\managed\
├── discovery-core
├── compliance-proof
├── document-registry
├── access-control
├── jurisdiction-registry
└── expert-witness
```

Each contains:
- `.prover` file
- `.verifier` file
- `.zkir` file

---

## Step 3: Deploy Using Midnight IDE (Easiest GUI Option)

**Instead of command-line, use the web-based IDE:**

1. Go to **https://midnight.network** (check current URL)
2. Look for "IDE" or "Playground"
3. Click "Deploy Contract"
4. Upload each contract file (`.zkir` file)
5. Connect Lace wallet
6. Click Deploy
7. Approve in Lace
8. Copy contract address
9. Repeat for all 6 contracts

---

## Step 4: Manual Contract Deployment (TypeScript)

If you can run TypeScript directly:

Create file: `deploy.ts`

```typescript
import { deployContract } from '@midnight-ntwrk/midnight-js-contracts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import * as fs from 'fs';

// Your wallet mnemonic
const mnemonic = 'your 24-word phrase';

// Contract path
const contractPath = './AutoDiscovery/autodiscovery-contract/src/managed/discovery-core';

async function deploy() {
  try {
    const contract = await deployContract({
      contractPath,
      mnemonic,
      network: 'preprod',
      proofProvider: httpClientProofProvider('http://localhost:6300'),
    });

    console.log('✅ Deployed:', contract.address);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

deploy();
```

Then run:
```powershell
npx ts-node deploy.ts
```

---

## Alternative: Pre-Deployed Contracts

**If all else fails:**

1. Use **existing deployed contracts** from another project
2. Or ask Midnight team for test contract addresses
3. Use those addresses in `.env.prod`

Example `.env.contracts`:
```env
VITE_CONTRACT_DISCOVERY_CORE=<existing-address>
VITE_CONTRACT_JURISDICTION_REGISTRY=<existing-address>
VITE_CONTRACT_COMPLIANCE_PROOF=<existing-address>
VITE_CONTRACT_DOCUMENT_REGISTRY=<existing-address>
VITE_CONTRACT_ACCESS_CONTROL=<existing-address>
VITE_CONTRACT_EXPERT_WITNESS=<existing-address>
```

Then proceed with UI deployment.

---

## 📞 If Nothing Works

1. **Check Midnight documentation:**
   https://docs.midnight.network/getting-started

2. **Contact Midnight support:**
   https://github.com/midnightntwrk/midnight-local-dev/issues

3. **Use reference implementation:**
   https://github.com/Mackenzie-OO7/midnight-doc-manager

---

## Summary

**Manual deployment options:**
1. ✅ Use Midnight IDE (web-based, easiest)
2. ✅ Install Midnight CLI + deploy command
3. ✅ Use existing deployed contracts
4. ✅ Write custom TypeScript script

**Pick the one that works for your setup!**

---

*Last Updated: 2026-05-27*
