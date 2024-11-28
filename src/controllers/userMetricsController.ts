import pool from '../config/db';
import { RowDataPacket } from 'mysql2';
import { addNewUserAchievements } from './userAchievementsController';

interface IUserMetrics {
    user_id: number;
    total_points: number;
    games_played: number;
    average_score: number;
    perfect_guesses: number;
    highest_streak: number;
}

export async function getUserMetricsByUserId(userId: number): Promise<IUserMetrics | null> {
    const query = 'SELECT * FROM user_metrics WHERE user_id = ?';
    const [rows] = await pool.query<RowDataPacket[]>(query, [userId]);

    if (rows.length === 0) return null;

    return rows[0] as IUserMetrics;
}

export async function createUserMetrics(userId: number): Promise<Boolean> {
    if (!userId) return false;

    const query = 'INSERT INTO user_metrics (user_id, total_points, games_played, average_score, perfect_guesses, highest_streak) VALUES (?, 0, 0, 0, 0, 0)';
    await pool.query(query, [userId, 0, 0, 0, 0, 0]);

    return true;
}

export async function updateUserMetrics(userId: number, score: number): Promise<Boolean> {
    const currentUserMetrics: IUserMetrics | null = await getUserMetricsByUserId(userId);

    if (!currentUserMetrics) return false;

    const totalPoints = currentUserMetrics.total_points + score;
    const gamesPlayed = currentUserMetrics.games_played + 1;
    const averageScore = Math.floor(totalPoints / gamesPlayed);
    const perfectGuesses = score === 5000 ? currentUserMetrics.perfect_guesses + 1 : currentUserMetrics.perfect_guesses;

    const query = 'UPDATE user_metrics SET total_points = ?, games_played = ?, average_score = ?, perfect_guesses = ? WHERE user_id = ?';
    await pool.query(query, [
        totalPoints,
        gamesPlayed,
        averageScore,
        perfectGuesses,
        userId
    ]);

    await addNewUserAchievements(gamesPlayed, perfectGuesses, score, userId);
    return true;
}

export async function getHighestStreakUserId(userId: number): Promise<number | null> {
    try {
        const query = 'SELECT highest_streak FROM user_metrics WHERE user_id = ?';
        const [rows] = await pool.query<RowDataPacket[]>(query, [userId]);
    
        if (rows.length === 0) return 0;
    
        return rows[0].highest_streak;
    } catch (error) {
        console.error('Error getting highest streak by user id:', error);
        return null;
    }
}

export async function updateHighestStreak(userId: number, streak: number): Promise<Boolean> {
    try {
        const highestStreak = await getHighestStreakUserId(userId);
        if (highestStreak === null) throw new Error('No highest streak found');

        if (streak <= highestStreak) return false;

        const query = 'UPDATE user_metrics SET highest_streak = ? WHERE user_id = ?';
        await pool.query(query, [streak, userId]);

        return true;
    } catch (error) {
        console.error('Error updating highest streak:', error);
        return false
    }
}
