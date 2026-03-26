import path from 'path';
import * as api from '../api';
import { type CounterProviders } from '../common-types';
import { Config, currentDir } from '../config';
import { createLogger } from '../logger';

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import 'dotenv/config';
import * as Rx from 'rxjs';
import { TestEnvironment } from './simulators/simulator';
import { Counter } from '@meshsdk/counter-contract';
import * as ledger from '@midnight-ntwrk/ledger-v6';
import { CombinedTokenTransfer } from '@midnight-ntwrk/wallet-sdk-facade';
import { tokenValue } from './utils/utils';

const logDir = path.resolve(currentDir, '..', 'logs', 'public-provider', `${new Date().toISOString()}.log`);
const logger = await createLogger(logDir);

describe('API', () => {
  let testEnvironment: TestEnvironment;
  let wallet: api.WalletContext;
  let providers: CounterProviders;
  let configuration: Config;

  beforeAll(
    async () => {
      api.setLogger(logger);
      testEnvironment = new TestEnvironment(logger);
      const testConfiguration = await testEnvironment.start();
      logger.info(`Test configuration: ${JSON.stringify(testConfiguration)}`);
      configuration = testConfiguration.dappConfig;
    },
    1000 * 60 * 45,
  );

  beforeEach(
    async () => {
      // Reset before each test
      wallet = await testEnvironment.getWallet();
      providers = await api.configureProviders(wallet, configuration);
    },
    1000 * 60 * 45,
  );

  afterAll(async () => {
    await testEnvironment.shutdown();
  });

  it('allows to transfer shielded tokens only', async () => {
    const state = await Rx.firstValueFrom(wallet.wallet.state().pipe(Rx.filter((s) => s.isSynced)));
    const receiverAddress = state.shielded.address;
    logger.info({
      section: 'Shielded Address',
      receiverAddress,
    });

    const ttl = new Date(Date.now() + 60 * 60 * 1000);
    const recipe = await wallet.wallet.transferTransaction(
      [
        {
          type: 'shielded',
          outputs: [
            {
              type: ledger.shieldedToken().raw,
              receiverAddress,
              amount: tokenValue(1n),
            },
          ],
        },
      ],
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        shieldedSecretKeys: wallet.shieldedSecretKeys as unknown as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dustSecretKey: wallet.dustSecretKey as unknown as any,
      },
      { ttl },
    );

    const finalizedTx = await wallet.wallet.finalizeRecipe(recipe);
    const submittedTxHash = await wallet.wallet.submitTransaction(finalizedTx);
    logger.info({
      section: 'Submitted Transaction Hash',
      submittedTxHash,
    });

    await Rx.firstValueFrom(
      wallet.wallet
        .state()
        .pipe(Rx.filter((s) => s.shielded.availableCoins.some((c) => c.coin.value === tokenValue(1n)))),
    );
  });

  it('allows to transfer unshielded tokens', async () => {
    const state = await Rx.firstValueFrom(wallet.wallet.state().pipe(Rx.filter((s) => s.isSynced)));
    const receiverAddress = state.unshielded.address;
    logger.info({
      section: 'Unshielded Address',
      receiverAddress,
    });

    const tokenTransfer: CombinedTokenTransfer[] = [
      {
        type: 'unshielded',
        outputs: [
          {
            amount: tokenValue(1n),
            receiverAddress,
            type: ledger.unshieldedToken().raw,
          },
        ],
      },
    ];

    const ttl = new Date(Date.now() + 30 * 60 * 1000);
    const recipe = await wallet.wallet.transferTransaction(
      tokenTransfer,
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        shieldedSecretKeys: wallet.shieldedSecretKeys as unknown as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dustSecretKey: wallet.dustSecretKey as unknown as any,
      },
      { ttl },
    );

    const signedRecipe = await wallet.wallet.signRecipe(
      recipe,
      (payload) => wallet.unshieldedKeystore.signData(payload),
    );

    const finalizedTx = await wallet.wallet.finalizeRecipe(signedRecipe);

    const submittedTxHash = await wallet.wallet.submitTransaction(finalizedTx);
    logger.info({
      section: 'Submitted Transaction Hash',
      submittedTxHash,
    });

    await Rx.firstValueFrom(
      wallet.wallet
        .state()
        .pipe(Rx.filter((s) => s.unshielded.availableCoins.some((c) => c.utxo.value === tokenValue(1n)))),
    );
  });

  it('allows to balance and submit an arbitrary shielded transaction', async () => {
    const transfer = {
      type: ledger.shieldedToken().raw,
      amount: tokenValue(1n),
    };

    const coin = ledger.createShieldedCoinInfo(transfer.type, transfer.amount);
    const output = ledger.ZswapOutput.new(
      coin,
      0,
      wallet.shieldedSecretKeys.coinPublicKey,
      wallet.shieldedSecretKeys.encryptionPublicKey,
    );

    const outputOffer = ledger.ZswapOffer.fromOutput(output, transfer.type, transfer.amount);

    const arbitraryTx = ledger.Transaction.fromParts(configuration.networkId, outputOffer);

    const recipe = await wallet.wallet.balanceUnprovenTransaction(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      arbitraryTx as unknown as any,
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        shieldedSecretKeys: wallet.shieldedSecretKeys as unknown as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dustSecretKey: wallet.dustSecretKey as unknown as any,
      },
      { ttl: new Date(Date.now() + 30 * 60 * 1000) },
    );

    const finalizedTx = await wallet.wallet.finalizeRecipe(recipe);
    const submittedTxHash = await wallet.wallet.submitTransaction(finalizedTx);
    logger.info({
      section: 'Submitted Transaction Hash',
      submittedTxHash,
    });

    await Rx.firstValueFrom(
      wallet.wallet
        .state()
        .pipe(Rx.filter((s) => s.shielded.availableCoins.some((c) => c.coin.value === tokenValue(1n)))),
    );
  });

  it('allows to balance and submit an arbitrary unshielded transaction', async () => {
    const outputs = [
      {
        type: ledger.unshieldedToken().raw,
        value: tokenValue(1n),
        owner: wallet.unshieldedKeystore.getAddress(),
      },
    ];

    const intent = ledger.Intent.new(new Date(Date.now() + 30 * 60 * 1000));
    intent.guaranteedUnshieldedOffer = ledger.UnshieldedOffer.new([], outputs, []);

    const arbitraryTx = ledger.Transaction.fromParts(configuration.networkId, undefined, undefined, intent);

    const recipe = await wallet.wallet.balanceUnprovenTransaction(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      arbitraryTx as unknown as any,
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        shieldedSecretKeys: wallet.shieldedSecretKeys as unknown as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dustSecretKey: wallet.dustSecretKey as unknown as any,
      },
      { ttl: new Date(Date.now() + 30 * 60 * 1000) },
    );

    const signedRecipe = await wallet.wallet.signRecipe(
      recipe,
      (payload) => wallet.unshieldedKeystore.signData(payload),
    );

    const finalizedTx = await wallet.wallet.finalizeRecipe(signedRecipe);

    const submittedTxHash = await wallet.wallet.submitTransaction(finalizedTx);
    logger.info({
      section: 'Submitted Transaction Hash',
      submittedTxHash,
    });

    await Rx.firstValueFrom(
      wallet.wallet
        .state()
        .pipe(Rx.filter((s) => s.unshielded.availableCoins.some((c) => c.utxo.value === tokenValue(1n)))),
    );
  });
});
