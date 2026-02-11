import React from 'react';
import { colors } from '@/design-system/tokens/colors';
import { typography } from '@/design-system/tokens/typography';
import { spacing } from '@/design-system/tokens/spacing';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title,
  subtitle
}) => {
  return (
    <div 
      className="border-b pb-4 mb-6"
      style={{ 
        borderBottomColor: colors.neutral.lightGray,
      }}
    >
      <h1 
        style={{ 
          fontFamily: typography.fontFamily.serif,
          fontSize: typography.fontSize['3xl'],
          fontWeight: typography.fontWeight.bold,
          color: colors.primary.deepNavy,
          lineHeight: typography.lineHeight.tight,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p 
          style={{ 
            fontFamily: typography.fontFamily.sans,
            fontSize: typography.fontSize.lg,
            color: colors.primary.slateGray,
            marginTop: spacing.sm,
            lineHeight: typography.lineHeight.normal,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
