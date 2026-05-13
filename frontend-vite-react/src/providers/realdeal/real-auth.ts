// =============================================================================
// RealDeal Auth Provider
// =============================================================================
// Implements IAuthProvider using Midnight Lace wallet connection.
// The wallet address becomes the user identity.
// Public key is derived from the wallet's coinPublicKey.
// =============================================================================

import type { IAuthProvider, AuthMethod, Credentials, AuthSession } from '../types';
import {
  connectMidnightWallet,
  fetchWalletInfo,
  isMidnightWalletAvailable,
  WalletNotInstalledError,
} from '../../modules/midnight/wallet-widget';
import { deriveDisplayName } from '../../modules/midnight/wallet-widget';

export class RealAuthProvider implements IAuthProvider {
  private session: AuthSession | null = null;

  async login(method: AuthMethod, credentials?: Credentials): Promise<AuthSession> {
    if (method === 'email') {
      // In realDeal mode, email login falls back to wallet
      // This path allows graceful degradation during development
      if (!credentials?.email) throw new Error('Email is required');
      throw new Error(
        'Email authentication is not available in realDeal mode. ' +
        'Please use Midnight Lace wallet to sign in.',
      );
    }

    if (method === 'yubikey') {
      // Future: FIDO2/WebAuthn flow
      throw new Error('YubiKey authentication is coming in a future release. Please use Midnight Lace wallet.');
    }

    // method === 'trezor' maps to Midnight Lace wallet connection
    if (!isMidnightWalletAvailable()) {
      throw new WalletNotInstalledError();
    }

    const api = await connectMidnightWallet();
    const info = await fetchWalletInfo(api);

    const session: AuthSession = {
      userId: info.address,
      displayName: deriveDisplayName(info.address),
      email: `${info.address.slice(0, 8).toLowerCase()}@wallet.midnight.network`,
      role: 'defense',
      publicKey: info.coinPublicKey ?? info.address,
      authMethod: 'trezor',
      authenticatedAt: new Date().toISOString(),
    };

    this.session = session;
    return session;
  }

  async logout(): Promise<void> {
    this.session = null;
  }

  getSession(): AuthSession | null {
    return this.session;
  }

  getPublicKey(): string | null {
    return this.session?.publicKey ?? null;
  }
}
