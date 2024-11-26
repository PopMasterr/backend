import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/jwtMiddleware';
import { checkBlacklist } from '../middleware/blackList';
import { findUserAchievementsByUserId } from '../controllers/userAchievementsController';

const router = express.Router();

router.get("/getUserAchievements", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
    try {
        const userId = req.body.user?.id;

        const userAchievements = await findUserAchievementsByUserId(userId);

        if (userAchievements.length === 0) {
            res.status(404).json({ message: `User achievements not found` });
        }

        res.status(200).json(userAchievements);
    } catch (error) {
        res.status(500).json({ message: `Failed to get user achievements ${error}` });
    }
});

export default router;