// src/data/mockData.ts
import { 
  WillData, 
  AIRecommendation, 
  MemoryBox, 
  TimeCapsule, 
  SocialRecoveryGuardian 
} from '@/types';

export const getMockWillData = (): WillData => ({
  beneficiaries: [
    { id: 1, name: 'Sarah Johnson', relationship: 'Spouse', percentage: 60, verified: true },
    { id: 2, name: 'Michael Johnson', relationship: 'Son', percentage: 25, verified: true },
    { id: 3, name: 'Emily Johnson', relationship: 'Daughter', percentage: 15, verified: false }
  ],
  assets: {
    stx: '50,000',
    btc: '2.5',
    nfts: 12,
    totalValue: '$125,000'
  },
  conditions: [
    { type: 'Age Requirement', description: 'Children must be 21+ to inherit', status: 'active' },
    { type: 'Time Lock', description: 'Release after 30 days of inactivity', status: 'active' }
  ]
});

export const getMockAIRecommendations = (): AIRecommendation[] => [
  { 
    id: 1, 
    type: 'optimization', 
    title: 'Optimize Asset Distribution', 
    description: 'AI suggests redistributing 5% from savings to crypto based on market trends',
    confidence: 87,
    impact: 'medium'
  },
  { 
    id: 2, 
    type: 'security', 
    title: 'Add Social Recovery', 
    description: 'Consider adding your brother as a recovery guardian for enhanced security',
    confidence: 92,
    impact: 'high'
  },
  { 
    id: 3, 
    type: 'tax', 
    title: 'Tax Optimization Available', 
    description: 'Charitable donation could reduce inheritance tax by $3,400',
    confidence: 95,
    impact: 'high'
  }
];

export const getMockMemoryBoxes = (): MemoryBox[] => [
  { id: 1, title: 'Family Photos', type: 'photos', count: 150, unlockDate: '2030-01-01' },
  { id: 2, title: 'Voice Messages', type: 'audio', count: 12, unlockDate: '2028-06-15' },
  { id: 3, title: 'Personal Letters', type: 'documents', count: 8, unlockDate: '2025-12-25' }
];

export const getMockTimeCapsules = (): TimeCapsule[] => [
  { id: 1, title: 'Wedding Anniversary Message', recipient: 'Sarah Johnson', releaseDate: '2026-05-20', type: 'video' },
  { id: 2, title: 'Career Advice for Michael', recipient: 'Michael Johnson', releaseDate: '2030-01-01', type: 'letter' },
  { id: 3, title: 'Family Recipe Collection', recipient: 'All Family', releaseDate: '2025-11-25', type: 'document' }
];

export const getMockSocialRecovery = (): SocialRecoveryGuardian[] => [
  { id: 1, name: 'Emma Wilson', relationship: 'Sister', verified: true, responseTime: '2h' },
  { id: 2, name: 'Dr. James Chen', relationship: 'Family Doctor', verified: true, responseTime: '24h' },
  { id: 3, name: 'Robert Johnson', relationship: 'Best Friend', verified: false, responseTime: 'pending' }
];