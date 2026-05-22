# Midnight Contract Deployment - Manual Guide

## ⚠️ Important: Browser-Based Deployment Required

The Midnight contracts must be deployed through a **browser-based interface** because they require:
- Interactive Lace wallet connection
- User approval for each transaction
- Transaction signing through the wallet extension

This **cannot be automated** in a CLI environment.

---

## Step-by-Step Deployment Process

### Prerequisites (One-Time Setup)

1. **Install Lace Wallet** (Browser Extension)
   - Go to: https://www.lace.io
   - Install for Chrome, Firefox, or Edge
   - Create new wallet or import existing seed

2. **Switch to PreProd Network**
   - Open Lace extension
   - Click network dropdown (top right)
   - Select "PreProd" (not MainNet)

3. **Get Test DUST Tokens**
   - Go to: https://faucet.midnight.network
   - Paste your wallet address
   - Request tokens
   - Wait 1-2 minutes for funds to appear

4. **Verify Balance**
   - Open Lace wallet
   - Should show DUST balance > 0

---

## Method 1: Midnight Explorer (Visual - Recommended)

### Step 1: Open Block Explorer
```
URL: https://explore-preprod.midnight.network
```

### Step 2: Connect Wallet
- Look for "Connect Wallet" button
- Click it
- Select "Lace Wallet"
- Approve in Lace extension

### Step 3: Deploy Each Contract

**For discovery-core (Start Here):**

1. Click "Deploy Contract" button
2. Select contract source:
   - Option A: Upload folder `autodiscovery-contract/src/managed/discovery-core`
   - Option B: Paste compiled code if available
3. Review contract details
4. Click "Deploy"
5. In Lace wallet popup:
   - Review transaction
   - Approve gas fee
   - Confirm transaction
6. **Wait 30-60 seconds** for confirmation
7. **COPY the contract address** shown (e.g., `03cc52g89494d...`)
8. Save it to a text file

**Repeat for remaining 5 contracts:**
- compliance-proof (discovery-proof)
- document-registry
- access-control
- jurisdiction-registry
- expert-witness

---

## Method 2: Using Deployment Markdown File

We've created a file with all deployment details:

**File:** `CONTRACT_DEPLOYMENT.md` in AutoDiscovery root

This includes:
- Detailed contract descriptions
- Architecture information
- Verification procedures
- Troubleshooting guide

---

## Deployment Order (Recommended)

Deploy in this sequence (helps with gas estimation):

1. **counter** (optional - for testing)
2. **discovery-core** (primary contract)
3. **compliance-proof** (depends on discovery-core)
4. **document-registry**
5. **access-control**
6. **jurisdiction-registry**
7. **expert-witness**

---

## What You'll Get Back

After each deployment, you'll receive:

```
Contract Address: 03cc52g89494d8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
Transaction Hash: 0x1234567890abcdef...
Block Height: 123456
Status: Confirmed
```

**SAVE ALL 6 ADDRESSES** to a text file. Example:

```
VITE_CONTRACT_DISCOVERY_CORE=03cc52g89494d8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_DISCOVERY_PROOF=04dd63h89505e9d0e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_DOCUMENT_REGISTRY=05ee74i89616f0e1f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_ACCESS_CONTROL=06ff85j89727g1f2g7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_JURISDICTION_REGISTRY=07gg96k89838h2g3h8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_EXPERT_WITNESS=08hh07l89949i3h4i9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
```

---

## Common Issues During Deployment

### "Wallet not connected"
```
Solution:
1. Install Lace: https://www.lace.io
2. Create wallet
3. Select PreProd network
4. Reload explorer page
5. Click Connect Wallet again
```

### "Insufficient balance"
```
Solution:
1. Get test DUST: https://faucet.midnight.network
2. Wait 1-2 minutes
3. Check balance in Lace (should see DUST)
4. Retry deployment
```

### "Transaction failed"
```
Solutions (try in order):
1. Wait 30 seconds and retry
2. Increase gas limit (if option available)
3. Try with different Lace account
4. Check network status: https://midnight.network
5. Review contract for syntax errors
```

### "Contract at address already exists"
```
Solution:
Each contract deploys only once per network.
- Use a different wallet account (create new in Lace)
- Deploy to TestNet instead
- Verify address was returned correctly
```

### "Network error / timeout"
```
Solutions:
1. Check internet connection
2. Verify PreProd network is selected in Lace
3. Reload explorer page
4. Try again (network may be busy)
```

---

## After Deployment: Save Addresses

Once you have all 6 addresses, use our helper script:

```bash
bash scripts/save-contract-addresses.sh
```

This script will:
1. Ask you to paste each address
2. Validate the format
3. Save to `.env.contract-addresses`
4. Optionally copy to `.env.prod`

---

## Verify Deployments on Explorer

After each deployment, verify on the block explorer:

```
1. Go to: https://explore-preprod.midnight.network
2. Search for your contract address
3. Should show:
   - Contract details
   - Deployment block
   - Current state
```

Example search:
```
https://explore-preprod.midnight.network/search?q=03cc52g89494d...
```

---

## Next Steps After All Deployments

Once all 6 contracts are deployed and addresses are saved:

```bash
# 1. Verify addresses saved
cat .env.contract-addresses

# 2. Deploy AutoDiscovery with contracts
bash scripts/setup-production.sh

# 3. Access the application
# - RealDeal: http://localhost:5174
# - CLI: http://localhost:8080

# 4. Test functionality
# - Open RealDeal in browser
# - Connect wallet
# - Create a test case
# - Verify contract interaction
```

---

## Detailed Information About Each Contract

### 1. discovery-core
- **Purpose:** Main case and step lifecycle management
- **Gas Estimate:** ~500,000 MIST
- **Deploy Time:** 30-60 seconds

### 2. compliance-proof (called "discovery-proof" in .env)
- **Purpose:** Compliance attestations and proofs
- **Gas Estimate:** ~450,000 MIST
- **Deploy Time:** 30-60 seconds

### 3. document-registry
- **Purpose:** Document metadata storage and retrieval
- **Gas Estimate:** ~400,000 MIST
- **Deploy Time:** 30-60 seconds

### 4. access-control
- **Purpose:** Permission management and access grants
- **Gas Estimate:** ~350,000 MIST
- **Deploy Time:** 30-60 seconds

### 5. jurisdiction-registry
- **Purpose:** Regional legal rule packs and verification
- **Gas Estimate:** ~400,000 MIST
- **Deploy Time:** 30-60 seconds

### 6. expert-witness
- **Purpose:** Expert witness registry and credentials
- **Gas Estimate:** ~350,000 MIST
- **Deploy Time:** 30-60 seconds

**Total Gas:** ~2.5M MIST (approximately)
**Faucet gives:** Usually enough for multiple deployments

---

## Helpful Links

| Resource | URL |
|----------|-----|
| **Midnight Explorer** | https://explore-preprod.midnight.network |
| **Lace Wallet** | https://www.lace.io |
| **PreProd Faucet** | https://faucet.midnight.network |
| **Midnight Docs** | https://midnight.network/docs |
| **AutoDiscovery Repo** | https://github.com/SpyCrypto/AutoDiscovery |
| **Deployment Guide** | See `CONTRACT_DEPLOYMENT.md` |

---

## Troubleshooting Checklist

- [ ] Lace wallet installed and working
- [ ] PreProd network selected in Lace
- [ ] Wallet has DUST tokens (> 0)
- [ ] Explorer page loads at https://explore-preprod.midnight.network
- [ ] Can connect wallet to explorer
- [ ] Can see "Deploy Contract" option
- [ ] Contracts compiled in `src/managed/`
- [ ] Ready to deploy first contract

---

## What Happens Next

After deployment:

1. **Addresses obtained** ✓
2. **Saved to environment file** ✓
3. **AutoDiscovery started with addresses** ✓
4. **Frontend connects to contracts** ✓
5. **Full dApp operational** ✓

---

## Questions or Issues?

- Check `CONTRACT_DEPLOYMENT.md` for full technical details
- Review `PREPROD-REVIEW.md` for architecture notes
- Visit GitHub: https://github.com/SpyCrypto/AutoDiscovery/issues
- Read Midnight docs: https://midnight.network/docs

---

**Ready to deploy?** 

Open your browser and go to:
## 👉 https://explore-preprod.midnight.network

Start with deploying `discovery-core` first!

---

**Time Estimate:** 10-15 minutes for all 6 deployments
