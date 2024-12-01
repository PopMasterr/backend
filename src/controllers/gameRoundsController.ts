import { RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { createGame, findGame } from './gamesController';
import { getScore, TGameData, TGameResult } from './populationServiceController';
import { updateUserMetrics } from './userMetricsController';
import { createGameScore } from './gameScoresController';

export type TGameRoundPort = {
    game_session_id: number;
    round_number: number;
}

export type TGameRound = TGameRoundPort & {
    id: number;
    game_id: number;
}

export type TCoordinates = {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

// Use this when creating a session
export async function createGameRound(gameRoundData: TGameRoundPort): Promise<boolean | null> {
    try {
        const newGameId = await createGame();

        if (newGameId === null) {
            throw new Error('Error creating game round');
        }

        const query = 'INSERT INTO game_rounds (game_session_id, game_id, round_number) VALUES (?, ?, ?)';
        await pool.query(query, [gameRoundData.game_session_id, newGameId, gameRoundData.round_number]);

        return true;
    } catch (error) {
        console.error('Error creating game round:', error);
        return null;
    }
}

// Use these two fucntions for calculating the scores of the players
export async function findGameRoundsByGameSessionIdUpToRound(gameSessionId: number, upToRound: number): Promise<number[] | null> {
    try {
        const query = `SELECT * FROM game_rounds WHERE game_session_id = ? AND round_number < ? ORDER BY round_number ASC`;
        const [rows] = await pool.query<RowDataPacket[]>(query, [gameSessionId, upToRound]);

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

export async function findAllGameRoundsByGameSessionId(gameSessionId: number): Promise<number[] | null> {
    try {
        const query = `SELECT * FROM game_rounds WHERE game_session_id = ? ORDER BY round_number ASC`;
        const [rows] = await pool.query<RowDataPacket[]>(query, [gameSessionId]);

        if (rows.length === 0) {
            return null;
        }

        let gameRoundsIds: number[] = [];

        for (let i = 0; i < rows.length; i++) {
            gameRoundsIds.push(rows[i].id);
        }

        return gameRoundsIds
    } catch (error) {
        console.error('Error getting game rounds by game session id:', error);
        return null;
    }
}

// these two functions go into routes
export async function getGameRoundCoordinates(gameSessionId: number, roundNumber: number): Promise<TCoordinates | null> {
    try {
        const gameRoundId = await findGameRoundByGameSessionIdAndRoundNumber(gameSessionId, roundNumber);
        if (gameRoundId === null) return null;

        const gameId = await getGameIdOfGameRound(gameRoundId);
        if (gameId === null) return null;

        const gameData: TGameData | null = await findGame(gameId);
        if (gameData === null) return null        

        const result: TCoordinates  = {
            x1: gameData.x1,
            y1: gameData.y1,
            x2: gameData.x2,
            y2: gameData.y2
        }

        return result;
    } catch (error) {
        console.error('Error getting game data by game round id:', error);
        return null;
    }
}

export async function getGameRoundPopulationAndScore(userId: number, gameSessionId: number, roundNumber: number, populationGuess: number): Promise<TGameResult | null> {
    try {
        const gameRoundId = await findGameRoundByGameSessionIdAndRoundNumber(gameSessionId, roundNumber);
        if (gameRoundId === null) return null;

        const gameId = await getGameIdOfGameRound(gameRoundId);
        if (gameId === null) return null;

        const gameData: TGameData | null = await findGame(gameId);

        if (gameData === null) return null     

        const population = gameData.population;
        const score = await getScore(populationGuess, population);
        if (score === null) return null;
        
        await updateUserMetrics(userId, score);
        await createGameScore({ userId: userId, gameRoundId: gameRoundId, score: score });

        return {population: population, score: score} as TGameResult;
    } catch (error) {
        console.error('Error getting game round population by game round id:', error);
        return null;
    }
}

// use for calculating the coords and population
export async function findGameRoundByGameSessionIdAndRoundNumber(gameSessionId: number, roundNumber: number): Promise<number | null> {
    try {
        const query = 'SELECT * FROM game_rounds WHERE game_session_id = ? AND round_number = ?';
        const [rows] = await pool.query<RowDataPacket[]>(query, [gameSessionId, roundNumber]);

        if (rows.length === 0) return null;

        const gameRound = rows[0];

        return gameRound.id;
    } catch (error) {
        console.error('Error getting game round by game session id and round number:', error);
        return null;
    }
}

export async function getGameIdOfGameRound(gameRoundId: number): Promise<number | null> {
    try {
        const query = 'SELECT game_id FROM game_rounds WHERE id = ?';
        const [rows] = await pool.query<RowDataPacket[]>(query, [gameRoundId]);

        if (rows.length === 0) return null;

        const gameId = rows[0].game_id;

        return gameId;
    } catch (error) {
        console.error('Error getting game id by game round id:', error);
        return null;
    }
}

// used for calculating the scores of the players
export async function getDistinctUsersByGameSessionId(gameSessionId: number): Promise<number[] | null> {
    try {
        const query = 'SELECT DISTINCT user_id FROM game_scores WHERE game_round_id IN (SELECT id FROM game_rounds WHERE game_session_id = ?)';
        const [rows] = await pool.query<RowDataPacket[]>(query, [gameSessionId]);

        if (rows.length === 0) return null;

        let userIds: number[] = [];

        for (let i = 0; i < rows.length; i++) {
            userIds.push(rows[i].user_id);
        }

        return userIds;
    } catch (error) {
        console.error('Error getting distinct users by game session id:', error);
        return null;
    }
}
