import { NavigationTab, UserRole } from '@/types';

// All navigation tabs
export const ALL_NAVIGATION_TABS: NavigationTab[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
  },
  {
    id: 'create',
    label: 'Create Will',
  },
  {
    id: 'drafts-versions',
    label: 'Drafts & Versions',
  },
  {
    id: 'review-preview',
    label: 'Review & Preview',
  },
  {
    id: 'deploy',
    label: 'Deploy',
  },
  {
    id: 'assets',
    label: 'Assets',
  },
  {
    id: 'legacy',
    label: 'Legacy Vault',
  },
  {
    id: 'ai-advisor',
    label: 'AI Advisor',
  },
  {
    id: 'security',
    label: 'Security',
  },
  {
    id: 'heir-view',
    label: 'Heir View',
  },
  {
    id: 'verifier-dashboard',
    label: 'Verifier Dashboard',
  },
];

// Role-based navigation tabs
export const ROLE_NAVIGATION: Record<UserRole, string[]> = {
  owner: ['dashboard', 'create', 'drafts-versions', 'review-preview', 'deploy', 'assets', 'legacy', 'ai-advisor', 'security'],
  heir: ['dashboard', 'heir-view', 'assets', 'legacy'],
  verifier: ['dashboard', 'verifier-dashboard', 'review-preview', 'security']
};

// Get navigation tabs for a specific role
export const getNavigationTabsForRole = (role: UserRole): NavigationTab[] => {
  const allowedTabIds = ROLE_NAVIGATION[role];
  return ALL_NAVIGATION_TABS.filter(tab => allowedTabIds.includes(tab.id));
};

// Backward compatibility - default to owner role
export const NAVIGATION_TABS = getNavigationTabsForRole('owner');