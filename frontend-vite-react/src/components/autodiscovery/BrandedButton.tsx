import React from 'react';
import { colors } from '@/design-system/tokens/colors';
import { typography } from '@/design-system/tokens/typography';

interface BrandedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const BrandedButton: React.FC<BrandedButtonProps> = ({ 
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props 
}) => {
  const baseStyles = `
    inline-flex items-center justify-center
    rounded-md font-semibold transition-all
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-40 disabled:cursor-not-allowed
  `;
  
  const variants = {
    primary: `
      text-white
      hover:brightness-90
    `,
    secondary: `
      text-white
      hover:brightness-90
    `,
    outline: `
      bg-transparent border-2
      hover:text-white
    `,
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const variantStyles = {
    primary: {
      backgroundColor: colors.primary.legalBlue,
      borderColor: colors.primary.legalBlue,
    },
    secondary: {
      backgroundColor: colors.accent.oracleGold,
      borderColor: colors.accent.oracleGold,
    },
    outline: {
      borderColor: colors.primary.legalBlue,
      color: colors.primary.legalBlue,
    },
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={{ 
        fontFamily: typography.fontFamily.sans,
        ...variantStyles[variant],
      }}
      {...props}
    >
      {children}
    </button>
  );
};
