# ✅ SSH Deployment Setup - Complete Instructions

## Server Setup Summary (What You've Provided)

### Staging Server Setup ✅
```bash
# Add SSH public key
mkdir -p ~/.ssh
cat >> ~/.ssh/authorized_keys << 'EOF'
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKNEH2J4BuSu6USEz4gnkzD0zsfbAoVZ65u75mDiLAPA kurti@Baxters
EOF

chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# Create deployment directory
mkdir -p /opt/autodiscovery
cd /opt/autodiscovery

# Login to Docker registry
docker login ghcr.io -u <github-username> -p <github-token>
```

### Production Server Setup ✅
```bash
# Add SSH public key
mkdir -p ~/.ssh
cat >> ~/.ssh/authorized_keys << 'EOF'
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINh4m3aitIMV/l+V0ikS56ziuXPZsFowdSpltAacjh8X kurti@Baxters
EOF

chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# Create deployment directory
mkdir -p /opt/autodiscovery
cd /opt/autodiscovery

# Login to Docker registry
docker login ghcr.io -u <github-username> -p <github-token>
```

---

## Step 3: Add 10 GitHub Secrets

Now add these secrets to GitHub Actions.

### Option A: Automated Script (RECOMMENDED)
```bash
chmod +x setup-complete-deployment.sh
./setup-complete-deployment.sh
```

The script will:
1. Prompt for server details
2. Read SSH private keys from files
3. Add all 10 secrets to GitHub

### Option B: Manual Commands

**SSH Deployment Secrets (6):**
```bash
gh secret set STAGING_HOST --body "your-staging-server.com"
gh secret set STAGING_USER --body "root"
gh secret set STAGING_SSH_KEY --body "$(cat ~/.ssh/deploy_staging)"

gh secret set PROD_HOST --body "your-prod-server.com"
gh secret set PROD_USER --body "root"
gh secret set PROD_SSH_KEY --body "$(cat ~/.ssh/deploy_prod)"
```

**Midnight Network Secrets (4):**
```bash
gh secret set VITE_NODE_URL --body "https://preprod-node.midnight.network"
gh secret set VITE_INDEXER_URL --body "https://preprod-indexer.midnight.network/api/v1/graphql"
gh secret set VITE_INDEXER_WS --body "wss://preprod-indexer.midnight.network/api/v1/graphql"
gh secret set VITE_PROOF_SERVER_URL --body "https://preprod-proof-server.midnight.network"
```

### Option C: Web UI (Manual)
Go to: **GitHub repo → Settings → Secrets and variables → Actions**

Click **New repository secret** and add each:

| Name | Value |
|------|-------|
| `STAGING_HOST` | your-staging-server.com |
| `STAGING_USER` | root |
| `STAGING_SSH_KEY` | (contents of ~/.ssh/deploy_staging) |
| `PROD_HOST` | your-prod-server.com |
| `PROD_USER` | root |
| `PROD_SSH_KEY` | (contents of ~/.ssh/deploy_prod) |
| `VITE_NODE_URL` | https://preprod-node.midnight.network |
| `VITE_INDEXER_URL` | https://preprod-indexer.midnight.network/api/v1/graphql |
| `VITE_INDEXER_WS` | wss://preprod-indexer.midnight.network/api/v1/graphql |
| `VITE_PROOF_SERVER_URL` | https://preprod-proof-server.midnight.network |

---

## Verify Setup

```bash
# List all secrets
gh secret list

# Should show 10 secrets:
PROD_HOST                           Updated Jul 2, 2026
PROD_SSH_KEY                        Updated Jul 2, 2026
PROD_USER                           Updated Jul 2, 2026
STAGING_HOST                        Updated Jul 2, 2026
STAGING_SSH_KEY                     Updated Jul 2, 2026
STAGING_USER                        Updated Jul 2, 2026
VITE_INDEXER_URL                    Updated Jul 2, 2026
VITE_INDEXER_WS                     Updated Jul 2, 2026
VITE_NODE_URL                       Updated Jul 2, 2026
VITE_PROOF_SERVER_URL               Updated Jul 2, 2026

# Test SSH connections
ssh -i ~/.ssh/deploy_staging root@your-staging-server.com "docker --version"
ssh -i ~/.ssh/deploy_prod root@your-prod-server.com "docker --version"
```

---

## Deployment Flow

### Automatic Staging Deployment
```bash
git push origin develop
  ↓
Build workflow completes
  ↓
Deploy workflow reads SSH secrets
  ↓
SSH to staging server
  ↓
Pull Docker image from GHCR
  ↓
docker-compose -f docker-compose.prod.yml up
  ↓
Health check: curl http://localhost/health
  ↓
Slack notification (success/failure)
```

### Manual Production Deployment
```bash
# Requires approval
gh workflow run deploy.yml -f environment=production
  ↓
Deploy workflow reads SSH secrets
  ↓
SSH to production server
  ↓
Pull Docker image from GHCR
  ↓
docker-compose -f docker-compose.prod.yml up
  ↓
Health check: curl http://localhost/health
  ↓
Auto-rollback on failure
  ↓
Slack notification
```

---

## Test Deployment

### 1. Test SSH Access First
```bash
# Should work without password
ssh -i ~/.ssh/deploy_staging root@staging.example.com "docker --version"
ssh -i ~/.ssh/deploy_prod root@prod.example.com "docker --version"
```

### 2. Test Staging Deployment
```bash
# Push to develop to trigger staging deployment
git push origin develop

# Watch the deployment
gh run list
gh run view <run-id> --log

# Verify app is running
curl http://staging.example.com/health
```

### 3. Test Production Deployment
```bash
# Trigger manual production deployment
gh workflow run deploy.yml -f environment=production

# Watch the deployment
gh run list
gh run view <run-id> --log

# Verify app is running
curl http://prod.example.com/health
```

---

## What You Have Now

```
✅ Local Docker Preview     http://localhost:80 (running)
✅ GitHub Actions          4 workflows configured
✅ SSH Keys                Generated & deployed to servers
✅ Deployment Directories   /opt/autodiscovery on both servers
✅ Docker Registry Login    Configured on both servers
⏳ GitHub Secrets           10 secrets needed
⏳ First Deployment Test    Ready after secrets added
```

---

## Complete Deployment Architecture

```
Your Computer (git push)
         ↓
GitHub Repository
         ↓
GitHub Actions Workflow
  ├─ build.yml       → Build Docker image + push to GHCR
  ├─ test.yml        → Run tests
  └─ deploy.yml      → SSH Deploy (reads secrets)
         ↓
Staging Server (develop branch)
  ├─ SSH connect using STAGING_SSH_KEY
  ├─ Pull image from GHCR
  ├─ docker-compose up
  └─ Health check
         ↓
Production Server (main branch + approval)
  ├─ SSH connect using PROD_SSH_KEY
  ├─ Pull image from GHCR
  ├─ docker-compose up
  ├─ Health check
  └─ Auto-rollback on failure
         ↓
Slack Notifications
```

---

## Files Ready for Use

- `.github/workflows/deploy.yml` - SSH deployment workflow (configured)
- `docker-compose.prod.yml` - Production compose config
- `setup-complete-deployment.sh` - Automated secret setup script
- `SSH_DEPLOYMENT_COMPLETE_SETUP.md` - Detailed guide

---

## Next: Add GitHub Secrets (2 Minutes)

Choose one option above:
- **Automated**: `./setup-complete-deployment.sh`
- **Manual CLI**: Copy/paste the commands
- **Web UI**: Manual entry in GitHub interface

After secrets are added, GitHub Actions CI/CD is **100% complete and operational**.

---

**Status**: ✅ SSH servers configured, ready for GitHub secrets setup
