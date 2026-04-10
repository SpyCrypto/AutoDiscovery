import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RealAIProvider } from '../real-ai';

// Mock import.meta.env
vi.stubGlobal('import', { meta: { env: {} } });

describe('RealAIProvider', () => {
  let provider: RealAIProvider;

  beforeEach(() => {
    provider = new RealAIProvider();
  });

  describe('generateSynopsis (local fallback)', () => {
    it('returns synopsis with content summary', async () => {
      const content = 'The plaintiff alleges medical negligence. The defendant denies all claims. Treatment began in March 2024.';
      const result = await provider.generateSynopsis(content);

      expect(result).toHaveProperty('summary');
      expect(result).toHaveProperty('keyTopics');
      expect(result).toHaveProperty('sentiment');
      expect(result).toHaveProperty('legalRelevance');
      expect(typeof result.summary).toBe('string');
      expect(result.summary.length).toBeGreaterThan(0);
      expect(result.legalRelevance).toBeGreaterThanOrEqual(0);
      expect(result.legalRelevance).toBeLessThanOrEqual(1);
    });

    it('handles empty content', async () => {
      const result = await provider.generateSynopsis('');
      expect(result.summary).toBeTruthy();
      expect(result.sentiment).toBe('neutral');
    });
  });

  describe('extractEntities (local fallback)', () => {
    it('detects dollar amounts', async () => {
      const content = 'The settlement was $2,500,000 for damages.';
      const entities = await provider.extractEntities(content);

      const amounts = entities.filter((e) => e.type === 'amount');
      expect(amounts.length).toBeGreaterThanOrEqual(1);
      expect(amounts[0].name).toContain('$2,500,000');
    });

    it('detects dates', async () => {
      const content = 'The injury occurred on March 15, 2024 at the facility.';
      const entities = await provider.extractEntities(content);

      const dates = entities.filter((e) => e.type === 'date');
      expect(dates.length).toBeGreaterThanOrEqual(1);
    });

    it('detects case numbers', async () => {
      const content = 'See case 24-CV-12345 for reference.';
      const entities = await provider.extractEntities(content);

      const caseNums = entities.filter((e) => e.type === 'case_number');
      expect(caseNums.length).toBeGreaterThanOrEqual(1);
      expect(caseNums[0].name).toBe('24-CV-12345');
    });

    it('returns placeholder when no entities found', async () => {
      const entities = await provider.extractEntities('just some words');
      expect(entities.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('detectObfuscation (local fallback)', () => {
    it('returns low score without AI service', async () => {
      const result = await provider.detectObfuscation('prod-001');

      expect(result.score).toBe(0);
      expect(result.level).toBe('low');
      expect(result.recommendation).toContain('AI service');
    });
  });

  describe('scoreFidelity (local fallback)', () => {
    it('returns 100 for matching hashes', async () => {
      const score = await provider.scoreFidelity('abc123', 'abc123');
      expect(score).toBe(100);
    });

    it('returns 0 for different hashes', async () => {
      const score = await provider.scoreFidelity('abc123', 'def456');
      expect(score).toBe(0);
    });
  });
});
