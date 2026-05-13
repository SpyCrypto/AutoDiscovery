import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';
import {
  connectMidnightWallet,
  fetchWalletInfo,
  isMidnightWalletAvailable,
  isMidnightWalletEnabled,
  DISCONNECTED_WALLET,
  type WalletConnection,
  type DAppConnectorWalletAPI,
} from '../api/wallet-api';

// ---------------------------------------------------------------------------
// Context Shape
// ---------------------------------------------------------------------------

interface WalletContextValue {
  wallet: WalletConnection;
  isAvailable: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  refresh: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface WalletProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
}

export function WalletProvider({ children, autoConnect = true }: WalletProviderProps) {
  const [wallet, setWallet] = useState<WalletConnection>(DISCONNECTED_WALLET);
  const isAvailable = isMidnightWalletAvailable();

  const applyConnection = useCallback(async (api: DAppConnectorWalletAPI) => {
    setWallet({ status: 'connecting', api: null, info: null, error: null });
    try {
      const info = await fetchWalletInfo(api);
      setWallet({ status: 'connected', api, info, error: null });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setWallet({ status: 'error', api: null, info: null, error: msg });
    }
  }, []);

  const connect = useCallback(async () => {
    setWallet({ status: 'connecting', api: null, info: null, error: null });
    try {
      const api = await connectMidnightWallet();
      await applyConnection(api);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setWallet({ status: 'error', api: null, info: null, error: msg });
      throw err;
    }
  }, [applyConnection]);

  const disconnect = useCallback(() => {
    setWallet(DISCONNECTED_WALLET);
  }, []);

  const refresh = useCallback(async () => {
    if (!wallet.api) return;
    try {
      const info = await fetchWalletInfo(wallet.api);
      setWallet((prev) => ({ ...prev, info }));
    } catch {
      // silently ignore refresh errors
    }
  }, [wallet.api]);

  // Auto-connect if wallet was previously enabled
  useEffect(() => {
    if (!autoConnect || !isAvailable) return;
    let cancelled = false;

    const tryAutoConnect = async () => {
      const alreadyEnabled = await isMidnightWalletEnabled();
      if (!alreadyEnabled || cancelled) return;
      try {
        const api = await connectMidnightWallet();
        if (!cancelled) await applyConnection(api);
      } catch {
        // Auto-connect failed silently — user can manually connect
      }
    };

    void tryAutoConnect();
    return () => { cancelled = true; };
  }, [autoConnect, isAvailable, applyConnection]);

  return (
    <WalletContext.Provider value={{ wallet, isAvailable, connect, disconnect, refresh }}>
      {children}
    </WalletContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useWalletContext(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWalletContext must be used within a WalletProvider');
  return ctx;
}
