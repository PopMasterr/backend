import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index';
import db from "./config/db"
import { createTables } from './config/db';
import cleanUpExpiredTokens from './middleware/cleanUpExpiredTokens';
import cron from "node-cron"

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  createTables();
});

cron.schedule('0 * * * *', async () => {
  await cleanUpExpiredTokens();
  console.log('Expired tokens cleaned up');
});