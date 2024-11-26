import { RowDataPacket } from 'mysql2';
import pool from '../config/db';

export type TGameScorePort = {
    user_id: number;
    game_session_id: number;
    score: number;
};

export async function createGameScore(userId: number, gameSessionId: number, score: number): Promise<boolean | null> {
    try {
        const query = 'INSERT INTO classic_games'

        return true;
    } catch (error) {
        console.error('Error creating game score:', error);
        return null;
    }
};

export async function findGameScoresByUserIdAndGameSessionId(userId: number, gameSessionId: number): Promise<number[] | null> {
    try {
        const query = 'SELECT * FROM game_scores WHERE user_id = ? AND game_session_id = ?';
        const [rows] = await pool.query<RowDataPacket[]>(query, [userId, gameSessionId]);

        if (rows.length === 0) return null;

        let gameScoresIds: number[] = [];

        for (let i = 0; i < rows.length; i++) {
            gameScoresIds.push(rows[i].id);
        }

        return gameScoresIds;
    } catch (error) {
        console.error('Error getting game scores by user id:', error);
        return null;
    }
};

export async function getSumScoreOfUsersGameSession(userId :number, gameSessionId: number): Promise<number | null> {
    try {
        const query = 'SELECT score FROM game_scores WHERE user_id = ? AND game_session_id = ?';
        const [rows] = await pool.query<RowDataPacket[]>(query, [userId, gameSessionId]);

        if (rows.length === 0) return null;

        let sum = 0;

        for (let i = 0; i < rows.length; i++) {
            sum += rows[i].score;
        }

        return sum;
    } catch (error){
        console.error('Error getting sum of user game session:', error);
        return null;
    }
}