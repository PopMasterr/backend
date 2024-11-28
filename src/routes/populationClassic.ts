import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/jwtMiddleware';
import { checkBlacklist } from '../middleware/blackList';
import { getData, getScoreAndPopulation, TGameResult } from '../controllers/populationServiceController';
import { findClassicGameByUserId, TClassicGamePort, updateClassicGameByUserId } from '../controllers/classicGamesController';

const router = express.Router();

router.get("/getCoordinates", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
  try {
    const userId = req.body.user?.id;

    await updateClassicGameByUserId(userId);
    const data = await findClassicGameByUserId(userId);

    res.status(200).json({ x1: data?.x1, y1: data?.y1, x2: data?.x2, y2: data?.y2 });
  } catch (error) {
    res.status(500).json({ message: `Failed to get data ${error}` });
  }
});

router.get("/getScore", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
  try {
    const userId = req.body.user?.id;
    const {guess} = req.query;

    const data: TGameResult | null = await getScoreAndPopulation(Number(guess), userId);

    if (data === null) {
      res.status(404).json({ message: `Score not found` });
    }

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: `Failed to get score ${error}` });
  }
});

export default router;
