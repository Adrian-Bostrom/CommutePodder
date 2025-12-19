import { Request, Response } from 'express';

export const searchStops = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Query parameter "q" is required' });
        }

        const response = await fetchSLStops(q as string);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch stops' });
    }
};

export async function fetchSLStops(searchString: string): Promise<any> {
  const params = new URLSearchParams({
    name_sf: searchString,
    any_obj_filter_sf: '0',
    type_sf: 'any'
  });
  const url = `https://journeyplanner.integration.sl.se/v2/stop-finder?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`SL API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}
