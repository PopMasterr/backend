import { RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { findAllGameRoundsByGameSessionId, findGameRoundsByGameSessionIdUpToRound, getDistinctUsersByGameSessionId } from './gameRoundsController';
import { findUsernameById } from './userController';

export type TGameScorePort = {
    userId: number;
    gameRoundId: number;
    score: number;
};

// use when getting game round score and population
export async function createGameScore(gameScorePort: TGameScorePort): Promise<boolean | null> {
    try {
        const query = 'INSERT INTO game_scores (user_id, game_round_id, score) VALUES (?, ?, ?)';
        await pool.query(query, [gameScorePort.userId, gameScorePort.gameRoundId, gameScorePort.score]);

        return true;
    } catch (error) {
        console.error('Error creating game score:', error);
        return null;
    }
};

export async function getAllGameSessionScoresUpToRound(gameSessionId: number, upToRound: number): Promise<Map<string, number> | null> {
    try {
        const userIds = await getDistinctUsersByGameSessionId(gameSessionId);
        if (userIds === null) return null;

        let userScores = new Map<string, number>();

        for (let i = 0; i < userIds.length; i++) {
            const sumScore = await getSumScoreUpToRound(userIds[i], gameSessionId, upToRound);
            if (sumScore === null) continue;

            const username = await findUsernameById(userIds[i]);
            if (username === null) continue;

            userScores.set(username, sumScore);
        }

        return userScores;
    } catch (error) {
        console.error('Error getting top scores:', error);
        return null;
    }
};

export async function getSumScoreUpToRound(userId: number, gameSessionId: number, upToRound: number): Promise<number | null> {
    try {
        const gameRoundIds = await findGameRoundsByGameSessionIdUpToRound(gameSessionId, upToRound);
        if (gameRoundIds === null) return null;

        const sumScore = await getSumScore(userId, gameRoundIds);

        return sumScore;
    } catch (error) {
        console.error('Error getting sum of user game session up to round:', error);
        return null;
    }
}

export async function getSumScoreOfAllRounds(userId: number, gameSessionId: number): Promise<number | null> {
    try {
        const gameRoundIds = await findAllGameRoundsByGameSessionId(gameSessionId);
        if (gameRoundIds === null) return null;

        const sumScore = getSumScore(userId, gameRoundIds);

        return sumScore;
    } catch (error) {
        console.error('Error getting sum of user game session up to round:', error);
        return null
    }
}

export async function getSumScore(userId :number, gameRoundIds: number[]): Promise<number | null> {
    try {
        let sum: number = 0;

        for (let i = 0; i < gameRoundIds.length; i++) {
            const { score }: any = await findGameScoresByUserIdAndGameSessionId(userId, gameRoundIds[i]);
            if (score === null) continue;

            sum += score;
        }

        return sum;
    } catch (error){
        console.error('Error getting sum of user game session:', error);
        return null;
    }
}

export async function findGameScoresByUserIdAndGameSessionId(userId: number, gameRoundId: number): Promise<number | null> {
    try {
        const query = 'SELECT score FROM game_scores WHERE user_id = ? AND game_round_id = ?';
        const [rows]: any = await pool.query<RowDataPacket[]>(query, [userId, gameRoundId]);

        if (rows.length === 0) return null;

        let score: number = rows[0];

        return score;
    } catch (error) {
        console.error('Error getting game scores by user id and gameRoundId:', error);
        return null;
    }
};