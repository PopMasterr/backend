import { RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { createGameRound } from './gameRoundsController';


export async function createGameSession(userId: number, numberOfRounds: number): Promise<string | null> {
    try {
        const code = uuidv4(); 
        const query = 'INSERT INTO game_sessions (code, host_id) VALUES (?, ?)';
        await pool.query(query, [code, userId]);

        for (let i = 0; i < Number(numberOfRounds); i++) {
            createGameRound({ game_session_id: 1, population: 1000, x1: 0, y1: 0, x2: 1000, y2: 1000, round_number: i + 1 });
        }

        return code; 
    } catch (error) {
        console.error('Error creating game session:', error);
        return null;
    }
}

export async function findGameSessionByCode(code: string): Promise<number | null> {
    try {
        const query = 'SELECT * FROM game_sessions WHERE code = ?';

        const [rows] = await pool.query<RowDataPacket[]>(query, [code]);

        if (!rows) return null;

        const gameSession = rows[0];

        return gameSession.id;
    } catch (error) {
        return null;
    }
}
