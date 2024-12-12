import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/jwtMiddleware';
import { checkBlacklist } from '../middleware/blackList';
import { getTopPlayersOfGamesPlayed, getTopPlayersOfHighestStreak, getTopPlayersOfPerfectGuesses, getTopPlayersOfTotalScore, TTotalScoreLeaderboard } from '../controllers/leaderboardsController';


const router = express.Router();

router.get("/getTopPlayersOfTotalScore", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    try {
        const topPlayers = await getTopPlayersOfTotalScore();
        if (topPlayers === null) {
            res.status(404).json({ message: `Leaderboards not found` });
        }

        res.status(200).json(topPlayers);
    } catch (error) {
        res.status(500).json({ message: `Failed to get leaderboards ${error}` });
    }
});

router.get("/getTopPlayersOfPerfectGuesses", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    try {
        const topPlayers = await getTopPlayersOfPerfectGuesses();
        if (topPlayers === null) {
            res.status(404).json({ message: `Leaderboards not found` });
        }

        res.status(200).json(topPlayers);
    } catch (error) {
        res.status(500).json({ message: `Failed to get leaderboards ${error}` });
    }
});

router.get("/getTopPlayersOfGamesPlayed", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    try {
        const topPlayers = await getTopPlayersOfGamesPlayed();
        if (topPlayers === null) {
            res.status(404).json({ message: `Leaderboards not found` });
        }

        res.status(200).json(topPlayers);
    } catch (error) {
        res.status(500).json({ message: `Failed to get leaderboards ${error}` });
    }
});

router.get("/getTopPlayersOfHighestStreak", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    try {
        const topPlayers = await getTopPlayersOfHighestStreak();
        if (topPlayers === null) {
            res.status(404).json({ message: `Leaderboards not found` });
        }

        res.status(200).json(topPlayers);
    } catch (error) {
        res.status(500).json({ message: `Failed to get leaderboards ${error}` });
    }
});

export default router;