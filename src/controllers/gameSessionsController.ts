import { RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { createGameRound, getDistinctUsersByGameSessionId } from './gameRoundsController';


export async function createGameSession(userId: number, numberOfRounds: number): Promise<string | null> {
    try {
        const code = uuidv4(); 
        const query = 'INSERT INTO game_sessions (code, host_id, number_of_rounds) VALUES (?, ?, ?)';
        await pool.query(query, [code, userId, numberOfRounds]);

        const getGameSessionIdQuery = 'SELECT id FROM game_sessions WHERE code = ?';
        const [rows] = await pool.query<RowDataPacket[]>(getGameSessionIdQuery, [code]);

        if (rows.length === 0) return null;

        const gameSessionId = rows[0].id;

        for (let i = 0; i < Number(numberOfRounds); i++) {
            createGameRound({ game_session_id: gameSessionId, round_number: i + 1 });
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

export async function findGameSessionsByUserId(userId: number): Promise<number[] > {
    try {
        const query = 'SELECT * FROM game_sessions WHERE host_id = ?';
        const [rows] = await pool.query<RowDataPacket[]>(query, [userId]);

        if (rows.length === 0) return [];

        let gameSessionCodes: number[] = [];

        for (let i = 0; i < rows.length; i++) {
            gameSessionCodes.push(rows[i].code);
        }

        return gameSessionCodes;
    } catch (error) {
        console.error('Error getting game sessions by user id:', error);
        return [];
    }
}

export async function getTheNumberOfRounds(gameSessionId: number): Promise<number | null> {
    try {
        const query = 'SELECT number_of_rounds FROM game_sessions WHERE id = ?';
        const [rows] = await pool.query<RowDataPacket[]>(query, [gameSessionId]);

        if (rows.length === 0) return null;

        const numberOfRounds = rows[0].number_of_rounds;

        return numberOfRounds;
    } catch (error) {
        console.error('Error getting number of rounds by game session id:', error);
        return null;
    }
}

export async function checkIfUserAlreadyPlayedThisSession (userId: number, gameSessionId: number): Promise<boolean | null> {
    try {
        const usersPlayedQuery = await getDistinctUsersByGameSessionId(gameSessionId);
        if (usersPlayedQuery === null) return null;

        if (usersPlayedQuery.includes(userId)) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking if user already played this session:', error);
        return null;
    }
}
