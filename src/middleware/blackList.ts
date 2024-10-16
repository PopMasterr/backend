import { Request, Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2';
import pool from '../config/db';


export async function checkBlacklist(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.headers['authorization'] 
    const refreshToken = req.headers['refresh_token'];

    if (!token) {
        res.status(401).json({ message: 'No token provided' });
    }

    const query = 'SELECT * FROM blacklist WHERE token = ?';
    const [rows] = await pool.query<RowDataPacket[]>(query, [token]);
    const [rows2] = await pool.query<RowDataPacket[]>(query, [refreshToken]);

    if (rows.length > 0 || rows2.length > 0) {
        res.status(401).json({ message: 'Token is blacklisted' });
    } else {
        next();
    }
}