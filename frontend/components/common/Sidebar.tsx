'use client';

import React from 'react';
import { getNavigationTabsForRole } from '@/data/navigationTabs';
import { TabType, UserRole } from '@/types';

interface SidebarProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    userRole: UserRole;
    isMobileMenuOpen?: boolean;
    setIsMobileMenuOpen?: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activeTab,
    setActiveTab,
    userRole,
    isMobileMenuOpen = false,
    setIsMobileMenuOpen
}) => {
    const handleTabChange = (tab: TabType): void => {
        setActiveTab(tab);
        // Close mobile menu when tab is selected
        if (setIsMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    // Get navigation tabs based on user role
    const navigationTabs = getNavigationTabsForRole(userRole);


    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-900 border-r border-gray-700 flex-col">
                {/* Navigation Links */}
                <nav className="flex-1 px-4 py-6">
                    <div className="space-y-2">
                        {navigationTabs.map((tab) => {
                            const IconComponent = getTabIcon(tab.id);
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id as TabType)}
                                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                        activeTab === tab.id
                                            ? 'bg-blue-600 text-white shadow-lg'
                                            : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                    }`}
                                >
                                    <IconComponent className="h-5 w-5" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </nav>
            </div>

            {/* Mobile Sidebar */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex">
                    {/* Background overlay */}
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50" 
                        onClick={() => setIsMobileMenuOpen?.(false)}
                    />
                    
                    {/* Sidebar content */}
                    <div className="relative flex flex-col w-64 bg-gray-900 border-r border-gray-700">
                        {/* Navigation Links */}
                        <nav className="flex-1 px-4 py-6 mt-16">
                            <div className="space-y-2">
                                {navigationTabs.map((tab) => {
                                    const IconComponent = getTabIcon(tab.id);
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => handleTabChange(tab.id as TabType)}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                                                activeTab === tab.id
                                                    ? 'bg-blue-600 text-white shadow-lg'
                                                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                                            }`}
                                        >
                                            <IconComponent className="h-5 w-5" />
                                            <span className="font-medium">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
};

// Helper function to get icon for each tab
const getTabIcon = (tabId: string) => {
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
        'dashboard': require('lucide-react').LayoutDashboard,
        'create': require('lucide-react').FileText,
        'drafts-versions': require('lucide-react').GitBranch,
        'review-preview': require('lucide-react').Eye,
        'deploy': require('lucide-react').Rocket,
        'assets': require('lucide-react').Wallet,
        'legacy': require('lucide-react').Archive,
        'ai-advisor': require('lucide-react').Brain,
        'security': require('lucide-react').Lock,
        'heir-view': require('lucide-react').Users,
        'verifier-dashboard': require('lucide-react').CheckCircle,
    };
    
    return icons[tabId] || require('lucide-react').Circle;
};

export default Sidebar;