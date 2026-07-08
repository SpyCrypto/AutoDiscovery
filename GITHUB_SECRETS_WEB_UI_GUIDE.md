# ✅ GitHub Secrets - Complete Web UI Guide

## Add 10 Secrets via GitHub Web Interface

### Access GitHub Secrets

1. Go to your GitHub repository: `https://github.com/SpyCrypto/AutoDiscovery`
2. Click **Settings** (top right)
3. Click **Secrets and variables** (left sidebar)
4. Click **Actions**
5. Click **New repository secret** button

---

## Staging Deployment Secrets (3)

### 1. STAGING_HOST

- **Name**: `STAGING_HOST`
- **Value**: `your-staging-server.com` (or IP address)
- Click **Add secret**

### 2. STAGING_USER

- **Name**: `STAGING_USER`
- **Value**: `deploy` (or root, whoever runs Docker)
- Click **Add secret**

### 3. STAGING_SSH_KEY

- **Name**: `STAGING_SSH_KEY`
- **Value**: (Contents of `~/.ssh/deploy_staging`)

To get the private key content:
```bash
cat ~/.ssh/deploy_staging
```

Copy the **entire output** (including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines)

- Paste into **Value** field
- Click **Add secret**

---

## Production Deployment Secrets (3)

### 4. PROD_HOST

- **Name**: `PROD_HOST`
- **Value**: `your-prod-server.com` (or IP address)
- Click **Add secret**

### 5. PROD_USER

- **Name**: `PROD_USER`
- **Value**: `deploy` (or root, whoever runs Docker)
- Click **Add secret**

### 6. PROD_SSH_KEY

- **Name**: `PROD_SSH_KEY`
- **Value**: (Contents of `~/.ssh/deploy_prod`)

To get the private key content:
```bash
cat ~/.ssh/deploy_prod
```

Copy the **entire output** (including the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` lines)

- Paste into **Value** field
- Click **Add secret**

---

## Midnight Network Secrets (4)

### 7. VITE_NODE_URL

- **Name**: `VITE_NODE_URL`
- **Value**: `https://preprod-node.midnight.network`
- Click **Add secret**

### 8. VITE_INDEXER_URL

- **Name**: `VITE_INDEXER_URL`
- **Value**: `https://preprod-indexer.midnight.network/api/v1/graphql`
- Click **Add secret**

### 9. VITE_INDEXER_WS

- **Name**: `VITE_INDEXER_WS`
- **Value**: `wss://preprod-indexer.midnight.network/api/v1/graphql`
- Click **Add secret**

### 10. VITE_PROOF_SERVER_URL

- **Name**: `VITE_PROOF_SERVER_URL`
- **Value**: `https://preprod-proof-server.midnight.network`
- Click **Add secret**

---

## Verify All Secrets Added

After adding all 10 secrets, you should see them listed:

```
PROD_HOST                           Updated just now
PROD_SSH_KEY                        Updated just now
PROD_USER                           Updated just now
STAGING_HOST                        Updated just now
STAGING_SSH_KEY                     Updated just now
STAGING_USER                        Updated just now
VITE_INDEXER_URL                    Updated just now
VITE_INDEXER_WS                     Updated just now
VITE_NODE_URL                       Updated just now
VITE_PROOF_SERVER_URL               Updated just now
```

---

## Complete Reference Table

| # | Name | Value | Type |
|---|------|-------|------|
| 1 | `STAGING_HOST` | your-staging-server.com | Hostname/IP |
| 2 | `STAGING_USER` | deploy | SSH user |
| 3 | `STAGING_SSH_KEY` | (paste ~/.ssh/deploy_staging) | Private key |
| 4 | `PROD_HOST` | your-prod-server.com | Hostname/IP |
| 5 | `PROD_USER` | deploy | SSH user |
| 6 | `PROD_SSH_KEY` | (paste ~/.ssh/deploy_prod) | Private key |
| 7 | `VITE_NODE_URL` | https://preprod-node.midnight.network | URL |
| 8 | `VITE_INDEXER_URL` | https://preprod-indexer.midnight.network/api/v1/graphql | URL |
| 9 | `VITE_INDEXER_WS` | wss://preprod-indexer.midnight.network/api/v1/graphql | WebSocket |
| 10 | `VITE_PROOF_SERVER_URL` | https://preprod-proof-server.midnight.network | URL |

---

## After Adding Secrets

### Test SSH Connections
```bash
# These should work without prompting for password
ssh -i ~/.ssh/deploy_staging deploy@your-staging-server.com "docker --version"
ssh -i ~/.ssh/deploy_prod deploy@your-prod-server.com "docker --version"
```

### Deploy to Staging
```bash
git push origin develop
gh run list
gh run view <run-id> --log
```

### Deploy to Production
```bash
gh workflow run deploy.yml -f environment=production
gh run list
gh run view <run-id> --log
```

---

## ✅ Setup Complete

All 10 secrets added = GitHub Actions CI/CD is **100% operational**

---

**Time to complete**: 5-10 minutes

**Result**: Full automated deployment pipeline
