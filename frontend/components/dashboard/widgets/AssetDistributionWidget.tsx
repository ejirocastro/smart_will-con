/**
 * AssetDistributionWidget Component
 * Dashboard widget displaying asset distribution
 */
'use client';

import React from 'react';
import { BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui';
import { Assets } from '@/types';

interface AssetDistributionWidgetProps {
  assets: Assets;
}

const AssetDistributionWidget: React.FC<AssetDistributionWidgetProps> = ({ assets }) => {
  return (
    <Card variant="elevated">
      <Card.Header icon={BarChart3} iconColor="text-green-500">
        Asset Distribution
      </Card.Header>
      
      <Card.Content>
        <div className="flex justify-between items-center py-1 md:py-2">
          <span className="text-gray-400 text-sm md:text-base">STX Holdings</span>
          <span className="text-white font-medium text-sm md:text-base">{assets.stx} STX</span>
        </div>
        <div className="flex justify-between items-center py-1 md:py-2">
          <span className="text-gray-400 text-sm md:text-base">BTC Holdings</span>
          <span className="text-white font-medium text-sm md:text-base">{assets.btc} BTC</span>
        </div>
        <div className="flex justify-between items-center py-1 md:py-2">
          <span className="text-gray-400 text-sm md:text-base">NFT Collection</span>
          <span className="text-white font-medium text-sm md:text-base">{assets.nfts} Items</span>
        </div>
        <div className="border-t border-gray-700 pt-3 md:pt-4 mt-3 md:mt-4">
          <div className="flex justify-between items-center">
            <span className="text-base md:text-lg font-medium text-white">Total Value</span>
            <span className="text-lg md:text-xl font-bold text-green-500">{assets.totalValue}</span>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default AssetDistributionWidget;