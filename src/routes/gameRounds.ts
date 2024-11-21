import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/jwtMiddleware';
import { checkBlacklist } from '../middleware/blackList';
import { findGameRoundsByGameSessionId } from '../controllers/gameRoundsController';

const router = express.Router();

router.get("/findGameRoundsBySessionId/:sessionId", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    try {
        const gameRounds = await findGameRoundsByGameSessionId(Number(req.params.sessionId));

        if (gameRounds === null) {
            res.status(404).json({ message: `Game rounds not found` });
        }

        res.status(200).json({ gameRounds });
    } catch (error) {
        res.status(500).json({ message: `Failed to find game rounds ${error}` });
    }
});
