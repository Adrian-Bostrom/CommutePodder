import axios from 'axios';

const BASE_URL = 'https://listen-api-test.listennotes.com/api/v2/search';
const API_KEY = process.env.LISTENNOTES_API_KEY; // set this in your backend .env

if (!API_KEY) {
  console.warn(
    'U dont have an api key set, this means you cannot run this website as it cannot get the right data.'
  );
}

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
    const resp = await axios.get(url, {
      headers: {
        'X-ListenAPI-Key': API_KEY ?? '',
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