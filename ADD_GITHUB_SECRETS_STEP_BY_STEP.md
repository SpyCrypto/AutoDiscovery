# ✅ Add GitHub Secrets - Step-by-Step Instructions

## Access GitHub Secrets

1. Go to your repository on GitHub: https://github.com/SpyCrypto/AutoDiscovery
2. Click **Settings** (top right, next to "Manage")
3. On the left sidebar, click **Secrets and variables**
4. Click **Actions**
5. Click the **New repository secret** button (green button, top right)

You're now ready to add secrets!

---

## Get Your SSH Private Keys

Before adding secrets, get the key contents:

```bash
# Display staging private key
cat ~/.ssh/deploy_staging
```

Copy the entire output (everything from `-----BEGIN PRIVATE KEY-----` to `-----END PRIVATE KEY-----`)

```bash
# Display production private key
cat ~/.ssh/deploy_prod
```

Copy the entire output (everything from `-----BEGIN PRIVATE KEY-----` to `-----END PRIVATE KEY-----`)

---

## Add 10 Secrets (One by One)

For each secret:
1. Click **New repository secret**
2. Enter the **Name** (left field)
3. Enter the **Value** (right field, paste key contents for SSH keys)
4. Click **Add secret**
5. Repeat for next secret

---

## SECRET 1: STAGING_HOST

1. Click **New repository secret**
2. **Name**: `STAGING_HOST`
3. **Value**: `your-staging-server.com` (or your staging server IP)
4. Click **Add secret**

---

## SECRET 2: STAGING_USER

1. Click **New repository secret**
2. **Name**: `STAGING_USER`
3. **Value**: `deploy` (or `root`, whoever runs Docker)
4. Click **Add secret**

---

## SECRET 3: STAGING_SSH_KEY

1. Click **New repository secret**
2. **Name**: `STAGING_SSH_KEY`
3. **Value**: Paste entire output from `cat ~/.ssh/deploy_staging`
   - Include `-----BEGIN PRIVATE KEY-----` at start
   - Include `-----END PRIVATE KEY-----` at end
   - Entire key should be pasted as-is
4. Click **Add secret**

---

## SECRET 4: PROD_HOST

1. Click **New repository secret**
2. **Name**: `PROD_HOST`
3. **Value**: `your-prod-server.com` (or your production server IP)
4. Click **Add secret**

---

## SECRET 5: PROD_USER

1. Click **New repository secret**
2. **Name**: `PROD_USER`
3. **Value**: `deploy` (or `root`, whoever runs Docker)
4. Click **Add secret**

---

## SECRET 6: PROD_SSH_KEY

1. Click **New repository secret**
2. **Name**: `PROD_SSH_KEY`
3. **Value**: Paste entire output from `cat ~/.ssh/deploy_prod`
   - Include `-----BEGIN PRIVATE KEY-----` at start
   - Include `-----END PRIVATE KEY-----` at end
   - Entire key should be pasted as-is
4. Click **Add secret**

---

## SECRET 7: VITE_NODE_URL

1. Click **New repository secret**
2. **Name**: `VITE_NODE_URL`
3. **Value**: `https://preprod-node.midnight.network`
4. Click **Add secret**

---

## SECRET 8: VITE_INDEXER_URL

1. Click **New repository secret**
2. **Name**: `VITE_INDEXER_URL`
3. **Value**: `https://preprod-indexer.midnight.network/api/v1/graphql`
4. Click **Add secret**

---

## SECRET 9: VITE_INDEXER_WS

1. Click **New repository secret**
2. **Name**: `VITE_INDEXER_WS`
3. **Value**: `wss://preprod-indexer.midnight.network/api/v1/graphql`
4. Click **Add secret**

---

## SECRET 10: VITE_PROOF_SERVER_URL

1. Click **New repository secret**
2. **Name**: `VITE_PROOF_SERVER_URL`
3. **Value**: `https://preprod-proof-server.midnight.network`
4. Click **Add secret**

---

## Verify All Secrets Added

After adding all 10 secrets, you should see them listed in the Secrets page:

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

Or verify via CLI:
```bash
gh secret list
```

---

## Quick Summary Table

| Step | Name | Value |
|------|------|-------|
| 1 | STAGING_HOST | your-staging-server.com |
| 2 | STAGING_USER | deploy |
| 3 | STAGING_SSH_KEY | (paste ~/.ssh/deploy_staging) |
| 4 | PROD_HOST | your-prod-server.com |
| 5 | PROD_USER | deploy |
| 6 | PROD_SSH_KEY | (paste ~/.ssh/deploy_prod) |
| 7 | VITE_NODE_URL | https://preprod-node.midnight.network |
| 8 | VITE_INDEXER_URL | https://preprod-indexer.midnight.network/api/v1/graphql |
| 9 | VITE_INDEXER_WS | wss://preprod-indexer.midnight.network/api/v1/graphql |
| 10 | VITE_PROOF_SERVER_URL | https://preprod-proof-server.midnight.network |

---

## ✅ Done!

Once all 10 secrets are added, GitHub Actions CI/CD is **100% operational**.

### Test It

**Deploy to Staging:**
```bash
git push origin develop
gh run list
gh run view <run-id> --log
```

**Deploy to Production:**
```bash
gh workflow run deploy.yml -f environment=production
gh run list
gh run view <run-id> --log
```

---

## Troubleshooting

**SSH key paste issues:**
- Make sure you copy the ENTIRE key including BEGIN and END lines
- Don't add extra spaces or line breaks before/after
- For SSH_KEY secrets, paste everything exactly as shown

**Secret not showing up:**
- Refresh the page
- Verify the name exactly matches (case-sensitive)
- Make sure you clicked "Add secret"

**Deployment still fails:**
- Check SSH connections work: `ssh -i ~/.ssh/deploy_staging deploy@your-staging-server.com "docker --version"`
- Verify secrets are added: `gh secret list`
- Check workflow logs: `gh run view <id> --log`

---

**Time to complete**: 10-15 minutes

**Result**: Fully operational GitHub Actions CI/CD pipeline ✅
