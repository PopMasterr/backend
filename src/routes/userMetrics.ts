import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/jwtMiddleware';
import { checkBlacklist } from '../middleware/blackList';
import { getUserMetricsByUserId } from '../controllers/userMetricsController';

const router = express.Router();

router.get('/getMetrics', authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    const userId = req.body.user?.id;
    try {
        const metrics = await getUserMetricsByUserId(userId);

        const data = {
            total_points: metrics?.total_points,
            games_played: metrics?.games_played,
            average_score: metrics?.average_score,
            perfect_guesses: metrics?.perfect_guesses,
            highest_streak: metrics?.highest_streak,
        }
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ error: `Failed to get metrics: ${error}` });
    }
});

export default router;