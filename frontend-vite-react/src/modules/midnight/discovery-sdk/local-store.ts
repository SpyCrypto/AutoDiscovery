// =============================================================================
// Local Store — typed localStorage wrapper
// =============================================================================
// Persists cases, steps, and documents per user (keyed by wallet address).
// This is the offline-first data layer. On-chain anchoring is additive.
// =============================================================================

const PREFIX = 'ad_';

function storageKey(namespace: string, userId: string): string {
  return `${PREFIX}${namespace}_${userId.slice(0, 16)}`;
}

export function readStore<T>(namespace: string, userId: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(storageKey(namespace, userId));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStore<T>(namespace: string, userId: string, value: T): void {
  try {
    localStorage.setItem(storageKey(namespace, userId), JSON.stringify(value));
  } catch (err) {
    console.warn(`[LocalStore] Failed to write "${namespace}":`, err);
  }
}

export function clearStore(namespace: string, userId: string): void {
  localStorage.removeItem(storageKey(namespace, userId));
}
