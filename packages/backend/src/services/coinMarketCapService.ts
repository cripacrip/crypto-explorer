interface CoinMarketCapResponse {
  status: {
    error_code: number;
    error_message: string;
  };
  data: Array<{
    id: number;
    name: string;
    symbol: string;
    quote: {
      USD: {
        price: number;
        market_cap: number;
        volume_24h: number;
        percent_change_24h: number;
      };
    };
  }>;
}

export interface FormattedCoin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  volume_24h: number;
  percent_change_24h: number;
}

const getConfig = () => {
  const baseUrl = process.env.COINMARKETCAP_BASE_URL || 'https://pro-api.coinmarketcap.com';
  const apiKey = process.env.COINMARKETCAP_API_KEY || '';
  if (!apiKey) {
    console.warn('Warning: COINMARKETCAP_API_KEY is not set');
  }
  return { baseUrl, apiKey };
};

export const getLatestCoins = async (limit: number = 10, start: number = 1): Promise<FormattedCoin[]> => {
  const { baseUrl, apiKey } = getConfig();

  if (!apiKey) {
    throw new Error('API key is required');
  }

  const response = await fetch(
    `${baseUrl}/v1/cryptocurrency/listings/latest?limit=${limit}&start=${start}`,
    {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: CoinMarketCapResponse = await response.json();

  if (data.status.error_code !== 0) {
    throw new Error(data.status.error_message || 'API returned an error');
  }

  return data.data.map((coin) => ({
    id: coin.id.toString(),
    name: coin.name,
    symbol: coin.symbol,
    current_price: coin.quote.USD.price,
    market_cap: coin.quote.USD.market_cap,
    volume_24h: coin.quote.USD.volume_24h,
    percent_change_24h: coin.quote.USD.percent_change_24h,
  }));
};

export const getCoinDetails = async (coinId: string): Promise<FormattedCoin | null> => {
  const { baseUrl, apiKey } = getConfig();

  if (!apiKey) {
    throw new Error('API key is required');
  }

  const response = await fetch(
    `${baseUrl}/v1/cryptocurrency/quotes/latest?id=${coinId}`,
    {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  if (data.status.error_code !== 0) {
    throw new Error(data.status.error_message || 'API returned an error');
  }

  const coin = data.data[coinId];
  if (!coin) {
    return null;
  }

  return {
    id: coin.id.toString(),
    name: coin.name,
    symbol: coin.symbol,
    current_price: coin.quote.USD.price,
    market_cap: coin.quote.USD.market_cap,
    volume_24h: coin.quote.USD.volume_24h,
    percent_change_24h: coin.quote.USD.percent_change_24h,
  };
};
