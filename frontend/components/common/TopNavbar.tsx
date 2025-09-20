'use client';

import React, { useState } from 'react';
import { Heart, Shield, LogOut, User, ChevronDown, Menu } from 'lucide-react';
import { User as UserType } from '@/types';

interface TopNavbarProps {
    isConnected: boolean;
    setIsConnected: (connected: boolean) => void;
    showHeartbeat: boolean;
    onLogoClick: () => void;
    onLogout: () => void;
    user: UserType | null;
    onMenuToggle?: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({
    isConnected,
    setIsConnected,
    showHeartbeat,
    onLogoClick,
    onLogout,
    user,
    onMenuToggle
}) => {
    const [showUserMenu, setShowUserMenu] = useState(false);
    const handleWalletConnect = (): void => {
        setIsConnected(!isConnected);
    };

    return (
        <div className="sticky top-0 z-50 h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 sm:px-6">
            {/* Left Side - Mobile Menu + Logo */}
            <div className="flex items-center space-x-3">
                {/* Mobile Menu Button */}
                {onMenuToggle && (
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                )}
                
                {/* Logo */}
                <button 
                    onClick={() => {
                        console.log('Logo clicked - going to landing page');
                        onLogoClick();
                    }}
                    className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-opacity duration-200"
                >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <span className="text-white font-bold text-lg sm:text-xl hidden xs:block">SmartWill</span>
                </button>
            </div>

            {/* Far Right - System Active + Wallet Connection + User Menu */}
            <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Heartbeat Monitor */}
                <div className="hidden sm:flex items-center space-x-2 bg-green-600/20 border border-green-600/40 rounded-lg px-3 py-2">
                    <Heart className={`h-4 w-4 text-green-400 ${showHeartbeat ? 'animate-pulse' : ''}`} />
                    <span className="text-green-400 text-sm font-medium">System Active</span>
                </div>

                {/* Wallet Connection */}
                <button
                    onClick={handleWalletConnect}
                    className={`px-3 sm:px-6 py-2 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                        isConnected
                            ? 'bg-green-600/20 text-green-400 border border-green-600/40 hover:bg-green-600/30'
                            : 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-600/60'
                    }`}
                >
                    <span className="hidden sm:inline">{isConnected ? 'Wallet Connected' : 'Connect Wallet'}</span>
                    <span className="sm:hidden">{isConnected ? 'Connected' : 'Connect'}</span>
                </button>

                {/* User Menu */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center space-x-1 sm:space-x-2 bg-gray-700 border border-gray-600 rounded-lg px-2 sm:px-3 py-2 hover:bg-gray-600 transition-colors"
                    >
                        <User className="h-4 w-4 text-gray-300" />
                        <span className="text-gray-300 text-sm font-medium hidden sm:block truncate max-w-24">
                            {user?.name || user?.email}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-300" />
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                            <div className="p-3 border-b border-gray-700">
                                <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                                <p className="text-gray-400 text-xs truncate">{user?.email}</p>
                                <p className="text-blue-400 text-xs capitalize">{user?.role}</p>
                            </div>
                            <button
                                onClick={() => {
                                    onLogout();
                                    setShowUserMenu(false);
                                }}
                                className="w-full flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="text-sm">Sign Out</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopNavbar;