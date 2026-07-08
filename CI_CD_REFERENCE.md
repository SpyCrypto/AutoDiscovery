# CI/CD Reference

## Status Badges

Add these to your README.md:

```markdown
[![Build Status](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/build.yml/badge.svg)](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/build.yml)
[![Test Status](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/test.yml/badge.svg)](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/test.yml)
[![Deploy Status](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/deploy.yml/badge.svg)](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/deploy.yml)
```

## Workflow Files

- `.github/workflows/build.yml` - Build & push Docker image
- `.github/workflows/test.yml` - Contract & frontend tests
- `.github/workflows/deploy.yml` - Deploy to staging/production
- `.github/workflows/release.yml` - Release management

## Documentation

- `.github/GITHUB_ACTIONS_SETUP.md` - Complete setup guide
- `.github/CI_CD_QUICKSTART.md` - 5-minute quick start
- `.github/setup-actions.sh` - Automated secret setup script

## Deployment Flow

```
git push (main/develop)
    ↓
Build Workflow (lint, build Docker, security scan)
    ↓
Test Workflow (contracts, frontend, code quality)
    ↓
Deploy Workflow (to staging or production)
    ↓
Health Check & Notification
```

## Quick Commands

```bash
# List all workflows
gh workflow list

# View recent runs
gh run list

# Deploy to staging
gh workflow run deploy.yml -f environment=staging

# Deploy to production
gh workflow run deploy.yml -f environment=production

# View logs
gh run view <run-id> --log
```
