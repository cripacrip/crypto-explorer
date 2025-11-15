import { useState, useEffect } from 'react';
import { api, type Coin } from '@/api/_api';

interface UseTopCoinsResult {
  coins: Coin[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch the top 10 cryptocurrencies for the dashboard
 */
export const useTopCoins = (): UseTopCoinsResult => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCoins = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get('/coins', { limit: '10' });
      setCoins(data as Coin[]);
    } catch (err) {
      console.error('Error fetching top coins:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch coins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  return { coins, loading, error, refetch: fetchCoins };
};
