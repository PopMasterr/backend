import { RowDataPacket } from "mysql2";
import pool from "../config/db";
import { updateHighestStreak } from "./userMetricsController";

export type TStreakScore = {
    userId: number;
    score: number;
}

export async function createStreakScore (userId: number): Promise<boolean | null> {
    try {
        const query = 'INSERT INTO streak_scores (user_id, score) VALUES (?, ?)';
        await pool.query(query, [userId, 0]);

        return true;
    } catch (error) {
        console.error('Error creating streak score:', error);
        return null;
    }
}

export async function increaseStreakScoreByOne (userId: number): Promise<number | null> {
    try {
        let streakScore: number | null = await getStreakScoreByUserId(userId);
        if (streakScore === null) throw new Error('No streak score found');

        const updateStreakScoreQuery = 'UPDATE streak_scores SET score = ? WHERE user_id = ?';
        await pool.query(updateStreakScoreQuery, [streakScore + 1, userId]);
        updateHighestStreak(userId, streakScore + 1);

        return streakScore + 1;
    } catch (error) {
        console.error('Error increasing streak score by one:', error);
        return null;
    }
}

export async function resetStreakScore (userId: number): Promise<boolean | null> {
    try {
        const query = 'UPDATE streak_scores SET score = 0 WHERE user_id = ?';
        await pool.query(query, [userId]);

        return true;
    } catch (error) {
        console.error('Error resetting streak score:', error);
        return null;
    }
}

export async function getStreakScoreByUserId (userId: number): Promise<number | null> {
    try {
        const query = 'SELECT * FROM streak_scores WHERE user_id = ?';
        const [rows] = await pool.query<RowDataPacket[]>(query, [userId]);

        if (rows.length === 0) return null;

        return rows[0].score;
    } catch (error) {
        console.error('Error getting streak score by user id:', error);
        return null;
    }
}