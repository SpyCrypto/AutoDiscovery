// =============================================================================
// Midnight Wallet Widget — Barrel Exports
// =============================================================================

export { WalletProvider } from './contexts/wallet-context';
export { useWallet } from './hooks/use-wallet';
export { WalletConnectButton } from './ui/WalletConnectButton';

export {
  isMidnightWalletAvailable,
  isMidnightWalletEnabled,
  connectMidnightWallet,
  fetchWalletInfo,
  DISCONNECTED_WALLET,
  WalletNotInstalledError,
  WalletConnectionRejectedError,
  WalletConnectionError,
} from './api/wallet-api';

export {
  formatAddress,
  formatTDUST,
  formatNetwork,
  deriveDisplayName,
  isValidMidnightAddress,
} from './utils/address-utils';

export type {
  WalletStatus,
  WalletConnection,
  WalletInfo,
  WalletStateSnapshot,
  ServiceUriConfig,
  DAppConnectorWalletAPI,
} from './api/wallet-api';
