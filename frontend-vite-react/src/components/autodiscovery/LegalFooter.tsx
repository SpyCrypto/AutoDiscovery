import React from 'react';
import { colors } from '@/design-system/tokens/colors';
import { typography } from '@/design-system/tokens/typography';
import { spacing } from '@/design-system/tokens/spacing';

export const LegalFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer 
      className="border-t mt-8 pt-6 pb-8"
      style={{ 
        borderTopColor: colors.neutral.lightGray,
        backgroundColor: colors.neutral.offWhite,
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div 
          style={{ 
            fontFamily: typography.fontFamily.sans,
            fontSize: typography.fontSize.sm,
            color: colors.primary.slateGray,
            lineHeight: typography.lineHeight.relaxed,
          }}
        >
          <p style={{ marginBottom: spacing.sm }}>
            <strong style={{ color: colors.primary.deepNavy }}>Legal Disclaimer:</strong> AutoDiscovery is a compliance assistance tool. 
            Users remain responsible for ensuring all discovery submissions comply with applicable 
            court rules and regulations. This platform does not constitute legal advice.
          </p>
          
          <p style={{ marginBottom: spacing.md }}>
            <strong style={{ color: colors.primary.deepNavy }}>Privacy:</strong> All case data is processed using zero-knowledge proofs 
            on Midnight Network. Personal information is selectively disclosed only as required by court rules.
          </p>
          
          <div 
            className="flex items-center justify-between flex-wrap gap-4"
            style={{ 
              paddingTop: spacing.md,
              borderTop: `1px solid ${colors.neutral.lightGray}`,
            }}
          >
            <div>
              <span style={{ 
                fontFamily: typography.fontFamily.serif,
                fontWeight: typography.fontWeight.bold,
                color: colors.primary.deepNavy,
              }}>
                AutoDiscovery
              </span>
              <span style={{ marginLeft: spacing.sm, marginRight: spacing.sm }}>•</span>
              <span>Build Once. Comply Everywhere.</span>
            </div>
            
            <div>
              <span>© {currentYear} AutoDiscovery</span>
              <span style={{ marginLeft: spacing.sm, marginRight: spacing.sm }}>•</span>
              <span>Powered by Midnight Network</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
