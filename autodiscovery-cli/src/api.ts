import { type Logger } from 'pino';
import * as Rx from 'rxjs';
import { WebSocket } from 'ws';
import * as bip39 from '@scure/bip39';
import { wordlist as english } from '@scure/bip39/wordlists/english.js';

import {
  type DiscoveryCoreContract,
  type DiscoveryCorePrivateStateId,
  type DiscoveryCoreProviders,
  type DeployedDiscoveryCoreContract,
  type JurisdictionRegistryContract,
  type JurisdictionRegistryPrivateStateId,
  type JurisdictionRegistryProviders,
  type DeployedJurisdictionRegistryContract,
  type ComplianceProofContract,
  type ComplianceProofPrivateStateId,
  type ComplianceProofProviders,
  type DeployedComplianceProofContract,
  type DocumentRegistryContract,
  type DocumentRegistryPrivateStateId,
  type DocumentRegistryProviders,
  type DeployedDocumentRegistryContract,
  type AccessControlContract,
  type AccessControlPrivateStateId,
  type AccessControlProviders,
  type DeployedAccessControlContract,
  type ExpertWitnessContract,
  type ExpertWitnessPrivateStateId,
  type ExpertWitnessProviders,
  type DeployedExpertWitnessContract,
} from './common-types';
import { type Config, contractConfig } from './config';
import {
  DiscoveryCore, type DiscoveryCorePrivateState, discoveryCoreWitnesses, createDiscoveryCorePrivateState,
  JurisdictionRegistry, type RegistryPrivateState, registryWitnesses, createRegistryPrivateState,
  ComplianceProof, type CompliancePrivateState, complianceWitnesses, createCompliancePrivateState,
  DocumentRegistry, type DocumentRegistryPrivateState, documentRegistryWitnesses, createDocumentRegistryPrivateState,
  AccessControl, type AccessControlPrivateState, accessControlWitnesses, createAccessControlPrivateState,
  ExpertWitness, type ExpertWitnessPrivateState, expertWitnessWitnesses, createExpertWitnessPrivateState,
} from '@autodiscovery/contract';

import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import * as ledger from '@midnight-ntwrk/ledger-v6';


import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { NodeZkConfigProvider } from '@midnight-ntwrk/midnight-js-node-zk-config-provider';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { assertIsContractAddress } from '@midnight-ntwrk/midnight-js-utils';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import {
  type FinalizedTxData,
  type MidnightProvider,
  type WalletProvider,
  type BalancedProvingRecipe,
} from '@midnight-ntwrk/midnight-js-types';

import {
  createKeystore,
  InMemoryTransactionHistoryStorage,
  PublicKey as UnshieldedPublicKey,
  type UnshieldedKeystore,
  UnshieldedWallet,
} from '@midnight-ntwrk/wallet-sdk-unshielded-wallet';
import { ShieldedWallet } from '@midnight-ntwrk/wallet-sdk-shielded';
import { DustWallet } from '@midnight-ntwrk/wallet-sdk-dust-wallet';
import { WalletFacade } from '@midnight-ntwrk/wallet-sdk-facade';
import { HDWallet, Roles } from '@midnight-ntwrk/wallet-sdk-hd';
import { mnemonicToSeed } from './test/utils/utils';

let logger: Logger;

// @ts-expect-error: It's needed to enable WebSocket usage through apollo
globalThis.WebSocket = WebSocket;

export function setLogger(_logger: Logger) {
  logger = _logger;
}

// Types for the new wallet
export interface WalletContext {
  wallet: WalletFacade;
  shieldedSecretKeys: ledger.ZswapSecretKeys;
  dustSecretKey: ledger.DustSecretKey;
  unshieldedKeystore: UnshieldedKeystore;
}

export const getDiscoveryCoreLedgerState = async (
  providers: DiscoveryCoreProviders,
  contractAddress: ContractAddress,
): Promise<bigint | null> => {
  assertIsContractAddress(contractAddress);
  logger.info('Checking contract ledger state...');
  const state = await providers.publicDataProvider
    .queryContractState(contractAddress)
    .then((contractState) => (contractState != null ? DiscoveryCore.ledger(contractState.data).totalCasesCreated : null));
  logger.info(`Ledger state - totalCasesCreated: ${state}`);
  return state;
};

export const discoveryCoreContractInstance: DiscoveryCoreContract = new DiscoveryCore.Contract(discoveryCoreWitnesses);

export const joinContract = async (
  providers: DiscoveryCoreProviders,
  contractAddress: string,
): Promise<DeployedDiscoveryCoreContract> => {
  const discoveryCoreContract = await findDeployedContract(providers, {
    contractAddress,
    contract: discoveryCoreContractInstance,
    privateStateId: 'discoveryCorePrivateState',
    initialPrivateState: createDiscoveryCorePrivateState(),
  });
  logger.info(`Joined contract at address: ${discoveryCoreContract.deployTxData.public.contractAddress}`);
  return discoveryCoreContract;
};

export const deploy = async (
  providers: DiscoveryCoreProviders,
  privateState: DiscoveryCorePrivateState,
): Promise<DeployedDiscoveryCoreContract> => {
  logger.info('Deploying discovery-core contract...');
  const discoveryCoreContract = await deployContract(providers, {
    contract: discoveryCoreContractInstance,
    privateStateId: 'discoveryCorePrivateState',
    initialPrivateState: privateState,
  });
  logger.info(`Deployed contract at address: ${discoveryCoreContract.deployTxData.public.contractAddress}`);
  return discoveryCoreContract;
};

const logFinalizedTxData = (finalizedTxData: FinalizedTxData): void => {
  logger.info({
    section: 'PUBLIC',
    tx: finalizedTxData.public.tx,
    txHash: finalizedTxData.public.txHash,
    txId: finalizedTxData.public.txId,
    blockHeight: finalizedTxData.public.blockHeight,
    blockHash: finalizedTxData.public.blockHash,
    blockAuthority: finalizedTxData.public.blockAuthor,
    blockTimestamp: finalizedTxData.public.blockTimestamp,
    fees: finalizedTxData.public.fees,
    nextContractState: finalizedTxData.public.nextContractState,
    publicTranscript: finalizedTxData.public.publicTranscript,
    status: finalizedTxData.public.status,
    identifiers: finalizedTxData.public.identifiers,
    indexerId: finalizedTxData.public.indexerId,
    protocolVersion: finalizedTxData.public.protocolVersion,
    segmentStatusMap: finalizedTxData.public.segmentStatusMap,
    unshielded: finalizedTxData.public.unshielded,
  });

  logger.info({
    section: 'Guaranteed-Effects',
    claimedContractCalls: finalizedTxData.public.partitionedTranscript[0]?.effects.claimedContractCalls,
    claimedNullifiers: finalizedTxData.public.partitionedTranscript[0]?.effects.claimedNullifiers,
    claimedShieldedReceives: finalizedTxData.public.partitionedTranscript[0]?.effects.claimedShieldedReceives,
    claimedShieldedSpends: finalizedTxData.public.partitionedTranscript[0]?.effects.claimedShieldedSpends,
    claimedUnshieldedSpends: finalizedTxData.public.partitionedTranscript[0]?.effects.claimedUnshieldedSpends,
    shieldedMints: finalizedTxData.public.partitionedTranscript[0]?.effects.shieldedMints,
    unshieldedInputs: finalizedTxData.public.partitionedTranscript[0]?.effects.unshieldedInputs,
    unshieldedMints: finalizedTxData.public.partitionedTranscript[0]?.effects.unshieldedMints,
    unshieldedOutputs: finalizedTxData.public.partitionedTranscript[0]?.effects.unshieldedOutputs,
    gas: finalizedTxData.public.partitionedTranscript[0]?.gas,
    program: finalizedTxData.public.partitionedTranscript[0]?.program,
  });

  logger.info({
    section: 'Fallible-Effects',
    claimedContractCalls: finalizedTxData.public.partitionedTranscript[1]?.effects.claimedContractCalls,
    claimedNullifiers: finalizedTxData.public.partitionedTranscript[1]?.effects.claimedNullifiers,
    claimedShieldedReceives: finalizedTxData.public.partitionedTranscript[1]?.effects.claimedShieldedReceives,
    claimedShieldedSpends: finalizedTxData.public.partitionedTranscript[1]?.effects.claimedShieldedSpends,
    claimedUnshieldedSpends: finalizedTxData.public.partitionedTranscript[1]?.effects.claimedUnshieldedSpends,
    shieldedMints: finalizedTxData.public.partitionedTranscript[1]?.effects.shieldedMints,
    unshieldedInputs: finalizedTxData.public.partitionedTranscript[1]?.effects.unshieldedInputs,
    unshieldedMints: finalizedTxData.public.partitionedTranscript[1]?.effects.unshieldedMints,
    unshieldedOutputs: finalizedTxData.public.partitionedTranscript[1]?.effects.unshieldedOutputs,
    gas: finalizedTxData.public.partitionedTranscript[1]?.gas,
    program: finalizedTxData.public.partitionedTranscript[1]?.program,
  });

  logger.info({
    section: 'Private Section',
    Inputs: finalizedTxData.private.input,
    newCoins: finalizedTxData.private.newCoins,
    nextPrivateState: finalizedTxData.private.nextPrivateState,
    nextZswapLocalState: finalizedTxData.private.nextZswapLocalState,
    Output: finalizedTxData.private.output,
    privateTranscriptOutputs: finalizedTxData.private.privateTranscriptOutputs,
    result: finalizedTxData.private.result,
    unprovenTx: finalizedTxData.private.unprovenTx,
  });
};

export const createNewCase = async (
  discoveryCoreContract: DeployedDiscoveryCoreContract,
  caseNumber: Uint8Array,
  jurisdictionCode: Uint8Array,
): Promise<FinalizedTxData> => {
  logger.info('Creating new case...');
  const finalizedTxData = await discoveryCoreContract.callTx.createNewCase(caseNumber, jurisdictionCode);
  logFinalizedTxData(finalizedTxData);
  return finalizedTxData.public;
};

export const addDiscoveryStepToCase = async (
  discoveryCoreContract: DeployedDiscoveryCoreContract,
  caseId: bigint,
  ruleRef: Uint8Array,
  deadline: bigint,
): Promise<FinalizedTxData> => {
  logger.info('Adding discovery step to case...');
  const finalizedTxData = await discoveryCoreContract.callTx.addDiscoveryStepToCase(caseId, ruleRef, deadline);
  logFinalizedTxData(finalizedTxData);
  return finalizedTxData.public;
};

export const markDiscoveryStepAsCompleted = async (
  discoveryCoreContract: DeployedDiscoveryCoreContract,
  caseId: bigint,
  stepHash: bigint,
): Promise<FinalizedTxData> => {
  logger.info('Marking discovery step as completed...');
  const finalizedTxData = await discoveryCoreContract.callTx.markDiscoveryStepAsCompleted(caseId, stepHash);
  logFinalizedTxData(finalizedTxData);
  return finalizedTxData.public;
};

export const displayCaseStatus = async (
  providers: DiscoveryCoreProviders,
  discoveryCoreContract: DeployedDiscoveryCoreContract,
): Promise<{ totalCasesCreated: bigint | null; contractAddress: string }> => {
  const contractAddress = discoveryCoreContract.deployTxData.public.contractAddress;
  const totalCasesCreated = await getDiscoveryCoreLedgerState(providers, contractAddress);
  if (totalCasesCreated === null) {
    logger.info(`There is no discovery-core contract deployed at ${contractAddress}.`);
  } else {
    logger.info(`Total cases created: ${Number(totalCasesCreated)}`);
  }
  return { contractAddress, totalCasesCreated };
};

// =============================================================================
// JURISDICTION REGISTRY
// =============================================================================

export const jurisdictionRegistryContractInstance: JurisdictionRegistryContract =
  new JurisdictionRegistry.Contract(registryWitnesses);

export const deployJurisdictionRegistry = async (
  providers: JurisdictionRegistryProviders,
  privateState: RegistryPrivateState,
): Promise<DeployedJurisdictionRegistryContract> => {
  logger.info('Deploying jurisdiction-registry contract...');
  const contract = await deployContract(providers, {
    contract: jurisdictionRegistryContractInstance,
    privateStateId: 'jurisdictionRegistryPrivateState',
    initialPrivateState: privateState,
  });
  logger.info(`Deployed jurisdiction-registry at: ${contract.deployTxData.public.contractAddress}`);
  return contract;
};

export const joinJurisdictionRegistry = async (
  providers: JurisdictionRegistryProviders,
  contractAddress: string,
): Promise<DeployedJurisdictionRegistryContract> => {
  const contract = await findDeployedContract(providers, {
    contractAddress,
    contract: jurisdictionRegistryContractInstance,
    privateStateId: 'jurisdictionRegistryPrivateState',
    initialPrivateState: createRegistryPrivateState(),
  });
  logger.info(`Joined jurisdiction-registry at: ${contract.deployTxData.public.contractAddress}`);
  return contract;
};

export const registerNewJurisdiction = async (
  jurisdictionRegistryContract: DeployedJurisdictionRegistryContract,
  jurisdictionCode: Uint8Array,
  rulePackContentHash: Uint8Array,
): Promise<FinalizedTxData> => {
  logger.info('Registering new jurisdiction...');
  const finalizedTxData = await jurisdictionRegistryContract.callTx.registerNewJurisdiction(
    jurisdictionCode,
    rulePackContentHash,
  );
  logFinalizedTxData(finalizedTxData);
  return finalizedTxData.public;
};

export const updateJurisdictionRulePack = async (
  jurisdictionRegistryContract: DeployedJurisdictionRegistryContract,
  jurisdictionCode: Uint8Array,
  updatedRulePackContentHash: Uint8Array,
  updatedVersionNumber: bigint,
): Promise<FinalizedTxData> => {
  logger.info('Updating jurisdiction rule pack...');
  const finalizedTxData = await jurisdictionRegistryContract.callTx.updateJurisdictionRulePack(
    jurisdictionCode,
    updatedRulePackContentHash,
    updatedVersionNumber,
  );
  logFinalizedTxData(finalizedTxData);
  return finalizedTxData.public;
};

// =============================================================================
// COMPLIANCE PROOF
// =============================================================================

export const complianceProofContractInstance: ComplianceProofContract =
  new ComplianceProof.Contract(complianceWitnesses);

export const deployComplianceProof = async (
  providers: ComplianceProofProviders,
  privateState: CompliancePrivateState,
): Promise<DeployedComplianceProofContract> => {
  logger.info('Deploying compliance-proof contract...');
  const contract = await deployContract(providers, {
    contract: complianceProofContractInstance,
    privateStateId: 'complianceProofPrivateState',
    initialPrivateState: privateState,
  });
  logger.info(`Deployed compliance-proof at: ${contract.deployTxData.public.contractAddress}`);
  return contract;
};

export const joinComplianceProof = async (
  providers: ComplianceProofProviders,
  contractAddress: string,
): Promise<DeployedComplianceProofContract> => {
  const contract = await findDeployedContract(providers, {
    contractAddress,
    contract: complianceProofContractInstance,
    privateStateId: 'complianceProofPrivateState',
    initialPrivateState: createCompliancePrivateState(),
  });
  logger.info(`Joined compliance-proof at: ${contract.deployTxData.public.contractAddress}`);
  return contract;
};

export const attestStepLevelCompliance = async (
  complianceProofContract: DeployedComplianceProofContract,
  caseIdentifier: bigint,
  stepHash: bigint,
  deadline: bigint,
): Promise<FinalizedTxData> => {
  logger.info('Attesting step-level compliance...');
  const finalizedTxData = await complianceProofContract.callTx.attestStepLevelCompliance(
    caseIdentifier,
    stepHash,
    deadline,
  );
  logFinalizedTxData(finalizedTxData);
  return finalizedTxData.public;
};

export const attestCaseLevelCompliance = async (
  complianceProofContract: DeployedComplianceProofContract,
  caseIdentifier: bigint,
): Promise<FinalizedTxData> => {
  logger.info('Attesting case-level compliance...');
  const finalizedTxData = await complianceProofContract.callTx.attestCaseLevelCompliance(
    caseIdentifier,
  );
  logFinalizedTxData(finalizedTxData);
  return finalizedTxData.public;
};

// =============================================================================
// DOCUMENT REGISTRY
// =============================================================================

export const documentRegistryContractInstance: DocumentRegistryContract =
  new DocumentRegistry.Contract(documentRegistryWitnesses);

export const deployDocumentRegistry = async (
  providers: DocumentRegistryProviders,
  privateState: DocumentRegistryPrivateState,
): Promise<DeployedDocumentRegistryContract> => {
  logger.info('Deploying document-registry contract...');
  const contract = await deployContract(providers, {
    contract: documentRegistryContractInstance,
    privateStateId: 'documentRegistryPrivateState',
    initialPrivateState: privateState,
  });
  logger.info(`Deployed document-registry at: ${contract.deployTxData.public.contractAddress}`);
  return contract;
};

export const joinDocumentRegistry = async (
  providers: DocumentRegistryProviders,
  contractAddress: string,
): Promise<DeployedDocumentRegistryContract> => {
  const contract = await findDeployedContract(providers, {
    contractAddress,
    contract: documentRegistryContractInstance,
    privateStateId: 'documentRegistryPrivateState',
    initialPrivateState: createDocumentRegistryPrivateState(),
  });
  logger.info(`Joined document-registry at: ${contract.deployTxData.public.contractAddress}`);
  return contract;
};

export const registerDocument = async (
  documentRegistryContract: DeployedDocumentRegistryContract,
  documentContentHash: Uint8Array,
  documentCategoryNumber: bigint,
  originatorPublicKey: Uint8Array,
): Promise<FinalizedTxData> => {
  logger.info('Registering document...');
  const finalizedTxData = await documentRegistryContract.callTx.registerDocument(
    documentContentHash,
    documentCategoryNumber,
    originatorPublicKey,
  );
  logFinalizedTxData(finalizedTxData);
  return finalizedTxData.public;
};

export const registerTwinBond = async (
  documentRegistryContract: DeployedDocumentRegistryContract,
  imageTwinContentHash: Uint8Array,
  digitalTwinContentHash: Uint8Array,
  ocrFidelityScorePercent: bigint,
): Promise<FinalizedTxData> => {
  logger.info('Registering twin bond...');
  const finalizedTxData = await documentRegistryContract.callTx.registerTwinBond(
    imageTwinContentHash,
    digitalTwinContentHash,
    ocrFidelityScorePercent,
  );
  logFinalizedTxData(finalizedTxData);
  return finalizedTxData.public;
};

// =============================================================================
// ACCESS CONTROL
// =============================================================================

export const accessControlContractInstance: AccessControlContract =
  new AccessControl.Contract(accessControlWitnesses);

export const deployAccessControl = async (
  providers: AccessControlProviders,
  privateState: AccessControlPrivateState,
): Promise<DeployedAccessControlContract> => {
  logger.info('Deploying access-control contract...');
  const contract = await deployContract(providers, {
    contract: accessControlContractInstance,
    privateStateId: 'accessControlPrivateState',
    initialPrivateState: privateState,
  });
  logger.info(`Deployed access-control at: ${contract.deployTxData.public.contractAddress}`);
  return contract;
};

export const joinAccessControl = async (
  providers: AccessControlProviders,
  contractAddress: string,
): Promise<DeployedAccessControlContract> => {
  const contract = await findDeployedContract(providers, {
    contractAddress,
    contract: accessControlContractInstance,
    privateStateId: 'accessControlPrivateState',
    initialPrivateState: createAccessControlPrivateState(),
  });
  logger.info(`Joined access-control at: ${contract.deployTxData.public.contractAddress}`);
  return contract;
};

export const registerParticipantKey = async (
  accessControlContract: DeployedAccessControlContract,
  participantPublicKeyHash: Uint8Array,
  roleEnum: bigint,
): Promise<FinalizedTxData> => {
  logger.info('Registering participant key...');
  const finalizedTxData = await accessControlContract.callTx.registerParticipantKey(
    participantPublicKeyHash,
    roleEnum,
  );
  logFinalizedTxData(finalizedTxData);
  return finalizedTxData.public;
};

export const grantDocumentAccessToParticipant = async (
  accessControlContract: DeployedAccessControlContract,
  documentHash: Uint8Array,
  participantPublicKeyHash: Uint8Array,
  protectiveOrderTierEnum: bigint,
): Promise<FinalizedTxData> => {
  logger.info('Granting document access to participant...');
  const finalizedTxData = await accessControlContract.callTx.grantDocumentAccessToParticipant(
    documentHash,
    participantPublicKeyHash,
    protectiveOrderTierEnum,
  );
  logFinalizedTxData(finalizedTxData);
  return finalizedTxData.public;
};

// =============================================================================
// EXPERT WITNESS
// =============================================================================

export const expertWitnessContractInstance: ExpertWitnessContract =
  new ExpertWitness.Contract(expertWitnessWitnesses);

export const deployExpertWitness = async (
  providers: ExpertWitnessProviders,
  privateState: ExpertWitnessPrivateState,
): Promise<DeployedExpertWitnessContract> => {
  logger.info('Deploying expert-witness contract...');
  const contract = await deployContract(providers, {
    contract: expertWitnessContractInstance,
    privateStateId: 'expertWitnessPrivateState',
    initialPrivateState: privateState,
  });
  logger.info(`Deployed expert-witness at: ${contract.deployTxData.public.contractAddress}`);
  return contract;
};

export const joinExpertWitness = async (
  providers: ExpertWitnessProviders,
  contractAddress: string,
): Promise<DeployedExpertWitnessContract> => {
  const contract = await findDeployedContract(providers, {
    contractAddress,
    contract: expertWitnessContractInstance,
    privateStateId: 'expertWitnessPrivateState',
    initialPrivateState: createExpertWitnessPrivateState(),
  });
  logger.info(`Joined expert-witness at: ${contract.deployTxData.public.contractAddress}`);
  return contract;
};

export const registerExpertWitness = async (
  expertWitnessContract: DeployedExpertWitnessContract,
  expertQualificationProofHash: Uint8Array,
): Promise<FinalizedTxData> => {
  logger.info('Registering expert witness...');
  const finalizedTxData = await expertWitnessContract.callTx.registerExpertWitness(
    expertQualificationProofHash,
  );
  logFinalizedTxData(finalizedTxData);
  return finalizedTxData.public;
};

export const createWalletAndMidnightProvider = async (
  walletContext: WalletContext,
): Promise<WalletProvider & MidnightProvider> => {
  const state = await Rx.firstValueFrom(walletContext.wallet.state().pipe(Rx.filter((s) => s.isSynced)));
  logger.info({
    section: 'DUST Wallet State',
    dust: state.dust,
  });
   logger.info({
    section: 'Shielded Wallet State',
    shielded: state.shielded,
  });
   logger.info({
    section: 'Unshielded Wallet State',
    unshielded: state.unshielded,
  });
  return {
    getCoinPublicKey(): ledger.CoinPublicKey {
      return walletContext.shieldedSecretKeys.coinPublicKey as unknown as ledger.CoinPublicKey;
    },
    getEncryptionPublicKey(): ledger.EncPublicKey {
      return walletContext.shieldedSecretKeys.encryptionPublicKey as unknown as ledger.EncPublicKey;
    },
    async balanceTx(
      tx: ledger.UnprovenTransaction,
      newCoins?: ledger.ShieldedCoinInfo[],
      ttl?: Date,
    ): Promise<BalancedProvingRecipe> {
      // Use the wallet facade to balance the transaction
      const txTtl = ttl ?? new Date(Date.now() + 30 * 60 * 1000); // 30 min default TTL
      // balanceTransaction returns a ProvingRecipe directly
      const provingRecipe = await walletContext.wallet.balanceTransaction(
        walletContext.shieldedSecretKeys,
        walletContext.dustSecretKey,
        tx as unknown as ledger.Transaction<ledger.SignatureEnabled, ledger.Proofish, ledger.Bindingish>,
        txTtl,
      );
      return provingRecipe as unknown as BalancedProvingRecipe;
    },
    async submitTx(tx: ledger.FinalizedTransaction): Promise<ledger.TransactionId> {
      return await walletContext.wallet.submitTransaction(tx);
    },
  };
};

export const waitForSync = (wallet: WalletFacade) =>
  Rx.firstValueFrom(
    wallet.state().pipe(
      Rx.throttleTime(5_000),
      Rx.tap((state) => {
        logger.info(`Waiting for wallet sync. Synced: ${state.isSynced}`);
      }),
      Rx.filter((state) => state.isSynced),
    ),
  );

export const waitForFunds = (wallet: WalletFacade) =>
  Rx.firstValueFrom(
    wallet.state().pipe(
      Rx.throttleTime(10_000),
      Rx.tap((state) => {
        const unshielded = state.unshielded?.balances[ledger.nativeToken().raw] ?? 0n;
        const shielded = state.shielded?.balances[ledger.nativeToken().raw] ?? 0n;
        logger.info(`Waiting for funds. Synced: ${state.isSynced}, Unshielded: ${unshielded}, Shielded: ${shielded}`);
      }),
      Rx.filter((state) => state.isSynced),
      Rx.map(
        (s) =>
          (s.unshielded?.balances[ledger.nativeToken().raw] ?? 0n) +
          (s.shielded?.balances[ledger.nativeToken().raw] ?? 0n),
      ),
      Rx.filter((balance) => balance > 0n),
    ),
  );

/**
 * Display wallet balances (unshielded, shielded, total)
 */
export const displayWalletBalances = async (
  wallet: WalletFacade,
): Promise<{ unshielded: any; shielded: bigint; total: bigint }> => {
  const state = await Rx.firstValueFrom(wallet.state());
  const unshielded = state.unshielded?.balances[ledger.nativeToken().raw] ?? 0n; 
  const shielded = state.shielded?.balances[ledger.nativeToken().raw] ?? 0n;
  const total = unshielded + shielded;

  logger.info(`Unshielded balance: ${unshielded} tSTAR`);
  logger.info(`Shielded balance: ${shielded} tSTAR`);
  logger.info(`Total balance: ${total} tSTAR`);

  return { unshielded, shielded, total };
};

/**
 * Register unshielded Night UTXOs for dust generation
 * This is required before the wallet can pay transaction fees
 */
export const registerNightForDust = async (walletContext: WalletContext): Promise<boolean> => {
  const state = await Rx.firstValueFrom(walletContext.wallet.state().pipe(Rx.filter((s) => s.isSynced)));

  // Check if we have unshielded coins that are not registered for dust generation
  const unregisteredNightUtxos =
    state.unshielded?.availableCoins.filter((coin) => coin.meta.registeredForDustGeneration === false) ?? [];

  if (unregisteredNightUtxos.length === 0) {
    logger.info('No unshielded Night UTXOs available for dust registration, or all are already registered');

    // Check current dust balance
    const dustBalance = state.dust?.walletBalance(new Date()) ?? 0n;
    logger.info(`Current dust balance: ${dustBalance}`);

    return dustBalance > 0n;
  }

  logger.info(`Found ${unregisteredNightUtxos.length} unshielded Night UTXOs not registered for dust generation`);
  logger.info('Registering Night UTXOs for dust generation...');

  try {
    const recipe = await walletContext.wallet.registerNightUtxosForDustGeneration(
      unregisteredNightUtxos,
      walletContext.unshieldedKeystore.getPublicKey(),
      (payload) => walletContext.unshieldedKeystore.signData(payload)
    );

    logger.info('Finalizing dust registration transaction...');
    const finalizedTx = await walletContext.wallet.finalizeTransaction(recipe);

    logger.info('Submitting dust registration transaction...');
    const txId = await walletContext.wallet.submitTransaction(finalizedTx);
    logger.info(`Dust registration submitted with tx id: ${txId}`);

    // Wait for dust to be available
    logger.info('Waiting for dust to be generated...');
    await Rx.firstValueFrom(
      walletContext.wallet.state().pipe(
        Rx.throttleTime(5_000),
        Rx.tap((s) => {
          const dustBalance = s.dust?.walletBalance(new Date()) ?? 0n;
          logger.info(`Dust balance: ${dustBalance}`);
        }),
        Rx.filter((s) => (s.dust?.walletBalance(new Date()) ?? 0n) > 0n),
      ),
    );

    logger.info('Dust registration complete!');
    return true;
  } catch (e) {
    logger.error(`Failed to register Night UTXOs for dust: ${e}`);
    return false;
  }
};

/**
 * Initialize wallet with seed using the new wallet SDK
 */
export const initWalletWithSeed = async (
  seed: Buffer,
  config: Config,
): Promise<WalletContext> => {
  const hdWallet = HDWallet.fromSeed(seed);

  if (hdWallet.type !== 'seedOk') {
    throw new Error('Failed to initialize HDWallet');
  }

  const derivationResult = hdWallet.hdWallet
    .selectAccount(0)
    .selectRoles([Roles.Zswap, Roles.NightExternal, Roles.Dust])
    .deriveKeysAt(0);

  if (derivationResult.type !== 'keysDerived') {
    throw new Error('Failed to derive keys');
  }

  hdWallet.hdWallet.clear();

  const shieldedSecretKeys = ledger.ZswapSecretKeys.fromSeed(derivationResult.keys[Roles.Zswap]);
  const dustSecretKey = ledger.DustSecretKey.fromSeed(derivationResult.keys[Roles.Dust]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const unshieldedKeystore = createKeystore(derivationResult.keys[Roles.NightExternal], config.networkId as any);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const walletConfiguration: any = {
    networkId: config.networkId,
    costParameters: {
      additionalFeeOverhead: 300_000_000_000_000n, // 300 trillion - matches SDK examples
      feeBlocksMargin: 5,
    },
    relayURL: new URL(config.node),
    provingServerUrl: new URL(config.proofServer),
    indexerClientConnection: {
      indexerHttpUrl: config.indexer,
      indexerWsUrl: config.indexerWS,
    },
    indexerUrl: config.indexerWS,
  };

  const shieldedWallet = ShieldedWallet(walletConfiguration).startWithSecretKeys(shieldedSecretKeys);
  const dustWallet = DustWallet(walletConfiguration).startWithSecretKey(
    dustSecretKey,
    ledger.LedgerParameters.initialParameters().dust,
  );
  const unshieldedWallet = UnshieldedWallet({
    ...walletConfiguration,
    txHistoryStorage: new InMemoryTransactionHistoryStorage(),
  }).startWithPublicKey(UnshieldedPublicKey.fromKeyStore(unshieldedKeystore));

  const facade: WalletFacade = new WalletFacade(shieldedWallet, unshieldedWallet, dustWallet);
  await facade.start(shieldedSecretKeys, dustSecretKey);

  return { wallet: facade, shieldedSecretKeys, dustSecretKey, unshieldedKeystore };
};

/**
 * Build wallet from mnemonic and wait for funds
 */
export const buildWalletAndWaitForFunds = async (
  config: Config,
  mnemonic: string,
): Promise<WalletContext> => {
  logger.info('Building wallet from mnemonic...');

  const seed = await mnemonicToSeed(mnemonic);
  const walletContext = await initWalletWithSeed(seed, config);

  logger.info(`Your wallet address: ${walletContext.unshieldedKeystore.getBech32Address().asString()}`);

  // Wait for sync first
  logger.info('Waiting for wallet to sync...');
  await waitForSync(walletContext.wallet);

  // Display and check balance
  const { total } = await displayWalletBalances(walletContext.wallet);

  if (total === 0n) {
    logger.info('Waiting to receive tokens...');
    await waitForFunds(walletContext.wallet);
    await displayWalletBalances(walletContext.wallet);
  }

  // Register Night UTXOs for dust generation (required for paying fees)
  await registerNightForDust(walletContext);

  return walletContext;
};

/**
 * Generate a fresh wallet with random mnemonic
 */
export const buildFreshWallet = async (config: Config): Promise<WalletContext> => {
  const mnemonic = bip39.generateMnemonic(english, 256);
  logger.info(`Generated new wallet mnemonic: ${mnemonic}`);
  return await buildWalletAndWaitForFunds(config, mnemonic);
};

/**
 * Build wallet from hex seed (for backwards compatibility with genesis wallet)
 */
export const buildWalletFromHexSeed = async (
  config: Config,
  hexSeed: string,
): Promise<WalletContext> => {
  logger.info('Building wallet from hex seed...');
  const seed = Buffer.from(hexSeed, 'hex');
  const walletContext = await initWalletWithSeed(seed, config);

  logger.info(`Your wallet address: ${walletContext.unshieldedKeystore.getBech32Address().asString()}`);

  // Wait for sync first
  logger.info('Waiting for wallet to sync...');
  await waitForSync(walletContext.wallet);

  // Display and check balance
  const { total } = await displayWalletBalances(walletContext.wallet);

  if (total === 0n) {
    logger.info('Waiting to receive tokens...');
    await waitForFunds(walletContext.wallet);
    await displayWalletBalances(walletContext.wallet);
  }

  // Register Night UTXOs for dust generation (required for paying fees)
  await registerNightForDust(walletContext);

  return walletContext;
};

export const configureProviders = async (walletContext: WalletContext, config: Config) => {
  // Set global network ID - required before contract deployment
  setNetworkId(config.networkId);

  const walletAndMidnightProvider = await createWalletAndMidnightProvider(walletContext);
  return {
    //AES-256-GCM + PBKDF2
    // WalletProvider for encryption uses Encryption Public Key (EPK)
    privateStateProvider: levelPrivateStateProvider<typeof DiscoveryCorePrivateStateId>({
      privateStateStoreName: contractConfig.privateStateStoreName,      
      signingKeyStoreName: "signing-keys",
      midnightDbName: "midnight-level-db",
      // walletProvider: walletAndMidnightProvider,
      privateStoragePasswordProvider: () => "1234567890123456"
    }),
    publicDataProvider: indexerPublicDataProvider(config.indexer, config.indexerWS),
    zkConfigProvider: new NodeZkConfigProvider<'createNewCase' | 'addDiscoveryStepToCase' | 'markDiscoveryStepAsCompleted' | 'checkCaseComplianceStatus'>(contractConfig.zkConfigPath),
    proofProvider: httpClientProofProvider(config.proofServer),
    walletProvider: walletAndMidnightProvider,
    midnightProvider: walletAndMidnightProvider,
  };
};

export const closeWallet = async (walletContext: WalletContext): Promise<void> => {
  try {
    await walletContext.wallet.stop();
  } catch (e) {
    logger.error(`Error closing wallet: ${e}`);
  }
};
