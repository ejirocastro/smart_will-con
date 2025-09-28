'use client';

import React, { useState } from 'react';
import LandingPage from '@/components/landing/LandingPage';
import LoginModal from '@/components/auth/LoginModal';
import SignupModal from '@/components/auth/SignupModal';
import OTPVerificationModal from '@/components/auth/OTPVerificationModal';
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
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [showSignupModal, setShowSignupModal] = useState<boolean>(false);
  const [showEmailVerification, setShowEmailVerification] = useState<boolean>(false);
  const [verificationEmail, setVerificationEmail] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const { willData } = useWillData();
  const { showHeartbeat } = useHeartbeat();
  const { isAuthenticated, user, login, signup, loginWithWallet, signupWithWallet, logout, completeAuthentication, loading, error, clearError } = useAuth();

  // Handle authentication flow
  const handleLogin = async (credentials: any) => {
    try {
      await login(credentials);
      setShowLoginModal(false);
    } catch (err) {
      // Error will be displayed by the modal
      console.error('Login failed:', err);
    }
  };

  const handleSignup = async (data: any) => {
    try {
      const result = await signup(data);

      if (result.requiresVerification) {
        // Show email verification screen
        setVerificationEmail(result.email || data.email);
        setShowSignupModal(false);
        setShowEmailVerification(true);
      } else {
        // User created and logged in immediately (shouldn't happen with new flow)
        setShowSignupModal(false);
      }
    } catch (err) {
      // Error will be displayed by the modal
      console.error('Signup failed:', err);
    }
  };

  // Handle wallet login
  const handleWalletLogin = async () => {
    try {
      console.log('🔄 Page: Starting wallet login through AuthContext...');
      await loginWithWallet();
      setShowLoginModal(false);
      console.log('✅ Page: Wallet login successful, modal closed');
    } catch (err) {
      console.error('❌ Page: Wallet login failed:', err);
      // Error will be displayed by the modal through AuthContext
    }
  };

  // Handle wallet signup
  const handleWalletSignup = async () => {
    try {
      console.log('🔄 Page: Starting wallet signup through AuthContext...');
      await signupWithWallet();
      setShowSignupModal(false);
      console.log('✅ Page: Wallet signup successful, modal closed');
    } catch (err) {
      // Handle user cancellation gracefully - don't log as error
      if (err instanceof Error && err.message === 'WALLET_CANCELED') {
        console.log('ℹ️ Page: User canceled wallet signup');
        return;
      }

      console.error('❌ Page: Wallet signup failed:', err);
      // Error will be displayed by the modal through AuthContext
    }
  };

  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
    clearError();
  };

  const handleSwitchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
    clearError();
  };

  const handleCloseModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    setShowEmailVerification(false);
    clearError();
  };

  const handleVerificationComplete = (user: any, token: string) => {
    // Complete authentication and close verification
    completeAuthentication(user, token);
    setShowEmailVerification(false);
  };

  const handleBackToSignup = () => {
    setShowEmailVerification(false);
    setShowSignupModal(true);
  };

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <LandingPage
          onGetStarted={() => setShowApp(true)}
          onSignInClick={() => setShowLoginModal(true)}
          onSignUpClick={() => setShowSignupModal(true)}
        />

        {/* Auth Modals */}
        <LoginModal
          isOpen={showLoginModal}
          onClose={handleCloseModals}
          onLogin={handleLogin}
          onWalletLogin={handleWalletLogin}
          onSwitchToSignup={handleSwitchToSignup}
          loading={loading}
          error={error || undefined}
        />

        <SignupModal
          isOpen={showSignupModal}
          onClose={handleCloseModals}
          onSignup={handleSignup}
          onWalletSignup={handleWalletSignup}
          onSwitchToLogin={handleSwitchToLogin}
          loading={loading}
          error={error || undefined}
        />

        {/* OTP Verification Modal */}
        <OTPVerificationModal
          isOpen={showEmailVerification}
          email={verificationEmail}
          onClose={handleCloseModals}
          onVerificationComplete={handleVerificationComplete}
          onBackToSignup={handleBackToSignup}
        />
      </>
    );
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
    <>
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

      {/* Auth Modals - Available even when authenticated for other users */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleCloseModals}
        onLogin={handleLogin}
        onWalletLogin={handleWalletLogin}
        onSwitchToSignup={handleSwitchToSignup}
        loading={loading}
        error={error || undefined}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={handleCloseModals}
        onSignup={handleSignup}
        onWalletSignup={handleWalletSignup}
        onSwitchToLogin={handleSwitchToLogin}
        loading={loading}
        error={error || undefined}
      />
    </>
  );
};

export default SmartWillApp;