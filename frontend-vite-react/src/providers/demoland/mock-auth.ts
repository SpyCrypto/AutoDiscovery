import type { IAuthProvider, AuthMethod, Credentials, AuthSession } from '../types';

const DEMO_USERS: Record<string, AuthSession> = {
  'demo@autodiscovery.legal': {
    userId: 'user-001',
    displayName: 'Sarah Mitchell',
    email: 'demo@autodiscovery.legal',
    role: 'prosecution',
    publicKey: '0xDEMO_PK_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
    authMethod: 'email',
    authenticatedAt: new Date().toISOString(),
  },
};

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockAuthProvider implements IAuthProvider {
  private session: AuthSession | null = null;

  async login(method: AuthMethod, credentials?: Credentials): Promise<AuthSession> {
    // Simulate auth delay
    switch (method) {
      case 'email':
        await delay(800);
        break;
      case 'yubikey':
        await delay(1500); // Simulates "touch your key" delay
        break;
      case 'trezor':
        await delay(2000); // Simulates device connection
        break;
    }

    const session: AuthSession = {
      ...DEMO_USERS['demo@autodiscovery.legal'],
      authMethod: method,
      authenticatedAt: new Date().toISOString(),
      email: credentials?.email || 'demo@autodiscovery.legal',
    };

    this.session = session;
    return session;
  }

  async logout(): Promise<void> {
    await delay(300);
    this.session = null;
  }

  getSession(): AuthSession | null {
    return this.session;
  }

  getPublicKey(): string | null {
    return this.session?.publicKey ?? null;
  }
}
