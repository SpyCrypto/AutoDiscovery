# ✅ COMPLETE: Add 10 GitHub Secrets - Final Instructions

## 10 Secrets to Add to GitHub Actions

Add these exactly as shown below to: **GitHub Repo → Settings → Secrets and variables → Actions**

---

## STAGING DEPLOYMENT (3 Secrets)

### Secret 1: STAGING_HOST
```
Name:  STAGING_HOST
Value: your-staging-server.com
```
(or IP address if you don't have a domain)

### Secret 2: STAGING_USER
```
Name:  STAGING_USER
Value: deploy
```
(or `root` if that's your deployment user)

### Secret 3: STAGING_SSH_KEY
```
Name:  STAGING_SSH_KEY
Value: [contents of ~/.ssh/deploy_staging - PRIVATE KEY]
```

To get the private key, run:
```bash
cat ~/.ssh/deploy_staging
```
Copy the entire output including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

---

## PRODUCTION DEPLOYMENT (3 Secrets)

### Secret 4: PROD_HOST
```
Name:  PROD_HOST
Value: your-prod-server.com
```
(or IP address if you don't have a domain)

### Secret 5: PROD_USER
```
Name:  PROD_USER
Value: deploy
```
(or `root` if that's your deployment user)

### Secret 6: PROD_SSH_KEY
```
Name:  PROD_SSH_KEY
Value: [contents of ~/.ssh/deploy_prod - PRIVATE KEY]
```

To get the private key, run:
```bash
cat ~/.ssh/deploy_prod
```
Copy the entire output including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`

---

## MIDNIGHT NETWORK (4 Secrets)

### Secret 7: VITE_NODE_URL
```
Name:  VITE_NODE_URL
Value: https://preprod-node.midnight.network
```

### Secret 8: VITE_INDEXER_URL
```
Name:  VITE_INDEXER_URL
Value: https://preprod-indexer.midnight.network/api/v1/graphql
```

### Secret 9: VITE_INDEXER_WS
```
Name:  VITE_INDEXER_WS
Value: wss://preprod-indexer.midnight.network/api/v1/graphql
```

### Secret 10: VITE_PROOF_SERVER_URL
```
Name:  VITE_PROOF_SERVER_URL
Value: https://preprod-proof-server.midnight.network
```

---

## Step-by-Step to Add via Web UI

1. Go to: `https://github.com/SpyCrypto/AutoDiscovery/settings/secrets/actions`
2. Click **New repository secret**
3. Enter Name (left): `STAGING_HOST`
4. Enter Value (right): `your-staging-server.com`
5. Click **Add secret**
6. Repeat for all 10 secrets

---

## Verify All Secrets Added

After adding all 10, run:
```bash
gh secret list
```

Expected output:
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

## Test SSH Connections After Adding Secrets

```bash
# Test staging - should work without password
ssh -i ~/.ssh/deploy_staging deploy@your-staging-server.com "docker --version"

# Test production - should work without password
ssh -i ~/.ssh/deploy_prod deploy@your-prod-server.com "docker --version"
```

Both should return Docker version without prompting for password.

---

## Security Checklist

✅ **Done Right**
- [x] Keys are in `~/.ssh/` with restricted permissions
- [x] Ed25519 keys are modern and secure (256-bit)
- [x] Each environment has its own key (staging vs production)
- [x] Private keys only stored in GitHub Secrets (encrypted)
- [x] Public keys only on servers (not sensitive)

⚠️ **Important - Follow These**
- Never commit private keys to git
- Never share private keys publicly
- Rotate keys quarterly
- Use different keys per environment
- Don't share the private key content with anyone

---

## Key Fingerprints (For Reference)

| Key | Fingerprint |
|-----|------------|
| **deploy_staging** | SHA256:3sGFpZuIZ03YS5TATrcXv7aAA1+rfB907hkXlOFsraQ |
| **deploy_prod** | SHA256:4VIsk0845wRxKpLbYQ8Yi4cN5RsQhi87ytD8I233/KE |

---

## After All 10 Secrets Are Added

Your GitHub Actions CI/CD is **100% operational**.

### Try these:

**Deploy to Staging (Auto)**
```bash
git push origin develop
gh run list
gh run view <run-id> --log
```

**Deploy to Production (Manual)**
```bash
gh workflow run deploy.yml -f environment=production
gh run list
gh run view <run-id> --log
```

**Check Application**
```bash
curl http://your-staging-server.com/health
curl http://your-prod-server.com/health
```

---

## What Happens Now

When you add the 10 secrets:

1. GitHub Actions reads them at workflow runtime
2. Never logs them (encrypted)
3. Only visible to authorized repository access
4. Used by deploy.yml to SSH to your servers
5. Frontend connects to Midnight PreProd network

---

## Summary

| Secret | Purpose |
|--------|---------|
| STAGING_HOST | Where to deploy staging |
| STAGING_USER | SSH user for staging |
| STAGING_SSH_KEY | SSH private key for staging |
| PROD_HOST | Where to deploy production |
| PROD_USER | SSH user for production |
| PROD_SSH_KEY | SSH private key for production |
| VITE_NODE_URL | Midnight blockchain RPC |
| VITE_INDEXER_URL | Midnight GraphQL endpoint |
| VITE_INDEXER_WS | Midnight WebSocket endpoint |
| VITE_PROOF_SERVER_URL | Midnight proof server |

---

## ✅ Status: Ready for Final Configuration

Add these 10 secrets and **GitHub Actions CI/CD is 100% complete and operational**.

**Time to complete**: 5-10 minutes

**Result**: Fully automated deployment pipeline with:
- ✅ Auto-deploy to staging on push to develop
- ✅ Manual production deployment from main
- ✅ Health checks before marking success
- ✅ Auto-rollback on failure
- ✅ Slack notifications

---

**Next**: Add the 10 secrets above to GitHub

**Then**: Test with `git push origin develop`
