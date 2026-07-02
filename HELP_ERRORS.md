# 🎯 WHERE YOU ARE & WHAT TO DO

**You're getting npm/Docker errors in terminals. Here's how to fix it.**

---

## ⚡ IMMEDIATE ACTION (Next 2 Minutes)

### Step 1: Run Diagnostic

Open PowerShell in AutoDiscovery folder:

```powershell
cd AutoDiscovery
.\diagnose.bat
```

### Step 2: Look At Output

You'll see:
```
✅ Node.js installed: v25.9.0
✅ npm installed: 11.7.0
✅ Docker installed: Docker version 29.4.3
✅ AutoDiscovery folder found
✅ autodiscovery-cli folder found
✅ package.json found
⚠️  node_modules NOT found     ← This might be the problem
✅ Port 6300 is available
```

### Step 3: Tell Me What Shows ❌ or ⚠️

---

## 🆘 MOST LIKELY PROBLEM

Based on your system:

```
❌ Probable Issue:
   node_modules NOT installed
   
✅ Quick Fix:
   cd AutoDiscovery
   npm install
   
⏱️  Wait: 2-3 minutes for all packages to download
```

---

## 📍 WHAT EACH ERROR MEANS

### If you see: ❌ "npm: command not found"
```
Problem: npm not installed
Fix: Download https://nodejs.org/ (LTS)
Time: 10 minutes
```

### If you see: ❌ "Node.js NOT found"
```
Problem: Node.js not installed
Fix: Download https://nodejs.org/ (LTS)
Time: 10 minutes
```

### If you see: ❌ "Docker NOT found"
```
Problem: Docker not running or not installed
Fix: Download https://www.docker.com/products/docker-desktop
Time: 15 minutes
```

### If you see: ⚠️ "node_modules NOT found"
```
Problem: Dependencies not installed
Fix: cd AutoDiscovery && npm install
Time: 3 minutes
```

### If you see: ⚠️ "Port 6300 is in use"
```
Problem: Another service using port 6300
Fix: taskkill /PID <number> /F
     (from diagnose output)
Time: 1 minute
```

---

## 🎯 MOST LIKELY FIX

Based on Windows + errors in both terminals:

**Command 1:**
```powershell
cd AutoDiscovery
npm install
```

**Wait 2-3 minutes**

**Then:**
```powershell
cd autodiscovery-cli
set WALLET_MNEMONIC=your-24-word-phrase-here
npm run deploy-preprod
```

---

## ✅ HOW TO KNOW IT'S WORKING

### During npm install:
```
added 873 packages in 36s
✅ Success - takes 1-5 minutes
```

### During deploy-preprod:
```
🚀  AutoDiscovery — Preprod Contract Deployer
📦  Deploying discovery-core...
   ✅  discovery-core: 03cc52g...
✅ Success - takes 5-10 minutes
```

---

## 📋 DECISION TREE

```
START HERE
    ↓
Run .\diagnose.bat
    ↓
What errors do you see?
    ├─→ ❌ Node.js missing    → Install from nodejs.org
    ├─→ ❌ npm missing        → Install from nodejs.org
    ├─→ ❌ Docker missing     → Install from docker.com
    ├─→ ⚠️  node_modules missing  → Run: npm install
    ├─→ ⚠️  Port 6300 in use   → Run: taskkill /PID <N> /F
    └─→ ✅ All green          → Ready to deploy!
           ↓
        Run: npm run deploy-preprod
           ↓
        ✅ Contracts deployed
           ↓
        Save 6 addresses to .env.contracts
           ↓
        Done!
```

---

## 🚨 IF ALL ELSE FAILS

You have 5 backup options:

1. **Use Midnight IDE** (web browser, easiest)
   - Go to https://midnight.network
   - Upload contracts via web UI
   
2. **Use Demoland mode** (no deployment needed)
   - `cd frontend-demoland-vite-react && npm run dev`
   - UI at http://localhost:5173 with demo data

3. **Use existing addresses** (if you have them)
   - Skip deployment, just configure .env

4. **Contact Midnight support**
   - https://github.com/midnightntwrk/midnight-local-dev/issues

5. **Manual TypeScript deployment**
   - See DEPLOYMENT_MANUAL_NO_NPM.md

---

## 📞 WHAT TO TELL ME

Share:

1. **Output of `.\diagnose.bat`** (all of it)
2. **Any error message** from PowerShell/Docker
3. **Which step** you're stuck on
4. **What command** you ran when error happened

Example:
```
Running: npm run deploy-preprod
Error: npm ERR! code ENOENT
Message: no such file or directory, open '.env'

diagnose.bat shows:
✅ Node.js v25.9.0
✅ npm 11.7.0
⚠️  node_modules missing
```

---

## 🎯 YOUR NEXT STEP RIGHT NOW

**1. Run this:**
```powershell
cd AutoDiscovery
.\diagnose.bat
```

**2. Tell me the output** (copy-paste the entire thing)

**3. I'll tell you exact fix**

---

**That's it. Just run the diagnostic and share the output.**

*2026-05-27*
