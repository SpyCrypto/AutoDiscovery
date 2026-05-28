# ✅ DEPLOYMENT READY - Follow These Exact Steps

**Your npm install worked! Now follow these exact commands.**

---

## 📋 Prerequisites (Get Ready)

Before starting, have these ready:

1. **Lace wallet** installed (https://www.lace.io)
2. **PreProd network** selected in Lace
3. **Test tDUST tokens** from https://midnight.network/testnet-faucet
4. **24-word mnemonic** from Lace Settings → Recovery (copy it)

---

## 🚀 Deployment Steps

### STEP 1: Open PowerShell in AutoDiscovery Folder

```powershell
cd AutoDiscovery\autodiscovery-cli
```

Verify you see output with scripts including `deploy-preprod` ✅

---

### STEP 2: Start Proof Server (Terminal 1)

**Keep this terminal window open - DO NOT CLOSE**

```powershell
npm run ps-preprod
```

**Wait for output:**
```
Creating midnightnetwork-proof-server...
midnightnetwork-proof-server | 2026-05-27 12:34:56 listening on http://0.0.0.0:6300
✓ Proof server ready
```

**If you see this, keep terminal open and go to Step 3**

---

### STEP 3: Deploy Contracts (Open NEW Terminal 2)

**Open a completely new PowerShell window** (don't close Terminal 1)

```powershell
cd AutoDiscovery\autodiscovery-cli
```

Now set your wallet mnemonic and deploy:

```powershell
$env:WALLET_MNEMONIC = "word1 word2 word3 ... word24"
npm run deploy-preprod
```

**Replace:** `word1 word2 word3 ... word24` with your actual 24 words from Lace

**Example:**
```powershell
$env:WALLET_MNEMONIC = "abandon ability able about above absent absorb abstract abuse access accident account achieve acid acknowledge acquaintance acorn acquire across act action activate actual add"
npm run deploy-preprod
```

---

### STEP 4: Wait for Deployment

Script will output:

```
🚀  AutoDiscovery — Preprod Contract Deployer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Network : preprod
   Indexer : https://indexer-preprod.midnight.network
   Proof   : http://localhost:6300
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📦  Deploying discovery-core...
   ✅  discovery-core: 03cc52g89494d89495e89606f89717g89828h89

📦  Deploying jurisdiction-registry...
   ✅  jurisdiction-registry: 04dd63h89505e89616g89727h89838i89949j

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

**⏱️ This takes 5-10 minutes**

---

### STEP 5: Save the 6 Addresses

Create a new file: `AutoDiscovery\.env.contracts`

Copy the 6 lines from Step 4 output:

```env
VITE_CONTRACT_DISCOVERY_CORE=03cc52g89494d89...
VITE_CONTRACT_JURISDICTION_REGISTRY=04dd63h89505e...
VITE_CONTRACT_COMPLIANCE_PROOF=05ee74i89616f...
VITE_CONTRACT_DOCUMENT_REGISTRY=06ff85j89727g...
VITE_CONTRACT_ACCESS_CONTROL=07gg96k89838h...
VITE_CONTRACT_EXPERT_WITNESS=08hh07l89949i...
```

**Save the file** (Ctrl+S)

---

### STEP 6: Run Auto-Deploy Script

Open a **third PowerShell window** (or close Terminal 2, keep Terminal 1 running):

```powershell
cd AutoDiscovery
bash scripts/quick-deploy.sh
```

**Script will:**
1. ✅ Ask for 6 contract addresses (paste from .env.contracts)
2. ✅ Ask for wallet mnemonic (same as before)
3. ✅ Ask for unshielded address (from Lace)
4. ✅ Build Docker images
5. ✅ Start services
6. ✅ Verify everything works

---

### STEP 7: Access the UI

Services now running on:

```
💼 RealDeal UI (Live):     http://localhost:5174
🎨 Demoland UI (Mock):     http://localhost:5173
🔧 CLI Dashboard:          http://localhost:8080
```

Open in browser → Connect Lace wallet → Done! 🎉

---

## ✅ Checklist

```
[ ] npm install completed
[ ] Terminal 1: ps-preprod running (proof server)
[ ] Terminal 2: deploy-preprod running
[ ] All 6 contracts deployed (✅ shown)
[ ] Addresses copied to .env.contracts
[ ] quick-deploy.sh ran successfully
[ ] Services running on http://localhost:5174
[ ] Lace wallet connected in UI
```

---

## 🆘 If Something Goes Wrong

### "Connection refused" in Terminal 2
→ Terminal 1 (proof server) not running  
→ Go back to Terminal 1, check it shows "✓ listening"

### "Wallet has no funds"
→ Go to https://midnight.network/testnet-faucet  
→ Get more tDUST tokens  
→ Wait 60 seconds  
→ Try again

### "Port 6300 in use"
→ Another service using port  
→ Kill it: `netstat -ano | findstr :6300` then `taskkill /PID <N> /F`  
→ Try again

### "npm: command not found"
→ Node.js not installed  
→ Download: https://nodejs.org/  
→ Restart PowerShell  
→ Try again

### Any other error
→ Read: `AutoDiscovery/NPM_ERROR_TROUBLESHOOTING.md`

---

## 📝 Summary

**4 Simple Steps:**
1. Terminal 1: `npm run ps-preprod` (proof server)
2. Terminal 2: `$env:WALLET_MNEMONIC = "..."; npm run deploy-preprod` (deploy)
3. Copy 6 addresses to `.env.contracts`
4. Terminal 3: `bash scripts/quick-deploy.sh` (UI)

**Total time: ~30 minutes**

---

## 🎯 Next Actions

1. **Right now:** Follow Step 1-2 above
2. **Terminal 1 running?** → Go to Step 3
3. **Contracts deployed?** → Go to Step 5-6
4. **UI running?** → Connect Lace wallet and test

---

**You're ready! Start with Step 1 now!** 🚀

*AutoDiscovery Deployment Guide - 2026-05-27*
