# 🚀 GitHub Actions CI/CD Quick Reference Card

## 30-Second Overview

AutoDiscovery now has complete GitHub Actions automation for:
- ✅ Build: Lint, Docker build, security scan, registry push
- ✅ Test: Contract build, frontend test, code quality, dependencies
- ✅ Deploy: Staging (auto), Production (approval required), health checks, rollback
- ✅ Release: Git tags, GitHub Releases, versioned images, documentation

## Setup (15 Minutes Total)

```bash
# 1. Generate SSH keys (2 min)
ssh-keygen -t ed25519 -f ~/.ssh/deploy_staging -N ""
ssh-keygen -t ed25519 -f ~/.ssh/deploy_prod -N ""

# 2. On servers: add keys, create dirs (5 min)
mkdir -p /opt/autodiscovery
cd /opt/autodiscovery
docker login ghcr.io -u <user> -p <token>

# 3. Configure secrets in GitHub (5 min)
cd .github
chmod +x setup-actions.sh
./setup-actions.sh

# 4. Test (2 min)
git push origin main
gh run list
```

## Common Commands

```bash
# View workflows
gh workflow list

# View runs
gh run list

# View logs
gh run view <run-id> --log

# Deploy manually
gh workflow run deploy.yml -f environment=staging
gh workflow run deploy.yml -f environment=production

# Create release
git tag v0.2.0 -m "Release"
git push origin v0.2.0
```

## GitHub Secrets Required

```
STAGING_HOST          ← staging.example.com
STAGING_USER          ← deploy
STAGING_SSH_KEY       ← (private key)
PROD_HOST             ← prod.example.com
PROD_USER             ← deploy
PROD_SSH_KEY          ← (private key)
SLACK_WEBHOOK         ← (optional)
```

## Workflow Triggers

| Workflow | Trigger |
|----------|---------|
| **build.yml** | Push to main/develop, PR to main |
| **test.yml** | Any push, any PR |
| **deploy.yml** | Manual or build success |
| **release.yml** | Git tag v*.*.* |

## File Locations

```
.github/
├── workflows/
│   ├── build.yml              # Build & push
│   ├── test.yml               # Tests
│   ├── deploy.yml             # Deploy
│   └── release.yml            # Release
├── README.md                  # Overview
├── GITHUB_ACTIONS_SETUP.md    # Complete guide
├── CI_CD_QUICKSTART.md        # 5-minute start
└── setup-actions.sh           # Auto setup
```

## Running Deployment

```bash
# Staging deploys automatically on push to develop
git checkout develop
git commit -m "feature"
git push origin develop
# Workflow runs automatically

# Production: manual trigger
gh workflow run deploy.yml -f environment=production
# Requires approval if configured
```

## Status Badges (for README)

```markdown
[![Build](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/build.yml/badge.svg)](...)
[![Tests](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/test.yml/badge.svg)](...)
[![Deploy](https://github.com/SpyCrypto/AutoDiscovery/actions/workflows/deploy.yml/badge.svg)](...)
```

## Health Check

After deployment, verify:
```bash
curl http://localhost/health
# Expected: HTTP 200 OK
```

## Docker Status

```bash
# Local preview (running)
docker compose -f docker-compose.preview.yml ps

# Image details
docker image ls autodiscovery-preview
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| SSH fails | Verify key in GitHub secret, check ~/.ssh/authorized_keys on server |
| Push fails | Check GitHub token scope (packages), docker login |
| Build fails | Review logs: `gh run view <id> --log` |

## Learn More

- 📖 Complete Setup: `.github/GITHUB_ACTIONS_SETUP.md`
- ⚡ Quick Start: `.github/CI_CD_QUICKSTART.md`
- 📋 Overview: `.github/README.md`
- 🛠️ Script: `.github/setup-actions.sh`

---

**Status**: ✅ Ready | **Environment**: GitHub Actions | **Registry**: GHCR
