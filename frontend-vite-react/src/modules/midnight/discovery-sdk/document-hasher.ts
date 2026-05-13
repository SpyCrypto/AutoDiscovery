// =============================================================================
// Document Hasher
// =============================================================================
// Computes SHA-256 hashes for document content + metadata.
// Mirrors the hash computation that would go into the document-registry contract.
// =============================================================================

import { sha256Hex } from '../jurisdiction-sdk';

/**
 * Hash document content (raw text, base64, or any string).
 * This is the Level-2 document hash that would be committed to the
 * immutableDocumentHashCommitments MerkleTree on-chain.
 */
export async function hashDocumentContent(content: string): Promise<string> {
  return sha256Hex(content);
}

/**
 * Hash document metadata when no content is provided.
 * Uses title + category + dateReceived + originator as entropy.
 */
export async function hashDocumentMetadata(
  title: string,
  category: string,
  dateReceived: string,
  originator: string,
): Promise<string> {
  return sha256Hex(`${title}|${category}|${dateReceived}|${originator}|${Date.now()}`);
}

/**
 * Compute a Twin Bond hash: SHA-256(imageHash + "|" + digitalHash).
 * Mirrors the Twin Protocol described in document-registry.compact.
 */
export async function computeTwinBondHash(
  imageHash: string,
  digitalHash: string,
): Promise<string> {
  return sha256Hex(`${imageHash}|${digitalHash}`);
}

/**
 * Simple Merkle root for a list of hashes (pairwise SHA-256 up to root).
 * Used to compute production-level Merkle roots (Level 4 in the hierarchy).
 */
export async function computeMerkleRoot(hashes: string[]): Promise<string> {
  if (hashes.length === 0) return sha256Hex('empty-production');
  if (hashes.length === 1) return hashes[0];

  let layer = [...hashes];
  while (layer.length > 1) {
    const next: string[] = [];
    for (let i = 0; i < layer.length; i += 2) {
      const left = layer[i];
      const right = layer[i + 1] ?? left;
      next.push(await sha256Hex(`${left}${right}`));
    }
    layer = next;
  }
  return layer[0];
}
