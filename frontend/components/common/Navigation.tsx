// src/components/common/Navigation.tsx
'use client';

import React, { useState } from 'react';
import { Shield, Heart, Menu, X } from 'lucide-react';
import { NAVIGATION_TABS } from '@/data/navigationTabs';
import { TabType } from '@/types';

interface NavigationProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    isConnected: boolean;
    setIsConnected: (connected: boolean) => void;
    showHeartbeat: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
    activeTab,
    setActiveTab,
    isConnected,
    setIsConnected,
    showHeartbeat
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    const handleTabChange = (tab: TabType): void => {
        setActiveTab(tab);
        setIsMobileMenuOpen(false);
    };

    const handleWalletConnect = (): void => {
        setIsConnected(!isConnected);
    };

    const toggleMobileMenu = (): void => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav className="bg-black/80 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <div className="text-white font-bold text-xl flex items-center space-x-2">
                            <Shield className="h-8 w-8 text-blue-500" />
                            <span>SmartWill</span>
                        </div>

                        <div className="hidden md:flex space-x-6">
                            {NAVIGATION_TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id as TabType)}
                                    className={`capitalize px-3 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab.id
                                        ? 'text-blue-400 bg-blue-500/10'
                                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Heartbeat Monitor */}
                        <div className="hidden md:flex items-center space-x-2 bg-green-500/10 border border-green-500/30 rounded-lg px-3 py-2">
                            <Heart className={`h-4 w-4 text-green-500 ${showHeartbeat ? 'animate-pulse' : ''}`} />
                            <span className="text-green-400 text-sm font-medium">Active</span>
                        </div>

                        <button
                            onClick={handleWalletConnect}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${isConnected
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {isConnected ? 'Connected' : 'Connect Wallet'}
                        </button>

                        <button
                            className="md:hidden text-white"
                            onClick={toggleMobileMenu}
                            aria-label="Toggle mobile menu"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-black/90 backdrop-blur-xl border-t border-gray-800 py-4">
                        {NAVIGATION_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id as TabType)}
                                className={`block w-full text-left px-4 py-3 capitalize ${activeTab === tab.id ? 'text-blue-400 bg-blue-500/10' : 'text-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;