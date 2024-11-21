import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

export const createAchievement = async (name: string, description: string): Promise<boolean> => {
    try {
        const query = 'INSERT INTO achievements (name, description) VALUES (?, ?)';
        await pool.query(query, [name, description]);
    
        return true;
    } catch (error: any | Error) {
        throw new Error(`Error creating achievement: ${error.message}`);
    }
}

