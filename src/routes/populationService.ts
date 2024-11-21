import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/jwtMiddleware';
import { checkBlacklist } from '../middleware/blackList';
import { getData, getScore } from '../controllers/populationServiceController';
import { TClassicGamePort, updateClassicGameByUserId } from '../controllers/classicGamesController';

const router = express.Router();

router.get("/getCoordinates", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
  try {
    const userId = req.body.user?.id;
    const data = await getData();
    let gameData: TClassicGamePort;

    if (data === null) {
      res.status(404).json({ message: `Data not found` });
    } else {
       gameData = {
        user_id: userId,
        population: data.population,
        x1: data.x1,
        y1: data.y1,
        x2: data.x2,
        y2: data.y2
      };

      await updateClassicGameByUserId(gameData);
    }


    res.status(200).json({ x1: data?.x1, y1: data?.y1, x2: data?.x2, y2: data?.y2 });
  } catch (error) {
    res.status(500).json({ message: `Failed to get data ${error}` });
  }
});

router.get("/getScore", authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
  try {
    const userId = req.body.user?.id;
    const {guess} = req.query;

    const score = await getScore(Number(guess), userId);

    if (score === null) {
      res.status(404).json({ message: `Score not found` });
    }

    res.status(200).json({ score });
  } catch (error) {
    res.status(500).json({ message: `Failed to get score ${error}` });
  }
});

export default router;
