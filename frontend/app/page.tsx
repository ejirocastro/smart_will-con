'use client';

import React, { useState } from 'react';
import LandingPage from '@/components/landing/LandingPage';
import Login from '@/components/auth/Login';
import Signup from '@/components/auth/Signup';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/components/dashboard/Dashboard';
import CreateWill from '@/components/forms/CreateWill';
import DraftsVersions from '@/components/drafts/DraftsVersions';
import ReviewPreview from '@/components/review/ReviewPreview';
import Deploy from '@/components/deploy/Deploy';
import HeirView from '@/components/heir/HeirView';
import VerifierDashboard from '@/components/verifier/VerifierDashboard';
import LegacyVault from '@/components/legacy/LegacyVault';
import AIAdvisor from '@/components/ai/AIAdvisor';
import { useWillData } from '@/hooks/useWillData';
import { useHeartbeat } from '@/hooks/useHeartbeat';
import { useAuth } from '@/contexts/AuthContext';
import { TabType } from '@/types';
import { Wallet, Lock } from 'lucide-react';

const SmartWillApp: React.FC = () => {
  const [showApp, setShowApp] = useState<boolean>(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { willData } = useWillData();
  const { showHeartbeat } = useHeartbeat();
  const { isAuthenticated, user, login, signup, logout, loading, error, clearError } = useAuth();

  // Handle authentication flow
  const handleLogin = async (credentials: any) => {
    await login(credentials);
  };

  const handleSignup = async (data: any) => {
    await signup(data);
  };

  const handleAuthViewSwitch = (view: 'login' | 'signup') => {
    setAuthView(view);
    clearError();
  };

  // Show landing page if not authenticated and app not shown
  if (!showApp && !isAuthenticated) {
    return <LandingPage onGetStarted={() => setShowApp(true)} />;
  }

  // Show authentication forms if app is shown but user not authenticated
  if (showApp && !isAuthenticated) {
    if (authView === 'login') {
      return (
        <Login
          onLogin={handleLogin}
          onSwitchToSignup={() => handleAuthViewSwitch('signup')}
          onLogoClick={() => setShowApp(false)}
          loading={loading}
          error={error || undefined}
        />
      );
    } else {
      return (
        <Signup
          onSignup={handleSignup}
          onSwitchToLogin={() => handleAuthViewSwitch('login')}
          onLogoClick={() => setShowApp(false)}
          loading={loading}
          error={error || undefined}
        />
      );
    }
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
      case 'deploy':
        return <Deploy />;
      case 'heir-view':
        return <HeirView />;
      case 'verifier-dashboard':
        return <VerifierDashboard />;
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
      userRole={user?.role || 'owner'}
      onLogout={logout}
      user={user}
    >
      {renderContent()}
    </MainLayout>
  );
};

export default SmartWillApp;