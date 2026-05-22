#!/bin/bash

# Save Contract Deployment Addresses
# Usage: bash scripts/save-contract-addresses.sh

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}AutoDiscovery Contract Address Capture${NC}\n"

# Create template file if it doesn't exist
if [ ! -f ".env.contract-addresses" ]; then
    cat > .env.contract-addresses << 'EOF'
# AutoDiscovery Contract Addresses (PreProd)
# Generated: 
# Network: preprod
# Deployment Method: Manual

# Network Endpoints (PreProd)
VITE_NODE_URL=https://preprod-node.midnight.network
VITE_INDEXER_URL=https://preprod-indexer.midnight.network/api/v1/graphql
VITE_INDEXER_WS=wss://preprod-indexer.midnight.network/api/v1/graphql
VITE_PROOF_SERVER_URL=https://preprod-proof-server.midnight.network

# Contract Addresses - PASTE FROM DEPLOYMENT OUTPUT
VITE_CONTRACT_DISCOVERY_CORE=
VITE_CONTRACT_DISCOVERY_PROOF=
VITE_CONTRACT_DOCUMENT_REGISTRY=
VITE_CONTRACT_ACCESS_CONTROL=
VITE_CONTRACT_JURISDICTION_REGISTRY=
VITE_CONTRACT_EXPERT_WITNESS=
EOF
    echo -e "${GREEN}✓ Created .env.contract-addresses${NC}\n"
fi

# Interactive address entry
echo -e "${YELLOW}Enter contract addresses from deployment:${NC}\n"

CONTRACTS=(
    "VITE_CONTRACT_DISCOVERY_CORE:Discovery Core"
    "VITE_CONTRACT_DISCOVERY_PROOF:Discovery Proof"
    "VITE_CONTRACT_DOCUMENT_REGISTRY:Document Registry"
    "VITE_CONTRACT_ACCESS_CONTROL:Access Control"
    "VITE_CONTRACT_JURISDICTION_REGISTRY:Jurisdiction Registry"
    "VITE_CONTRACT_EXPERT_WITNESS:Expert Witness"
)

for contract_pair in "${CONTRACTS[@]}"; do
    IFS=':' read -r var_name display_name <<< "$contract_pair"
    
    read -p "$(echo -e ${YELLOW}Enter $display_name address:${NC} )" address
    
    if [ -z "$address" ]; then
        echo -e "${RED}✗ Address cannot be empty${NC}"
        continue
    fi
    
    # Validate format (should start with two hex chars for contract ID)
    if ! [[ $address =~ ^[0-9a-fA-F]{50,100}$ ]]; then
        echo -e "${YELLOW}⚠ Address format may be incorrect (expected hex string)${NC}"
    fi
    
    # Update env file
    if grep -q "^$var_name=" .env.contract-addresses; then
        sed -i.bak "s|^$var_name=.*|$var_name=$address|" .env.contract-addresses
    else
        echo "$var_name=$address" >> .env.contract-addresses
    fi
    
    echo -e "${GREEN}✓ $display_name: $address${NC}"
done

# Copy to production env
echo ""
read -p "$(echo -e ${YELLOW}Copy addresses to .env.prod? (y/n):${NC} )" -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Backup existing .env.prod
    if [ -f ".env.prod" ]; then
        cp .env.prod .env.prod.backup
        echo -e "${GREEN}✓ Backed up .env.prod to .env.prod.backup${NC}"
    fi
    
    # Copy relevant lines from contract addresses to prod
    grep "^VITE_CONTRACT_\|^VITE_NODE_URL\|^VITE_INDEXER" .env.contract-addresses >> .env.prod 2>/dev/null || true
    
    echo -e "${GREEN}✓ Addresses copied to .env.prod${NC}"
fi

# Show summary
echo -e "\n${BLUE}Summary${NC}"
echo "========"
echo -e "${GREEN}✓ Addresses saved to .env.contract-addresses${NC}"
echo ""
echo -e "Next steps:"
echo "  1. Verify addresses in .env.contract-addresses"
echo "  2. Copy to .env.prod: bash scripts/save-contract-addresses.sh"
echo "  3. Deploy: bash scripts/setup-production.sh"
echo ""
echo -e "${GREEN}Your contract addresses:${NC}"
grep "^VITE_CONTRACT_" .env.contract-addresses || echo "(none saved yet)"
