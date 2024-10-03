import express, { Request, Response } from 'express';
import { registerUser, loginUser } from '../controllers/userController';
import { authenticateToken } from '../middleware/jwtMiddleware';
import { JwtPayload } from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    await registerUser(username, password);
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ error: 'Error registering user' });
  }
});


router.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const token = await loginUser(username, password);
    if (token) {
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

router.get('/dashboard', authenticateToken, (req: Request, res: Response) => {


  res.json({ message: `Hello ${req.body.user?.username}, welcome to your dashboard!` });
});




export default router;
