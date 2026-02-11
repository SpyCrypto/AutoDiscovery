import React from 'react';
import { colors } from '@/design-system/tokens/colors';

type ComplianceStatus = 'compliant' | 'review' | 'non-compliant';

interface ComplianceBadgeProps {
  status: ComplianceStatus;
  label?: string;
}

const statusConfig = {
  compliant: {
    color: colors.accent.complianceGreen,
    icon: '🟢',
    text: 'Compliant',
  },
  review: {
    color: colors.semantic.warning,
    icon: '🟡',
    text: 'Under Review',
  },
  'non-compliant': {
    color: colors.accent.alertRed,
    icon: '🔴',
    text: 'Non-Compliant',
  },
};

export const ComplianceBadge: React.FC<ComplianceBadgeProps> = ({ 
  status, 
  label 
}) => {
  const config = statusConfig[status];
  
  return (
    <div 
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
      style={{ 
        backgroundColor: `${config.color}20`,
        color: config.color,
        border: `1px solid ${config.color}40`,
      }}
    >
      <span>{config.icon}</span>
      <span>{label || config.text}</span>
    </div>
  );
};
