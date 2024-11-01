import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/jwtMiddleware';
import { checkBlacklist } from '../middleware/blackList';
import { getPopulation, getCoordinates } from '../controllers/populationServiceController';

const router = express.Router();

router.get('/getPopulation', authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
  const { x1, x2, y1, y2 } = req.query;

  if (!x1 || !x2 || !y1 || !y2) {
    res.status(400).json({ error: 'Missing coordinates' });
    return;
  }

  try {
    const population = await getPopulation(Number(x1), Number(x2), Number(y1), Number(y2));
    if (population) {
      res.json({ population });
    } else {
      res.status(500).json({ error: 'Error getting population' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error getting population' });
  }
});

router.get('/getCoordinates', authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
  try {
    const coordinates = await getCoordinates();
    if (coordinates) {
      res.json({ coordinates });
    } else {
      res.status(500).json({ error: 'Error getting coordinates' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error getting coordinates' });
  }
});

export default router;