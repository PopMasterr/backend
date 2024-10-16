import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

async function cleanUpExpiredTokens(): Promise<void> {
  const currentTime = Math.floor(Date.now() / 1000);
  const query = 'DELETE FROM blacklist WHERE expiration_date < ?';
  await pool.query(query, [currentTime]);
}

export default cleanUpExpiredTokens;