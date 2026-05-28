# 🖥️ Two Terminal Setup - Quick Visual Guide

## What You Need

You need **2 separate command line windows** open at the same time.

---

## On Windows: Easiest Method

### Method 1: Command Prompt (Simplest)

**Step 1: Open Terminal 1**
```
Press: Windows Key + R
Type: cmd
Press: Enter
```

New window opens. This is **Terminal 1**.

**Step 2: In Terminal 1, start proof server**
```
cd AutoDiscovery\autodiscovery-cli
npm run ps-preprod
```

Wait for:
```
✓ Proof server listening on http://localhost:6300
```

**Leave this window open - don't close it!**

**Step 3: Open Terminal 2**
```
Press: Windows Key + R
Type: cmd
Press: Enter
```

Another new window opens. This is **Terminal 2**.

**Step 4: In Terminal 2, deploy contracts**
```
cd AutoDiscovery\autodiscovery-cli
set WALLET_MNEMONIC=your 24-word phrase from Lace
npm run deploy-preprod
```

Done! You now have:
- Terminal 1: Proof server running
- Terminal 2: Deploying contracts

---

## On Mac: Terminal Method

**Step 1: Open Terminal 1**
```
Cmd + Space
Type: terminal
Press: Enter
```

**Step 2: Start proof server**
```
cd AutoDiscovery/autodiscovery-cli
npm run ps-preprod
```

**Step 3: Open Terminal 2**
```
Cmd + N (or File → New Window)
```

**Step 4: Deploy contracts**
```
cd AutoDiscovery/autodiscovery-cli
export WALLET_MNEMONIC="your 24-word phrase"
npm run deploy-preprod
```

---

## On Linux: Terminal Method

**Step 1: Open Terminal 1**
```
Ctrl + Alt + T
```

**Step 2: Start proof server**
```
cd AutoDiscovery/autodiscovery-cli
npm run ps-preprod
```

**Step 3: Open Terminal 2**
```
Ctrl + Alt + T (again)
```

**Step 4: Deploy contracts**
```
cd AutoDiscovery/autodiscovery-cli
export WALLET_MNEMONIC="your 24-word phrase"
npm run deploy-preprod
```

---

## Using VS Code (Alternative)

**Step 1: Open VS Code**
- Open your project folder in VS Code

**Step 2: Open Terminal 1**
```
Ctrl + ` (backtick - below Esc key)
```

You see a terminal panel at the bottom.

**Step 3: Start proof server**
```
cd autodiscovery-cli
npm run ps-preprod
```

**Step 4: Open Terminal 2**
- Click the **+** button in the terminal panel (top right)

A new terminal tab appears.

**Step 5: Deploy contracts**
```
cd autodiscovery-cli
export WALLET_MNEMONIC="your 24-word phrase"
npm run deploy-preprod
```

You now see two tabs at the bottom of VS Code:
- Tab 1: Proof server running
- Tab 2: Deploying contracts

---

## What It Looks Like

### Two Windows Side-by-Side

```
┌──────────────────────────┬──────────────────────────┐
│    TERMINAL 1            │    TERMINAL 2            │
│  (Left side)             │  (Right side)            │
├──────────────────────────┼──────────────────────────┤
│ $ npm run ps-preprod     │ $ npm run deploy-preprod │
│                          │                          │
│ Proof server listening   │ 🚀 AutoDiscovery         │
│ on http://localhost:6300 │                          │
│                          │ 📦 Deploying contracts   │
│ ✓ Ready                  │                          │
│                          │ ✅ discovery-core: 03c  │
│ Keep this open!          │ ✅ compliance-proof: 04 │
│                          │ ✅ document-reg: 05d    │
│                          │ ... more ...             │
└──────────────────────────┴──────────────────────────┘
```

### VS Code with Tabs

```
┌─────────────────────────────────────────────────┐
│  VS Code                                        │
├─────────────────────────────────────────────────┤
│  [File] [Edit] [View] ...                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  Your editor window                             │
│                                                 │
├─────────────────────────────────────────────────┤
│ [ps-preprod] [deploy-preprod] [+]             │
│  │                                              │
│  └─ Proof server running                       │
│     ✓ http://localhost:6300                   │
│     Keep running!                               │
│                                                 │
│     OR click [deploy-preprod] tab to switch    │
│     to see deployment progress                 │
└─────────────────────────────────────────────────┘
```

---

## ✅ Checklist

```
[ ] Terminal 1 is open
[ ] Terminal 1 shows "✓ Proof server listening"
[ ] Terminal 1 is NOT closed
[ ] Terminal 2 is open (different window/tab)
[ ] Terminal 2 has WALLET_MNEMONIC set
[ ] Terminal 2 runs deploy-preprod
[ ] Both terminals are running at same time
```

---

## 🆘 Troubleshooting

**Q: Terminal 2 says "Connection refused"**  
A: Terminal 1 (proof server) isn't running. Check Terminal 1 and make sure it shows "✓ Proof server listening"

**Q: Can't find Terminal 1 anymore**  
A: Look for the window or tab. On Windows, check taskbar. On Mac, use Cmd+Tab. In VS Code, click the terminal tab.

**Q: I closed Terminal 1 by accident**  
A: Go back and run `npm run ps-preprod` again. Then Terminal 2 can continue.

**Q: Getting "npm: command not found"**  
A: Node.js/npm not installed. Download from https://nodejs.org

**Q: cd command doesn't work**  
A: You're in wrong folder. Make sure you're in the `AutoDiscovery` folder first, then navigate to subfolders.

---

## 📝 Commands Reference

### Terminal 1: Start Proof Server (KEEP RUNNING)
```bash
cd AutoDiscovery/autodiscovery-cli
npm run ps-preprod
```

### Terminal 2: Deploy Contracts
```bash
cd AutoDiscovery/autodiscovery-cli
export WALLET_MNEMONIC="word1 word2 word3 ... word24"
npm run deploy-preprod
```

### Terminal 2 Alternative (Windows PowerShell)
```powershell
cd AutoDiscovery\autodiscovery-cli
$env:WALLET_MNEMONIC="word1 word2 word3 ... word24"
npm run deploy-preprod
```

### Terminal 2 Alternative (Windows Command Prompt)
```cmd
cd AutoDiscovery\autodiscovery-cli
set WALLET_MNEMONIC=word1 word2 word3 ... word24
npm run deploy-preprod
```

---

## 🚀 Quick Start

1. Open Terminal 1, run proof server
2. Open Terminal 2, deploy contracts
3. Copy contract addresses
4. Done!

---

*Updated: 2026-05-27*
