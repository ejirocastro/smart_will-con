/**
 * StacksMarketWidget Component
 * Real-time Stacks cryptocurrency price display with trend visualization
 */
'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useStacksPrice } from '@/hooks/useStacksPrice';

const StacksMarketWidget: React.FC = () => {
    const { stacksPrice, stacksChange, canvasRef } = useStacksPrice();

    return (
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="h-10 w-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                            <div className="h-2 w-2 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-white">Stacks (STX)</h3>
                        <p className="text-gray-400 text-sm">Live Market Data</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-2xl font-bold text-white">${stacksPrice.toFixed(3)}</p>
                    <div className={`flex items-center justify-end ${stacksChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stacksChange >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                        <span className="text-sm font-medium">
                            {stacksChange >= 0 ? '+' : ''}{stacksChange.toFixed(4)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="relative h-24 mb-4">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full rounded-lg"
                    style={{ width: '100%', height: '96px' }}
                />
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-gray-400 text-xs">24h Volume</p>
                    <p className="text-white font-medium text-sm">$2.1M</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs">Market Cap</p>
                    <p className="text-white font-medium text-sm">$3.2B</p>
                </div>
                <div>
                    <p className="text-gray-400 text-xs">24h Change</p>
                    <p className={`font-medium text-sm ${stacksChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {((stacksChange / stacksPrice) * 100).toFixed(2)}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StacksMarketWidget;