#!/bin/bash
# Add all GitHub secrets for AutoDiscovery
# Usage: bash add-secrets.sh

set -e

echo "🚀 AutoDiscovery GitHub Secrets Setup"
echo "======================================"
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

# Midnight Network Endpoints (public, same for all)
echo "📡 Adding Midnight PreProd Endpoints..."
gh secret set VITE_NODE_URL --body "https://preprod-node.midnight.network" 2>/dev/null && echo "  ✅ VITE_NODE_URL"
gh secret set VITE_INDEXER_URL --body "https://preprod-indexer.midnight.network/api/v1/graphql" 2>/dev/null && echo "  ✅ VITE_INDEXER_URL"
gh secret set VITE_INDEXER_WS --body "wss://preprod-indexer.midnight.network/api/v1/graphql" 2>/dev/null && echo "  ✅ VITE_INDEXER_WS"
gh secret set VITE_PROOF_SERVER_URL --body "https://preprod-proof-server.midnight.network" 2>/dev/null && echo "  ✅ VITE_PROOF_SERVER_URL"

echo ""
echo "📋 Adding Mock Contract Addresses (for testing)..."
gh secret set VITE_CONTRACT_DISCOVERY_CORE --body "03cc52g89494d8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f" 2>/dev/null && echo "  ✅ VITE_CONTRACT_DISCOVERY_CORE"
gh secret set VITE_CONTRACT_DISCOVERY_PROOF --body "04dd63h89505e9d0e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f" 2>/dev/null && echo "  ✅ VITE_CONTRACT_DISCOVERY_PROOF"
gh secret set VITE_CONTRACT_DOCUMENT_REGISTRY --body "05ee74i89616f0e1f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f" 2>/dev/null && echo "  ✅ VITE_CONTRACT_DOCUMENT_REGISTRY"
gh secret set VITE_CONTRACT_ACCESS_CONTROL --body "06ff85j89727g1f2g7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f" 2>/dev/null && echo "  ✅ VITE_CONTRACT_ACCESS_CONTROL"
gh secret set VITE_CONTRACT_JURISDICTION_REGISTRY --body "07gg96k89838h2g3h8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f" 2>/dev/null && echo "  ✅ VITE_CONTRACT_JURISDICTION_REGISTRY"
gh secret set VITE_CONTRACT_EXPERT_WITNESS --body "08hh07l89949i3h4i9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f" 2>/dev/null && echo "  ✅ VITE_CONTRACT_EXPERT_WITNESS"

echo ""
echo "✅ All secrets added!"
echo ""
echo "📋 Verifying secrets..."
gh secret list
echo ""
echo "🎉 GitHub Secrets Setup Complete!"
echo ""
echo "Next: Deploy contracts to Midnight PreProd, then update contract addresses:"
echo "  $ gh secret set VITE_CONTRACT_DISCOVERY_CORE --body '<real-address>'"
