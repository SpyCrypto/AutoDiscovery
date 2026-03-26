import { CombinedTokenTransfer } from '@midnight-ntwrk/wallet-sdk-facade';
import * as api from '../../api';
import * as ledger from '@midnight-ntwrk/ledger-v6';
import { tokenValue } from './utils';
import { MidnightBech32m, ShieldedAddress, UnshieldedAddress } from '@midnight-ntwrk/wallet-sdk-address-format';

//allows to transfer unshielded tokens
export async function sendUnshieldedToken(wallet: api.WalletContext, address: string, amount: bigint): Promise<string> {
  const parsedAddress = MidnightBech32m.parse(address);
  const unshieldedAddress = UnshieldedAddress.codec.decode('undeployed', parsedAddress);

  const tokenTransfer: CombinedTokenTransfer[] = [
    {
      type: 'unshielded',
      outputs: [
        {
          type: ledger.unshieldedToken().raw,
          amount: tokenValue(amount),
          receiverAddress: unshieldedAddress,
        },
      ],
    },
  ];

  const txTtl = new Date(Date.now() + 300 * 60 * 1000); // 30 min

  const recipe = await wallet.wallet.transferTransaction(
    tokenTransfer,
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      shieldedSecretKeys: wallet.shieldedSecretKeys as unknown as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dustSecretKey: wallet.dustSecretKey as unknown as any,
    },
    { ttl: txTtl },
  );

  const signedRecipe = await wallet.wallet.signRecipe(
    recipe,
    (payload) => wallet.unshieldedKeystore.signData(payload),
  );

  const finalizedTx = await wallet.wallet.finalizeRecipe(signedRecipe);

  const submittedTxHash = await wallet.wallet.submitTransaction(finalizedTx);

  return submittedTxHash;
}

//allows to transfer arbitrary unshielded tokens
export async function sendArbitraryUnshieldedToken(wallet: api.WalletContext, address: string, amount: bigint): Promise<string> {

  //address Hex format
  const addressBech32m = MidnightBech32m.parse(address);
  const addressHex = UnshieldedAddress.codec.decode("undeployed", addressBech32m);

  const outputs = [
    {
      type: ledger.unshieldedToken().raw,
      value: tokenValue(amount),
      // owner: wallet.unshieldedKeystore.getAddress(),
      owner: addressHex.hexString,
    },
  ];

  const intent = ledger.Intent.new(new Date(Date.now() + 30 * 60 * 1000));
  intent.guaranteedUnshieldedOffer = ledger.UnshieldedOffer.new([], outputs, []);

  const arbitraryTx = ledger.Transaction.fromParts("undeployed", undefined, undefined, intent);

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

  return submittedTxHash;
}
