import React from 'react';
import { colors } from '@/design-system/tokens/colors';
import { typography } from '@/design-system/tokens/typography';
import { spacing } from '@/design-system/tokens/spacing';

interface JurisdictionBannerProps {
  jurisdiction: string;
  rules: string;
  status?: 'active' | 'inactive';
}

export const JurisdictionBanner: React.FC<JurisdictionBannerProps> = ({ 
  jurisdiction,
  rules,
  status = 'active'
}) => {
  const isActive = status === 'active';
  
  return (
    <div 
      className="flex items-center gap-3 px-4 py-3 rounded-lg border-l-4"
      style={{ 
        backgroundColor: isActive ? `${colors.primary.legalBlue}10` : `${colors.neutral.lightGray}`,
        borderLeftColor: isActive ? colors.accent.oracleGold : colors.neutral.lightGray,
        fontFamily: typography.fontFamily.sans,
      }}
    >
      <span style={{ fontSize: '1.5rem' }}>📍</span>
      <div>
        <div style={{ 
          fontWeight: typography.fontWeight.semibold,
          color: colors.primary.deepNavy,
        }}>
          {jurisdiction} — {rules} {isActive ? 'Active' : 'Inactive'}
        </div>
        <div style={{ 
          fontSize: typography.fontSize.sm,
          color: colors.primary.slateGray,
          marginTop: spacing.xs,
        }}>
          {isActive 
            ? 'Jurisdiction rules currently applied to this case' 
            : 'Jurisdiction rules not currently active'}
        </div>
      </div>
    </div>
  );
};
