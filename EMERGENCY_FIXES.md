# 🚨 EMERGENCY QUICK-FIX Guide

**Use this if you're stuck with errors in terminals.**

---

## ⚡ Quick Fixes (Try These First)

### Fix 1: Clear npm Cache & Reinstall (5 min)

```powershell
cd AutoDiscovery

# Clear cache
npm cache clean --force

# Remove old packages
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Reinstall
npm install
```

**Wait for completion.**

---

### Fix 2: Reinstall Node.js & npm (10 min)

1. Download: https://nodejs.org/ (LTS version)
2. Run installer, follow steps
3. **Restart PowerShell**
4. Verify:
   ```powershell
   node --version
   npm --version
   ```

---

### Fix 3: Use Simplified Docker Approach

Instead of npm terminal, use Docker:

```powershell
cd AutoDiscovery

# Create environment file
@"
WALLET_MNEMONIC=your-24-word-phrase-here
"@ | Out-File -Encoding UTF8 .env.deploy

# Start proof server
docker compose -f autodiscovery-cli/ps-preprod.yml up -d

# Wait 30 seconds
Start-Sleep -Seconds 30

# Check it started
docker ps
```

---

### Fix 4: Just Use Frontend (Demoland Mode)

Skip contract deployment, use mock data:

```powershell
cd AutoDiscovery

# Set to demoland mode
$env:VITE_AD_MODE="demoland"

# Start just the UI
cd frontend-demoland-vite-react
npm install
npm run dev

# UI opens at http://localhost:5173 with mock data
```

---

## 🔍 What Errors Are You Seeing?

Copy the **exact error message** and tell me:

**Example errors:**

```
❌ "npm ERR! code ENOENT"
   → Missing file or wrong directory

❌ "npm ERR! code EACCES"
   → Permission issue

❌ "npm ERR! code E404"
   → Package not found

❌ "Error: ENOENT: no such file or directory"
   → File doesn't exist

❌ "ERROR: failed to load Windows modules"
   → System compatibility issue

❌ "connection refused"
   → Port already in use or service not running
```

---

## 📋 Diagnostic Checklist

Run each command, tell me results:

```powershell
# 1. Check location
pwd
# Should show: .../AutoDiscovery

# 2. Check Node.js
node --version
# Should show: v25.9.0 or higher

# 3. Check npm
npm --version
# Should show: 11.7.0 or higher

# 4. Check Docker
docker --version
# Should show: Docker version 29.4.3 or higher

# 5. Check folders exist
ls
# Should show: autodiscovery-cli, autodiscovery-contract, etc.

# 6. Check dependencies installed
ls node_modules
# Should show: many folders (if empty = need npm install)

# 7. Test npm works
npm list -g
# Should show: list of global packages
```

---

## 🆘 What To Tell Me

When you share errors, include:

1. **Exact error message** (copy-paste from terminal)
2. **Which step** you're on
3. **Output of**:
   ```powershell
   node --version
   npm --version
   docker --version
   pwd
   ```
4. **What you tried** before getting the error

---

## 💡 Best Next Step

**Run this diagnostic script:**

```powershell
cd AutoDiscovery
.\diagnose.bat
```

Then share the **entire output** with me.

---

## ⏱️ Fastest Solution Path

1. Run `diagnose.bat` (2 min)
2. Share output
3. I'll give exact fix based on what's missing
4. You follow specific steps
5. Done in ~15 minutes

---

**Don't try everything at once - just:**

1. Run diagnostic.bat
2. Tell me results
3. I'll guide you through specific fix

---

*Emergency Guide - 2026-05-27*
