#!/bin/bash
# GitHub Actions CI/CD Configuration Script
# Run this to set up GitHub Actions for AutoDiscovery

set -e

echo "🚀 AutoDiscovery GitHub Actions Setup"
echo "======================================"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI not found. Install from: https://cli.github.com${NC}"
    exit 1
fi

# Check if authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}📝 Authenticating with GitHub...${NC}"
    gh auth login
fi

echo -e "${GREEN}✅ GitHub authenticated${NC}"

# Repository info
REPO=$(gh repo view --json nameWithOwner -q)
echo -e "${YELLOW}Repository: $REPO${NC}"

# Ask for secret values
echo ""
echo -e "${YELLOW}Setting up secrets...${NC}"

read -p "Enter Staging Host (e.g., staging.example.com): " STAGING_HOST
read -p "Enter Staging User (e.g., deploy): " STAGING_USER
read -p "Enter Staging SSH Key path (e.g., ~/.ssh/deploy_staging): " STAGING_SSH_KEY_PATH
STAGING_SSH_KEY=$(cat "$STAGING_SSH_KEY_PATH")

read -p "Enter Production Host (e.g., prod.example.com): " PROD_HOST
read -p "Enter Production User (e.g., deploy): " PROD_USER
read -p "Enter Production SSH Key path (e.g., ~/.ssh/deploy_prod): " PROD_SSH_KEY_PATH
PROD_SSH_KEY=$(cat "$PROD_SSH_KEY_PATH")

read -p "Enter Slack Webhook URL (optional, press Enter to skip): " SLACK_WEBHOOK

# Set secrets
echo -e "${YELLOW}📝 Setting GitHub secrets...${NC}"

gh secret set STAGING_HOST -b"$STAGING_HOST"
gh secret set STAGING_USER -b"$STAGING_USER"
gh secret set STAGING_SSH_KEY -b"$STAGING_SSH_KEY"
gh secret set PROD_HOST -b"$PROD_HOST"
gh secret set PROD_USER -b"$PROD_USER"
gh secret set PROD_SSH_KEY -b"$PROD_SSH_KEY"

if [ -n "$SLACK_WEBHOOK" ]; then
    gh secret set SLACK_WEBHOOK -b"$SLACK_WEBHOOK"
    echo -e "${GREEN}✅ SLACK_WEBHOOK configured${NC}"
fi

# List set secrets
echo ""
echo -e "${YELLOW}📋 Secrets configured:${NC}"
gh secret list

echo ""
echo -e "${GREEN}✅ GitHub Actions setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Set up environments: gh api repos/{owner}/{repo}/environments"
echo "2. Add required reviewers for production environment"
echo "3. Test workflows: git push to main branch"
echo "4. Monitor: https://github.com/$REPO/actions"
