# Understanding Terminal 1 and Terminal 2

When deploying AutoDiscovery, you need **two separate terminal/command line windows** running **at the same time**.

---

## 🖥️ Why Two Terminals?

The proof server (Terminal 1) must **keep running in the background** while you deploy contracts (Terminal 2). If you close Terminal 1, the proof server stops and contract deployment fails.

---

## 📍 How to Open Two Terminals

### On Windows

**Option A: Using Command Prompt**
1. Open Command Prompt (Win+R → type `cmd` → Enter)
2. This is **Terminal 1**
3. Open another Command Prompt window (Win+R → type `cmd` → Enter again)
4. This is **Terminal 2**

**Option B: Using PowerShell**
1. Open PowerShell (Win+R → type `powershell` → Enter)
2. This is **Terminal 1**
3. Open another PowerShell window (Win+R → type `powershell` → Enter again)
4. This is **Terminal 2**

**Option C: Using VS Code**
1. Open VS Code
2. Open integrated terminal (Ctrl + `)
3. This is **Terminal 1**
4. Click the + button to open another tab in the same terminal panel
5. This is **Terminal 2** (visible as a tab at the bottom)

### On Mac

1. Open Terminal (Cmd + Space → type `terminal` → Enter)
2. This is **Terminal 1**
3. Open another Terminal window (Cmd + N)
4. This is **Terminal 2**

### On Linux

1. Open terminal (Ctrl + Alt + T)
2. This is **Terminal 1**
3. Open another terminal (Ctrl + Alt + T again)
4. This is **Terminal 2**

---

## 🚀 Correct Deployment Process

### Terminal 1: Start Proof Server (Keep Running)

```bash
cd AutoDiscovery/autodiscovery-cli
npm run ps-preprod
```

**Expected output:**
```
Proof server starting...
✓ Proof server listening on http://localhost:6300
```

**⚠️ IMPORTANT: DO NOT CLOSE THIS TERMINAL**  
Keep it open and running in the background.

---

### Terminal 2: Deploy Contracts (New Terminal)

In a **different** terminal window:

```bash
cd AutoDiscovery/autodiscovery-cli
export WALLET_MNEMONIC="your 24-word phrase from Lace"
npm run deploy-preprod
```

**Expected output:**
```
🚀  AutoDiscovery — Preprod Contract Deployer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦  Deploying discovery-core...
   ✅  discovery-core: 03cc52g89494d89...
📦  Deploying jurisdiction-registry...
   ✅  jurisdiction-registry: 04dd63h89505e...
[... more contracts ...]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  All contracts deployed!
VITE_CONTRACT_DISCOVERY_CORE=03cc52g89494d89...
[... copy these addresses ...]
```

---

## 📊 Visual Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Computer                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐    ┌──────────────────────┐      │
│  │    TERMINAL 1        │    │    TERMINAL 2        │      │
│  │  (Proof Server)      │    │  (Contract Deploy)   │      │
│  │                      │    │                      │      │
│  │ $ npm run ps-preprod │    │ $ npm run deploy-   │      │
│  │                      │    │   preprod           │      │
│  │ ✓ Running...         │    │                      │      │
│  │ Keep open!           │    │ Deploy in progress   │      │
│  │                      │    │ (uses Terminal 1)    │      │
│  └──────────────────────┘    └──────────────────────┘      │
│         |                              |                    │
│         └──────────────────────────────┘                    │
│              They communicate                               │
│           (Terminal 2 uses proof                            │
│          server from Terminal 1)                            │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Step-by-Step Example (Windows with Command Prompt)

### Step 1: Open First Command Prompt (Terminal 1)
```
Win + R
type: cmd
press Enter
```

You see:
```
C:\Users\YourName>
```

### Step 2: Start Proof Server
```
cd AutoDiscovery\autodiscovery-cli
npm run ps-preprod
```

You see:
```
Proof server starting on http://localhost:6300
✓ Server ready
```

**Leave this window open. Don't close it.**

### Step 3: Open Second Command Prompt (Terminal 2)
```
Win + R
type: cmd
press Enter
```

A new window opens. You see:
```
C:\Users\YourName>
```

### Step 4: Deploy Contracts in Terminal 2
```
cd AutoDiscovery\autodiscovery-cli
set WALLET_MNEMONIC=your 24-word phrase
npm run deploy-preprod
```

You see:
```
🚀  AutoDiscovery — Preprod Contract Deployer
📦  Deploying discovery-core...
   ✅  discovery-core: 03cc52g...
```

### Step 5: Copy Addresses
When deployment finishes, you see:
```
VITE_CONTRACT_DISCOVERY_CORE=03cc52g89494d89...
VITE_CONTRACT_JURISDICTION_REGISTRY=04dd63h89505e...
VITE_CONTRACT_COMPLIANCE_PROOF=05ee74i89616f...
VITE_CONTRACT_DOCUMENT_REGISTRY=06ff85j89727g...
VITE_CONTRACT_ACCESS_CONTROL=07gg96k89838h...
VITE_CONTRACT_EXPERT_WITNESS=08hh07l89949i...
```

Copy these 6 lines and save to `AutoDiscovery/.env.contracts`

### Step 6: Continue
Terminal 1 still running? ✅ Good.
Now run the auto-deploy script in a **third terminal** or the same Terminal 2:
```
cd AutoDiscovery
bash scripts/quick-deploy.sh
```

---

## 🎯 Summary

| What | Where |
|------|-------|
| **Terminal 1** | One command line window - runs proof server (KEEP OPEN) |
| **Terminal 2** | Different command line window - runs deployment script |
| **Both at same time** | Terminal 1 proof server + Terminal 2 deploying contracts |
| **After deployment** | Keep Terminal 1 open OR close it if done |

---

## ❓ Common Questions

**Q: Can I close Terminal 1 after deployment?**  
A: Yes, once all 6 contracts are deployed and you have the addresses, you can close Terminal 1.

**Q: What if I only have one monitor?**  
A: You can still have two terminal windows open. They'll overlap or you can move them around with your mouse.

**Q: Can I use VS Code instead?**  
A: Yes! VS Code has built-in terminals. Open terminal with Ctrl+` then click + to add a second terminal tab.

**Q: Do Terminal 1 and 2 need to be in the same folder?**  
A: Both should be in the `AutoDiscovery` folder or its subfolders. The commands handle the paths.

**Q: What if Terminal 2 says "connection refused"?**  
A: Terminal 1 (proof server) isn't running. Go back to Terminal 1 and make sure it's still showing the "✓ listening" message.

---

**Ready to deploy?**

1. Open Terminal 1: `cd AutoDiscovery/autodiscovery-cli && npm run ps-preprod`
2. Open Terminal 2: `cd AutoDiscovery/autodiscovery-cli && export WALLET_MNEMONIC="..." && npm run deploy-preprod`

---

*Last Updated: 2026-05-27*
