/**
 * QuickActionsWidget Component
 * Dashboard widget for quick action buttons
 */
'use client';

import React from 'react';
import { Card, Button } from '@/components/ui';

interface QuickActionsWidgetProps {
  onAddBeneficiary?: () => void;
  onUpdateAssets?: () => void;
  onReviewConditions?: () => void;
}

const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({ 
  onAddBeneficiary = () => console.log('Add beneficiary'),
  onUpdateAssets = () => console.log('Update assets'),
  onReviewConditions = () => console.log('Review conditions')
}) => {
  return (
    <Card variant="elevated" className="md:col-span-2 lg:col-span-1">
      <h3 className="text-lg md:text-lg font-semibold text-white mb-3 md:mb-4">Quick Actions</h3>
      
      <div className="space-y-2 md:space-y-3">
        <Button 
          onClick={onAddBeneficiary}
          variant="outline"
          className="w-full bg-blue-600/20 border-blue-500/30 text-blue-400 hover:bg-blue-600/30 hover:border-blue-400/50"
        >
          Add New Beneficiary
        </Button>
        
        <Button 
          onClick={onUpdateAssets}
          variant="outline"
          className="w-full bg-green-600/20 border-green-500/30 text-green-400 hover:bg-green-600/30 hover:border-green-400/50"
        >
          Update Asset Values
        </Button>
        
        <Button 
          onClick={onReviewConditions}
          variant="outline"
          className="w-full bg-purple-600/20 border-purple-500/30 text-purple-400 hover:bg-purple-600/30 hover:border-purple-400/50"
        >
          Review Conditions
        </Button>
      </div>
    </Card>
  );
};

export default QuickActionsWidget;