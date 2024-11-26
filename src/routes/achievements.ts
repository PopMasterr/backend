import express, { Request, Response } from 'express';
import { createAchievements } from '../controllers/achievementsController';

const router = express.Router();

router.get('/createAchievements', async (req: Request, res: Response) => {
    try {
        const achievementsCreated: boolean = await createAchievements();
    
        if (achievementsCreated) {
            res.status(200).json({ message: 'Achievements created' });
        } else {
            res.status(404).json({ message: 'Achievements not created' });
        }
    } catch (error){
        res.status(500).json({ message: `Failed to create achievements ${error}` });
    }
});

export default router;