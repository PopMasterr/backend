import { RowDataPacket } from 'mysql2';
import pool from '../config/db';

export type TGameRoundPort = {
    game_session_id: number;
    population: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    round_number: number;
}

export type TGameRound = TGameRoundPort & {
    id: number;
}

export async function createGameRound(gameRoundData: TGameRoundPort): Promise<boolean | null> {
    try {
        const query = 'INSERT INTO game_rounds (game_session_id, pupolation, x1, y1, x2, y2, round_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        await pool.query(query, [gameRoundData.game_session_id, gameRoundData.population, gameRoundData.x1, gameRoundData.y1, gameRoundData.x2, gameRoundData.y2, gameRoundData.round_number]);

        return true;
    } catch (error) {
        console.error('Error creating game round:', error);
        return null;
    }
}

export async function findGameRoundsByGameSessionId(gameSessionId: number): Promise<number[] | null> {
    try {
        const query = 'SELECT * FROM game_rounds WHERE game_session_id = ? ORDER BY round_number ASC';
        const [rows] = await pool.query<RowDataPacket[]>(query, [gameSessionId]);

        if (rows.length === 0) {
            return null;
        }

        let gameRoundsIds: number[] = [];

        for (let i = 0; i < rows.length; i++) {
            gameRoundsIds.push(rows[i].id);
        }

        return gameRoundsIds;
    } catch (error) {
        console.error('Error getting game round by game session id:', error);
        return null;
    }
}

// delete by session id
