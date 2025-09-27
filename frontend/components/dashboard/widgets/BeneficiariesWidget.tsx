/**
 * BeneficiariesWidget Component
 * Dashboard widget displaying recent beneficiaries
 */
'use client';

import React from 'react';
import { Users, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui';
import { Beneficiary } from '@/types';

interface BeneficiariesWidgetProps {
  beneficiaries: Beneficiary[];
}

const BeneficiariesWidget: React.FC<BeneficiariesWidgetProps> = ({ beneficiaries }) => {
  return (
    <Card variant="elevated">
      <Card.Header icon={Users} iconColor="text-blue-500">
        Recent Beneficiaries
      </Card.Header>
      
      <Card.Content>
        {beneficiaries.map((beneficiary) => (
          <div 
            key={beneficiary.id} 
            className="flex items-center justify-between py-2 md:py-3 px-3 md:px-4 rounded-lg md:rounded-xl bg-gray-700"
          >
            <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium text-sm md:text-base">
                  {beneficiary.name.charAt(0)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white font-medium text-sm md:text-base truncate">
                  {beneficiary.name}
                </p>
                <p className="text-gray-400 text-xs md:text-sm truncate">
                  {beneficiary.relationship}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0 ml-2">
              <span className="text-blue-500 font-medium text-sm md:text-base">
                {beneficiary.percentage}%
              </span>
              {beneficiary.verified ? (
                <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-yellow-500" />
              )}
            </div>
          </div>
        ))}
      </Card.Content>
    </Card>
  );
};

export default BeneficiariesWidget;