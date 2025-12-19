import { Request, Response } from 'express';
import admin from 'firebase-admin';
import { generateJWT } from '../utils/jwtSigning.js';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ message: 'ID token is required' });
      return;
    }

    // Verify the Google ID token
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      res.status(400).json({ message: 'Email not found in token' });
      return;
    }

    // Generate JWT for session management
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
