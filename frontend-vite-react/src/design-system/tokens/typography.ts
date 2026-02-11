/**
 * AutoDiscovery Typography System
 */

export const typography = {
  fontFamily: {
    serif: '"IBM Plex Serif", Georgia, serif',      // Headings, brand voice
    sans: '"Inter", -apple-system, sans-serif',     // UI, body text
    mono: '"JetBrains Mono", "Fira Code", monospace', // Code
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export type TypographyToken = typeof typography;
