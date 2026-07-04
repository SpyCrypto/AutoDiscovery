# GitHub Secrets Configuration for AutoDiscovery

## Overview

AutoDiscovery is a **blockchain dApp** that deploys to:
1. **Local Docker Compose** (development/testing)
2. **Midnight PreProd Network** (blockchain testnet)

No SSH-based servers needed. GitHub secrets configure Midnight network endpoints and contract addresses.

---

## Required GitHub Secrets (3 Categories)

### ✅ Midnight Network Endpoints (Always Same)
These are public Midnight PreProd endpoints - no secrets needed, but used for deployment.

### ⏳ Smart Contract Addresses (Needed After Deploy)
Get these from contract deployment output.

### Optional: Wallet & Deployment Keys
For CLI deployment automation.

---

## Step-by-Step: Add GitHub Secrets

### Option A: Using GitHub CLI (Recommended)

**1. Authenticate with GitHub**
```bash
gh auth login
```

**2. Add Midnight PreProd Endpoints**
```bash
# These are public endpoints
gh secret set VITE_NODE_URL --body "https://preprod-node.midnight.network"
gh secret set VITE_INDEXER_URL --body "https://preprod-indexer.midnight.network/api/v1/graphql"
gh secret set VITE_INDEXER_WS --body "wss://preprod-indexer.midnight.network/api/v1/graphql"
gh secret set VITE_PROOF_SERVER_URL --body "https://preprod-proof-server.midnight.network"
```

**3. Add Mock Contract Addresses (for testing)**
```bash
# Use these mock addresses until real contracts are deployed
gh secret set VITE_CONTRACT_DISCOVERY_CORE --body "03cc52g89494d8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"
gh secret set VITE_CONTRACT_DISCOVERY_PROOF --body "04dd63h89505e9d0e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"
gh secret set VITE_CONTRACT_DOCUMENT_REGISTRY --body "05ee74i89616f0e1f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"
gh secret set VITE_CONTRACT_ACCESS_CONTROL --body "06ff85j89727g1f2g7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"
gh secret set VITE_CONTRACT_JURISDICTION_REGISTRY --body "07gg96k89838h2g3h8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"
gh secret set VITE_CONTRACT_EXPERT_WITNESS --body "08hh07l89949i3h4i9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"
```

**4. Verify All Secrets**
```bash
gh secret list
```

Expected output:
```
VITE_NODE_URL                       Updated DATE
VITE_INDEXER_URL                    Updated DATE
VITE_INDEXER_WS                     Updated DATE
VITE_PROOF_SERVER_URL               Updated DATE
VITE_CONTRACT_DISCOVERY_CORE        Updated DATE
VITE_CONTRACT_DISCOVERY_PROOF       Updated DATE
VITE_CONTRACT_DOCUMENT_REGISTRY     Updated DATE
VITE_CONTRACT_ACCESS_CONTROL        Updated DATE
VITE_CONTRACT_JURISDICTION_REGISTRY Updated DATE
VITE_CONTRACT_EXPERT_WITNESS        Updated DATE
```

---

### Option B: Using GitHub Web UI (Manual)

1. Go to: **GitHub repo → Settings → Secrets and variables → Actions**

2. Click **New repository secret**

3. Add each secret:

| Name | Value |
|------|-------|
| `VITE_NODE_URL` | `https://preprod-node.midnight.network` |
| `VITE_INDEXER_URL` | `https://preprod-indexer.midnight.network/api/v1/graphql` |
| `VITE_INDEXER_WS` | `wss://preprod-indexer.midnight.network/api/v1/graphql` |
| `VITE_PROOF_SERVER_URL` | `https://preprod-proof-server.midnight.network` |
| `VITE_CONTRACT_DISCOVERY_CORE` | `03cc52g89494d8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f` |
| `VITE_CONTRACT_DISCOVERY_PROOF` | `04dd63h89505e9d0e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f` |
| `VITE_CONTRACT_DOCUMENT_REGISTRY` | `05ee74i89616f0e1f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f` |
| `VITE_CONTRACT_ACCESS_CONTROL` | `06ff85j89727g1f2g7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f` |
| `VITE_CONTRACT_JURISDICTION_REGISTRY` | `07gg96k89838h2g3h8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f` |
| `VITE_CONTRACT_EXPERT_WITNESS` | `08hh07l89949i3h4i9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f` |

4. For each secret:
   - Enter **Name** (left)
   - Enter **Value** (right)
   - Click **Add secret**

---

## What These Secrets Do

### Midnight Network Endpoints
```
VITE_NODE_URL               → Submit transactions
VITE_INDEXER_URL            → Query contract state
VITE_INDEXER_WS             → Real-time subscriptions
VITE_PROOF_SERVER_URL       → Generate ZK proofs
```

### Contract Addresses
```
VITE_CONTRACT_DISCOVERY_CORE        → Case/step lifecycle
VITE_CONTRACT_DISCOVERY_PROOF       → Compliance attestations
VITE_CONTRACT_DOCUMENT_REGISTRY     → Document tracking
VITE_CONTRACT_ACCESS_CONTROL        → Permission management
VITE_CONTRACT_JURISDICTION_REGISTRY → Rule packs by state
VITE_CONTRACT_EXPERT_WITNESS        → Expert management
```

---

## After Contracts Are Deployed

When you deploy contracts to Midnight PreProd:

1. Note the **6 contract addresses** from deployment output
2. Update GitHub secrets with real addresses:
   ```bash
   gh secret set VITE_CONTRACT_DISCOVERY_CORE --body "<address-from-deploy>"
   gh secret set VITE_CONTRACT_DISCOVERY_PROOF --body "<address-from-deploy>"
   gh secret set VITE_CONTRACT_DOCUMENT_REGISTRY --body "<address-from-deploy>"
   gh secret set VITE_CONTRACT_ACCESS_CONTROL --body "<address-from-deploy>"
   gh secret set VITE_CONTRACT_JURISDICTION_REGISTRY --body "<address-from-deploy>"
   gh secret set VITE_CONTRACT_EXPERT_WITNESS --body "<address-from-deploy>"
   ```

---

## Verification

Check secrets are added:
```bash
gh secret list
```

View a specific secret (hidden for security):
```bash
gh secret view VITE_NODE_URL
# Output: VITE_NODE_URL = https://preprod-node.midnight.network
```

---

## Deployment Flow

```
1. Developer: git push origin main
   ↓
2. GitHub Actions: Read secrets from Actions environment
   ↓
3. Build workflow: Build Docker images with secrets
   ↓
4. Frontend: Connects to Midnight PreProd using VITE_* secrets
   ↓
5. Smart Contracts: Deployed or interacted with using addresses
```

---

## Security Notes

✅ **Good**
- Secrets are encrypted and only exposed to workflows
- Never logged in workflow output
- Can only be read by people with repo access
- Different secrets per environment possible

⚠️ **Important**
- Don't commit `.env` files with secrets
- Don't print secrets in workflow logs
- Rotate secrets if compromised
- Use GitHub OIDC for future Midnight integrations

---

## Troubleshooting

### Secrets not working in build
- Check: Secrets are added to GitHub Actions (not repo settings)
- Check: Workflow file references `secrets.VITE_*`
- Check: No typos in secret names

### Contract addresses are wrong
- Check: Deploy logs show correct addresses
- Check: Addresses match network (PreProd vs MainNet)
- Check: Formatted correctly in secrets

### Network connectivity fails
- Check: Midnight endpoints are accessible (they're public)
- Check: No firewall blocking outbound to Midnight
- Check: Test endpoints manually: `curl https://preprod-node.midnight.network`

---

## Quick Commands

```bash
# Add all secrets quickly
gh secret set VITE_NODE_URL --body "https://preprod-node.midnight.network"
gh secret set VITE_INDEXER_URL --body "https://preprod-indexer.midnight.network/api/v1/graphql"
gh secret set VITE_INDEXER_WS --body "wss://preprod-indexer.midnight.network/api/v1/graphql"
gh secret set VITE_PROOF_SERVER_URL --body "https://preprod-proof-server.midnight.network"
gh secret set VITE_CONTRACT_DISCOVERY_CORE --body "03cc52g89494d8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"
gh secret set VITE_CONTRACT_DISCOVERY_PROOF --body "04dd63h89505e9d0e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"
gh secret set VITE_CONTRACT_DOCUMENT_REGISTRY --body "05ee74i89616f0e1f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"
gh secret set VITE_CONTRACT_ACCESS_CONTROL --body "06ff85j89727g1f2g7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"
gh secret set VITE_CONTRACT_JURISDICTION_REGISTRY --body "07gg96k89838h2g3h8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"
gh secret set VITE_CONTRACT_EXPERT_WITNESS --body "08hh07l89949i3h4i9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"

# Verify
gh secret list
```

---

**Status**: Ready to configure GitHub secrets for Midnight PreProd deployment
