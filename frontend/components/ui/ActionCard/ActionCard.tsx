/**
 * ActionCard Component
 * Interactive card for quick actions with hover effects
 */
'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card } from '../Card';
import { cn } from '@/lib/utils';

export interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'amber';
  className?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  action, 
  color = 'blue',
  className 
}) => {
  const colorClasses = {
    blue: 'text-blue-500 hover:border-blue-500/50',
    green: 'text-green-500 hover:border-green-500/50',
    purple: 'text-purple-500 hover:border-purple-500/50',
    red: 'text-red-500 hover:border-red-500/50',
    amber: 'text-amber-500 hover:border-amber-500/50',
  };

  return (
    <button
      onClick={action}
      className={cn(
        'text-left hover:bg-gray-750 transition-all group w-full',
        colorClasses[color]
      )}
    >
      <Card className={cn('p-3 sm:p-4 lg:p-6', className)} variant="interactive">
        <Icon className={cn('h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 mb-2 sm:mb-3 lg:mb-4', `text-${color}-500`)} />
        <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-1 lg:mb-2">{title}</h4>
        <p className="text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 lg:mb-4 leading-relaxed">{description}</p>
        <div className="flex items-center text-blue-400 text-xs sm:text-sm group-hover:translate-x-1 transition-transform">
          <span>Get Started</span> <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
        </div>
      </Card>
    </button>
  );
};

export default ActionCard;