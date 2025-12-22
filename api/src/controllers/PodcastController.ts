import axios from 'axios';
import { Request, Response } from 'express';

const BASE_URL = 'https://listen-api.listennotes.com/api/v2/search';
const EPISODE_URL = 'https://listen-api.listennotes.com/api/v2/episodes';
const GENRES_URL = 'https://listen-api.listennotes.com/api/v2/genres';

export const getGenres = async (req: Request, res: Response) => {
    try {
        const apiKey = process.env.LISTENNOTES_API_KEY;
        const resp = await axios.get(GENRES_URL, {
            headers: {
                'X-ListenAPI-Key': apiKey ?? '',
                Accept: 'application/json',
            },
        });
        res.json(resp.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch genres' });
    }
};

export const getEpisode = async (req: Request, res: Response) => {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Episode ID is required' });
    }

    try {
        const apiKey = process.env.LISTENNOTES_API_KEY;
        const url = `${EPISODE_URL}/${id}`;

        const resp = await axios.get(url, {
            headers: {
                'X-ListenAPI-Key': apiKey ?? '',
                Accept: 'application/json',
            },
        });

        const userId = (req as any).userId;
        console.log(`User: ${userId || 'Guest'} selected podcast ${id}`);

        res.json(resp.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch episode details' });
    }
};

export const searchPodcasts = async (req: Request, res: Response) => {
    try {
        const { q, duration, genre_ids } = req.query;

        
        const params: SearchParams = {
            q: (q as string) || 'podcast',
            type: 'episode',
            language: 'English',
            sort_by_date: 0,
            unique_podcasts: 1,
        };

        if (duration) {
            const dur = parseInt(duration as string);
            if (!isNaN(dur)) {
                params.len_max = dur;
                params.len_min = Math.max(5, dur - 10); // 10 mins buffer, min 5 mins
            }
        }

        if (genre_ids) {
            params.genre_ids = genre_ids as string;
        }

        const userId = (req as any).userId;
        console.log(`User: ${userId || 'Guest'} searched for podcasts with query "${params.q}"`);

        const data = await getPodcasts(params);
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch podcasts' });
    }
};

export type SearchParams = {
  q: string;
  sort_by_date?: 0 | 1;
  type?: 'episode' | 'podcast';
  offset?: number;
  len_min?: number;
  len_max?: number;
  genre_ids?: string; // e.g. "68,82"
  published_before?: number; // epoch ms
  published_after?: number; // epoch ms
  only_in?: string; // e.g. "title,description"
  language?: string; // e.g. "English"
  safe_mode?: 0 | 1;
  unique_podcasts?: 0 | 1;
  interviews_only?: 0 | 1;
  sponsored_only?: 0 | 1;
  page_size?: number;
};

export async function getPodcasts(params: SearchParams) {
  const searchParams = new URLSearchParams();

  // copy given params into URLSearchParams
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    searchParams.set(k, String(v));
  });

  const url = `${BASE_URL}?${searchParams.toString()}`;

  try {
    const apiKey = process.env.LISTENNOTES_API_KEY;
    if (!apiKey) {
        console.warn('LISTENNOTES_API_KEY is missing in environment variables');
    }

    const resp = await axios.get(url, {
      headers: {
        'X-ListenAPI-Key': apiKey ?? '',
        Accept: 'application/json',
      },
      timeout: 10_000, // 10s timeout
    });

    return resp.data; // typed as any — narrow types as needed
  } catch (err) {
    // wrap and rethrow for caller to handle
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const data = err.response?.data;
      throw new Error(
        `ListenNotes API request failed${status ? ` (status ${status})` : ''}: ${JSON.stringify(
          data ?? err.message
        )}`
      );
    }
    throw err;
  }
}