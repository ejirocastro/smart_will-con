/**
 * Components Barrel Export
 * Central export point for all application components
 */

// UI Components (reusable across the app)
export * from './ui';

// Feature Components
export * from './dashboard/widgets';

// Common Components
export { default as Footer } from './common/Footer';
export { default as Navigation } from './common/Navigation';
export { default as Sidebar } from './common/Sidebar';
export { default as TopNavbar } from './common/TopNavbar';

// Auth Components
export { default as Login } from './auth/Login';
export { default as LoginModal } from './auth/LoginModal';
export { default as Signup } from './auth/Signup';
export { default as SignupModal } from './auth/SignupModal';

// Page Components
export { default as Dashboard } from './dashboard/Dashboard';
export { default as LandingPage } from './landing/LandingPage';
export { default as CreateWill } from './forms/CreateWill';
export { default as HeirView } from './heir/HeirView';
export { default as VerifierDashboard } from './verifier/VerifierDashboard';
export { default as MainLayout } from './layout/MainLayout';

// Other Feature Components
export { default as AIAdvisor } from './ai/AIAdvisor';
export { default as Deploy } from './deploy/Deploy';
export { default as DraftsVersions } from './drafts/DraftsVersions';
export { default as LegacyVault } from './legacy/LegacyVault';
export { default as ReviewPreview } from './review/ReviewPreview';