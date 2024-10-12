import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index';
import db from "./config/db"
import { createTables } from './config/db';

dotenv.config();

const app = express();

app.use(express.json());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  createTables();
});
