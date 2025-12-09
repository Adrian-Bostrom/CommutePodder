import { Request, Response } from 'express';
import { getUsers } from '../models/firestoreModel';
export const getUser = async (req: Request, res: Response) => {
    try {
        // Mock data for SL travel info
        const response = await getUsers();
        console.log("made request", response)
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch travel info' });
    }
};
