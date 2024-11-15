import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

export const createAchievement = async (name: string, description: string, conditionQuery: string): Promise<boolean> => {
    try {
        const query = 'INSERT INTO achievements (name, description, condition_query) VALUES (?, ?, ?)';
        await pool.query(query, [name, description, conditionQuery]);
    
        return true;
    } catch (error: any | Error) {
        throw new Error(`Error creating achievement: ${error.message}`);
    }
}

