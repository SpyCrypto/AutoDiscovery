# GitHub Actions CI/CD Quick Start

## 5-Minute Setup

### 1. Generate SSH Keys (on your machine)
```bash
# For staging
ssh-keygen -t ed25519 -C "github-actions-staging" -f ~/.ssh/deploy_staging -N ""

# For production
ssh-keygen -t ed25519 -C "github-actions-prod" -f ~/.ssh/deploy_prod -N ""
```

### 2. Add Keys to Servers
```bash
# On staging server
cat ~/.ssh/deploy_staging.pub >> ~/.ssh/authorized_keys

# On production server
cat ~/.ssh/deploy_prod.pub >> ~/.ssh/authorized_keys
```

### 3. Set Up Server Directories
```bash
# SSH into each server and run:
mkdir -p /opt/autodiscovery
cd /opt/autodiscovery

# Copy docker-compose.preview.yml
# (You can download it or git pull the repo)

# Login to GitHub Container Registry
docker login ghcr.io -u <your-github-username> -p <github-token>
```

### 4. Configure GitHub Secrets
```bash
# Install GitHub CLI if not already installed
# https://cli.github.com

# Run setup script
cd AutoDiscovery/.github
chmod +x setup-actions.sh
./setup-actions.sh

# Or manually via GitHub UI:
# Settings → Secrets and variables → Actions → New repository secret
```

Required Secrets:
- `STAGING_HOST`
- `STAGING_USER`
- `STAGING_SSH_KEY`
- `PROD_HOST`
- `PROD_USER`
- `PROD_SSH_KEY`
- `SLACK_WEBHOOK` (optional)

### 5. Push & Watch
```bash
# Make a commit
git add .
git commit -m "Enable GitHub Actions CI/CD"
git push origin main

# Watch workflows
gh run list
```

---

## What Each Workflow Does

| Workflow | Trigger | Actions |
|----------|---------|---------|
| **build.yml** | Push to main/develop | Lint → Build Docker image → Security scan → Push to GHCR |
| **test.yml** | Push & PR | Contract build → Frontend test → Code quality → Dependency check |
| **deploy.yml** | Build success | Deploy to staging/prod → Health check → Slack notify → Rollback on fail |
| **release.yml** | Git tag v*.*.* | Create release → Tag image → Publish docs → Slack notify |

---

## Common Tasks

### Deploy to Staging
```bash
# Automatic: Push to develop branch
git checkout develop
git commit -m "feat: new feature"
git push origin develop

# Or manual
gh workflow run deploy.yml -f environment=staging
```

### Deploy to Production
```bash
# Via UI: Actions → Deploy to Production → Run workflow
# Select: environment=production

# Requires approval from required reviewers
```

### Create a Release
```bash
# Tag and push
git tag v0.2.0 -m "Release v0.2.0"
git push origin v0.2.0

# Workflow automatically:
# ✅ Builds and tags Docker image
# ✅ Creates GitHub Release
# ✅ Publishes to GitHub Pages
# ✅ Notifies Slack
```

### View Build Status
```bash
# Terminal
gh run list
gh run view <run-id>

# GitHub UI
https://github.com/SpyCrypto/AutoDiscovery/actions
```

---

## Status & Troubleshooting

### Check Workflow Status
```bash
gh workflow list
gh run list --workflow=build.yml --limit=5
```

### View Logs
```bash
# Last failed run
gh run list --status failed --limit=1
gh run view <run-id> --log

# Or view on GitHub UI
https://github.com/SpyCrypto/AutoDiscovery/actions
```

### Common Issues

**SSH connection fails:**
- Verify key is added to server: `cat ~/.ssh/authorized_keys`
- Test manually: `ssh -i ~/.ssh/deploy_staging deploy@staging.example.com`

**Docker push fails:**
- Check GitHub token has repo access
- Verify logged in: `docker login ghcr.io`

**Deployment doesn't start:**
- Check branch name matches trigger
- Verify secrets are set: `gh secret list`
- Check workflow YAML syntax

**Health check fails after deploy:**
- SSH into server: `docker logs autodiscovery-preview`
- Check port: `curl http://localhost/health`

---

## Advanced Configuration

### Add Environment Protection
```bash
# Require approvals for production
gh api repos/{owner}/{repo}/environments/production \
  --input - << 'EOF'
{
  "required_branch_protection": true,
  "reviewers": [
    {
      "type": "User",
      "id": 12345
    }
  ]
}
EOF
```

### Add Status Badges
```markdown
[![Build](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/build.yml/badge.svg)](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/build.yml)
[![Tests](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/test.yml/badge.svg)](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/test.yml)
[![Deploy](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/deploy.yml/badge.svg)](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/deploy.yml)
```

### Enable Dependabot
1. Go to Settings → Code security and analysis
2. Enable "Dependabot version updates"
3. Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
```

---

## Security Checklist

- [ ] SSH keys generated and added to servers
- [ ] All secrets configured in GitHub
- [ ] Production environment requires approval
- [ ] Branch protection enabled on `main`
- [ ] Slack webhook configured for notifications
- [ ] Docker credentials stored securely
- [ ] SSH keys rotate quarterly
- [ ] Deployment logs reviewed regularly

---

**Need help?** See `.github/GITHUB_ACTIONS_SETUP.md` for detailed instructions.
