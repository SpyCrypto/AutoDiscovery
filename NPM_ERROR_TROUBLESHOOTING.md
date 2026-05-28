# 🆘 NPM Error Troubleshooting Guide

---

## Common npm Errors & Fixes

### Error 1: "npm: command not found"

**Problem:** npm is not installed or not in your PATH

**Fix:**
```bash
# Check if npm is installed
npm --version

# If not found, download from:
# https://nodejs.org/
```

**Verify installation:**
```bash
node --version
npm --version
```

---

### Error 2: "Cannot find module" or "node_modules missing"

**Problem:** Dependencies not installed

**Fix:**
```bash
cd AutoDiscovery
npm install
```

**Wait 2-3 minutes for all packages to install**

---

### Error 3: "EACCES: permission denied"

**Problem:** Permission issue on Linux/Mac

**Fix:**
```bash
sudo npm install -g npm
npm install
```

---

### Error 4: "npm ERR! code ENOTFOUND"

**Problem:** Network issue, can't reach npm registry

**Fix:**
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

---

### Error 5: "Port 6300 already in use"

**Problem:** Proof server port is occupied

**Fix:**
```bash
# Kill process on port 6300
# On Windows (PowerShell as admin):
netstat -ano | findstr :6300
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:6300 | xargs kill -9
```

Then try again:
```bash
npm run ps-preprod
```

---

### Error 6: "Cannot find file" or "No such file"

**Problem:** You're in wrong directory

**Fix:**
```bash
# Make sure you're in AutoDiscovery folder
cd AutoDiscovery

# Verify you see these folders:
ls -la
# Should show: autodiscovery-cli, autodiscovery-contract, frontend-*, etc.

# Then navigate to CLI:
cd autodiscovery-cli

# Verify package.json exists:
ls package.json
```

---

### Error 7: "WALLET_MNEMONIC not set" or "Mnemonic required"

**Problem:** Wallet mnemonic not provided to deploy script

**Fix:**

**On Windows Command Prompt:**
```cmd
set WALLET_MNEMONIC=your 24-word phrase here
npm run deploy-preprod
```

**On Windows PowerShell:**
```powershell
$env:WALLET_MNEMONIC="your 24-word phrase here"
npm run deploy-preprod
```

**On Mac/Linux:**
```bash
export WALLET_MNEMONIC="your 24-word phrase here"
npm run deploy-preprod
```

---

### Error 8: "Proof server connection failed"

**Problem:** Proof server not running or port unreachable

**Fix:**
```bash
# Terminal 1: Make sure proof server is running
npm run ps-preprod

# Wait for:
# ✓ Proof server listening on http://localhost:6300

# Then in Terminal 2, try again:
npm run deploy-preprod
```

---

### Error 9: "Contract deployment failed" or "Transaction failed"

**Problem:** Wallet has no funds or network issue

**Fix:**
1. Check wallet balance in Lace wallet
2. Get more test tokens: https://midnight.network/testnet-faucet
3. Wait 60 seconds after getting tokens
4. Try again: `npm run deploy-preprod`

---

## 🔍 Diagnostic Steps

Run these commands to diagnose issues:

```bash
# 1. Check Node.js
node --version

# 2. Check npm
npm --version

# 3. Check Docker
docker --version

# 4. Check AutoDiscovery folder exists
cd AutoDiscovery
pwd

# 5. Check autodiscovery-cli exists
cd autodiscovery-cli
pwd

# 6. Check package.json
cat package.json | head -20

# 7. Try to install dependencies
npm install

# 8. Check if deploy-preprod script exists
npm run | grep deploy

# 9. Check port 6300 availability
netstat -an | grep 6300  # Linux/Mac
netstat -ano | findstr 6300  # Windows
```

---

## 📋 Pre-Flight Checklist

Before deploying, verify:

```
[ ] Node.js installed: node --version
[ ] npm installed: npm --version
[ ] Docker running: docker ps
[ ] In AutoDiscovery folder: ls package.json
[ ] Dependencies installed: ls node_modules
[ ] In autodiscovery-cli: ls package.json
[ ] Wallet mnemonic ready (from Lace)
[ ] Wallet funded with tDUST (check Lace)
[ ] Port 6300 available: netstat -an | grep 6300
```

---

## 🚀 Simplified Deployment (No Manual Terminals)

If terminal issues persist, use the automated Docker setup:

### Option: Use Docker Compose Instead

```bash
cd AutoDiscovery

# 1. Start all services with Docker
docker compose -f docker-compose.prod.yml up -d

# 2. Check services running
docker ps

# 3. View logs
docker compose logs -f

# 4. Stop services
docker compose down
```

This avoids manual terminal management.

---

## 📞 Get Help

**Share these details:**

1. Copy the **exact error message** you see
2. Tell me **which step** you're on:
   - [ ] Installing npm packages?
   - [ ] Starting proof server?
   - [ ] Deploying contracts?
   - [ ] Running quick-deploy script?
3. Your **operating system:**
   - [ ] Windows
   - [ ] Mac
   - [ ] Linux

**Then I can give specific fix!**

---

## ✅ Quick Fix Template

If you get an npm error, try:

```bash
# 1. Clear cache
npm cache clean --force

# 2. Go to correct folder
cd AutoDiscovery/autodiscovery-cli

# 3. Reinstall
npm install

# 4. Try command again
npm run deploy-preprod
```

---

*Last Updated: 2026-05-27*
