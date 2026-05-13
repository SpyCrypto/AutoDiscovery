/**
 * RealDeal Auth Provider
 * TODO: Wire to Midnight wallet integration + DID-based authentication
 *       - Wallet connect (Lace or compatible)
 *       - Public key extraction from wallet
 *       - Session management with on-chain identity
 */
import type { IAuthProvider } from '../types';

function notConnected(method: string): never {
  throw new Error(`[RealDeal] ${method} not yet connected to wallet`);
}

export class RealAuthProvider implements IAuthProvider {
  async login(_email: string, _password: string, _method?: any) { return notConnected('login'); }
  async logout() { return notConnected('logout'); }
  async getSession() { return notConnected('getSession'); }
}
