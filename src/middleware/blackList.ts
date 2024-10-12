import { Request, Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2';
import pool from '../config/db';


export async function checkBlacklist(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.headers['authorization'] !== undefined ? req.headers['authorization'] : req.headers['refresh_token'];

    if (!token) {
        res.status(401).json({ message: 'No token provided' });
    }

    const query = 'SELECT * FROM blacklist WHERE token = ?';
    const [rows] = await pool.query<RowDataPacket[]>(query, [token]);

    if (rows.length > 0) {
        res.status(401).json({ message: 'Token is blacklisted' });
    } else {
        next();
    }
}