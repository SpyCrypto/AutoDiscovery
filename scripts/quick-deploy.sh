#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# AutoDiscovery Quick Deployment Script
# ═══════════════════════════════════════════════════════════════════════════════
# Automates contract address capture, environment setup, and service deployment
# ═══════════════════════════════════════════════════════════════════════════════

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${PROJECT_DIR}/.env.prod"
CONTRACTS_FILE="${PROJECT_DIR}/.env.contracts"

echo ""
echo "╔═══════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                               ║"
echo "║               AutoDiscovery Deployment Quick Setup                            ║"
echo "║                                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════════════════════╝"
echo ""

# ───────────────────────────────────────────────────────────────────────────────────
# Step 1: Prerequisites Check
# ───────────────────────────────────────────────────────────────────────────────────

echo "📋 Checking prerequisites..."
echo ""

MISSING_TOOLS=()

if ! command -v docker &> /dev/null; then
  MISSING_TOOLS+=("Docker")
fi

if ! command -v docker compose &> /dev/null; then
  MISSING_TOOLS+=("Docker Compose")
fi

if ! command -v node &> /dev/null; then
  MISSING_TOOLS+=("Node.js")
fi

if ! command -v npm &> /dev/null; then
  MISSING_TOOLS+=("npm")
fi

if [ ${#MISSING_TOOLS[@]} -gt 0 ]; then
  echo "❌ Missing required tools:"
  for tool in "${MISSING_TOOLS[@]}"; do
    echo "   - $tool"
  done
  echo ""
  echo "Install missing tools and try again."
  exit 1
fi

echo "✅ Docker"
echo "✅ Docker Compose"
echo "✅ Node.js"
echo "✅ npm"
echo ""

# ───────────────────────────────────────────────────────────────────────────────────
# Step 2: Contract Address Input
# ───────────────────────────────────────────────────────────────────────────────────

echo "📝 Contract Address Configuration"
echo ""
echo "After deploying to Midnight PreProd, you should have 6 contract addresses."
echo "Paste them below (copy-paste from block explorer):"
echo ""

declare -A CONTRACTS
CONTRACTS["discovery-core"]="discovery-core"
CONTRACTS["compliance-proof"]="compliance-proof (discovery-proof)"
CONTRACTS["document-registry"]="document-registry"
CONTRACTS["access-control"]="access-control"
CONTRACTS["jurisdiction-registry"]="jurisdiction-registry"
CONTRACTS["expert-witness"]="expert-witness"

declare -A ADDRESSES
ENV_VARS=(
  "VITE_CONTRACT_DISCOVERY_CORE"
  "VITE_CONTRACT_DISCOVERY_PROOF"
  "VITE_CONTRACT_DOCUMENT_REGISTRY"
  "VITE_CONTRACT_ACCESS_CONTROL"
  "VITE_CONTRACT_JURISDICTION_REGISTRY"
  "VITE_CONTRACT_EXPERT_WITNESS"
)

for idx in "${!ENV_VARS[@]}"; do
  env_var=${ENV_VARS[$idx]}
  echo -n "  [$((idx+1))/6] $env_var: "
  read -r address
  ADDRESSES[$env_var]=$address
done

echo ""

# ───────────────────────────────────────────────────────────────────────────────────
# Step 3: Wallet Configuration
# ───────────────────────────────────────────────────────────────────────────────────

echo "🔑 Wallet Configuration (from Lace)"
echo ""

echo -n "  Enter your 24-word mnemonic (paste from Lace): "
read -r mnemonic

echo -n "  Enter your unshielded address (from Lace): "
read -r unshielded_address

echo ""

# ───────────────────────────────────────────────────────────────────────────────────
# Step 4: Generate .env.prod File
# ───────────────────────────────────────────────────────────────────────────────────

echo "💾 Generating .env.prod..."

cat > "$ENV_FILE" << EOF
# ═══════════════════════════════════════════════════════════════════
# AutoDiscovery Production Configuration
# Generated: $(date)
# ═══════════════════════════════════════════════════════════════════

# Mode: "demoland" or "realdeal"
VITE_AD_MODE=realdeal

# ───────────────────────────────────────────────────────────────────
# Smart Contracts (6 PreProd addresses)
# ───────────────────────────────────────────────────────────────────
${ENV_VARS[0]}=${ADDRESSES[${ENV_VARS[0]}]}
${ENV_VARS[1]}=${ADDRESSES[${ENV_VARS[1]}]}
${ENV_VARS[2]}=${ADDRESSES[${ENV_VARS[2]}]}
${ENV_VARS[3]}=${ADDRESSES[${ENV_VARS[3]}]}
${ENV_VARS[4]}=${ADDRESSES[${ENV_VARS[4]}]}
${ENV_VARS[5]}=${ADDRESSES[${ENV_VARS[5]}]}

# ───────────────────────────────────────────────────────────────────
# Midnight Network (PreProd)
# ───────────────────────────────────────────────────────────────────
VITE_MIDNIGHT_NETWORK=testnet
MIDNIGHT_NODE_URL=ws://localhost:9944
MIDNIGHT_INDEXER_URL=http://localhost:8088
MIDNIGHT_PROOF_SERVER_URL=http://localhost:6300

# ───────────────────────────────────────────────────────────────────
# Wallet
# ───────────────────────────────────────────────────────────────────
MY_PREVIEW_MNEMONIC=$mnemonic
MY_UNDEPLOYED_UNSHIELDED_ADDRESS=$unshielded_address

# ───────────────────────────────────────────────────────────────────
# Application
# ───────────────────────────────────────────────────────────────────
VITE_APP_NAME=AutoDiscovery
VITE_APP_ENV=production
VITE_API_BASE_URL=http://localhost:8080
EOF

echo "✅ Created .env.prod"
echo ""

# ───────────────────────────────────────────────────────────────────────────────────
# Step 5: Build Docker Images
# ───────────────────────────────────────────────────────────────────────────────────

echo "🐳 Building Docker images..."
echo ""

cd "$PROJECT_DIR"

echo "  Building CLI image..."
docker build -f Dockerfile.cli -t autodiscovery-cli:latest . > /dev/null
echo "  ✅ CLI image built"

echo "  Building RealDeal frontend image..."
docker build -f Dockerfile.frontend-realdeal -t autodiscovery-realdeal:latest . > /dev/null
echo "  ✅ RealDeal frontend built"

echo "  Building Demoland frontend image..."
docker build -f Dockerfile.frontend-demoland -t autodiscovery-demoland:latest . > /dev/null
echo "  ✅ Demoland frontend built"

echo ""

# ───────────────────────────────────────────────────────────────────────────────────
# Step 6: Start Services
# ───────────────────────────────────────────────────────────────────────────────────

echo "🚀 Starting services..."
echo ""

docker compose -f docker-compose.prod.yml up -d --build

echo ""
echo "⏳ Waiting for services to start (30 seconds)..."
sleep 30

echo ""

# ───────────────────────────────────────────────────────────────────────────────────
# Step 7: Health Checks
# ───────────────────────────────────────────────────────────────────────────────────

echo "🏥 Checking service health..."
echo ""

SERVICES=(
  "CLI:8080"
  "RealDeal:5174"
  "Demoland:5173"
)

for service in "${SERVICES[@]}"; do
  name="${service%:*}"
  port="${service#*:}"
  
  if curl -s http://localhost:$port/health > /dev/null 2>&1; then
    echo "  ✅ $name (http://localhost:$port)"
  else
    echo "  ⚠️  $name (http://localhost:$port) - not responding yet"
  fi
done

echo ""

# ───────────────────────────────────────────────────────────────────────────────────
# Step 8: Summary
# ───────────────────────────────────────────────────────────────────────────────────

echo "╔═══════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                               ║"
echo "║                   ✅ AutoDiscovery Deployment Complete!                      ║"
echo "║                                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════════════════════╝"
echo ""
echo "📍 Service Endpoints:"
echo ""
echo "   🔧 CLI Dashboard:     http://localhost:8080"
echo "   💼 RealDeal UI:       http://localhost:5174"
echo "   🎨 Demoland UI:       http://localhost:5173"
echo ""
echo "📚 Documentation:"
echo ""
echo "   View logs:            docker compose -f docker-compose.prod.yml logs -f"
echo "   Stop services:        docker compose -f docker-compose.prod.yml stop"
echo "   Restart services:     docker compose -f docker-compose.prod.yml up -d"
echo "   Full cleanup:         docker compose -f docker-compose.prod.yml down -v"
echo ""
echo "🔗 Quick Links:"
echo ""
echo "   Block Explorer:       https://explore-preprod.midnight.network"
echo "   Midnight Docs:        https://docs.midnight.network"
echo "   Test Faucet:          https://faucet.midnight.network"
echo ""
echo "👉 Next Steps:"
echo ""
echo "   1. Open http://localhost:5174 in your browser"
echo "   2. Connect your Lace wallet"
echo "   3. Create a test case"
echo "   4. Upload a document"
echo "   5. Monitor logs: docker compose -f docker-compose.prod.yml logs -f"
echo ""

