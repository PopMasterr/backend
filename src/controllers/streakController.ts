import axios from 'axios';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';
import { createGame, findGame, updateGame } from './gamesController';
import { TCoordinates } from './gameRoundsController';
import { createStreakScore, increaseStreakScoreByOne } from './streakScoreController';

export type TStreakGame = {
    userId: number;
    gameId1: number;
    gameId2: number;
}

export type TStreakCoordinates = {
    coordinates1: TCoordinates;
    coordinates2: TCoordinates;
}

export type TStreakGameResult = {
    population1: number;
    population2: number;
    score: number;
    answerIsCorrect: boolean;
}
export async function createStreakGame (userId: number): Promise<number | null> {
    try {
        const gameId1 = await createGame();
        const gameId2 = await createGame();        

        const query = 'INSERT INTO streak_games (user_id, game_id_1, game_id_2) VALUES (?, ?, ?)';
        const [result]: any = await pool.query(query, [userId, gameId1, gameId2]);

        if (result === null) {
            throw new Error('Error creating streak game');
        }

        await createStreakScore(userId);

        return result.insertId;
    } catch (error) {
        console.error('Error creating streak game:', error);
        return null;
    }
}

export async function updateStreakGame (userId: number): Promise<boolean> {
    try {
        const streakGame = await findStreakGameByUserId(userId);
        if (streakGame === null) throw new Error('No streak game found');
        const gameId1 = streakGame.gameId1;
        const gameId2 = streakGame.gameId2;

        const updateStatus1 = await updateGame(gameId1);
        const updateStatus2 = await updateGame(gameId2);

        if (!updateStatus1 || !updateStatus2) {
            throw new Error('Error updating streak game');
        }
        
        return true;
    } catch (error) {
        console.error('Error updating streak game:', error);
        return false;
    }
}

export async function getAnswerIsCorrectAndScore (userId: number, answer: string): Promise<TStreakGameResult | null> {
    try {
        const streakGame = await findStreakGameByUserId(userId);

        if (streakGame === null) throw new Error('No streak game found');

        const game1 = await findGame(streakGame.gameId1);
        const game2 = await findGame(streakGame.gameId2);

        if (game1 === null || game2 === null) throw new Error('No game found');

        const population1 = game1.population;
        const population2 = game2.population;

        let result: TStreakGameResult;

        if (population1 > population2 && answer === 'blue') {
            const score = await increaseStreakScoreByOne(userId);
            if (score === null) throw new Error('No score found');

            result = {
                population1,
                population2,
                score: score,
                answerIsCorrect: true
            }
        } else {
            result = {
                population1,
                population2,
                score: 0,
                answerIsCorrect: false
            }
        }

        return result;
    } catch (error) {
        console.error('Error getting answer is correct:', error);
        return null;
    }
}

export async function getCoordinates (userId: number): Promise< TStreakCoordinates | null> {
    try {
        const streakGame = await findStreakGameByUserId(userId);

        if (streakGame === null) throw new Error('No streak game found');

        const game1 = await findGame(streakGame.gameId1);
        const game2 = await findGame(streakGame.gameId2);

        if (game1 === null || game2 === null) throw new Error('No game found');

        const coordinates1: TCoordinates = {
            x1: game1.x1,
            y1: game1.y1,
            x2: game1.x2,
            y2: game1.y2
        }

        const coordinates2: TCoordinates = {
            x1: game2.x1,
            y1: game2.y1,
            x2: game2.x2,
            y2: game2.y2
        }

        return {
            coordinates1,
            coordinates2,
        } as TStreakCoordinates;
    } catch (error) {
        console.error('Error getting coordinates:', error);
        return null;
    }
}

export async function findStreakGameByUserId (userId: number): Promise<TStreakGame | null> {
    try {
        const query = 'SELECT * FROM streak_games WHERE user_id = ?';
        const [rows] = await pool.query<RowDataPacket[]>(query, [userId]);
        if (rows.length === 0) {
            throw new Error('No streak game found');
        }

        const result: TStreakGame = {
            userId: rows[0].user_id,
            gameId1: rows[0].game_id_1,
            gameId2: rows[0].game_id_2
        }

        return result;
    } catch (error) {
        console.error('Error finding streak game by user id:', error);
        return null;
    }
}

