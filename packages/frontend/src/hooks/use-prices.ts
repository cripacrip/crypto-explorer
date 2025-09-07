import { useState, useEffect } from 'react';
import { api } from '@/api/_api';

interface Coin {
  id: string;
  name: string;
  current_price: number;
}

export const usePrices = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        // const data = await api.get('/cryptocurrency/listings/latest');
        const data = await api.get('/coins');
        setCoins(data as Coin[]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching coins:', error);
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  return { coins, loading };
};