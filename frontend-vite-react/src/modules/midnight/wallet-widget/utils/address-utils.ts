// =============================================================================
// Wallet Address & Balance Utilities
// =============================================================================

const TDUST_DECIMALS = 6;

/**
 * Truncates a long hex address for display.
 * "0xa7f3e1b2c4d5f6..." → "0xa7f3...d5f6"
 */
export function formatAddress(address: string, chars = 6): string {
  if (!address || address.length <= chars * 2 + 2) return address;
  const prefix = address.startsWith('0x') ? '0x' : '';
  const body = address.startsWith('0x') ? address.slice(2) : address;
  return `${prefix}${body.slice(0, chars)}...${body.slice(-chars)}`;
}

/**
 * Formats a raw tDUST micro-denomination string for display.
 * "5000000" → "5.000000 tDUST"
 */
export function formatTDUST(raw: string | null | undefined): string {
  if (raw === null || raw === undefined) return '0 tDUST';
  try {
    const micro = BigInt(raw);
    const factor = BigInt(10 ** TDUST_DECIMALS);
    const whole = micro / factor;
    const frac = micro % factor;
    const fracStr = frac.toString().padStart(TDUST_DECIMALS, '0');
    return `${whole}.${fracStr} tDUST`;
  } catch {
    return `${raw} tDUST`;
  }
}

/**
 * Derives a deterministic display name from a wallet address.
 * Used when no user profile exists yet.
 */
export function deriveDisplayName(address: string): string {
  const suffix = address.slice(-6).toUpperCase();
  return `Wallet ${suffix}`;
}

/**
 * Returns a short network label for display.
 */
export function formatNetwork(networkId: string | null | undefined): string {
  if (!networkId) return 'Unknown Network';
  const id = networkId.toLowerCase();
  if (id.includes('testnet') || id === 'testnet') return 'Testnet';
  if (id.includes('mainnet') || id === 'mainnet') return 'Mainnet';
  if (id.includes('devnet') || id === 'devnet') return 'DevNet';
  if (id.includes('local') || id === 'local') return 'Local';
  return networkId;
}

/**
 * Returns true if the address looks like a valid Midnight hex address.
 */
export function isValidMidnightAddress(address: string): boolean {
  if (!address) return false;
  const clean = address.startsWith('0x') ? address.slice(2) : address;
  return /^[0-9a-fA-F]{40,}$/.test(clean);
}
