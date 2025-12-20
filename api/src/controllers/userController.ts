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

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const db = admin.firestore();
        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(userDoc.data());
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch user info' });
    }
};

export const toggleFavorite = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { podcastId } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (!podcastId) {
            return res.status(400).json({ error: 'Podcast ID is required' });
        }

        const db = admin.firestore();
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = userDoc.data();
        const favorites = userData?.favouritePods || [];
        
        let newFavorites;
        let isFavorite;

        if (favorites.includes(podcastId)) {
            newFavorites = favorites.filter((id: string) => id !== podcastId);
            isFavorite = false;
        } else {
            newFavorites = [...favorites, podcastId];
            isFavorite = true;
        }

        await userRef.update({
            favouritePods: newFavorites
        });

        console.log(`User: ${userId} ${isFavorite ? 'favourited' : 'unfavourited'} podcast ${podcastId}`);

        res.json({ success: true, isFavorite, favorites: newFavorites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update favorites' });
    }
};

export const toggleFavoriteRoute = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { startId, endId, startName, endName } = req.body;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        if (!startId || !endId) {
            return res.status(400).json({ error: 'Start ID and End ID are required' });
        }

        const db = admin.firestore();
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = userDoc.data();
        const favoriteRoutes = userData?.favouriteRoutes || [];
        
        let newFavoriteRoutes;
        let isFavorite;

        // Check if route exists (matching start and end IDs)
        const existingIndex = favoriteRoutes.findIndex((route: any) => 
            String(route.startId) === String(startId) && String(route.endId) === String(endId)
        );

        if (existingIndex !== -1) {
            newFavoriteRoutes = favoriteRoutes.filter((_: any, index: number) => index !== existingIndex);
            isFavorite = false;
        } else {
            // Store names if provided, otherwise try to find them? 
            // Ideally frontend provides them.
            newFavoriteRoutes = [...favoriteRoutes, { 
                startId, 
                endId, 
                startName: startName || '', 
                endName: endName || '' 
            }];
            isFavorite = true;
        }

        await userRef.update({
            favouriteRoutes: newFavoriteRoutes
        });

        const routeName = (startName && endName) ? `${startName} to ${endName}` : `${startId} to ${endId}`;
        console.log(`User: ${userId} ${isFavorite ? 'favourited' : 'unfavourited'} route ${routeName}`);

        res.json({ success: true, isFavorite, favoriteRoutes: newFavoriteRoutes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update favorite routes' });
    }
};

