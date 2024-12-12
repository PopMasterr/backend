import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

export type TTotalScoreLeaderboard = {
    username: string;
    score: number;
};

export type TPerfectGuessesLeaderboard = {
    username: string;
    perfectGuesses: number;
};

export type TGamesPlayedLeaderboard = {
    username: string;
    gamesPlayed: number;
};

export type THighestStreakLeaderboard = {
    username: string;
    highestStreak: number;
};

export async function getTopPlayersOfTotalScore(): Promise<TTotalScoreLeaderboard[] | null> {
    try {
        const query = 'SELECT users.username, user_metrics.total_points FROM user_metrics INNER JOIN users ON user_metrics.user_id = users.id ORDER BY total_points DESC LIMIT 10';
        const [rows] = await pool.query<RowDataPacket[]>(query);

        if (rows.length === 0) return null;

        let topPlayers: TTotalScoreLeaderboard[] = [];

        for (let i = 0; i < rows.length; i++) {
            topPlayers.push({
                username: rows[i].username,
                score: rows[i].total_points
            });
        }

        return topPlayers;
    } catch (error) {
        console.error('Error getting top players of total score:', error);
        return null;
    }
}

export async function getTopPlayersOfPerfectGuesses(): Promise<TPerfectGuessesLeaderboard[] | null> {
    try {
        const query = 'SELECT users.username, user_metrics.perfect_guesses FROM user_metrics INNER JOIN users ON user_metrics.user_id = users.id ORDER BY perfect_guesses DESC LIMIT 10';
        const [rows] = await pool.query<RowDataPacket[]>(query);

        if (rows.length === 0) return null;

        let topPlayers: TPerfectGuessesLeaderboard[] = [];

        for (let i = 0; i < rows.length; i++) {
            topPlayers.push({
                username: rows[i].username,
                perfectGuesses: rows[i].perfect_guesses
            });
        }

        return topPlayers;
    } catch (error) {
        console.error('Error getting top players of perfect guesses:', error);
        return null;
    }
}

export async function getTopPlayersOfGamesPlayed(): Promise<TGamesPlayedLeaderboard[] | null> {
    try {
        const query = 'SELECT users.username, user_metrics.games_played FROM user_metrics INNER JOIN users ON user_metrics.user_id = users.id ORDER BY games_played DESC LIMIT 10';
        const [rows] = await pool.query<RowDataPacket[]>(query);

        if (rows.length === 0) return null;

        let topPlayers: TGamesPlayedLeaderboard[] = [];

        for (let i = 0; i < rows.length; i++) {
            topPlayers.push({
                username: rows[i].username,
                gamesPlayed: rows[i].games_played
            });
        }

        return topPlayers;
    } catch (error) {
        console.error('Error getting top players of games played:', error);
        return null;
    }
}

export async function getTopPlayersOfHighestStreak(): Promise<THighestStreakLeaderboard[] | null> {
    try {
        const query = 'SELECT users.username, user_metrics.highest_streak FROM user_metrics INNER JOIN users ON user_metrics.user_id = users.id ORDER BY highest_streak DESC LIMIT 10';
        const [rows] = await pool.query<RowDataPacket[]>(query);

        if (rows.length === 0) return null;

        let topPlayers: THighestStreakLeaderboard[] = [];

        for (let i = 0; i < rows.length; i++) {
            topPlayers.push({
                username: rows[i].username,
                highestStreak: rows[i].highest_streak
            });
        }

        return topPlayers;
    } catch (error) {
        console.error('Error getting top players of highest streak:', error);
        return null;
    }
}
