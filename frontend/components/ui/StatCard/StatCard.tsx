/**
 * StatCard Component
 * Displays statistics with icon, title, and value
 */
'use client';

import React from 'react';
import { Card } from '../Card';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'amber';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  className 
}) => {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-500',
    green: 'bg-green-500/20 text-green-500',
    purple: 'bg-purple-500/20 text-purple-500',
    red: 'bg-red-500/20 text-red-500',
    amber: 'bg-amber-500/20 text-amber-500',
  };

  return (
    <Card className={cn('p-3 sm:p-4 lg:p-6', className)} variant="elevated">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-gray-400 text-xs sm:text-sm truncate">{title}</p>
          <p className="text-base sm:text-lg lg:text-2xl font-bold text-white mt-1 truncate">{value}</p>
        </div>
        <div className={cn(
          'p-1.5 sm:p-2 lg:p-3 rounded-lg lg:rounded-xl flex-shrink-0 ml-2',
          colorClasses[color]
        )}>
          <Icon className="h-3 w-3 sm:h-4 sm:w-4 lg:h-6 lg:w-6" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;