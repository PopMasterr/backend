import { RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { createGameRound } from './gameRoundsController';
import { getData } from './populationServiceController';


export async function createGameSession(userId: number, numberOfRounds: number): Promise<string | null> {
    try {
        const code = uuidv4(); 
        const query = 'INSERT INTO game_sessions (code, host_id) VALUES (?, ?)';
        await pool.query(query, [code, userId]);

        const getGameSessionIdQuery = 'SELECT id FROM game_sessions WHERE code = ?';
        const [rows] = await pool.query<RowDataPacket[]>(getGameSessionIdQuery, [code]);

        if (rows.length === 0) return null;

        const gameSessionId = rows[0].id;

        for (let i = 0; i < Number(numberOfRounds); i++) {
            const gameData = await getData();

            if (!gameData) return null;
            createGameRound({ game_session_id: gameSessionId, population: gameData.population, x1: gameData.x1, y1: gameData.y1, x2: gameData.x2, y2: gameData.y2, round_number: i + 1 });
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

export async function findGameSessionsByUserId(userId: number): Promise<number[] | null> {
    try {
        const query = 'SELECT * FROM game_sessions WHERE host_id = ?';
        const [rows] = await pool.query<RowDataPacket[]>(query, [userId]);

        if (rows.length === 0) return null;

        let gameSessionCodes: number[] = [];

        for (let i = 0; i < rows.length; i++) {
            gameSessionCodes.push(rows[i].code);
        }

        return gameSessionCodes;
    } catch (error) {
        console.error('Error getting game sessions by user id:', error);
        return null;
    }
}
