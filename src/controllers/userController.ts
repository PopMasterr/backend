import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';
import { IJwtPayload } from '../middleware/jwtMiddleware';

interface IUser {
  id: number;
  username: string;
  password: string;
}

interface IUserIdAndUsername {
  id: number,
  username: string
}

interface ILoginTokens {
  authToken: string;
  refreshToken: string;
}

export async function registerUser(username: string, password: string): Promise<Boolean> {
  const hashedPassword = await bcrypt.hash(password, 10);

  const userExistsQuery = 'SELECT * FROM users WHERE username = ?';
  const [rows] = await pool.query<RowDataPacket[]>(userExistsQuery, [username]);

  if (rows.length > 0) {
    return false;
  } else {
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    await pool.query(query, [username, hashedPassword]);
    return true;
  }
}

export async function loginUser(username: string, password: string): Promise<ILoginTokens | null> {
  const query = 'SELECT * FROM users WHERE username = ?';
  const [rows] = await pool.query<RowDataPacket[]>(query, [username]);

  if (rows.length === 0) return null;

  const user: IUser = rows[0] as IUser;
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return null;

  const authToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET as string,
    { expiresIn: '10m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: '7d' }
  );

  return { authToken: authToken, refreshToken: refreshToken } as ILoginTokens;
}


export async function refreshAuthToken(oldRefreshToken: string): Promise<string | null> {
  try {
    const decoded = jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET as string) as IUserIdAndUsername;

    const newAccessToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      process.env.JWT_SECRET as string,
      { expiresIn: '10m' }
    );

    return newAccessToken;
  } catch (error) {
    return null;
  }
}

export async function logoutUser(authToken: string, authTokenExp: number, refreshToken: string): Promise<boolean> {
  if (!authToken || !refreshToken) return false;

  let refreshTokenExp: number = -1;

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string, (error, decoded) => {
    if (error || !decoded) {
      return false;
    }

    let refreshTokenPayload = decoded as IJwtPayload;
    refreshTokenExp = refreshTokenPayload.exp;
  });

  try {
    const query = 'INSERT INTO blacklist (token, expiration_date) VALUES (?, ?),(?, ?)';
    await pool.query(query, [authToken, authTokenExp, refreshToken, refreshTokenExp]);
  } catch (error) {
    console.log(error);
    return false;
  }

  return true;
}


