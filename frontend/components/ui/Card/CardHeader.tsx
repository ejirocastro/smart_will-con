/**
 * CardHeader Component
 * Header section for Card component
 */
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: string;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, icon: Icon, iconColor = 'text-blue-500', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center mb-3 md:mb-4',
          className
        )}
        {...props}
      >
        {Icon && (
          <Icon className={cn('h-4 w-4 md:h-5 md:w-5 mr-2', iconColor)} />
        )}
        <h3 className="text-lg md:text-xl font-semibold text-white truncate">
          {children}
        </h3>
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

export default CardHeader;