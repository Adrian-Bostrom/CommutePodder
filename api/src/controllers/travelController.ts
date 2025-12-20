import { Request, Response } from 'express';
import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    const serviceAccountPath = join(__dirname, '../../../serviceAccountKey.json');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
  }
}

export const getTravelInfo = async (req: Request, res: Response) => {
    try {
        const { originId, destId, date, time } = req.query;
        
        // Mock data for SL travel info
        const response = await fetchSLTrips({
            originId: (originId as string) || '9091001000009182',
            destId: (destId as string) || '9091001000009192',
            date: date as string,
            time: time as string
        });

        // Auto-save trip if user is logged in
        const userId = (req as any).userId;
        
        if (userId && response && response.journeys && response.journeys.length > 0) {
            try {
                const firstTrip = response.journeys[0];
                const legs = firstTrip.legs;
                
                if (legs && legs.length > 0) {
                    // Find the actual start and end names from the trip details
                    const firstLeg = legs[0];
                    const lastLeg = legs[legs.length - 1];
                    
                    const startName = firstLeg.origin?.name || '';
                    const endName = lastLeg.destination?.name || '';
                    
                    const db = admin.firestore();
                    const userRef = db.collection('users').doc(userId);
                    
                    const trip = {
                        startId: (originId as string),
                        endId: (destId as string),
                        startName,
                        endName,
                        timestamp: new Date()
                    };

                    // Update asynchronously with transaction to a limit of 5 most recent trips
                    db.runTransaction(async (t) => {
                        const doc = await t.get(userRef);
                        if (!doc.exists) return;

                        const userData = doc.data();
                        let history = userData?.routeHistory || [];
                        
                        // Remove any existing entry with same start/end to move it to top (end of array)
                        history = history.filter((item: any) => 
                            String(item.startId) !== String(originId) || String(item.endId) !== String(destId)
                        );

                        // Add new trip
                        history.push(trip);
                        
                        // Keep only last 5
                        if (history.length > 5) {
                            history = history.slice(history.length - 5);
                        }

                        t.update(userRef, {
                            routeHistory: history,
                            currentRoute: { startId: originId, endId: destId }
                        });
                    }).catch(err => console.error("Failed to auto-save trip:", err));
                }
            } catch (err) {
                console.error("Error processing auto-save trip:", err);
            }
        }

        // Simplified logging
        const userLabel = userId ? `User: ${userId}` : 'User: Guest';
        let routeLabel = `between ${originId} and ${destId}`;
        
        // Try to get names from response if available
        if (response && response.journeys && response.journeys.length > 0) {
             const firstTrip = response.journeys[0];
             if (firstTrip.legs && firstTrip.legs.length > 0) {
                 const startName = firstTrip.legs[0].origin?.name;
                 const endName = firstTrip.legs[firstTrip.legs.length - 1].destination?.name;
                 if (startName && endName) {
                     routeLabel = `between ${startName} and ${endName}`;
                 }
             }
        }
        
        console.log(`${userLabel} searched for a trip ${routeLabel}`);
        
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
  date?: string;
  time?: string;
}

export async function fetchSLTrips({
  originId,
  destId,
  numberOfTrips = 3,
  typeOrigin = 'any',
  typeDestination = 'any',
  date,
  time
}: SLTripsOptions): Promise<any> {
  const queryParams: any = {
    type_origin: typeOrigin,
    type_destination: typeDestination,
    name_origin: originId,
    name_destination: destId,
    calc_number_of_trips: numberOfTrips.toString(),
  };

  if (date) {
      const cleanDate = date.replace(/-/g, '');
      queryParams.date = cleanDate;
      queryParams.itd_date = cleanDate;
  }
  if (time) {
      const cleanTime = time.replace(':', '');
      queryParams.time = cleanTime;
      queryParams.itd_time = cleanTime;
  }

  const params = new URLSearchParams(queryParams);
  const url = `https://journeyplanner.integration.sl.se/v2/trips?${params.toString()}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`SL API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}