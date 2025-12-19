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

        res.json({ success: true, isFavorite, favorites: newFavorites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update favorites' });
    }
};

