'use client';

import React, { useState } from 'react';
import LandingPage from '@/components/landing/LandingPage';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/components/dashboard/Dashboard';
import CreateWill from '@/components/forms/CreateWill';
import DraftsVersions from '@/components/drafts/DraftsVersions';
import ReviewPreview from '@/components/review/ReviewPreview';
import LegacyVault from '@/components/legacy/LegacyVault';
import AIAdvisor from '@/components/ai/AIAdvisor';
import { useWillData } from '@/hooks/useWillData';
import { useHeartbeat } from '@/hooks/useHeartbeat';
import { TabType } from '@/types';
import { Wallet, Lock } from 'lucide-react';

const SmartWillApp: React.FC = () => {
  const [showApp, setShowApp] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { willData } = useWillData();
  const { showHeartbeat } = useHeartbeat();

  if (!showApp) {
    return <LandingPage onGetStarted={() => setShowApp(true)} />;
  }

  const renderContent = (): React.ReactNode => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard willData={willData} />;
      case 'create':
        return <CreateWill />;
      case 'drafts-versions':
        return <DraftsVersions />;
      case 'review-preview':
        return <ReviewPreview willData={willData} />;
      case 'legacy':
        return <LegacyVault />;
      case 'ai-advisor':
        return <AIAdvisor />;
      case 'assets':
        return (
          <div className="text-center py-20">
            <Wallet className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Asset Management</h2>
            <p className="text-gray-400">Manage your digital assets and blockchain holdings</p>
          </div>
        );
      case 'security':
        return (
          <div className="text-center py-20">
            <Lock className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Security Settings</h2>
            <p className="text-gray-400">Configure multi-signature and recovery options</p>
          </div>
        );
      default:
        return <Dashboard willData={willData} />;
    }
  };

  return (
    <MainLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isConnected={isConnected}
      setIsConnected={setIsConnected}
      showHeartbeat={showHeartbeat}
      onLogoClick={() => setShowApp(false)}
    >
      {renderContent()}
    </MainLayout>
  );
};

export default SmartWillApp;