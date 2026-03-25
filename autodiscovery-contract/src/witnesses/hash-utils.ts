// ============================================================================
// SHARED HASH UTILITIES
// ============================================================================
//
// Provides cryptographically secure hash primitives for all witness files,
// using Midnight's native `persistentHash` from @midnight-ntwrk/compact-runtime.
//
// This replaces the FNV-1a-inspired custom hash functions that were used across
// all 5 witness files. Using `persistentHash` ensures:
//   1. Cross-contract compatibility with the Midnight ecosystem.
//   2. Verifier consistency: the hash matches what a Compact circuit computes
//      with `persistentHash<Bytes<N>>(value)`.
//   3. Cryptographic security appropriate for a ZK legal discovery system.
//
// Reference: midnight-doc-manager src/api/witnesses.ts uses the same pattern.
// ============================================================================

import { persistentHash, CompactTypeBytes } from "@midnight-ntwrk/compact-runtime";

// --- Internal Helpers ---

/**
 * Converts a bigint to a 32-byte big-endian Uint8Array.
 */
function bigintToBytes32(value: bigint): Uint8Array {
  const hexString = value.toString(16).padStart(64, '0');
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(hexString.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Concatenates all inputs into a single Uint8Array.
 * bigint values are serialized as 32-byte big-endian before concatenation.
 */
function combineInputs(...inputs: (Uint8Array | bigint)[]): Uint8Array {
  const parts: Uint8Array[] = inputs.map((input) => {
    if (input instanceof Uint8Array) return input;
    return bigintToBytes32(input);
  });

  const totalLength = parts.reduce((sum, p) => sum + p.length, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const part of parts) {
    combined.set(part, offset);
    offset += part.length;
  }
  return combined;
}

// --- Public Hash Functions ---

/**
 * hashToBytes32
 *
 * Hashes one or more inputs into a 32-byte Uint8Array using Midnight's native
 * `persistentHash`. Replaces `deterministicHashBytes`, `deterministicHashMixed`,
 * and the inline FNV-1a blocks in expert-witness and compliance witnesses.
 *
 * @param inputs - Any mix of Uint8Array or bigint values to hash together.
 * @returns A 32-byte Uint8Array hash.
 */
export function hashToBytes32(...inputs: (Uint8Array | bigint)[]): Uint8Array {
  const combined = combineInputs(...inputs);
  return persistentHash(new CompactTypeBytes(combined.length), combined);
}

/**
 * hashToField
 *
 * Hashes one or more inputs and returns a bigint suitable for Midnight's
 * `Field` type (i.e., the result is masked to fit within `< 2^254`).
 * Replaces `deterministicHashToField` in discovery-witnesses.
 *
 * @param inputs - Any mix of Uint8Array or bigint values to hash together.
 * @returns A bigint in the range [0, 2^254).
 */
export function hashToField(...inputs: (Uint8Array | bigint)[]): bigint {
  const hashBytes = hashToBytes32(...inputs);

  // Convert the 32-byte hash to a bigint (big-endian)
  let result = 0n;
  for (const byte of hashBytes) {
    result = (result << 8n) | BigInt(byte);
  }

  // Mask to < 2^254 to fit within Midnight's Field type
  const mask254 = (1n << 254n) - 1n;
  return result & mask254;
}
