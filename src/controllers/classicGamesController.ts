import { RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { TGameData } from './populationServiceController'; 
import { createGame, findGame, updateGame } from './gamesController';


export type TClassicGamePort = TGameData & {
    user_id: number;
}

export type TClassicGame = TClassicGamePort & {
    id: number;
}

export async function createClassicGame(userId: number): Promise<boolean | null> {
    try {
        const newClassicGameId = await createGame();

        if (newClassicGameId === null) {
            throw new Error('Error creating classic game');
        }

        const query = 'INSERT INTO classic_games (user_id, game_id) VALUES (?, ?)';
        await pool.query(query, [userId, newClassicGameId]);

        return true;
    } catch (error) {
        console.error('Error creating classic game:', error);
        return null;
    }
}

export async function updateClassicGameByUserId(userId: number): Promise<boolean | null> {
    try {
        const getGameIdQuery = 'SELECT game_id FROM classic_games WHERE user_id = ?';
        const gameId: any = await pool.query(getGameIdQuery, userId);

        if (gameId === null) {
            throw new Error('Error getting game id');
        }

        await updateGame(gameId[0].game_id);
        return true;
    } catch (error) {
        console.error('Error updating classic game:', error);
        return null;
    }
}

export async function findClassicGameByUserId(userId: number): Promise<TGameData | null> {
    try {
        const query = 'SELECT * FROM classic_games WHERE user_id = ?';

        const [rows] = await pool.query<RowDataPacket[]>(query, [userId]);

        if (!rows) return null;


        const classicGame = rows[0];
        const classicGameGameId = classicGame.game_id;

        const gameData = await findGame(classicGameGameId);
        return gameData as TGameData;
    } catch (error) {
        return null;
    }
}
