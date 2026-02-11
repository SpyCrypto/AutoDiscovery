import React from 'react';
import { colors } from '@/design-system/tokens/colors';
import { typography } from '@/design-system/tokens/typography';
import { spacing } from '@/design-system/tokens/spacing';
import { ComplianceBadge } from './ComplianceBadge';

type ComplianceStatus = 'compliant' | 'review' | 'non-compliant';

interface CaseCardProps {
  caseNumber: string;
  title: string;
  jurisdiction: string;
  status: ComplianceStatus;
  onClick?: () => void;
}

export const CaseCard: React.FC<CaseCardProps> = ({ 
  caseNumber,
  title,
  jurisdiction,
  status,
  onClick
}) => {
  return (
    <div 
      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      style={{ 
        backgroundColor: colors.neutral.offWhite,
        borderColor: colors.neutral.lightGray,
      }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div style={{ flex: 1 }}>
          <div 
            style={{ 
              fontFamily: typography.fontFamily.mono,
              fontSize: typography.fontSize.sm,
              color: colors.primary.slateGray,
              marginBottom: spacing.xs,
            }}
          >
            {caseNumber}
          </div>
          <h3 
            style={{ 
              fontFamily: typography.fontFamily.serif,
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.bold,
              color: colors.primary.deepNavy,
              marginBottom: spacing.sm,
            }}
          >
            {title}
          </h3>
          <div 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: spacing.sm,
              fontSize: typography.fontSize.sm,
              color: colors.primary.slateGray,
            }}
          >
            <span>📍</span>
            <span>{jurisdiction}</span>
          </div>
        </div>
        <div style={{ marginLeft: spacing.md }}>
          <ComplianceBadge status={status} />
        </div>
      </div>
    </div>
  );
};
