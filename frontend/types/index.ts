// frontend/types/index.ts
export interface Beneficiary {
  id: number;
  name: string;
  relationship: string;
  percentage: number;
  verified: boolean;
}

export interface Assets {
  stx: string;
  btc: string;
  nfts: number;
  totalValue: string;
}

export interface WillCondition {
  type: string;
  description: string;
  status: 'active' | 'inactive';
}

export interface WillData {
  beneficiaries: Beneficiary[];
  assets: Assets;
  conditions: WillCondition[];
}

export interface AIRecommendation {
  id: number;
  type: 'optimization' | 'security' | 'tax';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
}

export interface MemoryBox {
  id: number;
  title: string;
  type: 'photos' | 'audio' | 'documents';
  count: number;
  unlockDate: string;
}

export interface TimeCapsule {
  id: number;
  title: string;
  recipient: string;
  releaseDate: string;
  type: 'video' | 'letter' | 'document';
}

export interface SocialRecoveryGuardian {
  id: number;
  name: string;
  relationship: string;
  verified: boolean;
  responseTime: string;
}

export interface StacksPricePoint {
  price: number;
  timestamp: number;
}

export interface NavigationTab {
  id: string;
  label: string;
  href?: string;
}

export type TabType = 'dashboard' | 'create' | 'assets' | 'legacy' | 'ai-advisor' | 'security';