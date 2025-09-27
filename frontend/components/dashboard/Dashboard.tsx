/**
 * Dashboard Component
 * Main dashboard interface using composition pattern with reusable components
 */
'use client';

import React from 'react';
import {
    Wallet,
    Users,
    Shield,
    CheckCircle,
    FileText,
    Archive,
    Brain,
    Lock
} from 'lucide-react';
import { WillData } from '@/types';
import { StatCard, ActionCard } from '@/components/ui';
import { 
    BeneficiariesWidget, 
    AssetDistributionWidget, 
    QuickActionsWidget,
    AIAdvisorWidget,
    MemoryVaultWidget,
    SocialRecoveryWidget,
    StacksMarketWidget
} from './widgets';

interface DashboardProps {
    willData: WillData;
}

/**
 * Dashboard Main Component
 * Clean, focused component using composition pattern
 */
const Dashboard: React.FC<DashboardProps> = ({ willData }) => {
    // Dashboard statistics configuration
    const stats = [
        { title: 'Total Assets', value: willData.assets.totalValue, icon: Wallet, color: 'blue' as const },
        { title: 'Beneficiaries', value: willData.beneficiaries.length.toString(), icon: Users, color: 'green' as const },
        { title: 'Active Conditions', value: willData.conditions.length.toString(), icon: Shield, color: 'purple' as const },
        { title: 'Will Status', value: 'Active', icon: CheckCircle, color: 'green' as const }
    ];

    // Quick action cards configuration
    const actionCards = [
        {
            title: 'Create New Will',
            description: 'Set up a new digital inheritance plan',
            icon: FileText,
            action: () => console.log('Navigate to create'),
            color: 'blue' as const
        },
        {
            title: 'Legacy Vault',
            description: 'Store memories and time capsules for loved ones',
            icon: Archive,
            action: () => console.log('Navigate to legacy'),
            color: 'amber' as const
        },
        {
            title: 'AI Advisor',
            description: 'Get smart recommendations for your estate plan',
            icon: Brain,
            action: () => console.log('Navigate to ai-advisor'),
            color: 'purple' as const
        },
        {
            title: 'Security Settings',
            description: 'Configure multi-sig and recovery options',
            icon: Lock,
            action: () => console.log('Navigate to security'),
            color: 'red' as const
        }
    ];

    return (
        <div className="space-y-4 sm:space-y-6 lg:space-y-8 p-3 sm:p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                <BeneficiariesWidget beneficiaries={willData.beneficiaries} />
                <AIAdvisorWidget />
                <MemoryVaultWidget />
                <SocialRecoveryWidget />
            </div>

            {/* Asset Distribution and Market Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                <AssetDistributionWidget assets={willData.assets} />
                <StacksMarketWidget />
                <QuickActionsWidget />
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {actionCards.map((card, index) => (
                    <ActionCard key={index} {...card} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;