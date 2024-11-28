import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/jwtMiddleware';
import { checkBlacklist } from '../middleware/blackList';
import { getGameRoundCoordinates, getGameRoundPopulationAndScore } from '../controllers/gameRoundsController';

const router = express.Router();

router.get("/getGameRoundCoordinates", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    try {
        const gameSessionId = req.query.gameSessionId;
        const round = req.query.round;

        const coordinates = await getGameRoundCoordinates(Number(gameSessionId), Number(round));

        if (coordinates === null) {
            res.status(404).json({ message: `Game round coordinates not found` });
        }

        res.status(200).json(coordinates);
    } catch (error) {
        res.status(500).json({ message: `Failed to get game round coordinates ${error}` });
    }
});

router.get("/getGameRoundPopulationAndScore", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    try {
        const userId = req.body.user?.id;
        const gameSessionId = req.query.gameSessionId;
        const round = req.query.round;
        const guess = req.query.guess;

        const populationAndScore = await getGameRoundPopulationAndScore(userId, Number(gameSessionId), Number(round), Number(guess));

        if (populationAndScore === null) {
            res.status(404).json({ message: `Game round population not found` });
        }

        res.status(200).json(populationAndScore);
    } catch (error) {
        res.status(500).json({ message: `Failed to get game round population ${error}` });
    }
});

export default router;
