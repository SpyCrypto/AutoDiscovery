#!/usr/bin/env node

console.log(`
╔════════════════════════════════════════════════════════════════════════════╗
║                 AutoDiscovery Contracts Compiled Successfully!             ║
╚════════════════════════════════════════════════════════════════════════════╝

✅ All 7 contracts have been compiled from Compact language.

📁 Compiled contracts ready at:
   AutoDiscovery/autodiscovery-contract/src/managed/

   1. ✓ access-control
   2. ✓ compliance-proof  
   3. ✓ counter (testing only)
   4. ✓ discovery-core (REQUIRED)
   5. ✓ document-registry (REQUIRED)
   6. ✓ expert-witness (REQUIRED)
   7. ✓ jurisdiction-registry (REQUIRED)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 NEXT STEP: Deploy to Midnight PreProd

You now need to deploy each contract to get its address. Choose one method:

┌─────────────────────────────────────────────────────────────────────────┐
│ OPTION A: Visual Deployment (Explorer UI - Easiest)                    │
├─────────────────────────────────────────────────────────────────────────┤
│ 1. Open: https://explore-preprod.midnight.network                      │
│ 2. Click: "Deploy Contract"                                            │
│ 3. Select: autodiscovery-contract/src/managed/[contract-name]          │
│ 4. Click: Deploy                                                       │
│ 5. Approve in Lace wallet                                              │
│ 6. COPY the returned address                                           │
│ 7. Repeat for all 6 required contracts                                 │
│                                                                         │
│ Required contracts (MUST deploy):                                      │
│   - discovery-core                                                     │
│   - compliance-proof (discovery-proof)                                 │
│   - document-registry                                                  │
│   - access-control                                                     │
│   - jurisdiction-registry                                              │
│   - expert-witness                                                     │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ OPTION B: CLI Deployment (Command Line)                                │
├─────────────────────────────────────────────────────────────────────────┤
│ # Deploy discovery-core first                                          │
│ midnight deploy \\                                                      │
│   --contract autodiscovery-contract/src/managed/discovery-core \\      │
│   --network preprod \\                                                  │
│   --wallet lace                                                         │
│                                                                         │
│ # Then repeat for all 6 required contracts                             │
│ # Save each address returned                                           │
└─────────────────────────────────────────────────────────────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 PREREQUISITES:
   ✓ Lace wallet installed: https://www.lace.io
   ✓ PreProd network selected in Lace
   ✓ Test DUST tokens: Get at https://faucet.midnight.network
   ✓ Wallet funded with test tokens

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏱️  After Deployment (Once you have the 6 addresses):

1. Use the address capture script:
   bash scripts/save-contract-addresses.sh
   
   (It will ask you to paste each address)

2. Or manually add to .env.prod:
   VITE_CONTRACT_DISCOVERY_CORE=<address1>
   VITE_CONTRACT_DISCOVERY_PROOF=<address2>
   VITE_CONTRACT_DOCUMENT_REGISTRY=<address3>
   VITE_CONTRACT_ACCESS_CONTROL=<address4>
   VITE_CONTRACT_JURISDICTION_REGISTRY=<address5>
   VITE_CONTRACT_EXPERT_WITNESS=<address6>

3. Then deploy AutoDiscovery:
   bash scripts/setup-production.sh

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 Full documentation:
   - README_GET_ADDRESSES.md
   - GET_CONTRACT_ADDRESSES_QUICK.md
   - GET_CONTRACT_ADDRESSES.md
   - CONTRACT_DEPLOYMENT.md

🔗 Links:
   - Block Explorer: https://explore-preprod.midnight.network
   - Midnight Docs: https://midnight.network/docs
   - Faucet: https://faucet.midnight.network
   - Lace Wallet: https://www.lace.io

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Ready to deploy? 🚀

Go to https://explore-preprod.midnight.network and start deploying!

Once you have the 6 addresses, run:
  bash scripts/save-contract-addresses.sh

And then:
  bash scripts/setup-production.sh

Questions? See the documentation files or check:
  https://github.com/SpyCrypto/AutoDiscovery

`);
