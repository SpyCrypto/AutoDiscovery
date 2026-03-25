import { stdin as input, stdout as output } from 'node:process';
import { createInterface, type Interface } from 'node:readline/promises';
import { type Logger } from 'pino';
import { type StartedDockerComposeEnvironment, type DockerComposeEnvironment } from 'testcontainers';
import { type DiscoveryCoreProviders, type DeployedDiscoveryCoreContract } from './common-types';
import { type Config, UndeployedConfig } from './config';
import * as api from './api';
import type { WalletContext } from './api';
import { createDiscoveryCorePrivateState } from '@autodiscovery/contract';
import 'dotenv/config';

let logger: Logger;

/**
 * This seed gives access to tokens minted in the genesis block of a local development node - only
 * used in standalone networks to build a wallet with initial funds.
 */
const GENESIS_MINT_WALLET_SEED = '0000000000000000000000000000000000000000000000000000000000000001';

const DEPLOY_OR_JOIN_QUESTION = `
You can do one of the following:
  1. Deploy a new discovery-core contract
  2. Join an existing discovery-core contract
  3. Exit
Which would you like to do? `;

const MAIN_LOOP_QUESTION = `
You can do one of the following:
  1. Create a new case
  2. Add a discovery step to a case
  3. Mark a discovery step as completed
  4. Display case status
  5. Exit
Which would you like to do? `;

const join = async (providers: DiscoveryCoreProviders, rli: Interface): Promise<DeployedDiscoveryCoreContract> => {
  const contractAddress = await rli.question('What is the contract address (in hex)? ');
  return await api.joinContract(providers, contractAddress);
};

const deployOrJoin = async (providers: DiscoveryCoreProviders, rli: Interface): Promise<DeployedDiscoveryCoreContract | null> => {
  while (true) {
    const choice = await rli.question(DEPLOY_OR_JOIN_QUESTION);
    switch (choice) {
      case '1':
        return await api.deploy(providers, createDiscoveryCorePrivateState());
      case '2':
        return await join(providers, rli);
      case '3':
        logger.info('Exiting...');
        return null;
      default:
        logger.error(`Invalid choice: ${choice}`);
    }
  }
};

const mainLoop = async (providers: DiscoveryCoreProviders, rli: Interface): Promise<void> => {
  const discoveryCoreContract = await deployOrJoin(providers, rli);
  if (discoveryCoreContract === null) {
    return;
  }
  while (true) {
    const choice = await rli.question(MAIN_LOOP_QUESTION);
    switch (choice) {
      case '1': {
        const caseNumberHex = await rli.question('Enter case number (hex string, 32 bytes): ');
        const jurisdictionCodeHex = await rli.question('Enter jurisdiction code (hex string, 8 bytes): ');
        const caseNumber = Buffer.from(caseNumberHex.replace(/^0x/, ''), 'hex');
        const jurisdictionCode = Buffer.from(jurisdictionCodeHex.replace(/^0x/, ''), 'hex');
        await api.createNewCase(discoveryCoreContract, caseNumber, jurisdictionCode);
        break;
      }
      case '2': {
        const caseIdStr = await rli.question('Enter case ID (bigint as decimal): ');
        const ruleRefHex = await rli.question('Enter rule reference (hex string, 32 bytes): ');
        const deadlineStr = await rli.question('Enter step deadline timestamp (Unix seconds): ');
        const caseId = BigInt(caseIdStr);
        const ruleRef = Buffer.from(ruleRefHex.replace(/^0x/, ''), 'hex');
        const deadline = BigInt(deadlineStr);
        await api.addDiscoveryStepToCase(discoveryCoreContract, caseId, ruleRef, deadline);
        break;
      }
      case '3': {
        const caseIdStr = await rli.question('Enter case ID (bigint as decimal): ');
        const stepHashStr = await rli.question('Enter step hash (bigint as decimal): ');
        const caseId = BigInt(caseIdStr);
        const stepHash = BigInt(stepHashStr);
        await api.markDiscoveryStepAsCompleted(discoveryCoreContract, caseId, stepHash);
        break;
      }
      case '4':
        await api.displayCaseStatus(providers, discoveryCoreContract);
        break;
      case '5':
        logger.info('Exiting...');
        return;
      default:
        logger.error(`Invalid choice: ${choice}`);
    }
  }
};

const buildWalletFromMnemonic = async (config: Config, rli: Interface): Promise<WalletContext> => {
  const mnemonic = await rli.question('Enter your wallet mnemonic (24 words): ');
  return await api.buildWalletAndWaitForFunds(config, mnemonic);
};

const WALLET_LOOP_QUESTION = `
You can do one of the following:
  1. Build a fresh wallet
  2. Build wallet from a mnemonic
  3. Use mnemonic from .env file
  4. Exit
Which would you like to do? `;

const buildWallet = async (config: Config, rli: Interface): Promise<WalletContext | null> => {
  if (config instanceof UndeployedConfig) {
    // For standalone, use genesis wallet with hex seed
    return await api.buildWalletFromHexSeed(config, GENESIS_MINT_WALLET_SEED);
  }

  // Check if mnemonic is available in environment
  const envMnemonic = process.env.MY_PREVIEW_MNEMONIC;

  while (true) {
    const choice = await rli.question(WALLET_LOOP_QUESTION);
    switch (choice) {
      case '1':
        return await api.buildFreshWallet(config);
      case '2':
        return await buildWalletFromMnemonic(config, rli);
      case '3':
        if (envMnemonic) {
          logger.info('Using mnemonic from .env file...');
          return await api.buildWalletAndWaitForFunds(config, envMnemonic);
        } else {
          logger.error('No WALLET_MNEMONIC found in .env file');
        }
        break;
      case '4':
        logger.info('Exiting...');
        return null;
      default:
        logger.error(`Invalid choice: ${choice}`);
    }
  }
};

const mapContainerPort = (env: StartedDockerComposeEnvironment, url: string, containerName: string) => {
  const mappedUrl = new URL(url);
  const container = env.getContainer(containerName);

  mappedUrl.port = String(container.getFirstMappedPort());

  return mappedUrl.toString().replace(/\/+$/, '');
};

export const run = async (config: Config, _logger: Logger, dockerEnv?: DockerComposeEnvironment): Promise<void> => {
  logger = _logger;
  api.setLogger(_logger);
  const rli = createInterface({ input, output, terminal: true });
  let env;
  let walletContext: WalletContext | null = null;

  if (dockerEnv !== undefined) {
    env = await dockerEnv.up();

    if (config instanceof UndeployedConfig) {
      config.indexer = mapContainerPort(env, config.indexer, 'autodiscovery-indexer');
      config.indexerWS = mapContainerPort(env, config.indexerWS, 'autodiscovery-indexer');
      config.node = mapContainerPort(env, config.node, 'autodiscovery-node');
      config.proofServer = mapContainerPort(env, config.proofServer, 'autodiscovery-proof-server');
    }
  }

  try {
    walletContext = await buildWallet(config, rli);
    if (walletContext !== null) {
      const providers = await api.configureProviders(walletContext, config);
      await mainLoop(providers, rli);
    }
  } catch (e) {
    if (e instanceof Error) {
      logger.error(`Found error '${e.message}'`);
      logger.info('Exiting...');
      logger.debug(`${e.stack}`);
    } else {
      throw e;
    }
  } finally {
    try {
      rli.close();
      rli.removeAllListeners();
    } catch (e) {
      logger.error(`Error closing readline interface: ${e}`);
    } finally {
      try {
        if (walletContext !== null) {
          await api.closeWallet(walletContext);
        }
      } catch (e) {
        logger.error(`Error closing wallet: ${e}`);
      } finally {
        try {
          if (env !== undefined) {
            await env.down();
            logger.info('Goodbye');
          }
        } catch (e) {
          logger.error(`Error shutting down docker environment: ${e}`);
        }
      }
    }
  }
};
