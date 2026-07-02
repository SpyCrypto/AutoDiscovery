# Get 6 Midnight Contract Addresses - Quick Guide

## The 6 Contracts You Need to Deploy

```
AutoDiscovery dApp
├── discovery-core ..................... Main case/step lifecycle
├── discovery-proof .................... Compliance attestations  
├── jurisdiction-registry .............. Regional legal rules
├── access-control ..................... Permission management
├── document-registry .................. Document metadata
└── expert-witness ..................... Expert witness credentials
```

---

## 3-Step Deployment Process

### Step 1: Compile Contracts (5 min)

```bash
cd AutoDiscovery

# Download Compact toolkit and compile all contracts
npm run compact

# Output: AutoDiscovery/autodiscovery-contract/src/managed/
# - discovery-core/
# - discovery-proof/
# - jurisdiction-registry/
# - access-control/
# - document-registry/
# - expert-witness/
```

### Step 2: Deploy to Midnight PreProd (10-15 min)

**Option A: Using Midnight Explorer (Easiest)**

1. Go to: https://explore-preprod.midnight.network
2. Click "Deploy Contract" button
3. For each contract in `autodiscovery-contract/src/managed/`:
   - Select contract folder
   - Click "Deploy"
   - Approve in Lace wallet
   - **Copy the returned address** (e.g., `03cc52g89494d...`)

**Option B: Using CLI**

```bash
# Install Midnight CLI
npm install -g @midnight-ntwrk/cli

# Deploy each contract
midnight deploy \
  --contract autodiscovery-contract/src/managed/discovery-core \
  --network preprod \
  --wallet lace

# Repeat for all 6 contracts
```

### Step 3: Save Addresses (2 min)

```bash
# Use helper script to capture addresses
bash scripts/save-contract-addresses.sh

# Script will ask you to paste each address
# Enter the 6 addresses when prompted
# Saves to: .env.contract-addresses

# Verify saved correctly
cat .env.contract-addresses
```

---

## Complete Address Checklist

After deployment, you should have these 6 addresses:

```env
VITE_CONTRACT_DISCOVERY_CORE=          [PASTE_ADDRESS_1]
VITE_CONTRACT_DISCOVERY_PROOF=         [PASTE_ADDRESS_2]
VITE_CONTRACT_DOCUMENT_REGISTRY=       [PASTE_ADDRESS_3]
VITE_CONTRACT_ACCESS_CONTROL=          [PASTE_ADDRESS_4]
VITE_CONTRACT_JURISDICTION_REGISTRY=   [PASTE_ADDRESS_5]
VITE_CONTRACT_EXPERT_WITNESS=          [PASTE_ADDRESS_6]
```

---

## Prerequisites (Before You Start)

### 1. Lace Wallet
- [ ] Install Lace browser extension: https://www.lace.io
- [ ] Create or import wallet
- [ ] Switch network to **PreProd** (not MainNet)

### 2. Test Funds
- [ ] Go to faucet: https://faucet.midnight.network
- [ ] Enter wallet address
- [ ] Receive test DUST tokens
- [ ] Wait 1-2 minutes for tokens to arrive
- [ ] Check balance in Lace

### 3. Node.js
- [ ] Node.js v20+ installed: `node --version`
- [ ] npm v10+ installed: `npm --version`

---

## Command Cheat Sheet

```bash
# 1. Compile
npm run compact

# 2. Save addresses
bash scripts/save-contract-addresses.sh

# 3. Verify addresses saved
cat .env.contract-addresses

# 4. Copy to production config
cp .env.contract-addresses .env.prod

# 5. Deploy AutoDiscovery with addresses
bash scripts/setup-production.sh
```

---

## Common Issues & Solutions

### "Wallet not found"
→ Install Lace: https://www.lace.io

### "Need PreProd network"
→ In Lace, click network dropdown → select PreProd

### "Insufficient balance"
→ Get test DUST: https://faucet.midnight.network

### "Compilation error"
```bash
# Recompile with verbose output
npm run compact -- --verbose

# Check TypeScript errors
npm run typecheck
```

### "Can't find contract folder"
```bash
# Verify contracts were compiled
ls autodiscovery-contract/src/managed/

# Should show 6 folders:
# access-control/ compliance-proof/ discovery-core/
# document-registry/ expert-witness/ jurisdiction-registry/
```

---

## What Each Address Is For

### VITE_CONTRACT_DISCOVERY_CORE
- **What:** Main contract for managing cases and steps
- **Used by:** Frontend to create/read case lifecycle data
- **Network:** PreProd

### VITE_CONTRACT_DISCOVERY_PROOF
- **What:** Stores compliance proof attestations
- **Used by:** Frontend to validate compliance at each step
- **Network:** PreProd

### VITE_CONTRACT_DOCUMENT_REGISTRY
- **What:** Stores document metadata (hash, owner, timestamp)
- **Used by:** Frontend to register and retrieve documents
- **Network:** PreProd

### VITE_CONTRACT_ACCESS_CONTROL
- **What:** Manages permission grants/revokes
- **Used by:** Frontend to check who can access resources
- **Network:** PreProd

### VITE_CONTRACT_JURISDICTION_REGISTRY
- **What:** Stores regional legal rule packs
- **Used by:** Frontend to verify compliance rules by jurisdiction
- **Network:** PreProd

### VITE_CONTRACT_EXPERT_WITNESS
- **What:** Registry of expert witnesses and credentials
- **Used by:** Frontend for expert witness lookups
- **Network:** PreProd

---

## After Getting Addresses

1. **Save them securely**
   ```bash
   # Save to encrypted file or password manager
   cat .env.contract-addresses
   # Back up this file!
   ```

2. **Add to production config**
   ```bash
   bash scripts/save-contract-addresses.sh  # Interactive capture
   # OR
   cat .env.contract-addresses >> .env.prod  # Manual copy
   ```

3. **Deploy AutoDiscovery**
   ```bash
   bash scripts/setup-production.sh
   # All services will start with contract addresses
   ```

4. **Test the UI**
   ```
   Visit: http://localhost:5174 (RealDeal Frontend)
   
   Verify:
   - Can read jurisdiction registry ✓
   - Can view case list ✓
   - Can view documents ✓
   - Wallet connects and signs ✓
   ```

---

## Reference Documents

- **Full Deployment Guide:** `CONTRACT_DEPLOYMENT.md`
- **Production Setup:** `DEPLOYMENT.md`
- **Tech Details:** `PREPROD-REVIEW.md`
- **Integration Notes:** `INTEGRATION-FINDINGS.md`

---

## Support

- **Midnight Docs:** https://midnight.network/docs
- **Contract Details:** See `AutoDiscovery/autodiscovery-contract/src/contracts/`
- **Issues:** https://github.com/SpyCrypto/AutoDiscovery/issues

---

**Total Time:** ~20-30 minutes from compile → deploy → addresses → running

Ready to start? Begin with: `npm run compact` 🚀
