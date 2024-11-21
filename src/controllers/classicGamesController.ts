import { RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { TGameData } from './populationServiceController'; 


export type TClassicGamePort = TGameData & {
    user_id: number;
}

export type TClassicGame = TClassicGamePort & {
    id: number;
}

export async function createClassicGame(userId: number): Promise<boolean | null> {
    try {
        const query = 'INSERT INTO games (user_id, population, x1, y1, x2, y2) VALUES (?, ?, ?, ?, ?, ?)';
        await pool.query(query, [userId, 0, 0, 0, 0, 0]);

        return true;
    } catch (error) {
        console.error('Error creating classic game:', error);
        return null;
    }
}

export async function updateClassicGameByUserId(classicGameData: TClassicGamePort): Promise<boolean | null> {
    try {
        const query = 'UPDATE games SET population = ?, x1 = ?, y1 = ?, x2 = ?, y2 = ? WHERE user_id = ?';
        await pool.query(query, [classicGameData.population, classicGameData.x1, classicGameData.y1, classicGameData.x2, classicGameData.y2, classicGameData.user_id]);

        return true;
    } catch (error) {
        console.error('Error updating classic game:', error);
        return null;
    }
}

export async function findClassicGameByUserId(userId: number): Promise<number | null> {
    try {
        const query = 'SELECT * FROM games WHERE user_id = ?';

        const [rows] = await pool.query<RowDataPacket[]>(query, [userId]);

        if (!rows) return null;

        const classicGame = rows[0];

        return classicGame.id;
    } catch (error) {
        return null;
    }
}