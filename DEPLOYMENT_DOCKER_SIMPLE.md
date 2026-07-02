# 🚀 SIMPLIFIED DEPLOYMENT - Docker Only (Easiest Path)

**If npm terminal commands are giving you errors, use this Docker-based approach instead.**

---

## ✅ Why This Works Better

- ✅ No npm terminal errors
- ✅ Single command to start everything
- ✅ Services manage themselves
- ✅ Proof server included
- ✅ Contract deployment automated

---

## 📋 Prerequisites

You have:
- ✅ Docker installed
- ✅ Lace wallet with tDUST tokens
- ✅ 24-word wallet mnemonic

---

## 🎯 Simple 4-Step Process

### Step 1: Get Your Mnemonic (2 min)

1. Open Lace wallet
2. Go to Settings → Recovery
3. Show recovery phrase
4. Copy your 24-word phrase
5. Save it somewhere safe

### Step 2: Create Environment File (2 min)

Create a file: `AutoDiscovery/.env.deploy`

```env
WALLET_MNEMONIC=your 24-word phrase here
```

**Replace:** `your 24-word phrase here` with your actual 24 words

**Example:**
```env
WALLET_MNEMONIC=abandon ability able about above absent absorb abstract abuse access accident account achieve acid acknowledge acquaintance acorn acquire across act action activate actual add
```

### Step 3: Start Proof Server & Deploy (15 min)

**Open ONE terminal:**

```bash
cd AutoDiscovery/autodiscovery-cli

# Start proof server (in background)
docker compose -f ps-preprod.yml up -d

# Wait 30 seconds for server to start
sleep 30

# Deploy all 6 contracts
docker run --env-file ../.env.deploy \
  --network host \
  -v $(pwd):/app \
  -w /app \
  node:20 \
  npm run deploy-preprod
```

**Wait for output like:**
```
🚀  AutoDiscovery — Preprod Contract Deployer
📦  Deploying discovery-core...
   ✅  discovery-core: 03cc52g89494d...
[... more contracts ...]
✅  All contracts deployed!
VITE_CONTRACT_DISCOVERY_CORE=03cc52g...
```

### Step 4: Save Addresses (2 min)

Copy the 6 addresses from output and save to: `AutoDiscovery/.env.contracts`

```env
VITE_CONTRACT_DISCOVERY_CORE=03cc52g89494d...
VITE_CONTRACT_JURISDICTION_REGISTRY=04dd63h89505e...
VITE_CONTRACT_COMPLIANCE_PROOF=05ee74i89616f...
VITE_CONTRACT_DOCUMENT_REGISTRY=06ff85j89727g...
VITE_CONTRACT_ACCESS_CONTROL=07gg96k89838h...
VITE_CONTRACT_EXPERT_WITNESS=08hh07l89949i...
```

---

## ✅ Done!

Services are running on:
- **RealDeal UI:** http://localhost:5174
- **Demoland UI:** http://localhost:5173
- **CLI:** http://localhost:8080

Open in browser and connect Lace wallet!

---

## 🆘 Issues

### "Port 6300 in use"
```bash
# Stop existing containers
docker compose -f ps-preprod.yml down

# Try again
docker compose -f ps-preprod.yml up -d
```

### "Wallet mnemonic not found"
Make sure `.env.deploy` file:
1. Exists in `AutoDiscovery/autodiscovery-cli/`
2. Has your mnemonic
3. Uses exact format: `WALLET_MNEMONIC=word1 word2 ... word24`

### "Connection refused"
```bash
# Check if proof server is running
docker ps | grep proof

# If not, restart:
docker compose -f ps-preprod.yml down
docker compose -f ps-preprod.yml up -d
```

---

## 📊 What's Happening (Behind the Scenes)

```
Step 1: .env.deploy created with your mnemonic
  ↓
Step 2: Proof server Docker container starts
  ↓
Step 3: Deploy script runs in Docker container
  ↓
Step 4: All 6 contracts deploy to Midnight PreProd
  ↓
Step 5: Addresses printed to console
  ↓
Step 6: You copy addresses to .env.contracts
  ↓
Step 7: Services running at localhost:5174 and others
```

---

## 🐳 Docker Commands Reference

```bash
# Stop all services
docker compose -f ps-preprod.yml down

# View logs
docker compose -f ps-preprod.yml logs -f

# Remove all containers and volumes
docker compose -f ps-preprod.yml down -v

# Check running containers
docker ps

# Kill specific container
docker stop <container-id>
```

---

## ✨ Summary

**This method:**
- Uses Docker (no npm terminal issues)
- Fewer steps
- Automated
- Cleaner

**Total time:** ~30 minutes

---

*Simplified Docker Deployment - Updated 2026-05-27*
