# GitHub Actions & CI/CD Configuration

This directory contains all GitHub Actions workflows and CI/CD configuration for AutoDiscovery.

## Quick Links

- **🚀 [CI/CD Quick Start](./CI_CD_QUICKSTART.md)** - Get up and running in 5 minutes
- **📖 [Complete Setup Guide](./GITHUB_ACTIONS_SETUP.md)** - Detailed reference with all options
- **🛠️ [Automated Setup](./setup-actions.sh)** - Script to configure secrets automatically

## Workflows

### Build Pipeline
**File**: `workflows/build.yml`

Automatically builds and pushes Docker image on every push to `main` or `develop`.

- Lints code (ESLint, TypeScript)
- Builds Docker image (multi-stage)
- Scans for vulnerabilities (Trivy)
- Pushes to GitHub Container Registry

**Triggers**:
- Push to `main` or `develop`
- Pull request to `main`
- Changes to frontend, contracts, or Dockerfile

### Test Pipeline
**File**: `workflows/test.yml`

Runs comprehensive tests on every push and pull request.

- Builds smart contracts
- Compiles frontend with TypeScript
- Runs code quality analysis (SonarCloud)
- Checks dependencies (npm audit)
- Analyzes bundle size

**Triggers**:
- Any push to any branch
- Pull requests

### Deployment Pipeline
**File**: `workflows/deploy.yml`

Deploys to staging and production environments.

**Staging**: Auto-deploys on push to `develop`
- SSH into staging server
- Pull new image from registry
- Run docker-compose up
- Notify Slack on success/failure

**Production**: Manual approval required
- SSH into production server
- Pull new image from registry
- Run docker-compose up
- Health check verification
- Auto-rollback on failure
- Notify Slack

**Triggers**:
- Automatic: Build success on `main`/`develop`
- Manual: `workflow_dispatch` with environment selection

### Release Pipeline
**File**: `workflows/release.yml`

Manages releases and version tagging.

- Creates GitHub Release from tag
- Tags Docker image with version
- Generates changelog
- Publishes documentation to GitHub Pages
- Notifies Slack

**Triggers**:
- Git tag: `v*.*.*`
- Manual: `workflow_dispatch` with version input

## Environment Setup

### Secrets Required

Configure these in GitHub Settings → Secrets:

```
# Staging Deployment
STAGING_HOST              = staging.example.com
STAGING_USER              = deploy
STAGING_SSH_KEY           = (private SSH key)
STAGING_PORT              = 22 (optional)

# Production Deployment
PROD_HOST                 = prod.example.com
PROD_USER                 = deploy
PROD_SSH_KEY              = (private SSH key)
PROD_PORT                 = 22 (optional)

# Notifications (optional)
SLACK_WEBHOOK             = https://hooks.slack.com/services/...

# Code Quality (optional)
SONAR_TOKEN               = (SonarCloud token)
```

### Generate SSH Keys

```bash
# Staging
ssh-keygen -t ed25519 -C "github-actions-staging" -f ~/.ssh/deploy_staging -N ""

# Production
ssh-keygen -t ed25519 -C "github-actions-prod" -f ~/.ssh/deploy_prod -N ""
```

### Server Setup

```bash
# On each deployment server (staging & production)

# Create directory
mkdir -p /opt/autodiscovery
cd /opt/autodiscovery

# Add SSH public keys
cat ~/.ssh/deploy_*.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Copy docker-compose.preview.yml
# (download from repo or git pull)

# Login to Docker registry
docker login ghcr.io -u <github-username> -p <github-token>
```

## Usage

### View Workflows
```bash
gh workflow list
```

### Trigger Manual Deployment
```bash
# To staging
gh workflow run deploy.yml -f environment=staging

# To production
gh workflow run deploy.yml -f environment=production
```

### Create Release
```bash
git tag v0.2.0 -m "Release v0.2.0"
git push origin v0.2.0
```

### View Run Status
```bash
gh run list
gh run view <run-id> --log
```

## Status Badges

Add to README.md:

```markdown
[![Build Status](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/build.yml/badge.svg)](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/build.yml)
[![Test Status](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/test.yml/badge.svg)](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/test.yml)
[![Deploy Status](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/deploy.yml/badge.svg)](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/deploy.yml)
```

## Troubleshooting

### Build Fails
- Check workflow logs: `gh run view <run-id> --log`
- Verify YAML syntax
- Check file paths in Dockerfile

### SSH Connection Failed
- Verify SSH key added to server
- Check server hostname/port in secrets
- Test manually: `ssh -i key deploy@host`

### Docker Push Failed
- Ensure GitHub token has `repo` and `packages` scope
- Verify logged into registry: `docker login ghcr.io`

### Deployment Not Starting
- Check branch matches trigger (e.g., push to `main` for prod)
- Verify all secrets configured
- Review workflow file syntax

## Reference

- 📖 [Complete Setup Guide](./GITHUB_ACTIONS_SETUP.md)
- ⚡ [Quick Start Guide](./CI_CD_QUICKSTART.md)
- 🛠️ [Setup Script](./setup-actions.sh)
- 📚 [GitHub Actions Docs](https://docs.github.com/actions)
- 🐳 [Docker Compose Config](../docker-compose.preview.yml)

---

**Last Updated**: 2026-07-02
