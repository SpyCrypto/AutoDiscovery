# Deploy VITE_CONTRACT_DISCOVERY_CORE - Step-by-Step Guide

## Overview

**Contract:** discovery-core  
**Purpose:** Main case/step lifecycle management  
**Network:** Midnight PreProd  
**Environment Variable:** `VITE_CONTRACT_DISCOVERY_CORE`

---

## Prerequisites (One-Time Setup)

Before you start, make sure you have:

✅ **Lace Wallet Installed**
- Browser extension from https://www.lace.io
- Wallet created or seed imported
- Showing a balance (at least some tokens)

✅ **PreProd Network Selected**
- Open Lace wallet
- Click network dropdown (top right)
- Select "PreProd" (NOT MainNet)

✅ **Test DUST Tokens**
- Go to https://faucet.midnight.network
- Paste your wallet address (from Lace)
- Request tokens
- Wait 1-2 minutes for confirmation
- Check balance in Lace (should show DUST > 0)

---

## Deployment Steps

### Step 1: Open Midnight Block Explorer

Open your browser and navigate to:
```
https://explore-preprod.midnight.network
```

You should see the Midnight Explorer interface.

---

### Step 2: Connect Your Wallet

Look for a **"Connect Wallet"** button (usually top right or in a menu).

1. Click **"Connect Wallet"**
2. Select **"Lace Wallet"** from the options
3. A popup will appear asking to authorize
4. In the Lace extension popup:
   - Review the connection request
   - Click **"Approve"** or **"Connect"**
5. You should see your wallet address displayed in the explorer

**If you don't see the connect button:**
- Refresh the page
- Make sure Lace is installed and active
- Check that you're on the correct URL

---

### Step 3: Find the Deploy Contract Option

Look for one of these buttons/menus:
- "Deploy Contract"
- "New Contract"
- "Deploy"
- A menu option like "Contracts" → "Deploy"

If you can't find it:
1. Look for a menu icon (☰) 
2. Check for a "+" button
3. Scroll down to see more options

---

### Step 4: Select the Contract to Deploy

When you click the deploy option, you'll likely see:
- A file browser or upload area
- A contract selection menu
- A text input for contract details

You need to select: **discovery-core**

**Option A: Upload Folder**
```
Navigate to: AutoDiscovery/autodiscovery-contract/src/managed/discovery-core
Select the entire folder
Upload it
```

**Option B: Select from List**
If there's a dropdown of compiled contracts:
```
Look for "discovery-core" in the list
Click to select it
```

**Option C: Paste Contract Code**
If you need to paste the contract:
```
Open: AutoDiscovery/autodiscovery-contract/src/managed/discovery-core/index.ts
Copy the contents
Paste into the explorer
```

---

### Step 5: Review Contract Details

You should see a screen showing:
- Contract name: `discovery-core`
- Description: Case/step lifecycle management
- Gas estimate: ~500,000 MIST (approximately)
- Initial state: (should be empty or default)

**Verify:**
- Contract name looks correct ✓
- Network shows "PreProd" ✓
- Gas is reasonable (> 100,000) ✓

---

### Step 6: Click Deploy

Look for a button that says:
- "Deploy"
- "Deploy Contract"
- "Confirm Deploy"
- "Send Transaction"

Click it.

---

### Step 7: Approve in Lace Wallet

A **Lace wallet popup** will appear showing:
- Transaction details
- Gas fee (in DUST)
- From address (your wallet)
- To address (contract deployment)

**Review the details:**
- Make sure it's from your correct address
- Gas fee should be reasonable (< 1,000,000 MIST)
- Network should be PreProd

**Click "Approve"** or **"Confirm"** in the Lace popup.

---

### Step 8: Wait for Confirmation

You'll see a status indicator:
- "Pending..." (gray/blue)
- "Processing..." (blue)
- "Confirmed" (green) ← This is what you want

**Wait time:** 30-60 seconds (usually)

**You can check:**
- Explorer page will update automatically
- Lace wallet may show confirmation
- Browser console (F12) may show activity

---

### Step 9: Copy the Contract Address

Once confirmed, you should see:
```
✅ Deployment Successful!

Contract Address: 03cc52g89494d8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
Transaction Hash: 0x1234567890abcdef...
Block Height: 123456
Gas Used: 450,000 MIST
```

**Copy the Contract Address:**
1. Look for the long hex string starting with "02" or "03"
2. Click on it or select it
3. Right-click → Copy
4. Or click a copy icon (📋) if available

---

### Step 10: Save the Address

Create a text file and paste:

```env
VITE_CONTRACT_DISCOVERY_CORE=03cc52g89494d8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
```

**Verify the address:**
- Starts with "02" or "03" ✓
- All hex characters (0-9, a-f) ✓
- ~50-100 characters long ✓

---

## Troubleshooting

### Problem: "Connect Wallet" button not visible

**Solutions:**
1. Refresh page (F5 or Cmd+R)
2. Clear browser cache
3. Try different browser
4. Verify Lace is installed and enabled
5. Check you're on https://explore-preprod.midnight.network (not http://)

### Problem: Lace wallet shows "Wrong Network"

**Solution:**
1. Open Lace extension
2. Click network dropdown
3. Select "PreProd"
4. Reload explorer page
5. Try connecting again

### Problem: "Insufficient Balance" error

**Solution:**
1. Go to https://faucet.midnight.network
2. Paste your wallet address from Lace
3. Request tokens
4. Wait 1-2 minutes
5. Check Lace wallet balance
6. Try deployment again

### Problem: Transaction pending for > 2 minutes

**Solution:**
1. Wait a bit longer (network may be busy)
2. Refresh page to see actual status
3. Check recent transactions in Lace wallet
4. If stuck, try deploying again with a new transaction

### Problem: "Deploy button" not found

**Solution:**
1. Look for a menu icon (☰) at top left
2. Check for a "+" button
3. Look for "Contracts" menu item
4. Try scrolling down on page
5. Check browser console (F12) for errors

### Problem: See an error message

**Common errors and solutions:**
- "Invalid contract" → Contract files may be corrupted, recompile: `npm run compact`
- "Gas too low" → Increase gas limit in settings
- "Network error" → Check internet, refresh page
- "Wallet not responding" → Restart Lace extension

---

## What Happens Next

Once you have the `VITE_CONTRACT_DISCOVERY_CORE` address:

1. **Save it** to a text file
2. **Repeat for the other 5 contracts**:
   - VITE_CONTRACT_DISCOVERY_PROOF
   - VITE_CONTRACT_DOCUMENT_REGISTRY
   - VITE_CONTRACT_ACCESS_CONTROL
   - VITE_CONTRACT_JURISDICTION_REGISTRY
   - VITE_CONTRACT_EXPERT_WITNESS

3. **Run the address capture script**:
   ```bash
   bash scripts/save-contract-addresses.sh
   ```

4. **Start AutoDiscovery**:
   ```bash
   bash scripts/setup-production.sh
   ```

---

## Verify on Explorer

After deployment, you can verify the contract exists:

1. In explorer, search for your contract address
2. You should see:
   - Contract details
   - Deployment block
   - Current state
   - Transaction history

---

## Reference Information

**Contract Files:**
- Location: `AutoDiscovery/autodiscovery-contract/src/managed/discovery-core/`
- Main file: `index.ts`
- Circuit: `circuit.ts`
- Keys: `keys/` folder
- Proofs: `zkir/` folder

**Gas Estimate:**
- Expected: ~500,000 MIST
- Maximum (safe): ~1,000,000 MIST

**Deployment Time:**
- Average: 30-60 seconds
- Maximum: 2-3 minutes

**Network:**
- Name: PreProd
- Explorer: https://explore-preprod.midnight.network
- Faucet: https://faucet.midnight.network

---

## Success Indicators

You'll know it worked when you see:

✅ Green checkmark or "Success" message  
✅ Contract address displayed (hex string)  
✅ Transaction hash shown  
✅ Block height visible  
✅ No error messages  

---

## Next Steps After This Deployment

1. **Save the address** you received
2. **Repeat for the other 5 contracts** (use same process)
3. **Collect all 6 addresses**
4. **Run address capture script**:
   ```bash
   bash scripts/save-contract-addresses.sh
   ```
5. **Deploy AutoDiscovery**:
   ```bash
   bash scripts/setup-production.sh
   ```

---

## Need Help?

- Check `DEPLOY_MANUALLY.md` for full deployment guide
- Review `DEPLOYMENT_CHECKLIST.md` for checklist
- See `DEPLOYMENT_STATUS.txt` for status overview
- Visit https://midnight.network/docs
- Check GitHub issues: https://github.com/SpyCrypto/AutoDiscovery/issues

---

**Time Estimate:** 5-10 minutes for this deployment

Ready? Open your browser and go to:
## 👉 https://explore-preprod.midnight.network

Good luck! 🚀
