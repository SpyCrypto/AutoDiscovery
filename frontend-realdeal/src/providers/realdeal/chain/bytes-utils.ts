// ============================================================================
// Byte Conversion Helpers for Contract Circuit Calls
// ============================================================================
//
// Contract circuits expect typed byte arrays (Bytes<32>, Bytes<8>, etc.)
// and bigint arguments. These helpers convert between human-readable
// strings and the binary formats required by the Compact runtime.
// ============================================================================

/**
 * Convert a hex string (with or without 0x prefix) to a Uint8Array of exactly `length` bytes.
 * Zero-pads on the right if the hex string is shorter than `length * 2` hex chars.
 */
export function hexToBytes(hex: string, length: number): Uint8Array {
  const cleaned = hex.replace(/^0x/, '');
  const bytes = new Uint8Array(length);
  for (let i = 0; i < Math.min(cleaned.length / 2, length); i++) {
    bytes[i] = parseInt(cleaned.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/** Convert a hex string to Bytes<32>. */
export function hexToBytes32(hex: string): Uint8Array {
  return hexToBytes(hex, 32);
}

/** Convert a Uint8Array to a hex string (no 0x prefix). */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Map a ProtectiveOrderTier string to the contract's uint8 enum.
 * Matches the Compact enum: 0=attorneys_eyes, 1=confidential, 2=restricted, 3=public.
 */
export function tierToNumber(tier: string): number {
  const map: Record<string, number> = {
    attorneys_eyes: 0,
    confidential: 1,
    restricted: 2,
    public: 3,
  };
  return map[tier] ?? 1; // Default to confidential
}

/**
 * Map a document category string to the contract's category number.
 * Matches the Compact enum for document classification.
 */
export function categoryToNumber(category: string): number {
  const map: Record<string, number> = {
    pleading: 0,
    discovery: 1,
    evidence: 2,
    correspondence: 3,
    motion: 4,
    order: 5,
    deposition: 6,
    exhibit: 7,
    other: 8,
  };
  return map[category.toLowerCase()] ?? 8;
}

/**
 * Hash a string (e.g. expert qualifications) into a Bytes<32> suitable for contract storage.
 * Uses a simple deterministic hash for local operations. In production, this should
 * align with the contract's `persistentHash` when on-chain integrity matters.
 */
export function stringToBytes32(value: string): Uint8Array {
  const bytes = new Uint8Array(32);
  const encoded = new TextEncoder().encode(value);
  bytes.set(encoded.slice(0, 32));
  return bytes;
}
