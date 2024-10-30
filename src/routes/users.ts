import express, { Request, Response } from 'express';
import { registerUser, loginUser, logoutUser, refreshAuthToken } from '../controllers/userController';
import { authenticateToken } from '../middleware/jwtMiddleware';
import { checkBlacklist } from '../middleware/blackList';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const validCredentials: Boolean = await registerUser(username, password);
    if (!validCredentials) {
      res.status(400).json({ error: 'User already exists' });
      return;
    } else {
      res.status(201).json({ message: 'User registered' });
    }
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


router.get('/dashboard', authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
  res.json({ message: `Hello ${req.body.user?.username}, welcome to your dashboard!` });
});


router.post('/refreshAuthToken', checkBlacklist, async (req: Request, res: Response) => {
  const refreshToken = req.headers['refresh_token'] as string;

  try {
    const newToken = await refreshAuthToken(refreshToken);
    if (newToken) {
      res.json({ token: newToken });
    } else {
      res.status(401).json({ error: 'Invalid token' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error refreshing token' });
  }
})


router.post('/logout', authenticateToken, checkBlacklist, async (req: Request, res: Response) => {
  const authToken = req.headers['authorization'] as string;
  const refreshToken = req.headers['refresh_token'] as string;

  try {
    const logout = await logoutUser(authToken, req.body.user.exp, refreshToken);
    if (logout) {
      res.status(200).json({ message: 'User logged out' });
    } else {
      res.status(500).json({ error: 'Error logging out' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error logging out' });
  }
})

export default router;
