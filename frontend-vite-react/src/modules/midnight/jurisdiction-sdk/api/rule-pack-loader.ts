// =============================================================================
// Rule Pack Loader
// =============================================================================
// Loads rule pack JSON from the public folder, computes SHA-256 hash,
// and returns the parsed RulePack with its integrity hash.
// =============================================================================

import type { RulePack } from '../types';

// ---------------------------------------------------------------------------
// SHA-256 via Web Crypto API (browser-native, no external dep)
// ---------------------------------------------------------------------------

export async function sha256Hex(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ---------------------------------------------------------------------------
// Rule Pack Loading
// ---------------------------------------------------------------------------

export interface LoadedRulePack {
  rulePack: RulePack;
  rawJson: string;
  sha256: string;
}

const rulePackCache = new Map<string, LoadedRulePack>();

export async function loadRulePack(filePath: string): Promise<LoadedRulePack> {
  if (rulePackCache.has(filePath)) {
    return rulePackCache.get(filePath)!;
  }

  const response = await fetch(filePath);
  if (!response.ok) {
    throw new Error(
      `Failed to load rule pack from ${filePath}: HTTP ${response.status} ${response.statusText}`,
    );
  }

  const rawJson = await response.text();
  let rulePack: RulePack;
  try {
    rulePack = JSON.parse(rawJson) as RulePack;
  } catch {
    throw new Error(`Rule pack at ${filePath} contains invalid JSON.`);
  }

  const sha256 = await sha256Hex(rawJson);
  const result: LoadedRulePack = { rulePack, rawJson, sha256 };
  rulePackCache.set(filePath, result);
  return result;
}

export function clearRulePackCache(): void {
  rulePackCache.clear();
}

// ---------------------------------------------------------------------------
// Hash comparison utility
// ---------------------------------------------------------------------------

/**
 * Compares a locally-computed SHA-256 hex string to an on-chain hash
 * (which may be stored as a hex string or a 0x-prefixed hex string).
 */
export function hashesMatch(localHex: string, onChainHex: string | null): boolean {
  if (!onChainHex) return false;
  const clean = onChainHex.startsWith('0x') ? onChainHex.slice(2) : onChainHex;
  return localHex.toLowerCase() === clean.toLowerCase();
}
