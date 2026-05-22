#!/bin/bash

# Production Configuration Validation Script
# Run this before deploying to catch configuration issues early

set -e

ERRORS=0
WARNINGS=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}AutoDiscovery Production Configuration Validator${NC}\n"

# Check Dockerfiles exist and are valid
echo "Checking Dockerfiles..."
DOCKERFILES=(
    "Dockerfile.cli"
    "Dockerfile.frontend-realdeal"
    "Dockerfile.frontend-demoland"
)

for dockerfile in "${DOCKERFILES[@]}"; do
    if [ -f "$dockerfile" ]; then
        echo -e "${GREEN}✓${NC} $dockerfile exists"
        # Validate syntax (basic check)
        if ! grep -q "^FROM" "$dockerfile"; then
            echo -e "${RED}✗${NC} $dockerfile missing FROM instruction"
            ((ERRORS++))
        fi
    else
        echo -e "${RED}✗${NC} $dockerfile not found"
        ((ERRORS++))
    fi
done

# Check docker-compose files
echo -e "\nChecking docker-compose files..."
COMPOSE_FILES=(
    "docker-compose.yml"
    "docker-compose.prod.yml"
)

for compose in "${COMPOSE_FILES[@]}"; do
    if [ -f "$compose" ]; then
        echo -e "${GREEN}✓${NC} $compose exists"
        # Validate YAML syntax if docker-compose is available
        if command -v docker-compose &> /dev/null; then
            if docker-compose -f "$compose" config > /dev/null 2>&1; then
                echo -e "  ${GREEN}✓${NC} Valid YAML syntax"
            else
                echo -e "  ${RED}✗${NC} Invalid YAML syntax"
                ((ERRORS++))
            fi
        fi
    else
        echo -e "${RED}✗${NC} $compose not found"
        ((ERRORS++))
    fi
done

# Check environment configuration
echo -e "\nChecking environment configuration..."
if [ -f ".env.production" ]; then
    echo -e "${GREEN}✓${NC} .env.production exists"
    
    # Check for required variables
    REQUIRED_VARS=(
        "VITE_NODE_URL"
        "VITE_INDEXER_URL"
        "VITE_PROOF_SERVER_URL"
        "VITE_CONTRACT_DISCOVERY_CORE"
        "VITE_CONTRACT_DISCOVERY_PROOF"
        "VITE_CONTRACT_DOCUMENT_REGISTRY"
        "VITE_CONTRACT_ACCESS_CONTROL"
        "VITE_CONTRACT_JURISDICTION_REGISTRY"
        "VITE_CONTRACT_EXPERT_WITNESS"
    )
    
    for var in "${REQUIRED_VARS[@]}"; do
        if grep -q "^${var}=" .env.production; then
            echo -e "  ${GREEN}✓${NC} $var defined"
        else
            echo -e "  ${YELLOW}⚠${NC} $var not defined (will need to populate)"
            ((WARNINGS++))
        fi
    done
else
    echo -e "${RED}✗${NC} .env.production not found"
    ((ERRORS++))
fi

# Check package.json configurations
echo -e "\nChecking package.json configurations..."

# Check wallet SDK versions are aligned
if [ -f "frontend-realdeal/package.json" ]; then
    WALLET_SDK_VERSION=$(grep -o '"@midnight-ntwrk/wallet-sdk-facade": "[^"]*"' frontend-realdeal/package.json | grep -o '\^[0-9.]*' || echo "not found")
    if [[ "$WALLET_SDK_VERSION" == "^3"* ]]; then
        echo -e "${GREEN}✓${NC} Wallet SDK versions aligned to v3"
    else
        echo -e "${YELLOW}⚠${NC} Wallet SDK version might need alignment: $WALLET_SDK_VERSION"
        ((WARNINGS++))
    fi
fi

# Check nginx configuration
echo -e "\nChecking nginx configuration..."
if [ -f "nginx.conf" ] && [ -f "default.conf" ]; then
    echo -e "${GREEN}✓${NC} nginx configs exist"
    
    # Check for essential nginx directives
    if grep -q "gzip on" nginx.conf; then
        echo -e "  ${GREEN}✓${NC} Gzip compression enabled"
    else
        echo -e "  ${YELLOW}⚠${NC} Gzip compression not configured"
        ((WARNINGS++))
    fi
    
    if grep -q "try_files.*index.html" default.conf; then
        echo -e "  ${GREEN}✓${NC} SPA routing configured"
    else
        echo -e "  ${YELLOW}⚠${NC} SPA routing not configured"
        ((WARNINGS++))
    fi
else
    echo -e "${RED}✗${NC} nginx configs not found"
    ((ERRORS++))
fi

# Check deployment documentation
echo -e "\nChecking documentation..."
DOCS=(
    "DEPLOYMENT.md"
    "FINALIZATION-SUMMARY.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✓${NC} $doc exists"
    else
        echo -e "${YELLOW}⚠${NC} $doc not found"
        ((WARNINGS++))
    fi
done

# Check CI/CD workflow
echo -e "\nChecking CI/CD setup..."
if [ -f ".github/workflows/production.yml" ]; then
    echo -e "${GREEN}✓${NC} GitHub Actions workflow configured"
else
    echo -e "${YELLOW}⚠${NC} GitHub Actions workflow not found"
    ((WARNINGS++))
fi

# Check setup script
echo -e "\nChecking setup automation..."
if [ -f "scripts/setup-production.sh" ]; then
    echo -e "${GREEN}✓${NC} Production setup script exists"
else
    echo -e "${YELLOW}⚠${NC} Production setup script not found"
    ((WARNINGS++))
fi

# Check .dockerignore
echo -e "\nChecking build optimization..."
if [ -f ".dockerignore" ]; then
    echo -e "${GREEN}✓${NC} .dockerignore exists (optimized builds)"
else
    echo -e "${YELLOW}⚠${NC} .dockerignore not found"
    ((WARNINGS++))
fi

# Summary
echo -e "\n${BLUE}Validation Summary${NC}"
echo -e "==================\n"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ No critical errors${NC}"
else
    echo -e "${RED}✗ $ERRORS critical error(s)${NC}"
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s)${NC}"
else
    echo -e "${GREEN}✓ No warnings${NC}"
fi

if [ $ERRORS -gt 0 ]; then
    echo -e "\n${RED}Fix errors before deployment!${NC}\n"
    exit 1
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "\n${YELLOW}Warnings should be addressed, but deployment can proceed.${NC}\n"
fi

echo -e "${GREEN}Configuration is valid and ready for deployment!${NC}\n"
exit 0
