#!/bin/bash
# Complete GitHub Actions + SSH Deployment Setup
# Adds all 10 secrets for staging/production SSH deployment + Midnight network

set -e

echo "🚀 AutoDiscovery Complete Deployment Setup"
echo "=========================================="
echo ""

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI not found. Install from: https://cli.github.com"
    exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
    echo "📝 Authenticating with GitHub..."
    gh auth login
fi

echo "✅ GitHub authenticated"
echo ""

# Get repo info
REPO=$(gh repo view --json nameWithOwner -q)
echo "📦 Repository: $REPO"
echo ""

# Ask for deployment info
echo "📋 Enter your deployment configuration:"
echo ""

read -p "Staging Server (hostname/IP, e.g., staging.example.com): " STAGING_HOST
read -p "Staging User (SSH user, e.g., root or deploy): " STAGING_USER
read -sp "Staging SSH Private Key Path (e.g., ~/.ssh/deploy_staging): " STAGING_KEY_PATH
echo ""

read -p "Production Server (hostname/IP, e.g., prod.example.com): " PROD_HOST
read -p "Production User (SSH user, e.g., root or deploy): " PROD_USER
read -sp "Production SSH Private Key Path (e.g., ~/.ssh/deploy_prod): " PROD_KEY_PATH
echo ""

# Expand ~ to home directory
STAGING_KEY_PATH="${STAGING_KEY_PATH/#\~/$HOME}"
PROD_KEY_PATH="${PROD_KEY_PATH/#\~/$HOME}"

# Verify keys exist
if [ ! -f "$STAGING_KEY_PATH" ]; then
    echo "❌ Staging key not found: $STAGING_KEY_PATH"
    exit 1
fi

if [ ! -f "$PROD_KEY_PATH" ]; then
    echo "❌ Production key not found: $PROD_KEY_PATH"
    exit 1
fi

echo ""
echo "📝 Adding GitHub secrets..."
echo ""

# Read key contents
STAGING_KEY=$(cat "$STAGING_KEY_PATH")
PROD_KEY=$(cat "$PROD_KEY_PATH")

# Add SSH deployment secrets
echo "🔐 SSH Deployment Secrets:"
gh secret set STAGING_HOST --body "$STAGING_HOST" 2>/dev/null && echo "  ✅ STAGING_HOST = $STAGING_HOST"
gh secret set STAGING_USER --body "$STAGING_USER" 2>/dev/null && echo "  ✅ STAGING_USER = $STAGING_USER"
gh secret set STAGING_SSH_KEY --body "$STAGING_KEY" 2>/dev/null && echo "  ✅ STAGING_SSH_KEY ($(echo $STAGING_KEY | wc -c) bytes)"
gh secret set PROD_HOST --body "$PROD_HOST" 2>/dev/null && echo "  ✅ PROD_HOST = $PROD_HOST"
gh secret set PROD_USER --body "$PROD_USER" 2>/dev/null && echo "  ✅ PROD_USER = $PROD_USER"
gh secret set PROD_SSH_KEY --body "$PROD_KEY" 2>/dev/null && echo "  ✅ PROD_SSH_KEY ($(echo $PROD_KEY | wc -c) bytes)"

echo ""
echo "📡 Midnight Network Secrets:"
gh secret set VITE_NODE_URL --body "https://preprod-node.midnight.network" 2>/dev/null && echo "  ✅ VITE_NODE_URL"
gh secret set VITE_INDEXER_URL --body "https://preprod-indexer.midnight.network/api/v1/graphql" 2>/dev/null && echo "  ✅ VITE_INDEXER_URL"
gh secret set VITE_INDEXER_WS --body "wss://preprod-indexer.midnight.network/api/v1/graphql" 2>/dev/null && echo "  ✅ VITE_INDEXER_WS"
gh secret set VITE_PROOF_SERVER_URL --body "https://preprod-proof-server.midnight.network" 2>/dev/null && echo "  ✅ VITE_PROOF_SERVER_URL"

echo ""
echo "✅ All secrets added!"
echo ""
echo "📋 Verifying secrets..."
gh secret list
echo ""
echo "🎉 GitHub Actions + SSH Deployment Setup Complete!"
echo ""
echo "Next steps:"
echo "  1. Test SSH access: ssh -i $STAGING_KEY_PATH $STAGING_USER@$STAGING_HOST 'docker --version'"
echo "  2. Deploy to staging: git push origin develop"
echo "  3. Deploy to production: gh workflow run deploy.yml -f environment=production"
echo "  4. View logs: gh run list"
