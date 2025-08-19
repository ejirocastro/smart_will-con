// src/components/layout/MainLayout.tsx
'use client';

import React from 'react';
import Navigation from '../common/Navigation';
import Footer from '../common/Footer';
import { TabType } from '@/types';

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    isConnected: boolean;
    setIsConnected: (connected: boolean) => void;
    showHeartbeat: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    activeTab,
    setActiveTab,
    isConnected,
    setIsConnected,
    showHeartbeat
}) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <Navigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isConnected={isConnected}
                setIsConnected={setIsConnected}
                showHeartbeat={showHeartbeat}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default MainLayout;