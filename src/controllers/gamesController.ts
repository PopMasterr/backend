import { RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { getData, TGameData } from './populationServiceController';


export type TGames = TGameData & {
    id: number;
}

export async function createGame (): Promise<number | null> {
    try {
        const gameData: TGameData | null = await getData();

        if (gameData === null) {
            throw new Error('No game data found');
        }

        const query = 'INSERT INTO games (population, x1, y1, x2, y2) VALUES (?, ?, ?, ?, ?)';
        const [result]: any = await pool.query(query, [gameData.population, gameData.x1, gameData.y1, gameData.x2, gameData.y2]);

        if (result.insertId === undefined) {
            throw new Error('Error creating game');
        }

        return result.insertId;
    } catch (error) {
        console.error('Error creating game:', error);
        return null;
    }
}

export async function updateGame (gameId: number): Promise<boolean> {
    try {
        const gameData: TGameData | null = await getData();

        if (gameData === null) {
            throw new Error('No game data found');
        }

        const query = 'UPDATE games SET population = ?, x1 = ?, y1 = ?, x2 = ?, y2 = ? WHERE id = ?';
        await pool.query(query, [gameData.population, gameData.x1, gameData.y1, gameData.x2, gameData.y2, gameId]);

        return true;
    } catch (error) {
        console.error('Error updating game:', error);
        return false;
    }
}

export async function findGame (gameId: number): Promise<TGameData | null> {
    try {
        const query = 'SELECT * FROM games WHERE id = ?';
        const [rows] = await pool.query<RowDataPacket[]>(query, [gameId]);

        if (rows.length === 0) {
            throw new Error('No game found');
        }

        return rows[0] as TGameData;
    } catch (error) {
        console.error('Error finding game:', error);
        return null;
    }
}
