/**
 * Card Component
 * Base card component following compound component pattern
 */
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { variants } from '@/lib/design-system';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'flat' | 'interactive';
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'elevated', children, ...props }, ref) => {
    const cardVariant = variants.card[variant];
    
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'rounded-xl md:rounded-2xl p-4 md:p-6 border transition-colors',
          // Variant styles
          'bg-gray-800 border-gray-700',
          variant === 'elevated' && 'backdrop-blur-xl shadow-lg',
          variant === 'interactive' && 'hover:border-gray-600 cursor-pointer',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;