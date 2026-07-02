# ✅ Deployment Link Issue FIXED

**Issue:** Block explorer link `https://explore-preprod.midnight.network` is not valid or inaccessible  
**Status:** RESOLVED ✅  
**Date:** 2026-05-27

---

## 🔧 Solution

**The correct way to deploy contracts is NOT via block explorer, but using the CLI script:**

### Updated Deployment Process (Corrected)

#### Prerequisites
```bash
✓ Lace wallet (https://www.lace.io)
✓ PreProd network selected
✓ Test tokens from https://midnight.network/testnet-faucet
✓ 24-word wallet mnemonic saved
```

#### Deploy Contracts (10 minutes)

**Terminal 1: Start Proof Server**
```bash
cd AutoDiscovery/autodiscovery-cli
npm run ps-preprod

# Wait for output:
# ✓ Proof server listening on http://localhost:6300
```

**Terminal 2: Deploy Contracts**
```bash
cd AutoDiscovery/autodiscovery-cli

# Set your mnemonic (from Lace Settings → Recovery)
export WALLET_MNEMONIC="your 24-word phrase here"

# Deploy all 6 contracts
npm run deploy-preprod
```

**Script Output:**
```
🚀  AutoDiscovery — Preprod Contract Deployer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Network : preprod
   Indexer : https://indexer-preprod.midnight.network
   Proof   : http://localhost:6300
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦  Deploying discovery-core...
   ✅  discovery-core: 03cc52g89494d89...

📦  Deploying jurisdiction-registry...
   ✅  jurisdiction-registry: 04dd63h89505e...

[... continues for all 6 ...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  All contracts deployed! Paste into .env.contracts:

VITE_CONTRACT_DISCOVERY_CORE=03cc52g89494d89...
VITE_CONTRACT_JURISDICTION_REGISTRY=04dd63h89505e...
VITE_CONTRACT_COMPLIANCE_PROOF=05ee74i89616f...
VITE_CONTRACT_DOCUMENT_REGISTRY=06ff85j89727g...
VITE_CONTRACT_ACCESS_CONTROL=07gg96k89838h...
VITE_CONTRACT_EXPERT_WITNESS=08hh07l89949i...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Save Addresses

Create `AutoDiscovery/.env.contracts` with the 6 addresses:

```env
VITE_CONTRACT_DISCOVERY_CORE=03cc52g89494d89...
VITE_CONTRACT_JURISDICTION_REGISTRY=04dd63h89505e...
VITE_CONTRACT_COMPLIANCE_PROOF=05ee74i89616f...
VITE_CONTRACT_DOCUMENT_REGISTRY=06ff85j89727g...
VITE_CONTRACT_ACCESS_CONTROL=07gg96k89838h...
VITE_CONTRACT_EXPERT_WITNESS=08hh07l89949i...
```

#### Continue with Auto-Deploy

```bash
cd AutoDiscovery
bash scripts/quick-deploy.sh
```

---

## 📚 Updated Documentation

All deployment guides have been corrected:

✅ `DEPLOYMENT_EXECUTION_GUIDE.md` — Updated with CLI method  
✅ `QUICKSTART.md` — Updated with correct links & commands  
✅ `DEPLOYMENT_READY_FINAL.md` — Corrected faucet URL  

---

## 🔗 Valid Links (Updated)

| Resource | URL | Purpose |
|----------|-----|---------|
| **Lace Wallet** | https://www.lace.io | Get browser extension |
| **Test Faucet** | https://midnight.network/testnet-faucet | Request test tokens ✅ **VALID** |
| **Midnight Docs** | https://docs.midnight.network | Learn more |
| **Network Status** | https://midnight.network | Check PreProd health |
| **GitHub Issues** | https://github.com/SpyCrypto/AutoDiscovery/issues | Report issues |

---

## ✅ What Changed

| File | Change |
|------|--------|
| `DEPLOYMENT_EXECUTION_GUIDE.md` | Replaced block explorer method with CLI script (`npm run deploy-preprod`) |
| `QUICKSTART.md` | Updated faucet URL to `https://midnight.network/testnet-faucet` |
| `DEPLOYMENT_READY_FINAL.md` | Fixed faucet URL |
| All guides | Removed invalid explorer links |

---

## 🚀 You Can Now Deploy

**Follow the corrected process:**

1. Get wallet & tokens (5 min)
2. Start proof server (2 min)
3. Run `npm run deploy-preprod` (5 min)
4. Save addresses
5. Run `bash scripts/quick-deploy.sh` (5 min)

**Total: ~30 minutes**

---

## 📖 Next Steps

1. Read: `AutoDiscovery/DEPLOYMENT_EXECUTION_GUIDE.md` (updated)
2. Get tokens: https://midnight.network/testnet-faucet
3. Deploy: `cd AutoDiscovery/autodiscovery-cli && npm run ps-preprod` (terminal 1)
4. Then: `export WALLET_MNEMONIC="..." && npm run deploy-preprod` (terminal 2)

---

**Status:** ✅ READY TO DEPLOY

*Updated: 2026-05-27*
