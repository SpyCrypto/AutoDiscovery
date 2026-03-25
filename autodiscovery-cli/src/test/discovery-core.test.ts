import path from 'path';
import * as api from '../api';
import { type DiscoveryCoreProviders } from '../common-types';
import { currentDir } from '../config';
import { createLogger } from '../logger';
import { TestEnvironment } from './simulators/simulator';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import 'dotenv/config';
import * as Rx from 'rxjs';
import { createDiscoveryCorePrivateState } from '@autodiscovery/contract';

let logDir: string;
const network = process.env.TEST_ENV || 'undeployed';
if (network === 'undeployed') {
  logDir = path.resolve(currentDir, '..', 'logs', 'test-undeployed', `${new Date().toISOString()}.log`);
} else {
  logDir = path.resolve(currentDir, '..', 'logs', 'test-preview', `${new Date().toISOString()}.log`);
}
const logger = await createLogger(logDir);

describe('DiscoveryCore API', () => {
  let testEnvironment: TestEnvironment;
  let wallet: api.WalletContext;
  let providers: DiscoveryCoreProviders;

  beforeAll(
    async () => {
      api.setLogger(logger);
      testEnvironment = new TestEnvironment(logger);
      const testConfiguration = await testEnvironment.start();
      logger.info(`Test configuration: ${JSON.stringify(testConfiguration)}`);
      wallet = await testEnvironment.getWallet();
      providers = await api.configureProviders(wallet, testConfiguration.dappConfig);
    },
    1000 * 60 * 45,
  );

  afterAll(async () => {
    await testEnvironment.shutdown();
  });

  it('should deploy the discovery-core contract and create a new case [@slow]', async () => {
    const discoveryCoreContractDeployed = await api.deploy(providers, createDiscoveryCorePrivateState());
    expect(discoveryCoreContractDeployed).not.toBeNull();

    const status = await api.displayCaseStatus(providers, discoveryCoreContractDeployed);
    expect(status.totalCasesCreated).toEqual(BigInt(0));

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create a new case with a 32-byte case number and 8-byte jurisdiction code
    const caseNumber = new Uint8Array(32).fill(1);
    const jurisdictionCode = new Uint8Array(8).fill(2);
    const response = await api.createNewCase(discoveryCoreContractDeployed, caseNumber, jurisdictionCode);

    const state = await Rx.firstValueFrom(wallet.wallet.state().pipe(Rx.filter((s) => s.isSynced)));
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

    expect(response.txHash).toMatch(/[0-9a-f]{64}/);
    expect(response.blockHeight).toBeGreaterThan(BigInt(0));

    const statusAfter = await api.displayCaseStatus(providers, discoveryCoreContractDeployed);
    expect(statusAfter.totalCasesCreated).toEqual(BigInt(1));
    expect(statusAfter.contractAddress).toEqual(status.contractAddress);
  });

  it('Wallet Functionalities', async () => {
    logger.info({
      section: 'Wallet Context',
      dustSecretKey: wallet.dustSecretKey,
      shieldedSecretKeys: wallet.shieldedSecretKeys,
      unshieldedKeystore: wallet.unshieldedKeystore,
    });
  });
});
