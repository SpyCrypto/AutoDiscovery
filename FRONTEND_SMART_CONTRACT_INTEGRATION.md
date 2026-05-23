# Frontend Smart Contract Integration Guide

## Overview

The AutoDiscovery frontend connects to Midnight smart contracts through a provider-based architecture. The frontend uses **reusable provider interfaces** that abstract away contract complexity, allowing UI components to call business logic without knowing about blockchain details.

**Architecture Stack:**
- **Wallet Layer:** Lace extension (browser wallet integration)
- **Contract Layer:** Midnight-JS SDK (handles contract calls, proofs, ZK circuits)
- **Provider Layer:** TypeScript providers wrapping contract SDKs
- **UI Layer:** React components consuming providers via hooks

---

## 1. Architecture Overview

### Provider Pattern (UI ↔ Smart Contracts)

```
┌─────────────────────────────────────────────────────────────┐
│  React Components (Pages, Hooks)                            │
│  └─ useProviders() → access all contract functionality      │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│  Provider Layer (src/providers/realdeal/*)                  │
│  ├─ RealCaseProvider         → discovery-core contract      │
│  ├─ RealDocumentProvider     → document-registry contract   │
│  ├─ RealComplianceProvider   → discovery-proof contract     │
│  ├─ RealAccessControlProvider → access-control contract     │
│  ├─ RealJurisdictionProvider  → jurisdiction-registry       │
│  ├─ RealExpertWitnessProvider → expert-witness contract     │
│  └─ RealAuthProvider         → Midnight wallet + DID        │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│  Midnight Contract SDKs (generated from .compact files)     │
│  ├─ @autodiscovery/contract/discovery-core                 │
│  ├─ @autodiscovery/contract/document-registry              │
│  ├─ @autodiscovery/contract/discovery-proof                │
│  └─ (etc for each contract)                                │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│  Midnight-JS Libraries                                      │
│  ├─ @midnight-ntwrk/midnight-js-contracts                  │
│  ├─ @midnight-ntwrk/midnight-js-types                      │
│  ├─ @midnight-ntwrk/dapp-connector-api (wallet connection) │
│  └─ @midnight-ntwrk/compact-runtime (contract execution)   │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│  Midnight PreProd Network                                   │
│  ├─ Lace Browser Extension (wallet)                        │
│  ├─ PreProd Indexer (read public contract state)           │
│  ├─ PreProd Node (read ledger)                             │
│  └─ PreProd Proof Server (generate ZK proofs)              │
└─────────────────────────────────────────────────────────────┘
```

### Key Components

#### 1. **Wallet Connection** (Lace Integration)
```
User clicks "Connect Wallet"
    ↓
Browser detects Lace extension (window.midnight.mnLace)
    ↓
Request wallet connection via DAppConnectorAPI
    ↓
User approves in Lace popup
    ↓
Get coinPublicKey + serviceUriConfig (indexer URLs, proof server)
    ↓
Create AuthSession with wallet identity
    ↓
All contract calls use this wallet for signing + proofs
```

#### 2. **Provider Initialization**
```
ProvidersProvider
    ↓
Wallet context ready (from WalletContext)
    ↓
Create Midnight providers (publicDataProvider, privateStateProvider, etc.)
    ↓
Instantiate Contract SDKs
    ↓
Wrap in RealCase/Document/Compliance/etc. providers
    ↓
Expose via useProviders() hook
```

#### 3. **Contract Call Flow** (Example: Create Case)
```
Component calls: providers.cases.createCase({...})
    ↓
RealCaseProvider.createCase() implementation:
    • Construct case object
    • Call deployed discovery-core contract
    • discoveryCore.callTx.createCase(params)
    ↓
Midnight-JS handles:
    • Generate ZK proof (if needed)
    • Sign transaction with wallet public key
    • Submit to PreProd network
    ↓
Wait for blockchain confirmation
    ↓
Return on-chain result + contract address
    ↓
Component updates local state + UI
```

---

## 2. Existing Frontend Structure

### File Organization

```
frontend-realdeal/
├── src/
│   ├── providers/                    ← Provider implementations
│   │   ├── types.ts                 ← Interface definitions
│   │   ├── context.tsx              ← React contexts
│   │   ├── realdeal/
│   │   │   ├── index.ts            ← Provider factory
│   │   │   ├── real-auth.ts        ← Wallet connection
│   │   │   ├── real-case.ts        ← Case management (discovery-core)
│   │   │   ├── real-document.ts    ← Document storage (document-registry)
│   │   │   ├── real-compliance.ts  ← Proof attestations (discovery-proof)
│   │   │   ├── real-access-control.ts → access-control contract
│   │   │   ├── real-jurisdiction.ts  → jurisdiction-registry contract
│   │   │   ├── real-expert-witness.ts → expert-witness contract
│   │   │   ├── real-ai.ts          ← External AI service
│   │   │   ├── real-contacts.ts    ← Off-chain contacts (localStorage)
│   │   │   └── real-email-safety.ts ← Email gateway
│   │   └── demoland/               ← Mock providers (for UI testing)
│   │       ├── mock-auth.ts
│   │       ├── mock-case.ts
│   │       └── (etc)
│   │
│   ├── modules/midnight/
│   │   ├── wallet-widget/          ← Wallet UI component
│   │   │   ├── api/
│   │   │   ├── contexts/
│   │   │   ├── hooks/
│   │   │   └── ui/
│   │   │
│   │   └── counter-sdk/            ← Example: Counter contract SDK integration
│   │       ├── api/
│   │       │   ├── contractController.ts    ← Main contract interface
│   │       │   └── common-types.ts          ← TypeScript types
│   │       ├── contexts/
│   │       │   ├── counter-providers.tsx
│   │       │   ├── counter-deployment.tsx
│   │       │   └── counter-localStorage.tsx
│   │       └── hooks/
│   │           ├── use-contract-subscription.ts
│   │           ├── use-providers.ts
│   │           └── use-deployment.ts
│   │
│   ├── pages/                      ← Route pages
│   │   ├── dashboard/
│   │   ├── case-view/
│   │   ├── document-upload/
│   │   ├── compliance/
│   │   └── (etc)
│   │
│   ├── components/                 ← Reusable UI components
│   └── App.tsx
│
└── package.json
```

---

## 3. How Contracts Connect to Frontend

### A. Real Case Provider (discovery-core Integration)

**File:** `frontend-realdeal/src/providers/realdeal/real-case.ts`

```typescript
/**
 * RealCaseProvider implements ICaseProvider using the discovery-core contract.
 * 
 * The discovery-core contract handles:
 *   - Case creation and lifecycle management
 *   - Step tracking (discovery steps)
 *   - Party management
 *
 * NOTE: This is a STUB implementation. The actual contract calls use
 * the Midnight-JS SDK generated from discovery-core.compact.
 */

import type { ICaseProvider, Case, DiscoveryStep, Party, CreateCaseParams } from '../types';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';

export class RealCaseProvider implements ICaseProvider {
  private contractAddress: string | null = null;
  private discoveryCore: any; // Should be typed from compiled contract SDK

  constructor() {
    // Initialize with contract address from environment
    this.contractAddress = import.meta.env.VITE_CONTRACT_DISCOVERY_CORE || null;
  }

  async listCases(): Promise<Case[]> {
    if (!this.contractAddress) {
      throw new Error('discovery-core contract address not configured');
    }

    // TODO: Call discovery-core contract to list all cases
    // const result = await this.discoveryCore.getCases();
    // Convert contract response to Case interface
    return [];
  }

  async getCase(caseId: string): Promise<Case> {
    if (!this.contractAddress) {
      throw new Error('discovery-core contract address not configured');
    }

    // TODO: Call discovery-core contract to get case by ID
    // const result = await this.discoveryCore.getCase(caseId);
    // Convert contract response to Case interface
    throw new Error('Not implemented');
  }

  async createCase(params: CreateCaseParams): Promise<Case> {
    if (!this.contractAddress) {
      throw new Error('discovery-core contract address not configured');
    }

    // TODO: Call discovery-core contract to create case
    // This triggers:
    // 1. Build case object from params
    // 2. Call discoveryCore.callTx.createCase(params)
    // 3. Sign with wallet
    // 4. Generate ZK proof if needed
    // 5. Submit to blockchain
    // 6. Wait for confirmation
    // 7. Return on-chain result
    
    throw new Error('Not implemented');
  }

  async getCaseSteps(caseId: string): Promise<DiscoveryStep[]> {
    if (!this.contractAddress) {
      throw new Error('discovery-core contract address not configured');
    }

    // TODO: Query contract for steps associated with caseId
    return [];
  }

  async getCaseParties(caseId: string): Promise<Party[]> {
    if (!this.contractAddress) {
      throw new Error('discovery-core contract address not configured');
    }

    // TODO: Query contract for parties in this case
    return [];
  }
}
```

### B. Real Document Provider (document-registry Integration)

**File:** `frontend-realdeal/src/providers/realdeal/real-document.ts`

```typescript
/**
 * RealDocumentProvider implements IDocumentProvider using the document-registry contract.
 * 
 * The document-registry contract handles:
 *   - Document registration (store metadata + hash)
 *   - Document retrieval
 *   - Custody chain tracking
 *   - Twin bond verification (image vs digital hash fidelity)
 */

import type { IDocumentProvider, Document } from '../types';

export class RealDocumentProvider implements IDocumentProvider {
  private contractAddress: string | null = null;

  constructor() {
    this.contractAddress = import.meta.env.VITE_CONTRACT_DOCUMENT_REGISTRY || null;
  }

  async registerDocument(document: Document): Promise<Document> {
    if (!this.contractAddress) {
      throw new Error('document-registry contract address not configured');
    }

    // TODO: Call document-registry contract
    // 1. Compute SHA-256 hash of document content
    // 2. Call documentRegistry.callTx.registerDocument({
    //      contentHash,
    //      owner: walletPublicKey,
    //      metadata: { title, category, etc }
    //    })
    // 3. Wait for blockchain confirmation
    // 4. Store local metadata (title, category, etc) in localStorage
    // 5. Return enriched Document object with on-chain hash

    throw new Error('Not implemented');
  }

  async getDocuments(caseId: string): Promise<Document[]> {
    // TODO: Query document-registry contract for docs in this case
    return [];
  }

  async getDocument(documentId: string): Promise<Document> {
    // TODO: Retrieve specific document from contract
    throw new Error('Not implemented');
  }

  async updateDocumentMetadata(documentId: string, metadata: any): Promise<Document> {
    // TODO: Update metadata on-chain via document-registry contract
    throw new Error('Not implemented');
  }
}
```

### C. Real Compliance Provider (discovery-proof Integration)

**File:** `frontend-realdeal/src/providers/realdeal/real-compliance.ts`

```typescript
/**
 * RealComplianceProvider implements IComplianceProvider using discovery-proof contract.
 * 
 * The discovery-proof contract handles:
 *   - Attestation generation (ZK proof of compliance at each step)
 *   - Proof verification (courts can verify proofs independently)
 *   - Compliance history tracking
 */

import type { IComplianceProvider, ComplianceStatus, Attestation } from '../types';

export class RealComplianceProvider implements IComplianceProvider {
  private contractAddress: string | null = null;

  constructor() {
    this.contractAddress = import.meta.env.VITE_CONTRACT_DISCOVERY_PROOF || null;
  }

  async generateProof(caseId: string, stepId: string): Promise<Attestation> {
    if (!this.contractAddress) {
      throw new Error('discovery-proof contract address not configured');
    }

    // TODO: Call discovery-proof contract
    // 1. Generate ZK proof that step is complete and compliant
    // 2. Call discoveryProof.callTx.attestCompliance({
    //      caseId,
    //      stepId,
    //      proofData: zkProof
    //    })
    // 3. Store proof on blockchain with timestamp
    // 4. Return Attestation with proof hash + timestamp

    throw new Error('Not implemented');
  }

  async getAttestations(caseId: string): Promise<Attestation[]> {
    // TODO: Query contract for all attestations in this case
    return [];
  }

  async getComplianceStatus(caseId: string): Promise<ComplianceStatus> {
    // TODO: Compute compliance score from step completion + overdue count
    throw new Error('Not implemented');
  }
}
```

---

## 4. Integration Workflow: Step-by-Step

### Phase 1: Wallet Connection

**Goal:** Connect Lace wallet and extract user's public key

**File:** `frontend-realdeal/src/providers/realdeal/real-auth.ts`

```typescript
// 1. Check if Lace is installed
const isLaceAvailable = () => {
  return typeof window !== 'undefined' && !!(window as any).midnight?.mnLace;
};

// 2. Connect to Lace wallet
const connectLaceWallet = async () => {
  const mnLace = (window as any).midnight?.mnLace;
  const wallet = await mnLace.enable('1.x'); // Request user approval
  const walletState = await wallet.state();
  const publicKey = walletState.coinPublicKey;
  // ^ This public key identifies the user for all contract calls
};

// 3. Extract service URIs (indexer, proof server, node)
const serviceUriConfig = await wallet.getConfiguration();
// Returns: {
//   indexerUri: 'https://preprod-indexer.midnight.network/api/v1/graphql',
//   proverServerUri: 'https://preprod-proof-server.midnight.network',
//   nodeUri: 'https://preprod-node.midnight.network'
// }
```

### Phase 2: Initialize Midnight Providers

**Goal:** Create Midnight-JS provider instances with wallet connection

**File:** `frontend-realdeal/src/modules/midnight/wallet-widget/contexts/wallet.tsx`

```typescript
// 1. Create Midnight-JS providers
import {
  createIndexerPublicDataProvider,
  createHttpClientProofProvider,
  createLevelPrivateStateProvider,
} from '@midnight-ntwrk/midnight-js-*';

const publicDataProvider = await createIndexerPublicDataProvider({
  indexerUri: serviceUriConfig.indexerUri,
  proverUri: serviceUriConfig.proverServerUri,
  nodeUri: serviceUriConfig.nodeUri,
});

const proofProvider = await createHttpClientProofProvider({
  proverUri: serviceUriConfig.proverServerUri,
  // Sign proofs with wallet public key
  signatureProvider: async (message) => {
    return await wallet.signMessage(message);
  },
});

const privateStateProvider = await createLevelPrivateStateProvider();

// 2. Bundle into MidnightProviders
const providers: MidnightProviders = {
  publicDataProvider,
  proofProvider,
  privateStateProvider,
  // ... other providers
};
```

### Phase 3: Instantiate Contract SDKs

**Goal:** Create SDK instances from compiled contract files

**File:** `frontend-realdeal/src/modules/midnight/counter-sdk/api/contractController.ts` (example)

```typescript
// 1. Import compiled contract SDK (generated from .compact)
import { Counter, CounterPrivateState, witnesses } from '@autodiscovery/contract';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';

// 2. Create contract instance
const counterContractInstance = new Counter.Contract(witnesses);

// 3. Deploy or find deployed contract
const deployedContract = await deployContract(providers, {
  privateStateId: 'counterPrivateState',
  contract: counterContractInstance,
  initialPrivateState: createPrivateState(0),
});
// OR
const deployedContract = await findDeployedContract(providers, {
  contractAddress: '03cc52g89494d8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f',
  contract: counterContractInstance,
  privateStateId: 'counterPrivateState',
  initialPrivateState: createPrivateState(0),
});

// 4. Create ContractController wrapper
const controller = new ContractController(
  'counterPrivateState',
  deployedContract,
  providers,
  logger
);
```

### Phase 4: Wrap in Provider Classes

**Goal:** Create provider classes that abstract contract details

**File:** `frontend-realdeal/src/providers/realdeal/real-case.ts`

```typescript
export class RealCaseProvider implements ICaseProvider {
  private controller: ContractController;

  constructor(controller: ContractController) {
    this.controller = controller;
  }

  async createCase(params: CreateCaseParams): Promise<Case> {
    // Call contract method via controller
    const result = await this.controller.createCase(params);

    // Convert contract response to UI interface
    return {
      id: result.id,
      caseNumber: result.caseNumber,
      // ... map fields
    };
  }
}
```

### Phase 5: Expose via React Context

**Goal:** Make providers accessible to all components

**File:** `frontend-realdeal/src/providers/context.tsx`

```typescript
const ProvidersContext = createContext<Providers | null>(null);

export function ProvidersProvider({ children }) {
  // Initialize providers once
  const [providers] = useState(() => createRealProviders());

  return (
    <ProvidersContext.Provider value={providers}>
      {children}
    </ProvidersContext.Provider>
  );
}

// Hook for components to access providers
export function useProviders(): Providers {
  const ctx = useContext(ProvidersContext);
  if (!ctx) throw new Error('useProviders must be used within ProvidersProvider');
  return ctx;
}
```

### Phase 6: Use in Components

**Goal:** Components call providers and update UI

**File:** `frontend-realdeal/src/pages/case-creation/index.tsx`

```typescript
export function CaseCreationPage() {
  const { cases } = useProviders();

  const handleCreateCase = async (params: CreateCaseParams) => {
    try {
      // Call provider method (which calls smart contract)
      const newCase = await cases.createCase(params);
      
      // Update local state
      setCases([...cases, newCase]);
      
      // Show success message
      toast.success(`Case ${newCase.caseNumber} created on-chain!`);
    } catch (error) {
      toast.error(`Failed to create case: ${error.message}`);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleCreateCase(formData);
    }}>
      {/* form fields */}
    </form>
  );
}
```

---

## 5. Contract Call Breakdown: What Happens Behind the Scenes

### Example: Create Case

**User Action:** Clicks "Create Case" after filling form

**What happens:**

```
1. Component calls: providers.cases.createCase({
     caseNumber: "2024-CV-001",
     title: "Smith v. Jones",
     jurisdiction: "ID",
     parties: [...]
   })

2. RealCaseProvider.createCase() receives the params

3. Build contract input:
   - Convert party objects to contract-compatible format
   - Serialize caseNumber, title, etc.

4. Call discovery-core contract:
   contractAPI.callTx.createCase({
     caseNumber: "2024-CV-001",
     title: "Smith v. Jones",
     // ... other fields
   })

5. Midnight-JS handles:
   a) Generate ZK proof (if contract uses private state)
      - Prove case is valid without revealing sensitive data
   
   b) Sign transaction:
      - Hash the transaction
      - Sign with wallet's private key via Lace extension
      - User sees "Approve transaction" popup in Lace
   
   c) Submit to PreProd network:
      - Send to PreProd node
      - Node validates: signature, gas, contract logic
   
   d) Wait for confirmation:
      - Block is finalized
      - Contract state updated on ledger
      - Indexer picks up the change

6. Contract execution on-chain:
   - discovery-core.createCase() is called
   - Case added to contract state
   - Returns: { caseId, txHash, blockHeight, ... }

7. RealCaseProvider gets result:
   - Extract case data
   - Convert to Case interface format
   - Return to component

8. Component receives result:
   - Update local UI state
   - Show success message
   - Navigate to case view

TOTAL TIME: ~30-60 seconds (blockchain finalization)
```

---

## 6. Key Patterns & Best Practices

### Pattern 1: Wallet-Gated Methods
```typescript
async createCase(params: CreateCaseParams): Promise<Case> {
  // ✓ Always check wallet is connected
  if (!this.wallet.isConnected()) {
    throw new Error('Wallet not connected. Please connect Lace wallet.');
  }
  
  // ✓ Contract call requires wallet signature
  const result = await this.discoveryCore.callTx.createCase(params);
  return result;
}
```

### Pattern 2: Error Handling
```typescript
async getCase(caseId: string): Promise<Case> {
  try {
    // Try to get from contract
    const result = await this.discoveryCore.getCaseObservable(caseId).pipe(
      timeout(5000), // 5 second timeout for network call
      retry({ count: 2 }), // Retry 2x if network fails
    );
    return result;
  } catch (error) {
    if (error instanceof TimeoutError) {
      throw new Error('Network timeout. Proof server unavailable.');
    }
    throw error;
  }
}
```

### Pattern 3: Observable Subscriptions
```typescript
// Subscribe to real-time contract state changes
const subscription = contractAPI.state$.subscribe((newState) => {
  // This runs whenever contract state changes
  // (someone else calls the contract)
  setCaseData(newState);
});

// Clean up on unmount
useEffect(() => {
  return () => subscription.unsubscribe();
}, []);
```

### Pattern 4: Offline Fallback
```typescript
async getDocuments(caseId: string): Promise<Document[]> {
  try {
    // Try contract first
    return await this.documentRegistry.getDocuments(caseId);
  } catch (error) {
    // Fall back to local cache if network fails
    console.warn('Network error, using cached documents');
    return getDocumentsFromLocalStorage(caseId);
  }
}
```

---

## 7. Integration Checklist

- [ ] **Wallet Connection**
  - [ ] Lace extension detection
  - [ ] User approval flow
  - [ ] Public key extraction
  - [ ] Service URI configuration

- [ ] **Midnight Providers**
  - [ ] Public data provider (indexer)
  - [ ] Proof provider (proof server)
  - [ ] Private state provider (localStorage)

- [ ] **Contract SDKs**
  - [ ] Import compiled contract (from @autodiscovery/contract)
  - [ ] Deploy or find deployed contract
  - [ ] Create controller wrapper
  - [ ] Expose via providers

- [ ] **Real Providers**
  - [ ] RealCaseProvider (discovery-core)
  - [ ] RealDocumentProvider (document-registry)
  - [ ] RealComplianceProvider (discovery-proof)
  - [ ] RealAccessControlProvider (access-control)
  - [ ] RealJurisdictionProvider (jurisdiction-registry)
  - [ ] RealExpertWitnessProvider (expert-witness)

- [ ] **React Integration**
  - [ ] ProvidersProvider context setup
  - [ ] useProviders() hook
  - [ ] ProvidersProvider wraps App in main.tsx
  - [ ] Components use useProviders() for contract calls

- [ ] **Error Handling**
  - [ ] Network errors
  - [ ] Wallet disconnection
  - [ ] Contract validation errors
  - [ ] Gas/fee errors

- [ ] **Testing**
  - [ ] Manual testing with Lace wallet on PreProd
  - [ ] Mock provider testing (demoland)
  - [ ] Contract call verification via explorer

---

## 8. Environment Configuration

**File:** `.env.local` (never commit)

```env
# Wallet
VITE_WALLET_TYPE=lace

# Smart Contracts (from deployment)
VITE_CONTRACT_DISCOVERY_CORE=03cc52g89494d8c9d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_DOCUMENT_REGISTRY=05ee74i89616f0e1f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_DISCOVERY_PROOF=04dd63h89505e9d0e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f
VITE_CONTRACT_ACCESS_CONTROL=06ff85j89727g0e2g7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f
VITE_CONTRACT_JURISDICTION_REGISTRY=07gg96k89838h1f3h8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f
VITE_CONTRACT_EXPERT_WITNESS=08hh07l89949i2g4i9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f

# Midnight Network
VITE_MIDNIGHT_NETWORK=preprod
VITE_NODE_URL=https://preprod-node.midnight.network
VITE_INDEXER_URL=https://preprod-indexer.midnight.network/api/v1/graphql
VITE_PROOF_SERVER_URL=https://preprod-proof-server.midnight.network

# AI Service (optional)
VITE_AI_SERVICE_URL=http://localhost:3001/api

# App Mode
VITE_AD_MODE=realdeal  # or 'demoland' for mock data
```

---

## 9. Next Steps

1. **Implement RealCaseProvider** - Connect discovery-core contract
   - [ ] Create file: `real-case.ts`
   - [ ] Import contract SDK
   - [ ] Implement createCase, listCases, getCaseSteps
   - [ ] Test with Lace wallet

2. **Implement RealDocumentProvider** - Connect document-registry
   - [ ] Create file: `real-document.ts`
   - [ ] Implement registerDocument, getDocuments
   - [ ] Handle document hashing + twin bond

3. **Implement RealComplianceProvider** - Connect discovery-proof
   - [ ] Create file: `real-compliance.ts`
   - [ ] Implement generateProof, getAttestations
   - [ ] Handle ZK proof generation

4. **Wire up UI** - Build pages that use providers
   - [ ] Case creation page
   - [ ] Case list page
   - [ ] Document upload page
   - [ ] Compliance dashboard

5. **Testing** - Verify end-to-end flow
   - [ ] Connect Lace wallet on PreProd
   - [ ] Create a test case
   - [ ] Verify on Midnight Explorer
   - [ ] Check attestation generation

---

## References

- **Midnight Docs:** https://midnight.network/docs
- **Counter Example:** `frontend-realdeal/src/modules/midnight/counter-sdk/`
- **Wallet Widget:** `frontend-realdeal/src/modules/midnight/wallet-widget/`
- **Provider Types:** `frontend-realdeal/src/providers/types.ts`
- **PreProd Explorer:** https://explore-preprod.midnight.network
- **PreProd Faucet:** https://faucet.midnight.network
