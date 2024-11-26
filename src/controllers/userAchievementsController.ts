import { RowDataPacket } from 'mysql2';
import pool from '../config/db';
import { engine } from '../jsonRules/achievementsRulesEngine';
import { findAchievementsById, TAchievement } from './achievementsController';

export type TUserAchievementPort = {
    userId: number;
    achievement_id: number;
};

export type TUserAchievement = {
    achievementId: number;
    
}

export async function createUserAchievement(userAchievementData: TUserAchievementPort): Promise<boolean | null> {
    try {
        const query = 'INSERT INTO user_achievements (user_id, achievement_id) VALUES (?, ?)';
        await pool.query(query, [userAchievementData.userId, userAchievementData.achievement_id]);

        return true;
    } catch (error) {
        console.error('Error creating user achievement:', error);
        return null;
    }
}

export async function findUserAchievementsByUserId(userId: number): Promise<number[] > {
    try {
        const query = 'SELECT * FROM user_achievements WHERE user_id = ?';
        const [rows] = await pool.query<RowDataPacket[]>(query, userId);

        if (rows.length === 0) {
            return [];
        }

        let userAchievementsIds: number[] = [];

        for (let i = 0; i < rows.length; i++) {
            userAchievementsIds.push(rows[i].achievement_id);
        }

        return userAchievementsIds;
    } catch (error) {
        console.error('Error getting user achievements by user id:', error);
        return [];
    }
}

export const addNewUserAchievements = async (gamesPlayed: number, perfectGuesses: number, score: number, userId: number): Promise<boolean> => {
    try {
        let newAchievementGained = false;
        const facts = { gamesPlayed: gamesPlayed, perfectGuesses: perfectGuesses, score: score };
        const results = await engine.run(facts);
        const newAchievements: any = results.events;

        if (newAchievements.length === 0) {
            return false;
        }

        const currentUserAchievements = await findUserAchievementsByUserId(userId);

        for (let i = 0; i < results.events.length; i++) {
            if (newAchievements[i].params && currentUserAchievements.includes(newAchievements[i].params.achievementId)) {
                continue;
            } else {
                const userAchievementData: TUserAchievementPort = {
                    userId: userId,
                    achievement_id: newAchievements[i].params.achievementId
                };
                await createUserAchievement(userAchievementData);
                newAchievementGained = true;
            }
        }

        return newAchievementGained;
    } catch (error: any | Error) {
        throw new Error(`Error checking achievement: ${error.message}`);
    }
}

