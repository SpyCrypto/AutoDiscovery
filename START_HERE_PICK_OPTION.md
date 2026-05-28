# 📍 You Have 5 Deployment Options (Pick One)

**You're getting npm/Docker errors. That's OK - you have alternatives.**

---

## Option 1: ✅ SIMPLEST - Use Midnight IDE (Web-Based)

**Pros:** No terminals, GUI-based, easiest  
**Cons:** Manual (must upload each contract)  
**Time:** 15 minutes

**Steps:**
1. Go to Midnight IDE (find current URL at https://midnight.network)
2. Upload contract files from `autodiscovery-contract/src/managed/`
3. Connect Lace wallet
4. Deploy each contract via GUI
5. Copy 6 addresses

**👉 START HERE if terminals don't work**

---

## Option 2: ✅ SECOND EASIEST - Fixed npm Approach

**Pros:** Automated, once it works saves time  
**Cons:** Needs npm to work  
**Time:** 30 minutes

**Prerequisites:**
```powershell
cd AutoDiscovery
npm install  # This must complete without errors
```

**Then:**
```powershell
cd autodiscovery-cli
set WALLET_MNEMONIC=your-24-word-phrase
npm run deploy-preprod
```

**👉 If npm errors, do Fix 1 first (see EMERGENCY_FIXES.md)**

---

## Option 3: ✅ MIDDLE - Docker Approach

**Pros:** Self-contained, fewer dependencies  
**Cons:** Docker must work  
**Time:** 25 minutes

**Steps:**
```powershell
cd AutoDiscovery/autodiscovery-cli

# Create .env.deploy
@"
WALLET_MNEMONIC=your-24-word-phrase
"@ | Out-File -Encoding UTF8 ..\.env.deploy

# Start proof server
docker compose -f ps-preprod.yml up -d

# Wait 30 seconds
Start-Sleep -Seconds 30

# Deploy (read DEPLOYMENT_DOCKER_SIMPLE.md for exact command)
```

**👉 If Docker errors, check ps-preprod.yml exists**

---

## Option 4: ✅ USE EXISTING CONTRACTS

**Pros:** Skip deployment entirely  
**Cons:** Use pre-deployed addresses  
**Time:** 5 minutes

**Steps:**
1. Get contract addresses from existing deployment
2. Create `AutoDiscovery/.env.contracts`:
   ```env
   VITE_CONTRACT_DISCOVERY_CORE=<address>
   VITE_CONTRACT_JURISDICTION_REGISTRY=<address>
   ...etc (6 total)
   ```
3. Skip to UI deployment

**👉 Fastest if you have existing addresses**

---

## Option 5: ✅ DEMOLAND MODE (No Contracts Needed)

**Pros:** Instant, no deployment needed  
**Cons:** Mock data only, not production  
**Time:** 5 minutes

**Steps:**
```powershell
cd AutoDiscovery/frontend-demoland-vite-react
npm install
npm run dev
```

**UI opens at http://localhost:5173 with demo data**

**👉 Test UI without deployment**

---

## 🎯 What I Recommend RIGHT NOW

1. **First:** Run diagnostic to see what's broken
   ```powershell
   cd AutoDiscovery
   .\diagnose.bat
   ```

2. **Second:** Tell me what it shows

3. **Third:** I'll tell you which option will work

---

## 📂 Which File to Read

| Your Situation | Read This |
|---|---|
| "npm doesn't work" | `EMERGENCY_FIXES.md` |
| "Docker doesn't work" | `DEPLOYMENT_DOCKER_SIMPLE.md` |
| "Both don't work" | `DEPLOYMENT_MANUAL_NO_NPM.md` |
| "Just want to test UI" | `DEPLOYMENT_DOCKER_SIMPLE.md` - use Demoland |
| "Want to understand everything" | `DEPLOYMENT_EXECUTION_GUIDE.md` |
| "Getting specific error" | `NPM_ERROR_TROUBLESHOOTING.md` |

---

## 📞 What To Do Now

**STEP 1: Run diagnostic**
```powershell
cd AutoDiscovery
.\diagnose.bat
```

**STEP 2: Copy entire output**

**STEP 3: Tell me:**
- [ ] Output of diagnose.bat
- [ ] Any error messages you see
- [ ] Which terminal shows errors (PowerShell/Docker/Both)

**STEP 4: I'll say which option works**

---

## ✅ Status

You have:
- ✅ 7 compiled contracts (ready)
- ✅ 5 deployment options (pick one)
- ✅ Emergency support (diagnose.bat)
- ✅ Multiple guides (choose by situation)

**You WILL get this deployed. Just need to tell me which error you're seeing.**

---

## 🚀 Next Action

**Run this NOW:**

```powershell
cd AutoDiscovery
.\diagnose.bat
```

**Then tell me the results.**

---

*Deployment Options - 2026-05-27*
