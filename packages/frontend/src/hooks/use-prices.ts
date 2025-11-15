import { useState, useEffect } from 'react';
import { api, type Coin } from '@/api/_api';

export const usePrices = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get('/coins');
        setCoins(data as Coin[]);
      } catch (err) {
        console.error('Error fetching coins:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch coins');
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  return { coins, loading, error };
};