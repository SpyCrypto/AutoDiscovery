# ✅ Complete GitHub Actions + SSH Deployment Setup

## Deployment Architecture

AutoDiscovery deploys via SSH to remote servers with Docker Compose.

```
GitHub Actions Workflow
        ↓
  SSH to Staging/Production
        ↓
  Pull Docker Image from GHCR
        ↓
  Run docker-compose.prod.yml
        ↓
  Health Check
        ↓
  Success/Rollback
```

---

## Step 1: Set Up Servers (SSH Key Auth)

### On Your Staging Server

```bash
# SSH as root or sudo user
mkdir -p ~/.ssh
cat >> ~/.ssh/authorized_keys << 'EOF'
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKNEH2J4BuSu6USEz4gnkzD0zsfbAoVZ65u75mDiLAPA kurti@Baxters
EOF

chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# Create deployment directory
mkdir -p /opt/autodiscovery
cd /opt/autodiscovery

# Copy docker-compose.prod.yml to /opt/autodiscovery/
# (via git clone or manual copy)

# Login to GitHub Container Registry
docker login ghcr.io -u <github-username> -p <github-token>
```

### On Your Production Server

```bash
# SSH as root or sudo user
mkdir -p ~/.ssh
cat >> ~/.ssh/authorized_keys << 'EOF'
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINh4m3aitIMV/l+V0ikS56ziuXPZsFowdSpltAacjh8X kurti@Baxters
EOF

chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# Create deployment directory
mkdir -p /opt/autodiscovery
cd /opt/autodiscovery

# Copy docker-compose.prod.yml to /opt/autodiscovery/
# (via git clone or manual copy)

# Login to GitHub Container Registry
docker login ghcr.io -u <github-username> -p <github-token>
```

---

## Step 2: Add GitHub Secrets (10 Total)

### 6 SSH Deployment Secrets

```bash
# Staging Server
gh secret set STAGING_HOST --body "your-staging-server.com"
gh secret set STAGING_USER --body "root"  # or your deployment user
gh secret set STAGING_SSH_KEY --body "$(cat ~/.ssh/deploy_staging)"

# Production Server  
gh secret set PROD_HOST --body "your-prod-server.com"
gh secret set PROD_USER --body "root"  # or your deployment user
gh secret set PROD_SSH_KEY --body "$(cat ~/.ssh/deploy_prod)"
```

### 4 Midnight Network Secrets

```bash
gh secret set VITE_NODE_URL --body "https://preprod-node.midnight.network"
gh secret set VITE_INDEXER_URL --body "https://preprod-indexer.midnight.network/api/v1/graphql"
gh secret set VITE_INDEXER_WS --body "wss://preprod-indexer.midnight.network/api/v1/graphql"
gh secret set VITE_PROOF_SERVER_URL --body "https://preprod-proof-server.midnight.network"
```

---

## Step 3: GitHub Secrets Reference

| Secret | Example Value | Purpose |
|--------|---------------|---------|
| **STAGING_HOST** | staging.example.com | Staging server hostname/IP |
| **STAGING_USER** | root | SSH user for staging |
| **STAGING_SSH_KEY** | (private key content) | Private SSH key for staging |
| **PROD_HOST** | prod.example.com | Production server hostname/IP |
| **PROD_USER** | root | SSH user for production |
| **PROD_SSH_KEY** | (private key content) | Private SSH key for production |
| **VITE_NODE_URL** | https://preprod-node.midnight.network | Midnight RPC |
| **VITE_INDEXER_URL** | https://preprod-indexer.midnight.network/api/v1/graphql | Midnight GraphQL |
| **VITE_INDEXER_WS** | wss://preprod-indexer.midnight.network/api/v1/graphql | Midnight WebSocket |
| **VITE_PROOF_SERVER_URL** | https://preprod-proof-server.midnight.network | Midnight proof server |

---

## Step 4: Verify SSH Key Access

Test SSH connection from your machine:

```bash
# Test staging
ssh -i ~/.ssh/deploy_staging root@your-staging-server.com "docker --version"

# Test production
ssh -i ~/.ssh/deploy_prod root@your-prod-server.com "docker --version"
```

Both should return Docker version without prompting for password.

---

## Step 5: Add Smart Contract Secrets (Optional)

After deploying contracts to Midnight PreProd:

```bash
gh secret set VITE_CONTRACT_DISCOVERY_CORE --body "<address-from-deploy>"
gh secret set VITE_CONTRACT_DISCOVERY_PROOF --body "<address-from-deploy>"
gh secret set VITE_CONTRACT_DOCUMENT_REGISTRY --body "<address-from-deploy>"
gh secret set VITE_CONTRACT_ACCESS_CONTROL --body "<address-from-deploy>"
gh secret set VITE_CONTRACT_JURISDICTION_REGISTRY --body "<address-from-deploy>"
gh secret set VITE_CONTRACT_EXPERT_WITNESS --body "<address-from-deploy>"
```

---

## Step 6: Verify All Secrets

```bash
# List all secrets
gh secret list

# Expected: 10+ secrets
```

---

## Step 7: Update deploy.yml for SSH Deployment

The deploy.yml workflow uses SSH to deploy to your servers.

**Current flow:**
1. Build succeeds on `main` or `develop`
2. Deploy workflow triggers
3. SSH to staging (auto-deploy from `develop`)
4. SSH to production (manual approval required from `main`)
5. Pull Docker image
6. Run `docker compose up`
7. Health check
8. Slack notification

**File**: `.github/workflows/deploy.yml` (already configured)

---

## Step 8: Test First Deployment

```bash
# Push to develop (auto-deploys to staging)
git checkout develop
git commit -m "test: deployment test"
git push origin develop

# Watch deployment
gh run list
gh run view <run-id> --log

# Verify staging app
curl http://your-staging-server.com/health
```

---

## Step 9: Manual Production Deployment

```bash
# Manually trigger production deployment
gh workflow run deploy.yml -f environment=production

# Watch deployment
gh run list
gh run view <run-id> --log

# Verify production app
curl http://your-prod-server.com/health
```

---

## Deployment Workflow Details

### On Push to `develop`
```
git push origin develop
  ↓
build.yml runs → Docker build/push
  ↓
test.yml runs → Contract/frontend tests
  ↓
deploy.yml runs (auto) → SSH to staging
  ├─ Pull image from GHCR
  ├─ docker-compose down
  ├─ docker-compose -f docker-compose.prod.yml up
  ├─ curl http://localhost/health
  └─ Success → Slack notification
```

### On Push to `main` (or Manual)
```
git push origin main
  ↓
build.yml runs → Docker build/push
  ↓
test.yml runs → Contract/frontend tests
  ↓
deploy.yml runs (requires approval) → SSH to production
  ├─ Pull image from GHCR
  ├─ docker-compose down
  ├─ docker-compose -f docker-compose.prod.yml up
  ├─ curl http://localhost/health
  ├─ On success → Auto-notify Slack
  └─ On failure → Auto-rollback + notify Slack
```

---

## Troubleshooting

### SSH Connection Fails
```bash
# Test connection manually
ssh -i ~/.ssh/deploy_staging -v root@staging.example.com

# Check key permissions
ls -l ~/.ssh/deploy_staging  # Should be 600
ls -l ~/.ssh/deploy_staging.pub  # Should be 644

# Check server authorized_keys
ssh root@staging.example.com "cat ~/.ssh/authorized_keys"
```

### Docker Compose on Server Fails
```bash
# SSH to server and debug
ssh root@staging.example.com

# Check Docker status
docker ps
docker logs autodiscovery-frontend-demoland

# Manual deployment test
cd /opt/autodiscovery
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up
```

### Health Check Fails
```bash
# SSH to server
ssh root@staging.example.com

# Test health endpoint
curl http://localhost/health
curl -v http://localhost/

# Check container logs
docker-compose -f docker-compose.prod.yml logs frontend
```

---

## Security Best Practices

✅ **Implemented**
- SSH key authentication (no passwords)
- Separate keys per environment
- GitHub Actions secrets encryption
- Health checks before marking success
- Auto-rollback on failure

📋 **Recommended**
- Rotate SSH keys quarterly
- Use different deployment user per environment
- Enable GitHub branch protection on `main`
- Require pull request reviews
- Use environment protection rules
- Monitor deployment logs

---

## Quick Reference Commands

```bash
# Add all secrets
gh secret set STAGING_HOST --body "staging.example.com"
gh secret set STAGING_USER --body "root"
gh secret set STAGING_SSH_KEY --body "$(cat ~/.ssh/deploy_staging)"
gh secret set PROD_HOST --body "prod.example.com"
gh secret set PROD_USER --body "root"
gh secret set PROD_SSH_KEY --body "$(cat ~/.ssh/deploy_prod)"
gh secret set VITE_NODE_URL --body "https://preprod-node.midnight.network"
gh secret set VITE_INDEXER_URL --body "https://preprod-indexer.midnight.network/api/v1/graphql"
gh secret set VITE_INDEXER_WS --body "wss://preprod-indexer.midnight.network/api/v1/graphql"
gh secret set VITE_PROOF_SERVER_URL --body "https://preprod-proof-server.midnight.network"

# Verify
gh secret list

# Deploy to staging
git push origin develop

# Deploy to production
gh workflow run deploy.yml -f environment=production

# View logs
gh run list
gh run view <run-id> --log
```

---

## Files Involved

- `.github/workflows/deploy.yml` - SSH deployment workflow
- `docker-compose.prod.yml` - Production compose config
- `~/.ssh/deploy_staging` - Staging private key
- `~/.ssh/deploy_prod` - Production private key
- 10 × GitHub secrets

---

**Status**: ✅ Ready for SSH-based deployment

**Next Steps**:
1. Add SSH public keys to servers (done above)
2. Add 10 GitHub secrets
3. Test with `git push origin develop`
4. Monitor deployment in GitHub Actions
