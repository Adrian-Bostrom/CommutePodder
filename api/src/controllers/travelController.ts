import { Request, Response } from 'express';

export const getTravelInfo = (req: Request, res: Response) => {
    // Mock data for SL travel info
    const travelData = [
        { id: 1, line: '14', destination: 'Fruängen', time: '10 min', type: 'Metro' },
        { id: 2, line: '13', destination: 'Norsborg', time: '12 min', type: 'Metro' },
        { id: 3, line: '4', destination: 'Radiohuset', time: '5 min', type: 'Bus' },
        { id: 4, line: '14', destination: 'Mörby Centrum', time: '2 min', type: 'Metro' }
    ];
    res.json(travelData);
};
