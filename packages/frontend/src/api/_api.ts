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

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  count?: number;
  pagination?: PaginationInfo;
  message?: string;
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

  // Auth token management
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get auth headers
  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
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
        headers: this.getAuthHeaders(),
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
        headers: this.getAuthHeaders(),
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