import { Request, Response } from 'express';
import admin from 'firebase-admin';
import { generateJWT } from '../utils/jwtSigning.js';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (!admin.apps.length) {
  try {
    const serviceAccountPath = join(__dirname, '../../../serviceAccountKey.json');
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error);
    admin.initializeApp();
  }
}

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ message: 'ID token is required' });
      return;
    }

    const decodedToken = await getAuth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      res.status(400).json({ message: 'Email not found in token' });
      return;
    }

    // Get Firestore instance
    const db = admin.firestore();
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      // Update existing user's last login
      await userRef.update({
        lastLogin: admin.firestore.FieldValue.serverTimestamp(),
        name: name || email.split('@')[0],
        picture: picture || null
      });
      console.log(`Updated existing user: ${email}`);
    } else {
      // Create new user
      const newUser = {
        uid,
        email,
        name: name || email.split('@')[0],
        picture: picture || null,
        favouritePods: [],
        currentPod: 0,
        routeHistory: [],
        currentRoute: { startId: 0, endId: 0 },
        favouriteRoutes: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLogin: admin.firestore.FieldValue.serverTimestamp()
      };
      await userRef.set(newUser);
      console.log(`Created new user: ${email}`);
    }

    generateJWT(res, uid);

    res.status(200).json({
      message: 'Authentication successful',
      user: {
        uid,
        email,
        name: name || email.split('@')[0],
        picture,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const verifyGoogleToken = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ message: 'ID token is required' });
      return;
    }

    const decodedToken = await getAuth().verifyIdToken(idToken);

    res.status(200).json({
      valid: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
    });
  } catch (error) {
    res.status(401).json({ valid: false, message: 'Invalid token' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const userData = userDoc.data();
    res.status(200).json({
      user: {
        uid: userData?.uid,
        email: userData?.email,
        name: userData?.name,
        picture: userData?.picture,
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
