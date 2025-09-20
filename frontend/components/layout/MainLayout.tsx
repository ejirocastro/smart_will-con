// src/components/layout/MainLayout.tsx
'use client';

import React from 'react';
import Sidebar from '../common/Sidebar';
import TopNavbar from '../common/TopNavbar';
import { TabType } from '@/types';

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    isConnected: boolean;
    setIsConnected: (connected: boolean) => void;
    showHeartbeat: boolean;
    onLogoClick: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    activeTab,
    setActiveTab,
    isConnected,
    setIsConnected,
    showHeartbeat,
    onLogoClick
}) => {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            {/* Top Navbar - Full Width */}
            <TopNavbar
                isConnected={isConnected}
                setIsConnected={setIsConnected}
                showHeartbeat={showHeartbeat}
                onLogoClick={onLogoClick}
            />

            {/* Content Area with Sidebar */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />

                {/* Main Content Area */}
                <main className="flex-1 ml-64 p-8 pt-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;