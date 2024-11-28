import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/jwtMiddleware';
import { checkBlacklist } from '../middleware/blackList';
import { getAnswerIsCorrectAndScore, getCoordinates, updateStreakGame } from '../controllers/streakController';

const router = express.Router();

router.get("/getStreakCoordinates", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    try {
        const userId = req.body.user?.id;

        await updateStreakGame(userId);
        const streakCoordinates = await getCoordinates(userId);

        if (streakCoordinates === null) {
            res.status(404).json({ message: `Streak coordinates not found` });
        }

        res.status(200).json(streakCoordinates);
    } catch (error) {
        res.status(500).json({ message: `Failed to get streak coordinates ${error}` });
    }
});

router.get("/getAnswerIsCorrectAndScore/:answer", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    try {
        const userId = req.body.user?.id;
        const answer = req.params.answer;

        if (!(answer === 'blue' || answer === 'red')){
            res.status(400).json({ message: `Invalid answer` });
        } 
        const result = await getAnswerIsCorrectAndScore(userId, answer);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: `Failed to get is answer correct and score ${error}` });
    }
});

export default router;