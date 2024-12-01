import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/jwtMiddleware';
import { checkBlacklist } from '../middleware/blackList';
import { createGameSession, findGameSessionByCode, findGameSessionsByUserId, getTheNumberOfRounds } from '../controllers/gameSessionsController';

const router = express.Router();

router.post("/createGameSession", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    try {
        const userId = req.body.user?.id;
        const numberOfRounds = req.body.numberOfRounds;
        const gameSessionCode = await createGameSession(userId, numberOfRounds);

        if (gameSessionCode === null) {
            res.status(404).json({ message: `Game session not created` });
        }

        res.status(200).json(gameSessionCode);
    } catch (error) {
        res.status(500).json({ message: `Failed to create game session ${error}` });
    }
});

router.get("/getGameSessionByCode/:code", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    try {
        const code = req.params.code;
        const gameSessionId = await findGameSessionByCode(code);

        if (gameSessionId === null) {
            res.status(404).json({ message: `Game session not found` });
        }

        res.status(200).json(gameSessionId);
    } catch (error) {
        res.status(500).json({ message: `Failed to get game session by code ${error}` });
    }
});

router.get("/getGameSessionsByUserId", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    try {
        const userId = req.body.user?.id;

        const gameSessionCodes = await findGameSessionsByUserId(userId);

        if (gameSessionCodes === null) {
            res.status(404).json({ message: `Game sessions not found` });
        }

        res.status(200).json(gameSessionCodes);
    } catch (error) {
        res.status(500).json({ message: `Failed to get game sessions by user id ${error}` });
    }
});

router.get("/getGameSessionsRounds/:gameSessionId", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    try {
        const gameSessionId = req.params.gameSessionId;

        const numberOfRounds = await getTheNumberOfRounds(Number(gameSessionId));

        if (numberOfRounds === null) {
            res.status(404).json({ message: `Game session rounds not found` });
        }

        res.status(200).json(numberOfRounds);
    } catch (error) {
        res.status(500).json({ message: `Failed to get game sessions rounds ${error}` });
    }
});

export default router;
