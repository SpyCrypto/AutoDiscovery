/**
 * AutoDiscovery Brand Colors
 * Based on "Legal Modernism" aesthetic
 */

export const colors = {
  // Primary Colors
  primary: {
    deepNavy: '#1A2B4A',
    legalBlue: '#2E5C8A',
    slateGray: '#4A5568',
  },
  
  // Accent Colors
  accent: {
    oracleGold: '#D4AF37',
    complianceGreen: '#10B981',
    alertRed: '#DC2626',
  },
  
  // Neutral Palette
  neutral: {
    offWhite: '#F9FAFB',
    lightGray: '#E5E7EB',
    charcoal: '#1F2937',
  },
  
  // Semantic Colors
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#DC2626',
    info: '#2E5C8A',
  },
} as const;

export type ColorToken = typeof colors;
