import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index';
import db from "./config/db"
import { createTables } from './config/db';
import cleanUpExpiredTokens from './middleware/cleanUpExpiredTokens';
import cron from "node-cron"
import cors from "cors"

dotenv.config();

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies and credentials (optional)
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  createTables();
});

cron.schedule('0 * * * *', async () => {
  await cleanUpExpiredTokens();
  console.log('Expired tokens cleaned up');
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});