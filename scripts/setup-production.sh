#!/bin/bash

# AutoDiscovery Production Setup Script
# Automates environment setup and validation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== AutoDiscovery Production Setup ===${NC}\n"

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker not found. Install from https://docs.docker.com/get-docker/${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker installed${NC}"

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}✗ Docker Compose not found. Install from https://docs.docker.com/compose/install/${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker Compose installed${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found. Install v20+ from https://nodejs.org/${NC}"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js installed (${NODE_VERSION})${NC}"

# Setup environment
echo -e "\n${YELLOW}Setting up environment files...${NC}"

if [ ! -f ".env.prod" ]; then
    if [ -f ".env.production" ]; then
        cp .env.production .env.prod
        echo -e "${GREEN}✓ Created .env.prod from template${NC}"
    else
        echo -e "${RED}✗ .env.production template not found${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}ⓘ .env.prod already exists, skipping${NC}"
fi

# Validate environment file
echo -e "\n${YELLOW}Validating configuration...${NC}"

REQUIRED_VARS=(
    "VITE_NODE_URL"
    "VITE_INDEXER_URL"
    "VITE_CONTRACT_DISCOVERY_CORE"
    "VITE_CONTRACT_DISCOVERY_PROOF"
    "VITE_CONTRACT_DOCUMENT_REGISTRY"
    "VITE_CONTRACT_ACCESS_CONTROL"
    "VITE_CONTRACT_JURISDICTION_REGISTRY"
    "VITE_CONTRACT_EXPERT_WITNESS"
)

MISSING_VARS=()
for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^${var}=" .env.prod || grep -q "^${var}=<" .env.prod; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${YELLOW}✗ Missing or incomplete environment variables:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo "  - $var"
    done
    echo -e "\n${YELLOW}Please edit .env.prod and set all contract addresses and endpoints.${NC}"
    echo -e "${YELLOW}See DEPLOYMENT.md for details.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ All required environment variables configured${NC}"

# Build and validate images
echo -e "\n${YELLOW}Building Docker images...${NC}"

docker-compose -f docker-compose.prod.yml build --progress=plain

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Docker images built successfully${NC}"
else
    echo -e "${RED}✗ Docker build failed${NC}"
    exit 1
fi

# Start services
echo -e "\n${YELLOW}Starting services...${NC}"

docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo -e "\n${YELLOW}Waiting for services to be ready...${NC}"

max_attempts=60
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:8080/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ CLI service is ready${NC}"
        break
    fi
    attempt=$((attempt + 1))
    sleep 1
done

if [ $attempt -eq $max_attempts ]; then
    echo -e "${RED}✗ Services did not start within timeout${NC}"
    docker-compose -f docker-compose.prod.yml logs
    exit 1
fi

# Verify all services
echo -e "\n${YELLOW}Verifying all services...${NC}"

SERVICES=("8080" "5174" "5173")
SERVICE_NAMES=("CLI" "RealDeal Frontend" "Demoland Frontend")

for i in "${!SERVICES[@]}"; do
    port=${SERVICES[$i]}
    name=${SERVICE_NAMES[$i]}
    if curl -s http://localhost:${port}/health > /dev/null 2>&1 || curl -s http://localhost:${port}/ > /dev/null 2>&1; then
        echo -e "${GREEN}✓ ${name} ready on port ${port}${NC}"
    else
        echo -e "${YELLOW}ⓘ ${name} not yet responding on port ${port}${NC}"
    fi
done

# Summary
echo -e "\n${GREEN}=== Setup Complete ===${NC}\n"

echo "Services are running:"
echo -e "  ${GREEN}CLI${NC}                     http://localhost:8080"
echo -e "  ${GREEN}RealDeal Frontend${NC}       http://localhost:5174"
echo -e "  ${GREEN}Demoland Frontend${NC}       http://localhost:5173"

echo -e "\nNext steps:"
echo "  1. Open http://localhost:5174 in your browser"
echo "  2. Verify contract connectivity in the UI"
echo "  3. Run test transactions"
echo "  4. Monitor logs: docker-compose -f docker-compose.prod.yml logs -f"
echo "  5. Stop services: docker-compose -f docker-compose.prod.yml down"

echo -e "\nFor detailed deployment info, see DEPLOYMENT.md\n"
