# ✅ GitHub Secrets Configuration for AutoDiscovery

## Summary

AutoDiscovery deploys to **Midnight PreProd blockchain**, not traditional servers.

GitHub secrets configure:
- ✅ Midnight network endpoints (4 secrets)
- ✅ Smart contract addresses (6 secrets)

**Total: 10 secrets** (no SSH keys needed)

---

## Quick Setup (2 Minutes)

### Option 1: Automated Script (Recommended)
```bash
chmod +x add-github-secrets.sh
./add-github-secrets.sh
```

### Option 2: Manual Commands
```bash
# Midnight endpoints
gh secret set VITE_NODE_URL --body "https://preprod-node.midnight.network"
gh secret set VITE_INDEXER_URL --body "https://preprod-indexer.midnight.network/api/v1/graphql"
gh secret set VITE_INDEXER_WS --body "wss://preprod-indexer.midnight.network/api/v1/graphql"
gh secret set VITE_PROOF_SERVER_URL --body "https://preprod-proof-server.midnight.network"

# Mock contract addresses (for testing)
gh secret set VITE_CONTRACT_DISCOVERY_CORE --body "03cc52g89494d8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"
gh secret set VITE_CONTRACT_DISCOVERY_PROOF --body "04dd63h89505e9d0e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"
gh secret set VITE_CONTRACT_DOCUMENT_REGISTRY --body "05ee74i89616f0e1f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"
gh secret set VITE_CONTRACT_ACCESS_CONTROL --body "06ff85j89727g1f2g7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"
gh secret set VITE_CONTRACT_JURISDICTION_REGISTRY --body "07gg96k89838h2g3h8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"
gh secret set VITE_CONTRACT_EXPERT_WITNESS --body "08hh07l89949i3h4i9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"

# Verify
gh secret list
```

### Option 3: Web UI Manual
GitHub repo → Settings → Secrets and Variables → Actions → New repository secret

Add each from the table below.

---

## GitHub Secrets Reference

| Secret | Value | Purpose |
|--------|-------|---------|
| **VITE_NODE_URL** | `https://preprod-node.midnight.network` | RPC endpoint for transactions |
| **VITE_INDEXER_URL** | `https://preprod-indexer.midnight.network/api/v1/graphql` | Query contract state |
| **VITE_INDEXER_WS** | `wss://preprod-indexer.midnight.network/api/v1/graphql` | Real-time subscriptions |
| **VITE_PROOF_SERVER_URL** | `https://preprod-proof-server.midnight.network` | Generate ZK proofs |
| **VITE_CONTRACT_DISCOVERY_CORE** | `03cc52g89494d8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f` | Case lifecycle |
| **VITE_CONTRACT_DISCOVERY_PROOF** | `04dd63h89505e9d0e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f` | Compliance proofs |
| **VITE_CONTRACT_DOCUMENT_REGISTRY** | `05ee74i89616f0e1f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f` | Document tracking |
| **VITE_CONTRACT_ACCESS_CONTROL** | `06ff85j89727g1f2g7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f` | Permissions |
| **VITE_CONTRACT_JURISDICTION_REGISTRY** | `07gg96k89838h2g3h8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f` | Rules by state |
| **VITE_CONTRACT_EXPERT_WITNESS** | `08hh07l89949i3h4i9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f` | Expert management |

---

## Verification

After adding secrets:
```bash
gh secret list
```

Expected: 10 secrets listed

```
VITE_CONTRACT_ACCESS_CONTROL            Updated Jul 2, 2026
VITE_CONTRACT_DISCOVERY_CORE            Updated Jul 2, 2026
VITE_CONTRACT_DISCOVERY_PROOF           Updated Jul 2, 2026
VITE_CONTRACT_DOCUMENT_REGISTRY         Updated Jul 2, 2026
VITE_CONTRACT_EXPERT_WITNESS            Updated Jul 2, 2026
VITE_CONTRACT_JURISDICTION_REGISTRY     Updated Jul 2, 2026
VITE_INDEXER_URL                        Updated Jul 2, 2026
VITE_INDEXER_WS                         Updated Jul 2, 2026
VITE_NODE_URL                           Updated Jul 2, 2026
VITE_PROOF_SERVER_URL                   Updated Jul 2, 2026
```

---

## After Contracts Are Deployed

When you deploy smart contracts to Midnight PreProd:

1. Get the 6 contract addresses from deployment logs
2. Update GitHub secrets:

```bash
gh secret set VITE_CONTRACT_DISCOVERY_CORE --body "<address-from-deploy>"
gh secret set VITE_CONTRACT_DISCOVERY_PROOF --body "<address-from-deploy>"
gh secret set VITE_CONTRACT_DOCUMENT_REGISTRY --body "<address-from-deploy>"
gh secret set VITE_CONTRACT_ACCESS_CONTROL --body "<address-from-deploy>"
gh secret set VITE_CONTRACT_JURISDICTION_REGISTRY --body "<address-from-deploy>"
gh secret set VITE_CONTRACT_EXPERT_WITNESS --body "<address-from-deploy>"
```

---

## Deployment Flow

```
Developer pushes code
        ↓
GitHub Actions reads secrets
        ↓
Build workflow: Creates Docker image
        ↓
Test workflow: Runs with mock contracts
        ↓
Frontend connects to Midnight PreProd using:
  - VITE_NODE_URL (send transactions)
  - VITE_INDEXER_URL (query state)
  - VITE_PROOF_SERVER_URL (ZK proofs)
        ↓
Smart contracts interact with:
  - VITE_CONTRACT_* (deployed addresses)
```

---

## Next: Test First Deployment

```bash
# Push to trigger workflows
git push origin main

# Watch build
gh run list
gh run view <run-id> --log

# After build succeeds, frontend should connect to Midnight PreProd
```

---

## Files Created

- **GITHUB_SECRETS_SETUP.md** - Detailed secrets documentation
- **add-github-secrets.sh** - Automated script to add all secrets
- **GITHUB_SECRETS_CONFIGURED.md** - This file

---

**Status**: ✅ Ready to configure secrets

**Next**: Run `./add-github-secrets.sh` or manually add secrets from table above
