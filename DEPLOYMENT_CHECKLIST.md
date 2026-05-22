# 🚀 AutoDiscovery Deployment Checklist

## Status: Contracts Compiled ✅
All 7 contracts have been compiled from Midnight's Compact language and are ready for deployment.

---

## Pre-Deployment Checklist

### Setup (One-Time)
- [ ] Lace wallet installed from https://www.lace.io
- [ ] Lace wallet created or seed imported
- [ ] PreProd network selected in Lace (not MainNet)
- [ ] Test DUST tokens obtained from https://faucet.midnight.network
- [ ] Wallet shows DUST balance > 0 in Lace

### Preparation
- [ ] Contracts compiled in `AutoDiscovery/autodiscovery-contract/src/managed/`
- [ ] Text editor open to save addresses
- [ ] Browser window ready for https://explore-preprod.midnight.network

---

## Deployment Checklist (6 Contracts)

### Contract 1: discovery-core
- [ ] Open https://explore-preprod.midnight.network
- [ ] Connect wallet (click "Connect Wallet" → Lace)
- [ ] Click "Deploy Contract"
- [ ] Select: `autodiscovery-contract/src/managed/discovery-core`
- [ ] Click Deploy
- [ ] Approve in Lace wallet popup
- [ ] Wait 30-60 seconds for confirmation
- [ ] **COPY ADDRESS:** `VITE_CONTRACT_DISCOVERY_CORE=`
- [ ] Save to text file

### Contract 2: compliance-proof
- [ ] Click "Deploy Contract" again
- [ ] Select: `autodiscovery-contract/src/managed/compliance-proof`
- [ ] Click Deploy
- [ ] Approve in Lace
- [ ] Wait for confirmation
- [ ] **COPY ADDRESS:** `VITE_CONTRACT_DISCOVERY_PROOF=`
- [ ] Save to text file

### Contract 3: document-registry
- [ ] Click "Deploy Contract"
- [ ] Select: `autodiscovery-contract/src/managed/document-registry`
- [ ] Click Deploy
- [ ] Approve in Lace
- [ ] Wait for confirmation
- [ ] **COPY ADDRESS:** `VITE_CONTRACT_DOCUMENT_REGISTRY=`
- [ ] Save to text file

### Contract 4: access-control
- [ ] Click "Deploy Contract"
- [ ] Select: `autodiscovery-contract/src/managed/access-control`
- [ ] Click Deploy
- [ ] Approve in Lace
- [ ] Wait for confirmation
- [ ] **COPY ADDRESS:** `VITE_CONTRACT_ACCESS_CONTROL=`
- [ ] Save to text file

### Contract 5: jurisdiction-registry
- [ ] Click "Deploy Contract"
- [ ] Select: `autodiscovery-contract/src/managed/jurisdiction-registry`
- [ ] Click Deploy
- [ ] Approve in Lace
- [ ] Wait for confirmation
- [ ] **COPY ADDRESS:** `VITE_CONTRACT_JURISDICTION_REGISTRY=`
- [ ] Save to text file

### Contract 6: expert-witness
- [ ] Click "Deploy Contract"
- [ ] Select: `autodiscovery-contract/src/managed/expert-witness`
- [ ] Click Deploy
- [ ] Approve in Lace
- [ ] Wait for confirmation
- [ ] **COPY ADDRESS:** `VITE_CONTRACT_EXPERT_WITNESS=`
- [ ] Save to text file

---

## Post-Deployment Checklist

### Save Addresses
- [ ] All 6 addresses copied to text file
- [ ] Addresses are hex strings (~50-100 chars)
- [ ] All start with `02` or `03` (network ID)
- [ ] File looks like:
  ```
  VITE_CONTRACT_DISCOVERY_CORE=03cc52g89494d...
  VITE_CONTRACT_DISCOVERY_PROOF=04dd63h89505e...
  VITE_CONTRACT_DOCUMENT_REGISTRY=05ee74i89616f...
  VITE_CONTRACT_ACCESS_CONTROL=06ff85j89727g...
  VITE_CONTRACT_JURISDICTION_REGISTRY=07gg96k89838h...
  VITE_CONTRACT_EXPERT_WITNESS=08hh07l89949i...
  ```

### Capture Addresses (Automated)
Run the helper script:
```bash
bash scripts/save-contract-addresses.sh
```
- [ ] Script asks for each address
- [ ] Paste each address when prompted
- [ ] Script validates format
- [ ] Addresses saved to `.env.contract-addresses`
- [ ] Optionally merged with `.env.prod`

### Deploy AutoDiscovery
Run the production setup:
```bash
bash scripts/setup-production.sh
```
- [ ] Prerequisites validated (Docker, Node.js)
- [ ] Environment file created
- [ ] Contract addresses found
- [ ] Docker images built
- [ ] Services started
- [ ] All health checks pass

### Verify Deployment
- [ ] Open http://localhost:5174 in browser (RealDeal)
- [ ] Check browser console (F12) - no errors
- [ ] Can see the AutoDiscovery interface
- [ ] Try connecting wallet
- [ ] Try reading contract data

---

## Environment File Template

After all deployments, your file should look like:

```env
# AutoDiscovery Contract Addresses (PreProd)
VITE_NODE_URL=https://preprod-node.midnight.network
VITE_INDEXER_URL=https://preprod-indexer.midnight.network/api/v1/graphql
VITE_INDEXER_WS=wss://preprod-indexer.midnight.network/api/v1/graphql
VITE_PROOF_SERVER_URL=https://preprod-proof-server.midnight.network

VITE_CONTRACT_DISCOVERY_CORE=[ADDRESS_1]
VITE_CONTRACT_DISCOVERY_PROOF=[ADDRESS_2]
VITE_CONTRACT_DOCUMENT_REGISTRY=[ADDRESS_3]
VITE_CONTRACT_ACCESS_CONTROL=[ADDRESS_4]
VITE_CONTRACT_JURISDICTION_REGISTRY=[ADDRESS_5]
VITE_CONTRACT_EXPERT_WITNESS=[ADDRESS_6]
```

---

## Timeline

| Step | Time | Status |
|------|------|--------|
| Setup (Lace, funds) | 5 min | ⏳ Start here |
| Compile contracts | ✅ DONE | Completed |
| Deploy 6 contracts | 15 min | ⏳ Next |
| Save addresses | 2 min | ⏳ After deploy |
| Start AutoDiscovery | 5 min | ⏳ After addresses |
| Verify UI works | 3 min | ⏳ Final |
| **Total** | **~30 min** | - |

---

## Quick Links

- **Midnight Explorer:** https://explore-preprod.midnight.network
- **Lace Wallet:** https://www.lace.io
- **Test Faucet:** https://faucet.midnight.network
- **Midnight Docs:** https://midnight.network/docs

---

## Troubleshooting

### "Can't find deploy button"
→ Make sure wallet is connected first

### "Transaction failed"
→ Wait 30 seconds, ensure you have DUST tokens, try again

### "Contract already exists"
→ Each contract deploys once. Create new Lace account if needed

### "Insufficient balance"
→ Get more test DUST from faucet

---

## Success Criteria

You'll know you're done when:

✅ All 6 contracts deployed and addresses saved
✅ `.env.prod` populated with 6 contract addresses
✅ AutoDiscovery services running (RealDeal on port 5174)
✅ No errors in browser console
✅ Can connect wallet to frontend

---

## Next Command After Deployments

Once you have all 6 addresses, run:

```bash
bash scripts/save-contract-addresses.sh
```

Then:

```bash
bash scripts/setup-production.sh
```

Then:

```
Open http://localhost:5174 in browser 🎉
```

---

**Current Status:** ✅ Contracts Compiled
**Next Step:** 🔄 Deploy to Midnight PreProd
**Deployment Location:** https://explore-preprod.midnight.network

Ready to deploy? Let's go! 🚀
