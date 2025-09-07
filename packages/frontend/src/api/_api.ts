interface Coin {
  id: string;
  name: string;
  current_price: number;
  statusText?: string;
}

interface ApiResponse {
  status: 'success' | 'error';
  response: Coin[] | { code: number; statusText: string };
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
      if (data.status === 'success') {
        return options.needRaw ? data : data.response;
      }
      throw new Error(data.response.statusText || 'API request failed');
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  async post(endpoint: string, data: Record<string, any> = {}, options: { needRaw?: boolean } = {}) {
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
      if (responseData.status === 'success') {
        return options.needRaw ? responseData : responseData.response;
      }
      throw new Error(responseData.response.statusText || 'API request failed');
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      throw error;
    }
  }
}

export const api = new ApiCaller();