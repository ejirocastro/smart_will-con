/**
 * Custom Hook for Will Data Management
 * Provides will data state management with loading and error handling
 */
import { useState, useEffect } from 'react';
import { WillData } from '@/types';
import { getMockWillData } from '@/data/mockData';

interface UseWillDataReturn {
  /** Current will data state */
  willData: WillData;
  /** Function to update will data state */
  setWillData: React.Dispatch<React.SetStateAction<WillData>>;
  /** Loading state indicator */
  loading: boolean;
  /** Error message if data fetching fails */
  error: string | null;
}

/**
 * Custom hook for managing will data state
 * Fetches will data on component mount and provides state management
 * 
 * @returns {UseWillDataReturn} Object containing will data, loading state, error state, and update function
 */
export const useWillData = (): UseWillDataReturn => {
  // Initialize will data with empty state
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
    /**
     * Async function to fetch will data
     * Simulates API call with mock data for development
     */
    const fetchWillData = async (): Promise<void> => {
      try {
        setLoading(true);
        
        // Simulate realistic API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Fetch mock data (replace with actual API call in production)
        const mockData = getMockWillData();
        setWillData(mockData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch will data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchWillData();
  }, []); // Empty dependency array - fetch once on mount

  return {
    willData,
    setWillData,
    loading,
    error
  };
};