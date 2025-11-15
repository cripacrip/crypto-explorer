import { useState, useEffect, useCallback } from 'react';
import { api, type Coin, type PaginationInfo } from '@/api/_api';

interface ApiResponse {
  data: Coin[];
  count: number;
  pagination: PaginationInfo;
}

interface UseCryptoListResult {
  coins: Coin[];
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo;
  currentPage: number;
  totalPages: number;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  refetch: () => void;
}

interface UseCryptoListOptions {
  pageSize?: number;
  initialPage?: number;
}

/**
 * Hook to fetch paginated cryptocurrency list
 * @param options - Configuration options for pagination
 * @param options.pageSize - Number of coins per page (default: 10)
 * @param options.initialPage - Initial page number (default: 1)
 */
export const useCryptoList = (options: UseCryptoListOptions = {}): UseCryptoListResult => {
  const { pageSize = 10, initialPage = 1 } = options;

  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pagination, setPagination] = useState<PaginationInfo>({
    start: 1,
    limit: pageSize,
    total: 0,
  });

  const fetchCoins = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setError(null);

      const start = (page - 1) * pageSize + 1;
      const response = await api.get('/coins', {
        limit: pageSize.toString(),
        start: start.toString(),
      }, { needRaw: true }) as ApiResponse;

      setCoins(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Error fetching crypto list:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch cryptocurrency list');
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchCoins(currentPage);
  }, [currentPage, fetchCoins]);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
  }, []);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goToPage = useCallback((page: number) => {
    if (page >= 1) {
      setCurrentPage(page);
    }
  }, []);

  const refetch = useCallback(() => {
    fetchCoins(currentPage);
  }, [currentPage, fetchCoins]);

  // Calculate total pages (approximate since we don't know total count from API)
  // CoinMarketCap has ~10,000 cryptocurrencies, but we'll use a conservative estimate
  const totalPages = Math.ceil(5000 / pageSize);

  return {
    coins,
    loading,
    error,
    pagination,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    refetch,
  };
};
