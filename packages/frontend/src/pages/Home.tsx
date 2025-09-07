import React from 'react';
import { usePrices } from '../hooks/use-prices';

const Home: React.FC = () => {
  const { coins, loading } = usePrices();

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Cryptocurrencies</h2>
      <ul className="mt-4">
        {coins.map((coin) => (
          <li key={coin.id} className="py-2">
            {coin.name}: ${coin.current_price.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;