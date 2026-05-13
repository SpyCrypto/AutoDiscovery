# AutoDiscovery — Contract Deployment Guide

## Overview

The AutoDiscovery suite deploys 4 Compact smart contracts to the Midnight network:

| Contract | File | Role |
|---|---|---|
| `discovery-core` | `discovery-core.compact` | Case lifecycle + step tracking |
| `jurisdiction-registry` | `jurisdiction-registry.compact` | Rule pack registry |
| `compliance-proof` | `compliance-proof.compact` | ZK attestation anchoring |
| `document-registry` | `document-registry.compact` | Document hash anchoring |

---

## Option A — Local Development (Recommended First)

### 1. Start the local Midnight stack

```bash
# From the repo root
docker compose up
```

Wait for all 3 services to be healthy:
- `ad-node` → `:9944` (Midnight consensus node, dev mode)
- `ad-indexer` → `:8088` (GraphQL indexer)
- `ad-proof-server` → `:6300` (ZK proof generation)

### 2. Compile the contracts

```bash
# From repo root
npm run compact:ad
# or from autodiscovery-contract/
npm run compact:ad
```

### 3. Set up your deployer seed

Generate a random 64-char hex seed (any random bytes work for local dev):

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add it to `frontend-vite-react/.env.realdeal`:

```env
MIDNIGHT_NETWORK=undeployed
DEPLOYER_SEED=<your-64-char-hex-seed>
```

### 4. Deploy

```bash
cd autodiscovery-contract
npm run deploy:local
```

The script will:
1. Derive ZSwap + Dust keys from your seed
2. Deploy all 4 contracts sequentially
3. Print and auto-write the contract addresses to `.env.realdeal`

---

## Option B — Preprod Testnet

### 1. Start proof server locally

```bash
docker run -p 6300:6300 midnightnetwork/proof-server:6.1.0-alpha.6 \
  midnight-proof-server --network preprod
```

### 2. Set up your deployer seed and fund the wallet

Generate a 64-char hex seed:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run the deploy script once — it will print your wallet's Dust address:

```bash
cd autodiscovery-contract
MIDNIGHT_NETWORK=preprod DEPLOYER_SEED=<your-seed> npm run deploy:preprod
```

Copy the **Dust address** and fund it:
- Preprod faucet: https://faucet.preprod.midnight.network/
- Preview faucet: https://faucet.preview.midnight.network/

Wait ~1 minute for funds to arrive, then re-run `npm run deploy:preprod`.

### 3. Update .env.realdeal

```env
MIDNIGHT_NETWORK=preprod
DEPLOYER_SEED=<your-seed>
# VITE_INDEXER_URL=https://indexer.preprod.midnight.network/api/v3/graphql
# VITE_INDEXER_WS_URL=wss://indexer.preprod.midnight.network/api/v3/graphql/ws
# VITE_NODE_URL=https://rpc.preprod.midnight.network
```

Uncomment the preprod lines and comment out the local ones.

---

## Files Created

| File | Purpose |
|---|---|
| `docker-compose.yml` | Local Midnight stack (node + indexer + proof server) |
| `autodiscovery-contract/src/deploy/deploy-contracts.ts` | Main deploy script |
| `autodiscovery-contract/src/deploy/wallet-setup.ts` | Wallet/provider setup from seed |
| `autodiscovery-contract/src/witnesses/discovery-witnesses.ts` | discovery-core witnesses |
| `autodiscovery-contract/src/witnesses/compliance-witnesses.ts` | compliance-proof witnesses |
| `autodiscovery-contract/src/witnesses/document-witnesses.ts` | document-registry witnesses |
| `frontend-vite-react/.env.realdeal` | Network config + contract addresses |

---

## Architecture Notes

### Witness implementations
All 3 witnesses files use SHA-256 via Node.js `crypto` to compute on-chain identifiers:
- **`computeUniqueCaseIdentifier`** → `sha256(caseNumber | jurisdictionCode)` → 248-bit Field
- **`computeUniqueStepHash`** → `sha256(caseId | ruleReference)` → 248-bit Field
- **`computeUniqueAttestationHash`** → `sha256(caseId | stepHash | timestamp)` → Bytes<32>
- **`computeTwinBondHash`** → `sha256(imageTwinHash | digitalTwinHash)` → Bytes<32>

### Fee balancing
The current `balanceTx` implementation returns `NothingToProve` which works for:
- Local `undeployed` network (dev mode has no fee requirements)

For testnet, you need actual DUST balance and a synced `DustWallet`. See the
KYC demo at `kycdemo/kycdemotemp/kyc-cli/src/api.ts` for the full pattern.

### Contract addresses
After deployment, addresses are auto-written to `frontend-vite-react/.env.realdeal`
and picked up by the Vite dev server on next restart.
