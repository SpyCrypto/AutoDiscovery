# GitHub Actions CI/CD Setup Guide

This guide explains how to configure GitHub Actions for AutoDiscovery with build, test, and deployment pipelines.

## Workflows Overview

### 1. **Build & Push** (`build.yml`)
Runs on: Push to `main`/`develop`, PR to `main`
- Lint & type check
- Build Docker image
- Security scan with Trivy
- Push to GitHub Container Registry (GHCR)

### 2. **Tests** (`test.yml`)
Runs on: Push and PR
- Smart contract build & test
- Frontend build & bundle size analysis
- Code quality analysis (SonarCloud)
- Dependency security checks

### 3. **Deploy** (`deploy.yml`)
Runs on: Successful build on `main`/`develop`
- Deploy to staging (on `develop`)
- Deploy to production (on `main`)
- Automated rollback on failure
- Slack notifications

### 4. **Release** (`release.yml`)
Runs on: Git tags `v*.*.*`
- Create GitHub Release
- Tag Docker image with version
- Publish documentation to GitHub Pages
- Slack release notification

---

## Required Secrets Setup

Go to **Settings → Secrets and Variables → Actions** and add:

### GitHub Container Registry (GHCR)
No secrets needed—GitHub Actions uses `GITHUB_TOKEN` by default.

### Staging Deployment
```
STAGING_HOST         = your-staging-server.com
STAGING_USER         = deploy
STAGING_SSH_KEY      = (private SSH key)
STAGING_PORT         = 22 (optional)
```

### Production Deployment
```
PROD_HOST            = your-production-server.com
PROD_USER            = deploy
PROD_SSH_KEY         = (private SSH key)
PROD_PORT            = 22 (optional)
```

### Notifications
```
SLACK_WEBHOOK        = https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

### Code Quality (Optional)
```
SONAR_TOKEN          = (from sonarcloud.io)
```

---

## SSH Key Setup

### Generate deployment key (Linux/macOS)
```bash
ssh-keygen -t ed25519 -C "github-actions" -f deploy_key -N ""
```

### Add public key to server
```bash
cat deploy_key.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### Add private key as GitHub secret
1. Copy contents of `deploy_key` (private key)
2. Go to GitHub repo → Settings → Secrets
3. Add new secret: `STAGING_SSH_KEY` or `PROD_SSH_KEY`
4. Paste private key content

### Server setup
```bash
# As deploy user on server
mkdir -p /opt/autodiscovery
cd /opt/autodiscovery
# Copy docker-compose.preview.yml here
docker login ghcr.io -u $GITHUB_ACTOR -p $GITHUB_TOKEN
```

---

## Slack Integration

### Create Incoming Webhook
1. Go to https://api.slack.com/apps
2. Create New App → From scratch
3. Name: "AutoDiscovery CI/CD"
4. Select workspace
5. Go to **Incoming Webhooks** → Enable
6. **Add New Webhook to Workspace**
7. Select channel (e.g., #deployments)
8. Copy Webhook URL
9. Add to GitHub Secrets as `SLACK_WEBHOOK`

---

## SonarCloud Integration (Optional)

### Setup SonarCloud
1. Go to https://sonarcloud.io
2. Sign up with GitHub
3. Import repository
4. Go to **Administration → Security → User Tokens**
5. Generate token
6. Add as `SONAR_TOKEN` secret in GitHub

---

## Workflow Triggers

### Build Workflow
- ✅ Push to `main` or `develop`
- ✅ Pull request to `main`
- ✅ Changes in frontend, contract, or Dockerfile

### Test Workflow
- ✅ Push to `main` or `develop`
- ✅ Pull request to `main`
- ✅ Changes in contracts or frontend

### Deploy Workflow
- ✅ Manual trigger (workflow_dispatch)
- ✅ Success of build workflow on `main`/`develop`

### Release Workflow
- ✅ Git tag push (`v*.*.*`)
- ✅ Manual trigger with version input

---

## Usage Examples

### Trigger Manual Deployment
```bash
# Via GitHub CLI
gh workflow run deploy.yml -f environment=staging

# Or use GitHub UI: Actions → Deploy to Production → Run workflow
```

### Create Release
```bash
# Tag and push
git tag v0.2.0
git push origin v0.2.0

# Workflow automatically:
# 1. Builds Docker image
# 2. Tags as v0.2.0 and latest-stable
# 3. Creates GitHub Release
# 4. Publishes docs to GitHub Pages
# 5. Notifies Slack
```

### View Workflow Runs
```bash
# Via GitHub CLI
gh workflow list
gh run list --workflow=build.yml

# Or GitHub UI: Actions tab
```

---

## Environment Protection Rules

### Production Environment
1. Go to **Settings → Environments → Production**
2. Set **Required reviewers**: Select team members
3. Add **Deployment branches**: Only `main`
4. Enable **Prevent forking repositories from approving deployments**

### Staging Environment
1. Go to **Settings → Environments → Staging**
2. Set **Required reviewers**: Optional
3. Add **Deployment branches**: `develop`

---

## Status Badges

Add to README.md:
```markdown
[![Build Status](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/build.yml/badge.svg)](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/build.yml)
[![Test Status](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/test.yml/badge.svg)](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/test.yml)
[![Deploy Status](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/deploy.yml/badge.svg)](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/deploy.yml)
```

---

## Troubleshooting

### Workflow Not Running
- Check if trigger conditions are met (branch, path filters)
- Verify file is in `.github/workflows/`
- Ensure YAML syntax is valid

### SSH Connection Failed
- Verify SSH key is added to server
- Check server hostname/port in secrets
- Test manually: `ssh -i key deploy@host`

### Docker Push Failed
- Ensure `GITHUB_TOKEN` is used (auto-provided)
- Check GitHub repo settings → Packages → Read/Write access

### Deployment Timeout
- Increase timeout in workflow (default: 360 seconds)
- Check server resource availability
- Review server logs: `docker compose logs`

---

## Security Best Practices

1. **Rotate SSH keys quarterly**
2. **Use environment protection rules** for production
3. **Require pull request reviews** before merge
4. **Enable branch protection rules** on `main`
5. **Audit GitHub Actions usage** regularly
6. **Keep dependencies updated** (Dependabot)
7. **Review workflow logs** for sensitive data leaks

---

## Next Steps

1. ✅ Add secrets to GitHub
2. ✅ Set up SSH keys on staging/prod servers
3. ✅ Test deploy workflow manually
4. ✅ Enable required reviewers for production
5. ✅ Add status badges to README
6. ✅ Configure Slack notifications
7. ✅ Document deployment procedures for team

---

**Last Updated**: 2026-07-02
