import { Request, Response } from 'express';
import { getLatestCoins, getCoinDetails } from '../services/coinMarketCapService';

export const listCoins = {
  schema: {
    query: {
      // e.g., { limit: number, start: number }
    },
  },
  handler: async (req: Request, res: Response) => {
    try {
      const limit = parseInt((req.query.limit as string) || '10');
      const start = parseInt((req.query.start as string) || '1');

      if (Number.isNaN(limit) || limit < 1) {
        return res.status(400).json({ success: false, error: 'Invalid limit' });
      }
      if (limit > 100) {
        return res.status(400).json({ success: false, error: 'Limit cannot exceed 100 coins' });
      }
      if (Number.isNaN(start) || start < 1) {
        return res.status(400).json({ success: false, error: 'Invalid start parameter' });
      }

      const coins = await getLatestCoins(limit, start);
      return res.json({
        success: true,
        data: coins,
        count: coins.length,
        pagination: {
          start,
          limit,
          total: coins.length
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('API key is required')) {
          return res.status(500).json({ success: false, error: 'API key is not configured' });
        }
        if (error.message.includes('API returned an error')) {
          return res.status(502).json({ success: false, error: 'External API error' });
        }
      }
      return res.status(500).json({ success: false, error: 'Failed to fetch coin data' });
    }
  },
};

export const showCoin = {
  schema: {
    params: {
      // e.g., { id: string }
    },
  },
  handler: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Coin ID is required' });
      }

      const coin = await getCoinDetails(id);
      if (!coin) {
        return res.status(404).json({ success: false, error: 'Coin not found' });
      }
      return res.json({ success: true, data: coin });
    } catch (error) {
      if (error instanceof Error && error.message.includes('API key is required')) {
        return res.status(500).json({ success: false, error: 'API key is not configured' });
      }
      return res.status(500).json({ success: false, error: 'Failed to fetch coin details' });
    }
  },
};

