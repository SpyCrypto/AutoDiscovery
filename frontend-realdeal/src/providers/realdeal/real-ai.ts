/**
 * RealDeal AI Provider
 *
 * Provides AI-powered document analysis capabilities.
 * When VITE_AI_SERVICE_URL is configured, delegates to an external AI service.
 * Otherwise, returns local heuristic-based results so the UI remains functional.
 *
 * Capabilities:
 *   - Document synopsis generation (key themes + sentiment)
 *   - Entity extraction (NER — people, orgs, dates, amounts)
 *   - Obfuscation detection (data dump / haystack analysis)
 *   - Fidelity scoring (scan vs digital comparison)
 */
import type { IAIProvider, Synopsis, Entity, ObfuscationScore } from '../types';

function getAIServiceUrl(): string | null {
  const url = import.meta.env.VITE_AI_SERVICE_URL;
  return url && url.length > 0 ? url : null;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Extract simple entities from text using basic pattern matching.
 * This is a local fallback — not a replacement for real NLP.
 */
function extractEntitiesLocally(content: string): Entity[] {
  const entities: Entity[] = [];
  const words = content.split(/\s+/);

  // Detect dollar amounts
  const amountRegex = /\$[\d,]+(?:\.\d{2})?/g;
  const amounts = content.match(amountRegex) ?? [];
  for (const amount of amounts) {
    entities.push({ name: amount, type: 'amount', context: 'Financial reference', mentions: 1 });
  }

  // Detect dates (basic patterns)
  const dateRegex = /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s*\d{4}\b/gi;
  const dates = content.match(dateRegex) ?? [];
  for (const date of dates) {
    entities.push({ name: date, type: 'date', context: 'Date reference', mentions: 1 });
  }

  // Detect case numbers
  const caseNumRegex = /\b\d{2}-[A-Z]{2,}-\d{3,}\b/g;
  const caseNums = content.match(caseNumRegex) ?? [];
  for (const num of caseNums) {
    entities.push({ name: num, type: 'case_number', context: 'Case reference', mentions: 1 });
  }

  // Simple word count for relevance
  if (words.length > 0 && entities.length === 0) {
    entities.push({
      name: '(no structured entities detected)',
      type: 'person',
      context: `Document contains ${words.length} words`,
      mentions: 0,
    });
  }

  return entities;
}

function formatServiceError(url: string, response: Response): string {
  return `AI service error: ${response.status} ${response.statusText} (url: ${url})`;
}

export class RealAIProvider implements IAIProvider {
  private readonly serviceUrl: string | null = getAIServiceUrl();

  async generateSynopsis(content: string): Promise<Synopsis> {
    if (this.serviceUrl) {
      // Delegate to external AI service when configured
      const url = `${this.serviceUrl}/synopsis`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        throw new Error(formatServiceError(url, response));
      }
      return response.json();
    }

    // Local fallback: generate a basic synopsis from content analysis
    await delay(300);
    const words = content.split(/\s+/).length;
    const sentences = content.split(/[.!?]+/).filter(Boolean);
    const firstSentences = sentences.slice(0, 3).join('. ').trim();

    return {
      summary: firstSentences || `Document contains ${words} words. Configure VITE_AI_SERVICE_URL for AI-powered synopsis.`,
      keyTopics: ['document analysis', 'pending AI configuration'],
      sentiment: 'neutral',
      legalRelevance: 0.5,
    };
  }

  async extractEntities(content: string): Promise<Entity[]> {
    if (this.serviceUrl) {
      const url = `${this.serviceUrl}/entities`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) {
        throw new Error(formatServiceError(url, response));
      }
      return response.json();
    }

    // Local fallback: basic pattern matching
    await delay(200);
    return extractEntitiesLocally(content);
  }

  async detectObfuscation(_productionId: string): Promise<ObfuscationScore> {
    if (this.serviceUrl) {
      const url = `${this.serviceUrl}/obfuscation`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productionId: _productionId }),
      });
      if (!response.ok) {
        throw new Error(formatServiceError(url, response));
      }
      return response.json();
    }

    // Local fallback: cannot detect obfuscation without AI
    await delay(200);
    return {
      score: 0,
      level: 'low',
      flags: [],
      recommendation: 'Obfuscation analysis requires AI service. Configure VITE_AI_SERVICE_URL.',
    };
  }

  async scoreFidelity(_imageHash: string, _digitalHash: string): Promise<number> {
    if (this.serviceUrl) {
      const url = `${this.serviceUrl}/fidelity`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageHash: _imageHash, digitalHash: _digitalHash }),
      });
      if (!response.ok) {
        throw new Error(formatServiceError(url, response));
      }
      const data = await response.json();
      return data.score ?? 0;
    }

    // Local fallback: simple hash comparison (same hash = 100% fidelity)
    await delay(100);
    return _imageHash === _digitalHash ? 100 : 0;
  }
}
