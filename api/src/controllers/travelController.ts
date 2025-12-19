import { Request, Response } from 'express';

export const getTravelInfo = async (req: Request, res: Response) => {
    try {
        const { originId, destId } = req.query;
        
        // Mock data for SL travel info
        const response = await fetchSLTrips({
            originId: (originId as string) || '9091001000009182',
            destId: (destId as string) || '9091001000009192'
        });
        console.log("made request", response)
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch travel info' });
    }
};

interface SLTripsOptions {
  originId: string;
  destId: string;
  numberOfTrips?: number;
  typeOrigin?: string;
  typeDestination?: string;
}

export async function fetchSLTrips({
  originId,
  destId,
  numberOfTrips = 3,
  typeOrigin = 'any',
  typeDestination = 'any'
}: SLTripsOptions): Promise<any> {
  const params = new URLSearchParams({
    type_origin: typeOrigin,
    type_destination: typeDestination,
    name_origin: originId,
    name_destination: destId,
    calc_number_of_trips: numberOfTrips.toString(),
  });
  const url = `https://journeyplanner.integration.sl.se/v2/trips?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`SL API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}