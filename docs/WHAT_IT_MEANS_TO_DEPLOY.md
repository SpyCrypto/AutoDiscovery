# What It Means to Deploy a Smart Contract

**Created**: Feb 21, 2026  
**Audience**: Anyone new to blockchain development  
**Context**: AutoDiscovery.legal on Midnight blockchain

---

## The Analogy

Imagine you wrote a legal form (the contract). Right now it exists as a Word document on your laptop. **Deploying** = taking that form to the courthouse, getting it stamped and filed, and getting back a case number (address) that anyone can use to reference it.

---

## What Actually Happens — Step by Step

### 1. You write the contract ✅ (done)

These are the `.compact` files in `autodiscovery-contract/src/contracts/`. Written in Compact, Midnight's smart contract language.

### 2. You compile it ✅ (done)

The compiler takes your human-readable Compact code and turns it into:
- **ZK circuits** — the math that makes zero-knowledge proofs work
- **Proving keys** — cryptographic keys needed to generate proofs
- **TypeScript API** — code your frontend can call (like `contract.createNewCase(...)`)

All this lives in the `autodiscovery-contract/src/managed/` folders. We compiled all 6 contracts with compiler 0.29.0.

### 3. You start the proof server

This is a local Docker container that generates ZK proofs on your machine:

```bash
docker run -p 6300:6300 midnightntwrk/proof-server:7.0.0
```

**Key point**: Your private data never leaves your machine — only the proof goes to the network. This is the whole point of zero-knowledge proofs.

### 4. You deploy to the network (the actual "deployment")

Your machine sends a special transaction to the Midnight blockchain that says: *"Here's a new contract, please store it."*

The network:
1. Validates the contract
2. Stores it permanently on the blockchain
3. Gives you back a **contract address** — a long hex string like `ea87c25015951b...`

This address is permanent — it's where your contract "lives" on the blockchain. Think of it like a URL for your contract.

### 5. You save the address

You put that address in your `.env` file so your frontend knows where to find the contract:

```
VITE_CONTRACT_DISCOVERY_CORE=ea87c25015951b...
VITE_CONTRACT_DOCUMENT_REGISTRY=7f3a8bc912de45...
VITE_CONTRACT_COMPLIANCE_PROOF=b2d4e6f891ab23...
VITE_CONTRACT_JURISDICTION_REGISTRY=c5e7f9a1b3d56...
VITE_CONTRACT_ACCESS_CONTROL=d8f0a2c4e6b789...
VITE_CONTRACT_EXPERT_WITNESS=e1a3c5d7f9b012...
```

### 6. You interact with it

Your frontend calls functions like `contract.createNewCase(...)`. Each call:
1. **Generates a ZK proof locally** (via the proof server on your machine)
2. **Submits the proof** to the Midnight network
3. **The network verifies** the proof and updates the contract's state
4. This takes **~20-30 seconds** per transaction (ZK proofs are computationally expensive)

---

## What You Need to Deploy

| Thing | What It Is | Status |
|-------|-----------|--------|
| Compiled contracts | `.compact` files turned into deployable code | ✅ All 6 compiled |
| Proof server | Docker container for ZK proof generation | 🟡 Just need `docker run` |
| Wallet with tDUST | Tokens to pay for deployment (free from faucet) | 🔴 Need to create wallet + get tokens |
| Network access | Connection to Midnight preprod | 🟡 Public, just need internet |

---

## The Cost

- **$0 real money** — preprod uses **tDUST** (test tokens) which are free
- Get them from the [faucet](https://faucet.preprod.midnight.network/)
- Each deployment costs some tDUST (like gas fees on Ethereum, but free on testnet)
- When Midnight goes to mainnet, real DUST tokens will cost real money

---

## Networks Explained

| Network | Purpose | Tokens | Who Can See |
|---------|---------|--------|-------------|
| **Preprod** | Testing before production | tDUST (free) | Everyone |
| **Mainnet** | Real production (not live yet) | DUST (real money) | Everyone |

There is no official "local devnet in a box" yet — Midnight is still pre-mainnet. We use preprod for development and testing.

---

## Our 6 Contracts

| Contract | What It Does | Circuits |
|----------|-------------|----------|
| `discovery-core` | Case lifecycle, steps, deadlines | 4 |
| `document-registry` | Documents, hashes, custody, productions | 7 |
| `compliance-proof` | ZK attestations that obligations were met | 5 |
| `jurisdiction-registry` | Which rules govern each case | 3 |
| `access-control` | Who can see what (roles + protective orders) | 6 |
| `expert-witness` | Expert credential tracking (Phase 2 skeleton) | 2 |

**Total: 27 circuits** across 6 contracts.

---

## Glossary

- **Circuit** — A function in the smart contract that generates a ZK proof when called
- **ZK Proof** — Cryptographic proof that something happened correctly, without revealing the private details
- **tDUST** — Free test tokens on the preprod network
- **Proof server** — Local service that does the heavy math to generate ZK proofs
- **Contract address** — The permanent "location" of your contract on the blockchain
- **Faucet** — A website that gives you free test tokens
- **Preprod** — Midnight's public test network (like a staging environment)
- **Managed output** — The compiled artifacts (TypeScript API, ZK circuits, proving keys) in `src/managed/`
