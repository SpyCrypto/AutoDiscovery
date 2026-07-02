# AutoDiscovery Deployment Execution Guide

**Status:** Ready for production deployment  
**Date:** 2026-05-27  
**Version:** 0.1.0

---

## 🎯 Overview

This guide walks you through **finalizing and deploying AutoDiscovery** to Midnight PreProd, step-by-step.

**Current Status:**
- ✅ Contracts compiled (7 Midnight smart contracts ready)
- ✅ Dockerfiles created (CLI, RealDeal, Demoland)
- ✅ Docker Compose configured (dev and prod stacks)
- ✅ Environment templates ready
- ✅ CI/CD pipeline configured

**What's Next:**
1. Set up wallet and PreProd environment
2. Deploy 6 contracts to Midnight PreProd
3. Configure environment variables with contract addresses
4. Build and run Docker containers
5. Verify all services are operational

---

## 📋 Prerequisites Checklist

Before you start, ensure you have:

```
[ ] Node.js v20+         - node --version
[ ] npm v11+             - npm --version
[ ] Docker               - docker --version
[ ] Docker Compose       - docker compose --version
[ ] Git                  - git --version
[ ] Lace wallet          - https://www.lace.io (browser extension)
[ ] tDUST test tokens    - From https://faucet.midnight.network
```

**Install missing tools:**
- Node.js: https://nodejs.org/
- Docker: https://www.docker.com/products/docker-desktop
- Git: https://git-scm.com/

---

## 🚀 Deployment Steps

### Step 1: Set Up Lace Wallet & Get Test Tokens (5 min)

#### 1.1 Install Lace Browser Extension
1. Go to https://www.lace.io
2. Click "Get Lace" → Select your browser (Chrome, Firefox, Edge)
3. Install extension
4. Open extension → Create or import wallet

#### 1.2 Switch to PreProd Network
1. Open Lace wallet extension
2. Click network dropdown (top-right)
3. Select **"Midnight PreProd"** (not MainNet)

#### 1.3 Copy Your Address
1. In Lace, find your **unshielded address** (public address)
2. Copy it (click copy button next to address)
3. Save somewhere temporarily

#### 1.4 Get Test Tokens
1. Go to https://faucet.midnight.network
2. Paste your unshielded address
3. Request tDUST tokens
4. Wait 30-60 seconds for confirmation
5. Verify balance in Lace (should show tDUST)

#### 1.5 Export Wallet Mnemonic (Save Securely!)
1. In Lace, open Settings → Recovery
2. Show recovery phrase (12 or 24-word seed)
3. **Copy and save securely** (you'll need this for deployment)
4. Do NOT commit this to git or share publicly

---

### Step 2: Deploy Contracts to Midnight PreProd (20 min)

The 6 contracts AutoDiscovery uses:

| # | Contract | Purpose |
|---|----------|---------|
| 1 | **discovery-core** | Case lifecycle & discovery steps |
| 2 | **compliance-proof** | ZK attestations |
| 3 | **document-registry** | Document tracking & Merkle trees |
| 4 | **access-control** | YubiKey-based permissions |
| 5 | **jurisdiction-registry** | Regional legal rules |
| 6 | **expert-witness** | Expert credentials |

#### 2.1 Navigate to Midnight Block Explorer
1. Go to https://explore-preprod.midnight.network
2. Click "Connect Wallet" (top-right)
3. Select "Lace" 
4. Approve connection in Lace extension
5. Verify you're connected (shows your address)

#### 2.2 Deploy Each Contract (Repeat 6 times)

**For each contract:**

1. Click "**Deploy Contract**" button
2. **Select contract file:**
   - From your repo: `AutoDiscovery/autodiscovery-contract/src/managed/[contract-name]`
   - Paste contract folder path or browse
3. Click "**Deploy**"
4. Approve transaction in Lace wallet (click "Sign" in Lace)
5. Wait for confirmation (check Lace for pending transaction)
6. Once confirmed, **COPY the contract address** shown on explorer
7. Save address to a text file (you'll need all 6)

**Repeat for:**
```
1. discovery-core
2. compliance-proof
3. document-registry
4. access-control
5. jurisdiction-registry
6. expert-witness
```

---

### Step 3: Save Contract Addresses (2 min)

After deploying all 6 contracts, you'll have 6 addresses. **Save them in this format:**

**File: `AutoDiscovery/.env.contracts`**

```env
VITE_CONTRACT_DISCOVERY_CORE=<address from step 2.2>
VITE_CONTRACT_DISCOVERY_PROOF=<address from step 2.2>
VITE_CONTRACT_DOCUMENT_REGISTRY=<address from step 2.2>
VITE_CONTRACT_ACCESS_CONTROL=<address from step 2.2>
VITE_CONTRACT_JURISDICTION_REGISTRY=<address from step 2.2>
VITE_CONTRACT_EXPERT_WITNESS=<address from step 2.2>
```

**Example:**
```env
VITE_CONTRACT_DISCOVERY_CORE=03cc52g89494d89495e89606f89717g89828h89
VITE_CONTRACT_DISCOVERY_PROOF=04dd63h89505e89616g89727h89838i89949j
# ... etc
```

---

### Step 4: Configure Environment Variables (5 min)

#### 4.1 Create Production Environment File

**File: `AutoDiscovery/.env.prod`**

Copy and populate:

```env
# ═══════════════════════════════════════════════════════════════
# AutoDiscovery Production Configuration
# ═══════════════════════════════════════════════════════════════

# ───────────────────────────────────────────────────────────────
# MODE: "demoland" (mock data) or "realdeal" (live blockchain)
# ───────────────────────────────────────────────────────────────
VITE_AD_MODE=realdeal

# ───────────────────────────────────────────────────────────────
# SMART CONTRACTS (6 addresses from Step 3)
# ───────────────────────────────────────────────────────────────
VITE_CONTRACT_DISCOVERY_CORE=<paste from .env.contracts>
VITE_CONTRACT_DISCOVERY_PROOF=<paste from .env.contracts>
VITE_CONTRACT_DOCUMENT_REGISTRY=<paste from .env.contracts>
VITE_CONTRACT_ACCESS_CONTROL=<paste from .env.contracts>
VITE_CONTRACT_JURISDICTION_REGISTRY=<paste from .env.contracts>
VITE_CONTRACT_EXPERT_WITNESS=<paste from .env.contracts>

# ───────────────────────────────────────────────────────────────
# MIDNIGHT NETWORK (PreProd)
# ───────────────────────────────────────────────────────────────
VITE_MIDNIGHT_NETWORK=testnet
MIDNIGHT_NODE_URL=ws://localhost:9944
MIDNIGHT_INDEXER_URL=http://localhost:8088
MIDNIGHT_PROOF_SERVER_URL=http://localhost:6300

# ───────────────────────────────────────────────────────────────
# WALLET (Your Lace mnemonic - KEEP SECURE!)
# ───────────────────────────────────────────────────────────────
MY_PREVIEW_MNEMONIC=<your 24-word seed phrase from Lace>

# ───────────────────────────────────────────────────────────────
# ADDRESSES
# ───────────────────────────────────────────────────────────────
MY_UNDEPLOYED_UNSHIELDED_ADDRESS=<your unshielded address from Lace>

# ───────────────────────────────────────────────────────────────
# AI SERVICE (Optional - for document metadata extraction)
# ───────────────────────────────────────────────────────────────
VITE_AI_SERVICE_URL=http://localhost:3000

# ───────────────────────────────────────────────────────────────
# APPLICATION (Frontend configuration)
# ───────────────────────────────────────────────────────────────
VITE_APP_NAME=AutoDiscovery
VITE_APP_ENV=production
VITE_API_BASE_URL=http://localhost:8080
```

#### 4.2 Verify Environment File

Check that all required fields are filled:

```bash
cd AutoDiscovery
cat .env.prod | grep -v '^#' | grep -v '^$'
```

All lines should have values, not placeholders.

---

### Step 5: Build Docker Images (10 min)

#### 5.1 Build All Services

```bash
cd AutoDiscovery

# Build all 3 container images
docker build -f Dockerfile.cli -t autodiscovery-cli:latest .
docker build -f Dockerfile.frontend-realdeal -t autodiscovery-realdeal:latest .
docker build -f Dockerfile.frontend-demoland -t autodiscovery-demoland:latest .

# Verify images were created
docker images | grep autodiscovery
```

**Expected output:**
```
REPOSITORY                      TAG       IMAGE ID      CREATED
autodiscovery-cli               latest    abc123def     5 minutes ago
autodiscovery-realdeal          latest    def456ghi     4 minutes ago
autodiscovery-demoland          latest    ghi789jkl     3 minutes ago
```

---

### Step 6: Deploy with Docker Compose (5 min)

#### 6.1 Start All Services

```bash
cd AutoDiscovery

# Start containers in background
docker compose -f docker-compose.prod.yml up -d --build

# Watch logs
docker compose -f docker-compose.prod.yml logs -f
```

Services will start on:
- **CLI:** http://localhost:8080
- **RealDeal Frontend:** http://localhost:5174
- **Demoland Frontend:** http://localhost:5173

#### 6.2 Wait for Services to Start

Logs will show when each service is ready:

```
cli         | ✓ Server listening on http://localhost:8080
frontend-realdeal  | ✓ Ready in 123ms
frontend-demoland  | ✓ Ready in 115ms
```

---

### Step 7: Verify Deployment (3 min)

#### 7.1 Health Checks

Open new terminal:

```bash
# Test each service endpoint
curl http://localhost:8080/health
curl http://localhost:5174/health
curl http://localhost:5173/health

# All should return status 200
```

**Expected output:**
```json
{"status":"ok","timestamp":"2026-05-27T..."}
```

#### 7.2 Open in Browser

Visit each service:

1. **RealDeal Frontend:** http://localhost:5174
   - Should show AutoDiscovery UI connected to live Midnight
   - Can create cases and transactions
   
2. **Demoland Frontend:** http://localhost:5173
   - Should show AutoDiscovery UI with mock data
   - For testing without real contracts

3. **CLI Dashboard:** http://localhost:8080
   - Should show deployment status and contract info

#### 7.3 Test Basic Flow

In RealDeal frontend:

1. Connect Lace wallet (click "Connect" button)
2. Create a test case
3. Add a document
4. Verify transaction confirmation in Lace
5. Check case appears in dashboard

---

## 🛠️ Common Issues & Fixes

### Docker Services Won't Start

**Issue:** `docker compose ... up` fails with error

**Fix:**
```bash
# Check Docker is running
docker ps

# Check logs for errors
docker compose -f docker-compose.prod.yml logs cli

# Stop and clean up
docker compose -f docker-compose.prod.yml down -v

# Try again
docker compose -f docker-compose.prod.yml up -d
```

### "Contract Address Not Found" Error

**Issue:** Frontend can't connect to contracts

**Fix:**
1. Verify all 6 addresses are in `.env.prod`
2. Check addresses are on correct network (PreProd, not MainNet)
3. Verify addresses exist on-chain:
   - Visit https://explore-preprod.midnight.network
   - Search for each address
   - Should show contract deployment

### "Wallet Connection Failed"

**Issue:** Lace wallet won't connect to dApp

**Fix:**
1. Ensure Lace is on **PreProd network** (not MainNet)
2. Try refreshing browser page
3. Try disconnecting and reconnecting wallet in Lace
4. Check browser console for error messages (F12)

### "Transaction Failed"

**Issue:** Case creation or document upload fails

**Fix:**
1. Verify wallet has tDUST balance (check Lace)
2. Request more test tokens: https://faucet.midnight.network
3. Check contract addresses are correct
4. Check PreProd network is not down: https://midnight.network

---

## 📊 Monitoring

### View Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f cli
docker compose -f docker-compose.prod.yml logs -f frontend-realdeal

# Last 100 lines
docker compose -f docker-compose.prod.yml logs -f --tail 100
```

### Check Resource Usage

```bash
# CPU, memory, network
docker stats

# Disk usage
docker system df
```

### Container Status

```bash
# Running containers
docker ps

# All containers (including stopped)
docker ps -a

# Detailed container info
docker inspect <container-name>
```

---

## 🧹 Cleanup

### Stop Services

```bash
# Stop (keep data)
docker compose -f docker-compose.prod.yml stop

# Stop and remove containers (keep volumes)
docker compose -f docker-compose.prod.yml down

# Stop, remove containers AND volumes (full cleanup)
docker compose -f docker-compose.prod.yml down -v
```

### Remove Images

```bash
# Remove specific image
docker rmi autodiscovery-cli:latest

# Remove all AutoDiscovery images
docker rmi $(docker images | grep autodiscovery | awk '{print $3}')
```

---

## 📚 Additional Documentation

- **`DEPLOYMENT.md`** — Comprehensive deployment guide (Kubernetes, scaling, etc.)
- **`DEPLOYMENT_CHECKLIST.md`** — Full pre-deployment checklist
- **`PREPROD-REVIEW.md`** — Technical audit and known issues
- **`INTEGRATION-FINDINGS.md`** — Smart contract integration details
- **`README.md`** — Project overview and architecture

---

## 🔗 Quick Links

- **Midnight PreProd Network:** https://midnight.network
- **PreProd Block Explorer:** https://explore-preprod.midnight.network
- **Lace Wallet:** https://www.lace.io
- **Test Faucet:** https://faucet.midnight.network
- **Midnight Docs:** https://docs.midnight.network
- **GitHub Issues:** https://github.com/SpyCrypto/AutoDiscovery/issues

---

## ✅ Deployment Checklist

Use this final checklist before going live:

```
PREREQUISITES
[ ] Node.js v20+
[ ] Docker & Docker Compose
[ ] Lace wallet installed
[ ] PreProd network selected in Lace
[ ] Test tokens in wallet

CONTRACT DEPLOYMENT
[ ] Contract 1 deployed (discovery-core)
[ ] Contract 2 deployed (compliance-proof)
[ ] Contract 3 deployed (document-registry)
[ ] Contract 4 deployed (access-control)
[ ] Contract 5 deployed (jurisdiction-registry)
[ ] Contract 6 deployed (expert-witness)
[ ] All 6 addresses saved to .env.contracts

CONFIGURATION
[ ] .env.prod created
[ ] All 6 contract addresses filled in
[ ] Wallet mnemonic added
[ ] Unshielded address added
[ ] Environment validated (no placeholders)

DOCKER BUILD & DEPLOY
[ ] Docker images built successfully
[ ] Docker Compose started without errors
[ ] All 3 services running (docker ps)

VERIFICATION
[ ] Health checks passing (curl http://localhost:*/health)
[ ] RealDeal UI opens (http://localhost:5174)
[ ] Demoland UI opens (http://localhost:5173)
[ ] Wallet connects to RealDeal
[ ] Test transaction succeeds
[ ] Case appears in dashboard

MONITORING
[ ] Logs show no errors (docker logs)
[ ] Container status healthy (docker ps)
[ ] Resource usage normal (docker stats)
```

---

## 🎉 Success!

Your AutoDiscovery dApp is now **live on Midnight PreProd!**

**Next Steps:**
1. Test the UI thoroughly with real contracts
2. Create and manage test cases
3. Monitor logs for issues
4. Iterate on features based on testing
5. When ready, deploy to MainNet (separate process)

**Support:** Check GitHub Issues or Midnight docs if you encounter problems.

---

**Happy deploying! 🚀**

*AutoDiscovery Deployment Guide v0.1.0*  
*Last Updated: 2026-05-27*
