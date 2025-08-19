// src/utils/constants.ts
import { NavigationTab } from '@/types';

export const NAVIGATION_TABS: NavigationTab[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'create', label: 'Create Will' },
  { id: 'assets', label: 'Assets' },
  { id: 'legacy', label: 'Legacy Vault' },
  { id: 'ai-advisor', label: 'AI Advisor' },
  { id: 'security', label: 'Security' },
];

export const RELATIONSHIP_OPTIONS = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'child', label: 'Child' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'friend', label: 'Friend' },
  { value: 'charity', label: 'Charity' },
];

export const TIME_LOCK_OPTIONS = [
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
  { value: '365', label: '1 year' },
  { value: '1095', label: '3 years' },
];

export const MEMORY_BOX_TYPES = {
  photos: 'photos',
  audio: 'audio', 
  documents: 'documents',
} as const;

export const TIME_CAPSULE_TYPES = {
  video: 'video',
  letter: 'letter',
  document: 'document',
} as const;

export const AI_RECOMMENDATION_TYPES = {
  optimization: 'optimization',
  security: 'security',
  tax: 'tax',
} as const;

export const IMPACT_LEVELS = {
  high: 'high',
  medium: 'medium',
  low: 'low',
} as const;