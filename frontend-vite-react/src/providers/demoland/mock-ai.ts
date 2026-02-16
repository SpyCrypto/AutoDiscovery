import type { IAIProvider, Synopsis, Entity, ObfuscationScore } from '../types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockAIProvider implements IAIProvider {
  async generateSynopsis(_content: string): Promise<Synopsis> {
    await delay(1200);
    return {
      summary: `AI-generated synopsis of document. Key themes identified: medical negligence, delayed diagnosis, standard of care deviation.`,
      keyTopics: ['medical negligence', 'delayed diagnosis', 'cardiac care', 'standard of care'],
      sentiment: 'adversarial',
      legalRelevance: 0.89,
    };
  }

  async extractEntities(_content: string): Promise<Entity[]> {
    await delay(800);
    return [
      { name: 'John Smith', type: 'person', context: 'Plaintiff / Patient', mentions: 47 },
      { name: 'Dr. Jane Wilson', type: 'person', context: 'Defendant / Treating Physician', mentions: 34 },
      { name: 'Acme Medical Center', type: 'organization', context: 'Defendant / Hospital', mentions: 28 },
      { name: '$2,500,000', type: 'amount', context: 'Damages claimed', mentions: 3 },
      { name: 'March 2024', type: 'date', context: 'Initial treatment date', mentions: 12 },
    ];
  }

  async detectObfuscation(productionId: string): Promise<ObfuscationScore> {
    await delay(1500);
    if (productionId === 'prod-001') {
      return {
        score: 0.62, level: 'medium',
        flags: [
          'Document ordering appears randomized (non-chronological, non-Bates)',
          'Unrelated patient records intermixed (detected 3 non-party patients)',
          'OCR quality deliberately degraded on 23 pages (estimated 40% lower than source)',
          'Duplicate pages detected: 8 pages appear twice in different locations',
        ],
        recommendation: 'Haystack Alert — recommend filing Motion to Compel re-production in organized format. Document this scoring for sanctions argument.',
      };
    }
    return {
      score: 0.08, level: 'low', flags: [],
      recommendation: 'Production appears well-organized. No obfuscation indicators detected.',
    };
  }

  async scoreFidelity(imageHash: string, _digitalHash: string): Promise<number> {
    await delay(600);
    // Simulate varying fidelity
    const scores: Record<string, number> = {
      'img-d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1': 97.3,
      'img-a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4': 99.1,
      'img-b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5': 89.4,
      'img-e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8': 99.8,
    };
    return scores[imageHash] ?? 95.0;
  }
}
