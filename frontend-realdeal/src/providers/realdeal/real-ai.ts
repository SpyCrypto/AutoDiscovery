/**
 * RealDeal AI Provider
 * TODO: Wire to external AI service for:
 *   - Document synopsis generation
 *   - Entity extraction (NER)
 *   - Obfuscation detection (data dump analysis)
 *   - Fidelity scoring (scan vs digital comparison)
 */
import type { IAIProvider } from '../types';

function notConnected(method: string): never {
  throw new Error(`[RealDeal] ${method} not yet connected to AI service`);
}

export class RealAIProvider implements IAIProvider {
  async generateSynopsis(_content: string) { return notConnected('generateSynopsis'); }
  async extractEntities(_content: string) { return notConnected('extractEntities'); }
  async detectObfuscation(_productionId: string) { return notConnected('detectObfuscation'); }
  async scoreFidelity(_imageHash: string, _digitalHash: string) { return notConnected('scoreFidelity'); }
}
