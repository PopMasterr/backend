import pool from '../config/db';
import { RowDataPacket } from 'mysql2';
import { allAchievements } from '../jsonRules/achievementsRulesEngine';

export type TAchievement = {
    name: string;
    description: string;
}

export const createAchievements = async (): Promise<boolean> => {
    try {
        const achievements = allAchievements;
        for (let i = 0; i < achievements.length; i++) {
            await createAchievement(achievements[i].event.type, achievements[i].event.params.message);
        }

        return true;
    } catch (error: any | Error) {
        throw new Error(`Error creating achievements: ${error.message}`);
    }
}

export const createAchievement = async (name: string, description: string): Promise<boolean> => {
    try {
        const query = 'INSERT INTO achievements (name, description) VALUES (?, ?)';
        await pool.query(query, [name, description]);

        return true;
    } catch (error: any | Error) {
        throw new Error(`Error creating achievement: ${error.message}`);
    }
}

export const findAchievementsById = async (achievementId: number): Promise<TAchievement | null> => {
    try {
        const query = 'SELECT * FROM achievements WHERE id = ?';
        const [rows] = await pool.query<RowDataPacket[]>(query, [achievementId]);

        if (rows.length === 0) {
            return null;
        }

        const achievement: TAchievement = {
            name: rows[0].name,
            description: rows[0].description
        };

        return achievement;
    } catch (error: any | Error) {
        throw new Error(`Error getting achievement by id: ${error.message}`);
    }
}
