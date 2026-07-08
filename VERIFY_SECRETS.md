# Verify GitHub Secrets - Manual Check

## View Your Secrets on GitHub Web UI

### Go to Your Repository Settings

1. **Navigate to**: https://github.com/SpyCrypto/AutoDiscovery
2. **Click**: Settings (top right)
3. **Click**: Secrets and variables (left sidebar)
4. **Click**: Actions

You should see all 10 secrets listed:

---

## Expected 10 Secrets

### Staging Deployment (3)
- [ ] `STAGING_HOST` 
- [ ] `STAGING_USER`
- [ ] `STAGING_SSH_KEY`

### Production Deployment (3)
- [ ] `PROD_HOST`
- [ ] `PROD_USER`
- [ ] `PROD_SSH_KEY`

### Midnight Network (4)
- [ ] `VITE_NODE_URL`
- [ ] `VITE_INDEXER_URL`
- [ ] `VITE_INDEXER_WS`
- [ ] `VITE_PROOF_SERVER_URL`

---

## Check Each Secret

Each secret should show:
- ✅ Name (e.g., `STAGING_HOST`)
- ✅ Created date
- ✅ Last updated date
- ✅ (Value hidden for security)

If any are **missing**, you need to add them.

---

## Authenticate GitHub CLI (Optional)

To check secrets via CLI:

```bash
# Login to GitHub
gh auth login

# Then list secrets
gh secret list --repo SpyCrypto/AutoDiscovery

# Should output:
# PROD_HOST                           Updated DATE
# PROD_SSH_KEY                        Updated DATE
# PROD_USER                           Updated DATE
# STAGING_HOST                        Updated DATE
# STAGING_SSH_KEY                     Updated DATE
# STAGING_USER                        Updated DATE
# VITE_INDEXER_URL                    Updated DATE
# VITE_INDEXER_WS                     Updated DATE
# VITE_NODE_URL                       Updated DATE
# VITE_PROOF_SERVER_URL               Updated DATE
```

---

## Verify Secrets Are Being Used

Check your latest workflow run uses the secrets:

1. Go to: https://github.com/SpyCrypto/AutoDiscovery/actions
2. Click on latest workflow run
3. Click on `deploy.yml` job
4. Look for: "Secrets available in GitHub Actions"
5. Should list all 10 secrets

---

## If Secrets Are Missing

**Which secrets are missing?**

1. Staging: `STAGING_HOST`, `STAGING_USER`, `STAGING_SSH_KEY`
2. Production: `PROD_HOST`, `PROD_USER`, `PROD_SSH_KEY`
3. Midnight: `VITE_NODE_URL`, `VITE_INDEXER_URL`, `VITE_INDEXER_WS`, `VITE_PROOF_SERVER_URL`

---

## Add Missing Secrets

**Go to**: https://github.com/SpyCrypto/AutoDiscovery/settings/secrets/actions

**Click**: New repository secret

**Add**:
- Name: (e.g., `STAGING_HOST`)
- Value: (e.g., `192.168.1.143`)
- Click: Add secret

---

## Summary

| Secret | Status | Value |
|--------|--------|-------|
| STAGING_HOST | ✅ or ❌ | 192.168.1.143 |
| STAGING_USER | ✅ or ❌ | deploy |
| STAGING_SSH_KEY | ✅ or ❌ | (from ~/.ssh/deploy_staging) |
| PROD_HOST | ✅ or ❌ | (your-prod-server) |
| PROD_USER | ✅ or ❌ | deploy |
| PROD_SSH_KEY | ✅ or ❌ | (from ~/.ssh/deploy_prod) |
| VITE_NODE_URL | ✅ or ❌ | https://preprod-node.midnight.network |
| VITE_INDEXER_URL | ✅ or ❌ | https://preprod-indexer.midnight.network/api/v1/graphql |
| VITE_INDEXER_WS | ✅ or ❌ | wss://preprod-indexer.midnight.network/api/v1/graphql |
| VITE_PROOF_SERVER_URL | ✅ or ❌ | https://preprod-proof-server.midnight.network |

---

**Please verify all 10 secrets are present on GitHub.**

Link: https://github.com/SpyCrypto/AutoDiscovery/settings/secrets/actions

Let me know which secrets are present and which are missing! ✅
