import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Providers, ADMode, AuthSession } from './types';
import { createDemoProviders } from './demoland';

// --- Provider Context ---

const ProvidersContext = createContext<Providers | null>(null);

export function useProviders(): Providers {
  const ctx = useContext(ProvidersContext);
  if (!ctx) throw new Error('useProviders must be used within a ProvidersProvider');
  return ctx;
}

// --- Auth Context ---

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  login: (method: AuthSession['authMethod'], credentials?: { email?: string; password?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within a ProvidersProvider');
  return ctx;
}

// --- Mode Context ---

const ModeContext = createContext<ADMode>('demoland');

export function useMode(): ADMode {
  return useContext(ModeContext);
}

// --- Combined Provider ---

function createProviders(mode: ADMode): Providers {
  if (mode === 'demoland') {
    return createDemoProviders();
  }
  // realDeal providers will be implemented later
  // For now, fall back to demo
  return createDemoProviders();
}

interface ProvidersProviderProps {
  children: ReactNode;
}

export function ProvidersProvider({ children }: ProvidersProviderProps) {
  const mode: ADMode = (import.meta.env.VITE_AD_MODE as ADMode) || 'demoland';
  const [providers] = useState(() => createProviders(mode));
  const [session, setSession] = useState<AuthSession | null>(null);

  const login = useCallback(
    async (method: AuthSession['authMethod'], credentials?: { email?: string; password?: string }) => {
      const result = await providers.auth.login(method, credentials);
      setSession(result);
    },
    [providers],
  );

  const logout = useCallback(async () => {
    await providers.auth.logout();
    setSession(null);
  }, [providers]);

  const authValue: AuthContextValue = {
    session,
    isAuthenticated: session !== null,
    login,
    logout,
  };

  return (
    <ModeContext.Provider value={mode}>
      <ProvidersContext.Provider value={providers}>
        <AuthContext.Provider value={authValue}>
          {children}
        </AuthContext.Provider>
      </ProvidersContext.Provider>
    </ModeContext.Provider>
  );
}
