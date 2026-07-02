# AutoDiscovery Contract Addresses - Complete Reference

## Quick Start (Under 5 Minutes)

### You Need These 6 Addresses:

```
┌─────────────────────────────────────────────────┐
│ AutoDiscovery 6 Required Contracts (PreProd)    │
├─────────────────────────────────────────────────┤
│ 1. VITE_CONTRACT_DISCOVERY_CORE                 │
│ 2. VITE_CONTRACT_DISCOVERY_PROOF                │
│ 3. VITE_CONTRACT_DOCUMENT_REGISTRY              │
│ 4. VITE_CONTRACT_ACCESS_CONTROL                 │
│ 5. VITE_CONTRACT_JURISDICTION_REGISTRY          │
│ 6. VITE_CONTRACT_EXPERT_WITNESS                 │
└─────────────────────────────────────────────────┘
```

### Where to Get Them

1. **If contracts are already deployed** → Retrieve from deployment logs or block explorer
2. **If contracts are NOT deployed** → Follow "Deploy from Source" below

---

## Option 1: Retrieve Existing Addresses

### From Midnight Block Explorer

```bash
# PreProd Explorer URL
https://explore-preprod.midnight.network

# Search for each contract by name:
# 1. Search "discovery-core"
# 2. Click the result
# 3. Copy the "Contract Address" field

# Repeat for all 6 contracts
```

### From Previous Deployment Logs

```bash
# If you have the DEPLOYMENT_LOG.json file
cat DEPLOYMENT_LOG.json

# Extract addresses:
jq '.[] | {name: .contractName, address: .contractAddress}' DEPLOYMENT_LOG.json

# Output:
# {
#   "name": "discovery-core",
#   "address": "03cc52g89494d8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"
# }
```

---

## Option 2: Deploy from Source (20 minutes)

### Prerequisites Checklist

```
✓ Node.js v20+           → node --version
✓ npm v10+               → npm --version
✓ Lace wallet installed  → https://www.lace.io
✓ PreProd network        → Switch in Lace
✓ Test DUST funds        → https://faucet.midnight.network
```

### Step-by-Step Deployment

#### Phase 1: Compile Contracts (5 min)

```bash
cd AutoDiscovery

# Compile all contracts from Compact language
npm run compact

# Outputs to: autodiscovery-contract/src/managed/
# Each contract gets its own folder with circuit files
```

#### Phase 2: Deploy Each Contract (10-15 min)

**Method A: Midnight Explorer (Visual)**

```
1. Go to https://explore-preprod.midnight.network
2. Connect Wallet → Authorize Lace
3. Click "Deploy Contract"
4. Select: autodiscovery-contract/src/managed/discovery-core
5. Click "Deploy"
6. Approve gas fee in Lace wallet
7. Wait for confirmation (~30 seconds)
8. Copy the returned contract address
9. Repeat for all 6 contracts
```

**Method B: CLI (Command Line)**

```bash
# Deploy discovery-core
midnight deploy \
  --contract autodiscovery-contract/src/managed/discovery-core \
  --network preprod \
  --wallet lace

# Save the address, then repeat for:
# - discovery-proof
# - document-registry
# - access-control
# - jurisdiction-registry
# - expert-witness
```

#### Phase 3: Save Addresses (2 min)

```bash
# Interactive address capture
bash scripts/save-contract-addresses.sh

# Paste addresses when prompted:
# 1. discovery-core: [PASTE_ADDRESS]
# 2. discovery-proof: [PASTE_ADDRESS]
# ... etc

# Saves to: .env.contract-addresses
```

### Verification

```bash
# Check addresses were saved
cat .env.contract-addresses

# Expected output:
# VITE_CONTRACT_DISCOVERY_CORE=03cc52g89494d...
# VITE_CONTRACT_DISCOVERY_PROOF=04dd63h89505e...
# VITE_CONTRACT_DOCUMENT_REGISTRY=05ee74i89616f...
# VITE_CONTRACT_ACCESS_CONTROL=06ff85j89727g...
# VITE_CONTRACT_JURISDICTION_REGISTRY=07gg96k89838h...
# VITE_CONTRACT_EXPERT_WITNESS=08hh07l89949i...
```

---

## Step 4: Activate Production

### Copy Addresses to Production Config

```bash
# Option 1: Auto-merge
cat .env.contract-addresses >> .env.prod

# Option 2: Manual
# Edit .env.prod and paste all 6 VITE_CONTRACT_* lines

# Verify
cat .env.prod | grep VITE_CONTRACT_
```

### Deploy AutoDiscovery

```bash
# One-command deployment with addresses
bash scripts/setup-production.sh

# Services will start:
# - CLI on port 8080
# - RealDeal Frontend on port 5174
# - Demoland Frontend on port 5173
```

### Test the Frontend

```
1. Open http://localhost:5174 (RealDeal)
2. Check console for errors (F12 → Console)
3. Verify contract connections:
   - Can read jurisdictions ✓
   - Can view cases ✓
   - Can view documents ✓
4. Test with wallet connection
```

---

## If Something Goes Wrong

### "Contracts not found" Error

```bash
# Recompile
npm run compact

# Verify output
ls -la autodiscovery-contract/src/managed/

# Should list 6 folders:
# access-control/, compliance-proof/, discovery-core/,
# document-registry/, expert-witness/, jurisdiction-registry/
```

### "No matching network" in Lace

```
1. Open Lace wallet
2. Click network dropdown (top right)
3. Select "PreProd"
4. Reload browser
```

### "Insufficient balance" on Deployment

```bash
# Get more test DUST
1. Go to https://faucet.midnight.network
2. Paste wallet address
3. Request tokens
4. Wait 1-2 minutes
5. Check balance in Lace
6. Retry deployment
```

### "Contract at address already exists"

```bash
# Each contract can only deploy once per network
# Solutions:
# 1. Use a different wallet account
# 2. Deploy to TestNet instead
# 3. Verify address was returned correctly
```

---

## Contract Address Format

Midnight contract addresses look like:

```
03cc52g89494d8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f

Format breakdown:
├── 03        Network identifier (PreProd)
├── cc52...   Contract hash (unique identifier)
└── (hex)     Total ~50-100 characters
```

**Validation:** Each address should:
- Start with `02` or `03` (for PreProd)
- Be 50-100 hex characters
- Be unique per contract

---

## Environment Variable Template

Copy this to `.env.prod`:

```env
# ============================================================================
# CONTRACT ADDRESSES (Copy from deployment)
# ============================================================================

VITE_CONTRACT_DISCOVERY_CORE=
VITE_CONTRACT_DISCOVERY_PROOF=
VITE_CONTRACT_DOCUMENT_REGISTRY=
VITE_CONTRACT_ACCESS_CONTROL=
VITE_CONTRACT_JURISDICTION_REGISTRY=
VITE_CONTRACT_EXPERT_WITNESS=

# ============================================================================
# NETWORK ENDPOINTS (PreProd - no changes needed)
# ============================================================================

VITE_NODE_URL=https://preprod-node.midnight.network
VITE_INDEXER_URL=https://preprod-indexer.midnight.network/api/v1/graphql
VITE_INDEXER_WS=wss://preprod-indexer.midnight.network/api/v1/graphql
VITE_PROOF_SERVER_URL=https://preprod-proof-server.midnight.network
```

---

## What Each Contract Does

| Contract | Purpose | Example Use |
|---|---|---|
| **discovery-core** | Case/step lifecycle | Create and track legal cases |
| **discovery-proof** | Compliance attestations | Prove compliance at each step |
| **document-registry** | Document metadata storage | Register evidence documents |
| **access-control** | Permission management | Grant witness access to case |
| **jurisdiction-registry** | Regional legal rules | Load rules for specific county |
| **expert-witness** | Witness credentials | Verify expert qualifications |

---

## Documentation Map

```
AutoDiscovery/
│
├── GET_CONTRACT_ADDRESSES.md  ← Quick visual guide (you are here)
├── CONTRACT_DEPLOYMENT.md      ← Detailed deployment instructions
├── DEPLOYMENT.md               ← Full production guide
├── FINALIZATION-CHECKLIST.md   ← What was finalized
│
├── scripts/
│   ├── save-contract-addresses.sh    ← Helper to capture addresses
│   ├── setup-production.sh           ← Deploy everything
│   └── validate-production-config.sh ← Check config before deploy
│
└── autodiscovery-contract/
    └── src/
        ├── counter.compact
        ├── contracts/
        │   ├── discovery-core.compact
        │   ├── compliance-proof.compact
        │   ├── jurisdiction-registry.compact
        │   ├── access-control.compact
        │   ├── document-registry.compact
        │   └── expert-witness.compact
        └── managed/ ← Output of npm run compact
            └── (compiled contracts with keys & circuits)
```

---

## Timeline

| Step | Time | What |
|---|---|---|
| 1 | 5 min | Compile contracts (`npm run compact`) |
| 2 | 10-15 min | Deploy 6 contracts to PreProd |
| 3 | 2 min | Save addresses (`bash scripts/save-contract-addresses.sh`) |
| 4 | 2 min | Copy to production config |
| 5 | 5 min | Start services (`bash scripts/setup-production.sh`) |
| | **~30 min** | **Total** |

---

## Next Steps

After you have the 6 addresses:

1. ✅ Save them to `.env.contract-addresses`
2. ✅ Copy to `.env.prod`
3. ✅ Run `bash scripts/setup-production.sh`
4. ✅ Open http://localhost:5174 (RealDeal)
5. ✅ Test case creation and contract interaction
6. ✅ Monitor logs: `docker-compose -f docker-compose.prod.yml logs -f`

---

## Support

- **Midnight Docs:** https://midnight.network/docs
- **Block Explorer:** https://explore-preprod.midnight.network
- **Faucet:** https://faucet.midnight.network
- **Issues:** https://github.com/SpyCrypto/AutoDiscovery/issues
- **Lace Wallet:** https://www.lace.io

---

**Ready to deploy?** Start with: `npm run compact` 🚀
