// src/hooks/useWillData.ts
import { useState, useEffect } from 'react';
import { WillData } from '@/types';
import { getMockWillData } from '@/data/mockData';

interface UseWillDataReturn {
  willData: WillData;
  setWillData: React.Dispatch<React.SetStateAction<WillData>>;
  loading: boolean;
  error: string | null;
}

export const useWillData = (): UseWillDataReturn => {
  const [willData, setWillData] = useState<WillData>({
    beneficiaries: [],
    assets: {
      stx: '0',
      btc: '0',
      nfts: 0,
      totalValue: '$0'
    },
    conditions: []
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWillData = async (): Promise<void> => {
      try {
        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockData = getMockWillData();
        setWillData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch will data');
      } finally {
        setLoading(false);
      }
    };

    fetchWillData();
  }, []);

  return {
    willData,
    setWillData,
    loading,
    error
  };
};