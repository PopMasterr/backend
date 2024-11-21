import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/jwtMiddleware';
import { checkBlacklist } from '../middleware/blackList';
import { createGameSession, findGameSessionByCode } from '../controllers/gameSessionsController';

const router = express.Router();

router.post("/createGameSession/:numberOfRounds", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    try {
        const numberOfRounds: number = req.body.numberOfRounds;
        const userId = req.body.user?.id;
        const gameSessionCode: string | null = await createGameSession(userId, numberOfRounds);

        if (gameSessionCode === null) {
            res.status(500).json({ message: `Failed to create a game session` });
        }

        res.status(200).json({ gameSessionCode: gameSessionCode });
    } catch (error) {
        res.status(500).json({ message: `Failed to create a game session ${error}` });
    }
});

router.get("/findGameSessionById/:sessionCode", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    try {
        const gameSession = await findGameSessionByCode(req.params.sessionCode);

        if (gameSession === null) {
            res.status(404).json({ message: `Game session not found` });
        }

        res.status(200).json({ gameSession });
    } catch (error) {
        res.status(500).json({ message: `Failed to find game session ${error}` });
    }
});

export default router;