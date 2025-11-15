export interface Coin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  volume_24h: number;
  percent_change_24h: number;
  statusText?: string;
}

export interface PaginationInfo {
  start: number;
  limit: number;
  total: number;
}

interface ApiResponse {
  success: boolean;
  data?: Coin[];
  count?: number;
  pagination?: PaginationInfo;
  error?: string;
}

export class ApiCaller {
  private baseURL: string;
  private apiVersion: string;

  constructor() {
    // Use relative path by default so Vite proxy handles routing in dev and nginx in prod
    this.baseURL = (import.meta.env.VITE_APP_API_HTTP || '').trim();
    this.apiVersion = (import.meta.env.VITE_APP_API_VER || '/api').trim();
  }

  async get(endpoint: string, query: Record<string, string> = {}, options: { needRaw?: boolean } = {}) {
    const base = this.baseURL;
    // Ensure relative if baseURL is empty
    let url = `${base}${this.apiVersion}${endpoint}`;
    const validQuery: Record<string, string> = {};
    for (const key in query) {
      if (query[key]) validQuery[key] = query[key].toString();
    }
    const queryString = new URLSearchParams(validQuery).toString();
    if (queryString) url += `?${queryString}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data: ApiResponse = await response.json();
      if (data.success) {
        return options.needRaw ? data : data.data;
      }
      throw new Error(data.error || 'API request failed');
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  async post(endpoint: string, data: Record<string, unknown> = {}, options: { needRaw?: boolean } = {}) {
    const base = this.baseURL;
    const url = `${base}${this.apiVersion}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const responseData: ApiResponse = await response.json();
      if (responseData.success) {
        return options.needRaw ? responseData : responseData.data;
      }
      throw new Error(responseData.error || 'API request failed');
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      throw error;
    }
  }
}

export const api = new ApiCaller();