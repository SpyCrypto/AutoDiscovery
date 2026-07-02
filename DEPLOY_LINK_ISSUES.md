# Deploy VITE_CONTRACT_DISCOVERY_CORE - Alternative Methods

## Explorer Link Issues

If `https://explore-preprod.midnight.network` doesn't work, here are **alternative deployment methods**:

---

## Option 1: Use Midnight Developer Portal

**Official Midnight Documentation:**
- Main site: https://midnight.network
- Developer docs: https://docs.midnight.network
- Getting started: https://docs.midnight.network/getting-started

**Steps:**
1. Visit: https://docs.midnight.network
2. Look for "Deploy" or "Smart Contracts" section
3. Follow official deployment guide
4. Alternative: Check for "Developer Tools" or "Testnet" links

---

## Option 2: Use Lace Wallet Built-In Features

Lace wallet may have built-in contract deployment:

**Steps:**
1. Open Lace wallet browser extension
2. Look for "dApps" or "Connect" section
3. Look for deployment tools
4. Or search for connected dApps that allow deployment

---

## Option 3: Local Deployment Testing

Since remote explorer may be down, you can test locally first:

```bash
# Start local Midnight network
docker-compose up -d midnight-local

# This starts:
# - Node on localhost:9944
# - Indexer on localhost:8088
# - Proof server on localhost:6300

# Then test deployment against local network
# (You'd need local deployment tools)
```

---

## Option 4: Check Community Resources

**Midnight Community:**
- Discord: https://discord.com/invite/midnightnetwork
- GitHub: https://github.com/midnightntwrk
- Forum: https://forum.midnight.network

**What to ask:**
- "Explorer not working - alternative deployment method?"
- "PreProd deployment URLs"
- "How to deploy discovery-core contract"

---

## Option 5: Reference Deployments

Look for existing deployments in the ecosystem:

**midnight-doc-manager** (reference project):
- https://github.com/Mackenzie-OO7/midnight-doc-manager
- May have deployment scripts or examples
- Check their documentation for working methods

**AutoDiscovery repo:**
- Check issues: https://github.com/SpyCrypto/AutoDiscovery/issues
- May have deployment guidance
- Other users may have solutions

---

## Option 6: Manual Contract Data (If No Deployment Available)

If you absolutely can't deploy right now, here's what to do:

### Workaround: Use Mock Addresses

For **testing purposes only**, you can use placeholder addresses:

```env
# Test addresses (NOT real - for development only)
VITE_CONTRACT_DISCOVERY_CORE=03cc52g89494d8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_DISCOVERY_PROOF=04dd63h89505e9d0e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_DOCUMENT_REGISTRY=05ee74i89616f0e1f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_ACCESS_CONTROL=06ff85j89727g1f2g7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_JURISDICTION_REGISTRY=07gg96k89838h2g3h8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_EXPERT_WITNESS=08hh07l89949i3h4i9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
```

**⚠️ WARNING:** These won't actually work for transactions, but you can:
- Test the UI starts
- Test the frontend loads
- Test wallet connection UI
- See what errors you get

Then when the explorer is back up, deploy real contracts.

---

## Option 7: Wait & Retry

The explorer might be:
- Temporarily down for maintenance
- Rate limiting
- Under heavy load

**Try again later:**
1. Wait 30 minutes - 1 hour
2. Retry: https://explore-preprod.midnight.network
3. Check Discord for status updates

---

## What to Do Right Now

### Immediate Actions:

1. **Check current status:**
   - Discord: https://discord.com/invite/midnightnetwork
   - Ask: "Is PreProd explorer down?"

2. **Check documentation:**
   - https://docs.midnight.network
   - Search for "deploy contract"
   - Look for alternative explorer URLs

3. **Check GitHub:**
   - https://github.com/SpyCrypto/AutoDiscovery/issues
   - Ask if anyone has working deployment method

4. **Try local testing:**
   ```bash
   docker-compose up -d midnight-local
   # At least you can test the UI without real deployment
   ```

---

## Alternative Explorers / Tools

Search for:
- "Midnight testnet explorer"
- "Midnight preprod tools"
- "Midnight contract deployment"
- "Midnight dApp tools"

These may turn up:
- Backup explorers
- Community tools
- Official alternative UIs

---

## If Explorer is Down Long-Term

**Plan B: Wait for CLI Tool**

The `midnight deploy` CLI tool should become available eventually:
- It's being developed but not public yet
- When available: `npm install -g @midnight-ntwrk/cli`
- Then deployment can be automated

**Until then:**
- Use whatever explorer/tool is available
- Or use local testing with mock addresses

---

## Testing with Mock Addresses (Development Only)

If you want to test the AutoDiscovery UI **without real deployment**:

```bash
# Add mock addresses to .env.prod
cat > .env.prod << 'EOF'
VITE_CONTRACT_DISCOVERY_CORE=03cc52g89494d8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_DISCOVERY_PROOF=04dd63h89505e9d0e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_DOCUMENT_REGISTRY=05ee74i89616f0e1f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_ACCESS_CONTROL=06ff85j89727g1f2g7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_JURISDICTION_REGISTRY=07gg96k89838h2g3h8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_EXPERT_WITNESS=08hh07l89949i3h4i9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_NODE_URL=http://localhost:9944
VITE_INDEXER_URL=http://localhost:8088/api/v1/graphql
VITE_PROOF_SERVER_URL=http://localhost:6300
EOF

# Start local stack
docker-compose up -d

# Deploy UI
bash scripts/setup-production.sh

# Access UI
# http://localhost:5174 (will show errors but UI loads)
```

This lets you:
- See the UI
- Test wallet connection flow
- See what errors occur
- Understand the architecture

Then when you have real addresses, update `.env.prod` and it'll work.

---

## Summary of Options

| Option | Pros | Cons | Time |
|--------|------|------|------|
| Use working explorer | Real deployment | Need to find it | Variable |
| Local testing | Can start now | No real chain | 10 min |
| Wait for explorer | Official path | Blocked for now | Unknown |
| Discord community | Get help | May not respond fast | 5-30 min |
| Mock addresses | Test UI | No transactions work | 5 min |

---

## Recommended Next Step

1. **Check Discord** first: https://discord.com/invite/midnightnetwork
   - Ask: "PreProd explorer URLs?"
   - Get current status
   - Find working deployment method (2-5 min)

2. **If no response in 10 min**, try local testing with mock addresses:
   ```bash
   docker-compose up -d
   bash scripts/setup-production.sh
   # UI will work, transactions won't
   ```

3. **When you have working explorer**, update addresses and deploy for real

---

## Resources

- **Midnight Docs:** https://docs.midnight.network
- **GitHub:** https://github.com/midnightntwrk
- **Discord:** https://discord.com/invite/midnightnetwork
- **Forum:** https://forum.midnight.network

---

**What should we try first?**

Option 1: Check Discord for working explorer URL?  
Option 2: Test locally with mock addresses?  
Option 3: Try alternative URLs?

Let me know! 🚀
