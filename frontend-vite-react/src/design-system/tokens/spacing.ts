/**
 * AutoDiscovery Spacing System
 * Based on 4px increments for consistent rhythm
 */

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px',
  '5xl': '128px',
} as const;

export type SpacingToken = typeof spacing;
