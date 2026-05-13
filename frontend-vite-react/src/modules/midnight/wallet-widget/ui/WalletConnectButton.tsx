import { Wallet, Loader2, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { useWallet } from '../hooks/use-wallet';
import { formatAddress, formatTDUST, formatNetwork } from '../utils/address-utils';

// ---------------------------------------------------------------------------
// Install Prompt — shown when Lace is not detected
// ---------------------------------------------------------------------------

function WalletNotInstalledBanner() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
        <div>
          <p className="text-sm font-medium text-amber-300">Midnight Lace wallet not found</p>
          <p className="mt-1 text-xs text-amber-300/70">
            AutoDiscovery uses the Midnight Lace browser extension to create zero-knowledge compliance
            proofs. Your case data never leaves your device.
          </p>
        </div>
      </div>
      <a
        href="https://docs.midnight.network/develop/tutorial/using/using-lace"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 self-start rounded-md bg-amber-500/20 px-3 py-1.5 text-xs font-medium text-amber-300 transition-colors hover:bg-amber-500/30"
      >
        Install Midnight Lace
        <ExternalLink className="h-3 w-3" />
      </a>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Connected Status — shown when wallet is connected
// ---------------------------------------------------------------------------

interface WalletStatusBadgeProps {
  onDisconnect?: () => void;
}

function WalletStatusBadge({ onDisconnect }: WalletStatusBadgeProps) {
  const { wallet, refresh } = useWallet();
  const info = wallet.info;
  if (!info) return null;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-300">Wallet Connected</span>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
            {formatNetwork(info.networkId)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            className="text-xs text-zinc-400 transition-colors hover:text-zinc-200"
            title="Refresh balance"
          >
            ↻
          </button>
          {onDisconnect && (
            <button
              onClick={onDisconnect}
              className="text-xs text-zinc-500 transition-colors hover:text-red-400"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400">
        <div>
          <span className="text-zinc-500">Address</span>
          <p className="font-mono text-zinc-200">{formatAddress(info.address)}</p>
        </div>
        <div>
          <span className="text-zinc-500">Balance</span>
          <p className="font-mono text-zinc-200">{formatTDUST(info.balanceTDUST)}</p>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Button
// ---------------------------------------------------------------------------

interface WalletConnectButtonProps {
  onConnected?: () => void;
  onDisconnect?: () => void;
  className?: string;
  compact?: boolean;
}

export function WalletConnectButton({
  onConnected,
  onDisconnect,
  className = '',
  compact = false,
}: WalletConnectButtonProps) {
  const { wallet, isAvailable, connect, disconnect } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
      onConnected?.();
    } catch {
      // Error is stored in wallet.error — no re-throw needed here
    }
  };

  const handleDisconnect = () => {
    disconnect();
    onDisconnect?.();
  };

  if (!isAvailable) {
    return compact ? (
      <button
        disabled
        className="inline-flex items-center gap-2 rounded-md bg-amber-500/10 px-3 py-2 text-sm text-amber-400"
        title="Midnight Lace wallet not installed"
      >
        <Wallet className="h-4 w-4" />
        Install Lace
      </button>
    ) : (
      <WalletNotInstalledBanner />
    );
  }

  if (wallet.status === 'connected' && wallet.info) {
    return compact ? (
      <button
        onClick={handleDisconnect}
        className={`inline-flex items-center gap-2 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-400 transition-colors hover:bg-red-500/10 hover:text-red-400 ${className}`}
        title={wallet.info.address}
      >
        <CheckCircle2 className="h-4 w-4" />
        {formatAddress(wallet.info.address, 4)}
      </button>
    ) : (
      <WalletStatusBadge onDisconnect={handleDisconnect} />
    );
  }

  if (wallet.status === 'connecting') {
    return (
      <button
        disabled
        className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600/50 px-4 py-3 text-sm font-medium text-white ${className}`}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Connecting to Midnight Lace…
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {wallet.error && (
        <div className="flex items-start gap-2 rounded-md border border-red-500/30 bg-red-500/5 p-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <p className="text-xs text-red-300">{wallet.error}</p>
        </div>
      )}
      <button
        onClick={handleConnect}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-violet-500 active:bg-violet-700 ${className}`}
      >
        <Wallet className="h-4 w-4" />
        Connect Midnight Lace Wallet
      </button>
      <p className="text-center text-xs text-zinc-500">
        Your case data stays on your device. Only ZK proofs go on-chain.
      </p>
    </div>
  );
}
