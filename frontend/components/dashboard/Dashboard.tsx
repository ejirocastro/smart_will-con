// src/components/dashboard/Dashboard.tsx
'use client';

import React from 'react';
import {
    Wallet,
    Users,
    Shield,
    CheckCircle,
    AlertTriangle,
    BarChart3,
    ChevronRight,
    FileText,
    Archive,
    Brain,
    Lock
} from 'lucide-react';
import { WillData } from '@/types';
import AIAdvisorWidget from './AIAdvisorWidget';
import MemoryVaultWidget from './MemoryVaultWidget';
import SocialRecoveryWidget from './SocialRecoveryWidget';
import StacksMarketWidget from './StacksMarketWidget';

interface DashboardProps {
    willData: WillData;
}

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

interface ActionCardProps {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    action: () => void;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-gray-800 backdrop-blur-xl rounded-xl md:rounded-2xl p-3 md:p-6 border border-gray-700 hover:border-gray-600 transition-colors">
        <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
                <p className="text-gray-400 text-xs md:text-sm truncate">{title}</p>
                <p className="text-lg md:text-2xl font-bold text-white mt-1 truncate">{value}</p>
            </div>
            <div className={`p-2 md:p-3 rounded-lg md:rounded-xl bg-${color === 'blue' ? 'blue' : color}-500/20 flex-shrink-0 ml-2`}>
                <Icon className={`h-4 w-4 md:h-6 md:w-6 text-${color === 'blue' ? 'blue' : color}-500`} />
            </div>
        </div>
    </div>
);

const ActionCard: React.FC<ActionCardProps> = ({ title, description, icon: Icon, action, color }) => (
    <button
        onClick={action}
        className={`bg-gray-800 border border-gray-700 hover:border-${color === 'blue' ? 'blue' : color}-500/50 rounded-xl md:rounded-2xl p-4 md:p-6 text-left hover:bg-gray-750 transition-all group`}
    >
        <Icon className={`h-6 w-6 md:h-8 md:w-8 text-${color === 'blue' ? 'blue' : color}-500 mb-3 md:mb-4`} />
        <h4 className="text-base md:text-lg font-semibold text-white mb-1 md:mb-2">{title}</h4>
        <p className="text-gray-400 text-xs md:text-sm mb-3 md:mb-4 leading-relaxed">{description}</p>
        <div className="flex items-center text-blue-400 text-xs md:text-sm group-hover:translate-x-1 transition-transform">
            Get Started <ChevronRight className="h-3 w-3 md:h-4 md:w-4 ml-1" />
        </div>
    </button>
);

const Dashboard: React.FC<DashboardProps> = ({ willData }) => {
    const stats = [
        { title: 'Total Assets', value: willData.assets.totalValue, icon: Wallet, color: 'blue' },
        { title: 'Beneficiaries', value: willData.beneficiaries.length.toString(), icon: Users, color: 'green' },
        { title: 'Active Conditions', value: willData.conditions.length.toString(), icon: Shield, color: 'purple' },
        { title: 'Will Status', value: 'Active', icon: CheckCircle, color: 'green' }
    ];

    const actionCards = [
        {
            title: 'Create New Will',
            description: 'Set up a new digital inheritance plan',
            icon: FileText,
            action: () => console.log('Navigate to create'),
            color: 'blue'
        },
        {
            title: 'Legacy Vault',
            description: 'Store memories and time capsules for loved ones',
            icon: Archive,
            action: () => console.log('Navigate to legacy'),
            color: 'amber'
        },
        {
            title: 'AI Advisor',
            description: 'Get smart recommendations for your estate plan',
            icon: Brain,
            action: () => console.log('Navigate to ai-advisor'),
            color: 'purple'
        },
        {
            title: 'Security Settings',
            description: 'Configure multi-sig and recovery options',
            icon: Lock,
            action: () => console.log('Navigate to security'),
            color: 'red'
        }
    ];

    return (
        <div className="space-y-6 md:space-y-8 p-4 md:p-6 lg:p-8">

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                <div className="bg-gray-800 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-700">
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center">
                        <Users className="h-4 w-4 md:h-5 md:w-5 mr-2 text-blue-500" />
                        <span className="truncate">Recent Beneficiaries</span>
                    </h3>
                    <div className="space-y-3 md:space-y-4">
                        {willData.beneficiaries.map((beneficiary) => (
                            <div key={beneficiary.id} className="flex items-center justify-between py-2 md:py-3 px-3 md:px-4 rounded-lg md:rounded-xl bg-gray-700">
                                <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-medium text-sm md:text-base">{beneficiary.name.charAt(0)}</span>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-white font-medium text-sm md:text-base truncate">{beneficiary.name}</p>
                                        <p className="text-gray-400 text-xs md:text-sm truncate">{beneficiary.relationship}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0 ml-2">
                                    <span className="text-blue-500 font-medium text-sm md:text-base">{beneficiary.percentage}%</span>
                                    {beneficiary.verified ? (
                                        <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                                    ) : (
                                        <AlertTriangle className="h-3 w-3 md:h-4 md:w-4 text-yellow-500" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <AIAdvisorWidget />
                <MemoryVaultWidget />
                <SocialRecoveryWidget />
            </div>

            {/* Asset Distribution and Market Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                <div className="bg-gray-800 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-700">
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4 flex items-center">
                        <BarChart3 className="h-4 w-4 md:h-5 md:w-5 mr-2 text-green-500" />
                        <span className="truncate">Asset Distribution</span>
                    </h3>
                    <div className="space-y-3 md:space-y-4">
                        <div className="flex justify-between items-center py-1 md:py-2">
                            <span className="text-gray-400 text-sm md:text-base">STX Holdings</span>
                            <span className="text-white font-medium text-sm md:text-base">{willData.assets.stx} STX</span>
                        </div>
                        <div className="flex justify-between items-center py-1 md:py-2">
                            <span className="text-gray-400 text-sm md:text-base">BTC Holdings</span>
                            <span className="text-white font-medium text-sm md:text-base">{willData.assets.btc} BTC</span>
                        </div>
                        <div className="flex justify-between items-center py-1 md:py-2">
                            <span className="text-gray-400 text-sm md:text-base">NFT Collection</span>
                            <span className="text-white font-medium text-sm md:text-base">{willData.assets.nfts} Items</span>
                        </div>
                        <div className="border-t border-gray-700 pt-3 md:pt-4 mt-3 md:mt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-base md:text-lg font-medium text-white">Total Value</span>
                                <span className="text-lg md:text-xl font-bold text-green-500">{willData.assets.totalValue}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <StacksMarketWidget />

                <div className="bg-gray-800 backdrop-blur-xl rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-700 md:col-span-2 lg:col-span-1">
                    <h3 className="text-lg md:text-lg font-semibold text-white mb-3 md:mb-4">Quick Actions</h3>
                    <div className="space-y-2 md:space-y-3">
                        <button className="w-full bg-blue-600/20 border border-blue-500/30 rounded-lg md:rounded-xl py-2 md:py-3 text-blue-400 text-sm font-medium hover:bg-blue-600/30 hover:border-blue-400/50 transition-all">
                            Add New Beneficiary
                        </button>
                        <button className="w-full bg-green-600/20 border border-green-500/30 rounded-lg md:rounded-xl py-2 md:py-3 text-green-400 text-sm font-medium hover:bg-green-600/30 hover:border-green-400/50 transition-all">
                            Update Asset Values
                        </button>
                        <button className="w-full bg-purple-600/20 border border-purple-500/30 rounded-lg md:rounded-xl py-2 md:py-3 text-purple-400 text-sm font-medium hover:bg-purple-600/30 hover:border-purple-400/50 transition-all">
                            Review Conditions
                        </button>
                    </div>
                </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                {actionCards.map((card, index) => (
                    <ActionCard key={index} {...card} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;