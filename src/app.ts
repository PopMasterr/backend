import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index';
import cleanUpExpiredTokens from './middleware/cleanUpExpiredTokens';
import cron from "node-cron";
import cors from "cors";
import { createTables } from './config/dbMigrations';
import db from './config/db';

dotenv.config();

const app = express();

const allowedOrigins = ['http://localhost:3000', 'https://popmasterr.netlify.app'];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get(`/${process.env.RUN_MIGRATIONS_SECRET}/runMigrations`, (req, res) => {
  createTables();
  res.send('Migrations ran');
});

cron.schedule('0 * * * *', async () => {
  await cleanUpExpiredTokens();
  console.log('Expired tokens cleaned up');
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});