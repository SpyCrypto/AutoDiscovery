// =============================================================================
// Case & Step Hasher
// =============================================================================
// Mirrors the witness computations in discovery-core.compact:
//   computeUniqueCaseIdentifier(caseNumber, jurisdictionCode) → Field
//   computeUniqueStepHash(caseIdentifier, ruleReference) → Field
//
// Uses Web Crypto SHA-256 (same algorithm; Field encoding abstracted).
// The on-chain contract uses Compact's built-in hash; we mirror that here
// to predict case IDs before writing to chain.
// =============================================================================

import { sha256Hex } from '../jurisdiction-sdk';

/**
 * Mirrors: computeUniqueCaseIdentifier(caseNumber, jurisdictionCode)
 * Case ID = SHA-256(caseNumber + "|" + jurisdictionCode)
 * The actual case number never appears on-chain — only this hash.
 */
export async function computeCaseId(
  caseNumber: string,
  jurisdictionCode: string,
): Promise<string> {
  return sha256Hex(`${caseNumber}|${jurisdictionCode}`);
}

/**
 * Mirrors: computeUniqueStepHash(caseIdentifier, jurisdictionRuleReference)
 * Step hash = SHA-256(caseId + "|" + ruleRef)
 * Hides which rule creates the obligation on the public chain.
 */
export async function computeStepHash(
  caseId: string,
  ruleRef: string,
): Promise<string> {
  return sha256Hex(`${caseId}|${ruleRef}`);
}

/**
 * Short deterministic ID for local storage (first 16 chars of SHA-256).
 */
export async function shortId(input: string): Promise<string> {
  const h = await sha256Hex(input);
  return h.slice(0, 16);
}
