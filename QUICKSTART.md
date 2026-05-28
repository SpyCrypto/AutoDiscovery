# 🚀 AutoDiscovery Deployment Quick Reference

**TL;DR Version — Deploy in 30 Minutes**

---

## ⚡ The 5-Minute Summary

You have a fully-finalized Midnight dApp with:
- ✅ 7 compiled smart contracts
- ✅ 3 containerized services
- ✅ Docker Compose orchestration
- ✅ Automated deployment script

**Deploy in 30 min:**

```bash
# 1. Set up wallet (5 min)
#    → Install Lace (https://www.lace.io)
#    → Switch to PreProd network
#    → Get test tokens (https://faucet.midnight.network)

# 2. Deploy contracts (15 min)
#    → Go to https://explore-preprod.midnight.network
#    → Deploy 6 contracts
#    → Copy 6 addresses

# 3. Auto-deploy services (5 min)
cd AutoDiscovery
bash scripts/quick-deploy.sh

# 4. Done! Access at:
#    → CLI: http://localhost:8080
#    → UI: http://localhost:5174
```

---

## 📂 Files & Folders

```
AutoDiscovery/
├── 📝 FINALIZATION_COMPLETE.md               ← You are here (overview)
├── 📝 DEPLOYMENT_EXECUTION_GUIDE.md          ← Full step-by-step guide
├── 📝 DEPLOYMENT.md                          ← Comprehensive guide
│
├── 🐳 Dockerfile.cli                         ← CLI container
├── 🐳 Dockerfile.frontend-realdeal           ← RealDeal UI container
├── 🐳 Dockerfile.frontend-demoland           ← Demoland UI container
├── 📋 docker-compose.yml                     ← Dev stack
├── 📋 docker-compose.prod.yml                ← Prod stack
├── 🔧 nginx.conf + default.conf              ← Web server config
├── 🚫 .dockerignore                          ← Build optimization
│
├── 📄 .env.production                        ← Config template
├── 📄 .env.prod                              ← (created during deploy)
│
├── 🤖 scripts/
│   ├── quick-deploy.sh                       ← 🚀 Main deployment script
│   ├── setup-production.sh                   ← Alternative setup
│   └── ...
│
├── 📦 autodiscovery-contract/
│   └── src/managed/
│       ├── counter (not deployed)
│       ├── discovery-core (deploy #1)
│       ├── compliance-proof (deploy #2)
│       ├── document-registry (deploy #3)
│       ├── access-control (deploy #4)
│       ├── jurisdiction-registry (deploy #5)
│       └── expert-witness (deploy #6)
│
└── 📚 docs/
    ├── PROJECT_OVERVIEW.md
    ├── SMART_CONTRACT_PARTITIONING.md
    └── ...
```

---

## 🎯 Step-by-Step (30 min)

### Step 1: Wallet Setup (5 min) ✅
```
1. Install Lace → https://www.lace.io
2. Open extension → Create/import wallet
3. Switch network → Select "PreProd" (not MainNet)
4. Get tokens → https://faucet.midnight.network
5. Paste address → Request tDUST
6. Wait → 30-60 seconds for confirmation
7. Check balance in Lace
```

### Step 2: Deploy Contracts (15 min) 🔗
```
1. Go to https://explore-preprod.midnight.network
2. Click "Connect Wallet" → Select Lace
3. For each contract (6 times):
   a) Click "Deploy Contract"
   b) Select: autodiscovery-contract/src/managed/[name]
   c) Click "Deploy"
   d) Approve in Lace
   e) Wait for confirmation
   f) COPY the address shown
   g) SAVE address to text file
```

**Contracts to deploy (in order):**
1. discovery-core
2. compliance-proof
3. document-registry
4. access-control
5. jurisdiction-registry
6. expert-witness

### Step 3: Auto-Deploy Services (5 min) 🤖
```bash
cd AutoDiscovery
bash scripts/quick-deploy.sh

# Script will:
# 1. Check prerequisites (Docker, Node.js)
# 2. Ask for 6 contract addresses
# 3. Ask for wallet mnemonic (from Lace)
# 4. Ask for unshielded address (from Lace)
# 5. Generate .env.prod
# 6. Build 3 Docker images
# 7. Start services
# 8. Run health checks
```

### Step 4: Verify & Open UI (3 min) ✨
```bash
# Check all services running
docker ps

# Health checks (should all return 200)
curl http://localhost:8080/health
curl http://localhost:5174/health
curl http://localhost:5173/health

# Open in browser
# → RealDeal (live): http://localhost:5174
# → Demoland (mock): http://localhost:5173
# → CLI: http://localhost:8080
```

---

## 🔗 Key Links

| What | Where | Purpose |
|------|-------|---------|
| **Deploy Contracts** | https://explore-preprod.midnight.network | Publish contracts to PreProd |
| **Install Wallet** | https://www.lace.io | Get Lace extension |
| **Get Test Tokens** | https://faucet.midnight.network | Request tDUST |
| **Midnight Docs** | https://docs.midnight.network | Learn more |
| **Network Status** | https://midnight.network | Check PreProd health |
| **GitHub Issues** | https://github.com/SpyCrypto/AutoDiscovery/issues | Report problems |

---

## 🐳 Docker Commands

```bash
# View running services
docker ps

# View all containers (including stopped)
docker ps -a

# View logs (all services)
docker compose -f docker-compose.prod.yml logs -f

# View logs (specific service)
docker compose -f docker-compose.prod.yml logs -f cli

# Stop services
docker compose -f docker-compose.prod.yml stop

# Start services
docker compose -f docker-compose.prod.yml up -d

# Restart services
docker compose -f docker-compose.prod.yml restart

# Full cleanup (removes containers + volumes)
docker compose -f docker-compose.prod.yml down -v

# Resource usage
docker stats

# Disk usage
docker system df
```

---

## 🚨 Troubleshooting

### "Docker not found"
```bash
# Install Docker Desktop
# https://www.docker.com/products/docker-desktop
# Then restart terminal/shell
```

### "Wallet not connecting"
```
1. Check network: Lace → Dropdown → "PreProd" selected?
2. Refresh browser (F5)
3. Disconnect wallet in Lace, then reconnect
4. Check browser console (F12) for errors
```

### "Contract not found"
```
1. Verify address is on PreProd (not MainNet)
2. Check on block explorer: https://explore-preprod.midnight.network
3. Ensure wallet has tDUST balance
4. Re-request tokens: https://faucet.midnight.network
```

### "Transaction failed"
```
1. Check tDUST balance (Lace)
2. Check contract addresses are correct in .env.prod
3. Check PreProd network is up: https://midnight.network
4. Wait 30 seconds, try again
```

### "Services won't start"
```bash
# Check Docker running
docker ps

# View error logs
docker compose -f docker-compose.prod.yml logs

# Stop and clean
docker compose -f docker-compose.prod.yml down -v

# Try again
docker compose -f docker-compose.prod.yml up -d
```

---

## 📊 Service Endpoints

| Service | URL | Purpose |
|---------|-----|---------|
| CLI Dashboard | http://localhost:8080 | Contract info, deployment status |
| RealDeal Frontend | http://localhost:5174 | Live UI (connected to contracts) |
| Demoland Frontend | http://localhost:5173 | Mock UI (demo data) |

---

## ✅ Deployment Checklist

```
PRE-DEPLOYMENT
[ ] Lace wallet installed
[ ] PreProd network selected in Lace
[ ] Test tokens in wallet
[ ] Wallet mnemonic saved securely
[ ] Unshielded address copied

CONTRACT DEPLOYMENT
[ ] discovery-core deployed
[ ] compliance-proof deployed
[ ] document-registry deployed
[ ] access-control deployed
[ ] jurisdiction-registry deployed
[ ] expert-witness deployed
[ ] All 6 addresses saved

DOCKER DEPLOYMENT
[ ] quick-deploy.sh script exists
[ ] All 6 addresses pasted into script
[ ] Wallet info entered into script
[ ] Docker images built successfully
[ ] Services started (docker ps shows 3 containers)

VERIFICATION
[ ] http://localhost:8080 responds (health check)
[ ] http://localhost:5174 responds (health check)
[ ] http://localhost:5173 responds (health check)
[ ] RealDeal UI opens in browser
[ ] Lace wallet connects to UI
[ ] Test case can be created
[ ] Transaction confirms in Lace

MONITORING
[ ] Logs show no errors (docker logs)
[ ] No container restarts
[ ] Normal CPU/memory usage (docker stats)
```

---

## 🎓 Learn More

For detailed information, see:

- **Full Guide:** `DEPLOYMENT_EXECUTION_GUIDE.md` (18 pages)
- **Comprehensive:** `DEPLOYMENT.md` (12 pages)
- **Technical:** `PREPROD-REVIEW.md` (11 pages)
- **Architecture:** `docs/SMART_CONTRACT_PARTITIONING.md`
- **Project:** `README.md`

---

## 🆘 Quick Support

**Something broken?**

1. Check logs:
   ```bash
   docker compose -f docker-compose.prod.yml logs
   ```

2. View technical audit:
   ```bash
   less PREPROD-REVIEW.md
   ```

3. Report issue:
   ```
   https://github.com/SpyCrypto/AutoDiscovery/issues
   ```

---

## 🎉 You're Ready!

AutoDiscovery is **production-finalized** and ready to deploy.

**Deploy now:**
```bash
bash AutoDiscovery/scripts/quick-deploy.sh
```

**Questions?** Check the full guide:
```bash
less AutoDiscovery/DEPLOYMENT_EXECUTION_GUIDE.md
```

---

**Happy deploying! 🚀**

*Last Updated: 2026-05-27*  
*Status: ✅ PRODUCTION-READY*
