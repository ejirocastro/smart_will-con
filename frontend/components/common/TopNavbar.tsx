'use client';

import React from 'react';
import { Heart, Shield } from 'lucide-react';

interface TopNavbarProps {
    isConnected: boolean;
    setIsConnected: (connected: boolean) => void;
    showHeartbeat: boolean;
    onLogoClick: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({
    isConnected,
    setIsConnected,
    showHeartbeat,
    onLogoClick
}) => {
    const handleWalletConnect = (): void => {
        setIsConnected(!isConnected);
    };

    return (
        <div className="sticky top-0 z-50 h-16 bg-gray-800 border-b border-gray-700 flex items-center px-6">
            {/* Far Left - Logo */}
            <button 
                onClick={() => {
                    console.log('Logo clicked - going to landing page');
                    onLogoClick();
                }}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
            >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                </div>
                <span className="text-white font-bold text-xl">SmartWill</span>
            </button>
            
            {/* Center - Heartbeat Monitor */}
            <div className="flex-1 flex justify-center">
                <div className="flex items-center space-x-2 bg-green-600/20 border border-green-600/40 rounded-lg px-3 py-2">
                    <Heart className={`h-4 w-4 text-green-400 ${showHeartbeat ? 'animate-pulse' : ''}`} />
                    <span className="text-green-400 text-sm font-medium">System Active</span>
                </div>
            </div>

            {/* Far Right - Wallet Connection */}
            <button
                onClick={handleWalletConnect}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                    isConnected
                        ? 'bg-green-600/20 text-green-400 border border-green-600/40 hover:bg-green-600/30'
                        : 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600/60'
                }`}
            >
                {isConnected ? 'Wallet Connected' : 'Connect Wallet'}
            </button>
        </div>
    );
};

export default TopNavbar;