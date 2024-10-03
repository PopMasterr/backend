import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

interface User {
  id: number;
  username: string;
  password: string;
}

export async function registerUser(username: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
  await pool.query(query, [username, hashedPassword]);
}

export async function loginUser(username: string, password: string): Promise<string | null> {
  const query = 'SELECT * FROM users WHERE username = ?';
  const [rows] = await pool.query<RowDataPacket[]>(query, [username]);

  if (rows.length === 0) return null;

  const user: User = rows[0] as User;
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return null;

  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );

  return token;
}
