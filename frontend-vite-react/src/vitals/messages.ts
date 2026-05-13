// =============================================================================
// MidnightVitals — Natural Language Message Templates
// =============================================================================
// All user-facing messages are defined here for consistency and maintainability.
// Every message is written in plain English. No jargon without explanation.
// =============================================================================


// ---------------------------------------------------------------------------
// Proof Server Messages
// ---------------------------------------------------------------------------

export const PROOF_SERVER_MESSAGES = {
  healthy: (responseTimeMs: number) =>
    `The proof server is running and responded in ${responseTimeMs}ms. ` +
    `This is the local service that builds your zero-knowledge proofs.`,

  healthySlow: (responseTimeMs: number) =>
    `The proof server is running but responding slowly (${responseTimeMs}ms). ` +
    `Proof generation might take longer than usual. ` +
    `If this persists, try restarting the Docker container.`,

  critical:
    `The proof server is not reachable. ` +
    `This is the service that builds zero-knowledge proofs on your machine. ` +
    `Without it, you can still browse and read data, but you cannot submit ` +
    `any transactions (create cases, register documents, etc.).`,

  criticalSuggestion:
    `Make sure Docker Desktop is running, then start the proof server with: ` +
    `docker run -p 6300:6300 midnightntwrk/proof-server:7.0.0`,

  unknown: `Checking the proof server...`,
} as const;


// ---------------------------------------------------------------------------
// Network / Indexer Messages
// ---------------------------------------------------------------------------

export const NETWORK_MESSAGES = {
  healthy: (responseTimeMs: number) =>
    `The Midnight preprod network is reachable and responded in ${responseTimeMs}ms. ` +
    `The network is synced and healthy.`,

  healthySlow: (responseTimeMs: number) =>
    `The Midnight preprod network is reachable but responding slowly (${responseTimeMs}ms). ` +
    `This could be network congestion or indexer lag.`,

  critical:
    `The Midnight preprod network is not reachable. ` +
    `This means we cannot read any data from the blockchain or submit transactions. ` +
    `The network might be down for maintenance, or your internet connection might be interrupted.`,

  criticalSuggestion:
    `Check your internet connection first. If that's fine, the Midnight preprod ` +
    `network might be experiencing downtime. This happens occasionally as the ` +
    `team prepares for mainnet. Try again in a few minutes.`,

  unknown: `Checking the Midnight network connection...`,
} as const;


// ---------------------------------------------------------------------------
// Wallet Messages
// ---------------------------------------------------------------------------

export const WALLET_MESSAGES = {
  healthy: (displayName: string) =>
    `Wallet is connected as "${displayName}." ` +
    `You can create cases, register documents, and submit transactions.`,

  warning:
    `No wallet is connected yet. ` +
    `You can still browse and read public data from the blockchain, ` +
    `but you will need to connect a wallet before you can create cases, ` +
    `register documents, or submit any transactions.`,

  warningSuggestion:
    `Click "Connect Wallet" or log in to connect your Midnight-compatible wallet.`,

  unknown: `Checking wallet connection...`,
} as const;


// ---------------------------------------------------------------------------
// Contract Messages
// ---------------------------------------------------------------------------

export const CONTRACT_MESSAGES = {
  allHealthy: (count: number) =>
    `All ${count} smart contracts are deployed and responding. ` +
    `The full AutoDiscovery contract suite is operational.`,

  someDeployed: (deployed: number, total: number) =>
    `${deployed} out of ${total} contracts are deployed. ` +
    `Some contracts are missing addresses in the environment configuration. ` +
    `Features that depend on undeployed contracts will not be available.`,

  noneDeployed:
    `No smart contracts have addresses configured yet. ` +
    `This means the contracts haven't been deployed to the network, ` +
    `or the deployment addresses haven't been added to the .env file.`,

  noneSuggestion:
    `Deploy the contracts to the Midnight preprod network using the deployment scripts, ` +
    `then add the resulting addresses to your .env file.`,

  unknown: `Checking smart contract status...`,
} as const;


// ---------------------------------------------------------------------------
// Dependency Messages
// ---------------------------------------------------------------------------

export const DEPENDENCY_MESSAGES = {
  dockerInstalled: (version: string) =>
    `Docker is installed (version ${version}).`,

  dockerMissing:
    `Docker is not installed or not accessible from WSL. ` +
    `You need Docker Desktop on Windows with WSL integration enabled.`,

  nodeInstalled: (version: string) =>
    `Node.js is installed (version ${version}).`,

  nodeMissing:
    `Node.js is not installed. This is required to run the application.`,

  compactInstalled: (version: string) =>
    `The Compact compiler is available (version ${version}).`,

  compactMissing:
    `The Compact compiler is not installed. ` +
    `This is needed to compile smart contracts but not required for running the frontend.`,

  npmComplete:
    `All npm packages are installed and up to date.`,

  npmIncomplete: (missing: number) =>
    `${missing} npm package(s) are missing. Run "npm install" to fix this.`,
} as const;


// ---------------------------------------------------------------------------
// Activity Log Message Helpers
// ---------------------------------------------------------------------------
// These functions generate natural-language log entries for common DApp actions.
// Each message explains WHAT happened and WHY it matters.
// ---------------------------------------------------------------------------

export const ACTIVITY_MESSAGES = {
  // Case operations
  caseCreateStarted: () =>
    `We are now asking the Midnight blockchain to register a new case ` +
    `in the discovery-core contract.`,

  caseCreateProofBuilding: () =>
    `Building a zero-knowledge proof on your machine. ` +
    `This is the step where your private case details stay local — ` +
    `only the proof that you did it correctly gets sent to the network. ` +
    `This usually takes 15-30 seconds. Hang tight.`,

  caseCreateSuccess: (caseId: string) =>
    `Your new case has been created. Case identifier: ${caseId}. ` +
    `The contract now shows this case on the public ledger. ` +
    `You can start adding discovery steps to this case.`,

  // Document operations
  documentHashStarted: () =>
    `We are going to anchor this document's fingerprint to the ` +
    `document-registry contract so there is permanent proof it existed ` +
    `at this moment in time. The actual file never touches the blockchain.`,

  documentHashSuccess: (docHash: string) =>
    `Document fingerprint has been anchored on-chain. ` +
    `Hash: ${docHash.slice(0, 12)}... ` +
    `Anyone can now verify this document existed at this timestamp.`,

  // Compliance operations
  complianceCheckStarted: () =>
    `Generating a compliance attestation. This creates a zero-knowledge proof ` +
    `that discovery obligations were met, without revealing the underlying case details.`,

  complianceCheckSuccess: () =>
    `Compliance attestation generated and recorded on-chain. ` +
    `Courts and opposing counsel can verify compliance without seeing case details.`,

  // General
  proofBuilding: (circuitName: string) =>
    `Building a zero-knowledge proof for the "${circuitName}" operation. ` +
    `Your private data stays on your machine — only the proof is sent to the network. ` +
    `This usually takes 15-30 seconds.`,

  proofComplete: (durationSeconds: number) =>
    `Proof built successfully. Took ${durationSeconds} seconds. ` +
    `Now sending it to the Midnight preprod network for confirmation.`,

  transactionConfirmed: () =>
    `The network accepted your transaction. ` +
    `The blockchain has been updated with the new data.`,

  transactionFailed: (reason: string) =>
    `The transaction was rejected by the network. Reason: "${reason}".`,
} as const;
