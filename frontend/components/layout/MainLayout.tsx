/**
 * MainLayout Component
 * Main application layout with sidebar navigation and top navbar
 */
'use client';

import React, { useState } from 'react';
import Sidebar from '../common/Sidebar';
import TopNavbar from '../common/TopNavbar';
import { TabType, UserRole, User } from '@/types';

interface MainLayoutProps {
    children: React.ReactNode;
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    isConnected: boolean;
    setIsConnected: (connected: boolean) => void;
    showHeartbeat: boolean;
    onLogoClick: () => void;
    userRole: UserRole;
    onLogout: () => void;
    user: User | null;
}

const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    activeTab,
    setActiveTab,
    isConnected,
    setIsConnected,
    showHeartbeat,
    onLogoClick,
    userRole,
    onLogout,
    user
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            {/* Top Navbar - Full Width */}
            <TopNavbar
                isConnected={isConnected}
                setIsConnected={setIsConnected}
                showHeartbeat={showHeartbeat}
                onLogoClick={onLogoClick}
                onLogout={onLogout}
                user={user}
                onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />

            {/* Content Area with Sidebar */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    userRole={userRole}
                    isMobileMenuOpen={isMobileMenuOpen}
                    setIsMobileMenuOpen={setIsMobileMenuOpen}
                />

                {/* Main Content Area */}
                <main className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 pt-4 sm:pt-6 lg:pt-8">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;