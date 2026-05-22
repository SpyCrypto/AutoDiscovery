# How to Get the 6 Midnight Contract Addresses - Complete Solution

## Summary

AutoDiscovery needs **6 smart contracts** deployed to Midnight PreProd. This document shows you exactly where to get them.

---

## The 6 Contracts You Need

```
1. VITE_CONTRACT_DISCOVERY_CORE       → Main case/step management
2. VITE_CONTRACT_DISCOVERY_PROOF      → Compliance attestations
3. VITE_CONTRACT_DOCUMENT_REGISTRY    → Document metadata
4. VITE_CONTRACT_ACCESS_CONTROL       → Permission management
5. VITE_CONTRACT_JURISDICTION_REGISTRY → Regional legal rules
6. VITE_CONTRACT_EXPERT_WITNESS       → Expert credentials
```

---

## Fastest Path: 20 Minutes to Deployment

### Prerequisites (Check These First)

- [ ] **Node.js v20+** installed → `node --version`
- [ ] **npm v10+** installed → `npm --version`
- [ ] **Lace Wallet** installed → https://www.lace.io (browser extension)
- [ ] **PreProd network** selected in Lace
- [ ] **Test DUST tokens** → Get at https://faucet.midnight.network

### Step 1: Compile All Contracts (5 min)

```bash
cd AutoDiscovery
npm run compact

# Output: autodiscovery-contract/src/managed/
# You'll have 6 compiled contract folders ready to deploy
```

### Step 2: Deploy to Midnight PreProd (10-15 min)

#### Visual Method (Explorer UI - Easiest)

```
1. Open: https://explore-preprod.midnight.network
2. Click: "Deploy Contract" button
3. For each of 6 contracts:
   a. Browse to: autodiscovery-contract/src/managed/[contract-name]
   b. Click: "Deploy"
   c. Approve in Lace wallet
   d. COPY the contract address shown
4. Save all 6 addresses
```

#### CLI Method (Command Line)

```bash
midnight deploy \
  --contract autodiscovery-contract/src/managed/discovery-core \
  --network preprod \
  --wallet lace

# Repeat for all 6 contracts, saving addresses each time
```

### Step 3: Save Addresses (2 min)

```bash
# Use helper script
bash scripts/save-contract-addresses.sh

# It will ask you to paste each address interactively
# Saves to: .env.contract-addresses

# Verify
cat .env.contract-addresses
```

### Step 4: Deploy AutoDiscovery (5 min)

```bash
# Copy addresses to production config
cat .env.contract-addresses >> .env.prod

# Start everything
bash scripts/setup-production.sh

# Open in browser: http://localhost:5174 (RealDeal)
```

---

## Full Documentation

We created comprehensive guides for each step:

| Document | Purpose | Read Time |
|---|---|---|
| **`GET_CONTRACT_ADDRESSES_QUICK.md`** | Visual quick-start (you are here) | 3 min |
| **`GET_CONTRACT_ADDRESSES.md`** | Step-by-step with troubleshooting | 5 min |
| **`CONTRACT_DEPLOYMENT.md`** | Detailed technical deployment guide | 10 min |
| **`DEPLOYMENT.md`** | Full production deployment guide | 15 min |

---

## If Contracts Are Already Deployed

**Skip compilation!** Just retrieve existing addresses:

### From Midnight Block Explorer

```
1. Go to: https://explore-preprod.midnight.network
2. Search for: "discovery-core" (or any contract name)
3. Click result
4. Copy the "Contract Address" field
5. Repeat for all 6 contracts
```

### If You Have Previous Deployment Logs

```bash
cat DEPLOYMENT_LOG.json | jq '.[] | "\(.contractName): \(.contractAddress)"'

# Output:
# discovery-core: 03cc52g89494d...
# discovery-proof: 04dd63h89505e...
# ... etc
```

---

## Where to Put the Addresses

Once you have all 6 addresses, they go in **`.env.prod`**:

```env
VITE_CONTRACT_DISCOVERY_CORE=03cc52g89494d8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_DISCOVERY_PROOF=04dd63h89505e9d0e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_DOCUMENT_REGISTRY=05ee74i89616f0e1f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_ACCESS_CONTROL=06ff85j89727g1f2g7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_JURISDICTION_REGISTRY=07gg96k89838h2g3h8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_EXPERT_WITNESS=08hh07l89949i3h4i9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f

# Network endpoints (PreProd - same for everyone)
VITE_NODE_URL=https://preprod-node.midnight.network
VITE_INDEXER_URL=https://preprod-indexer.midnight.network/api/v1/graphql
VITE_INDEXER_WS=wss://preprod-indexer.midnight.network/api/v1/graphql
VITE_PROOF_SERVER_URL=https://preprod-proof-server.midnight.network
```

---

## Troubleshooting

### "Contract folder not found"

```bash
# Make sure contracts were compiled
ls autodiscovery-contract/src/managed/

# Should show 6 folders:
# access-control/
# compliance-proof/
# discovery-core/
# document-registry/
# expert-witness/
# jurisdiction-registry/

# If not, recompile:
npm run compact
```

### "Wallet not connected"

```
1. Install Lace: https://www.lace.io
2. Create wallet or import seed
3. In Lace, select "PreProd" network (not MainNet)
4. Make sure you have test DUST tokens
5. Reload the explorer page
```

### "Insufficient balance"

```
1. Go to: https://faucet.midnight.network
2. Paste your wallet address
3. Request tokens
4. Wait 1-2 minutes
5. Check balance in Lace
6. Retry deployment
```

### "Transaction failed"

```
Try these in order:
1. Wait 30 seconds and retry
2. Ensure network is "PreProd" (not MainNet)
3. Increase gas limit in Lace settings
4. Try deploying with CLI instead of UI
5. Check Midnight network status page
```

---

## Common Questions

**Q: Do I need to deploy contracts myself?**  
A: If they're already deployed on PreProd, just get the addresses. If not, follow the 20-minute deployment process above.

**Q: Can I use contracts from MainNet?**  
A: No, use only PreProd contracts. The environment variables must match.

**Q: What if I mess up a deployment?**  
A: Each contract can only deploy once per network. Create a new Lace wallet account and retry.

**Q: How do I know if deployment worked?**  
A: You'll see the contract address returned. Can also check on explorer: https://explore-preprod.midnight.network

**Q: How long do contracts take to deploy?**  
A: Each contract takes ~30 seconds to 1 minute after you approve in Lace.

**Q: Do I need all 6 contracts?**  
A: Yes, all 6 are required for the full dApp to function.

---

## Cheat Sheet (Copy-Paste Commands)

```bash
# Compile
npm run compact

# Save addresses
bash scripts/save-contract-addresses.sh

# Copy to prod config
cat .env.contract-addresses >> .env.prod

# Deploy
bash scripts/setup-production.sh

# Test
curl http://localhost:5174/health
curl http://localhost:8080/health
```

---

## Next Steps After Getting Addresses

1. ✅ All 6 addresses saved to `.env.contract-addresses`
2. ✅ Copied to `.env.prod`
3. ✅ Run `bash scripts/setup-production.sh`
4. ✅ Open http://localhost:5174 in browser
5. ✅ Connect wallet in RealDeal frontend
6. ✅ Test creating a case
7. ✅ Monitor logs: `docker-compose -f docker-compose.prod.yml logs -f`

---

## Reference Links

- **Quick Visual Guide:** `GET_CONTRACT_ADDRESSES_QUICK.md`
- **Step-by-Step Guide:** `GET_CONTRACT_ADDRESSES.md`
- **Technical Deployment:** `CONTRACT_DEPLOYMENT.md`
- **Full Production Guide:** `DEPLOYMENT.md`
- **Midnight Block Explorer:** https://explore-preprod.midnight.network
- **Midnight Docs:** https://midnight.network/docs
- **Lace Wallet:** https://www.lace.io
- **Test Faucet:** https://faucet.midnight.network

---

## Support

- **Issues:** https://github.com/SpyCrypto/AutoDiscovery/issues
- **Technical Questions:** See `PREPROD-REVIEW.md`
- **Integration Details:** See `INTEGRATION-FINDINGS.md`

---

**Time Estimate: 20-30 minutes to have AutoDiscovery fully deployed with contracts**

Ready? Start with: `npm run compact` 🚀
