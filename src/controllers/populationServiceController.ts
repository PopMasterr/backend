import axios from 'axios';
import { updateUserMetrics } from './userMetricsController';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';

 export interface IGuessData {
  population: number;
  guess: number;
  score: number;
}

export type TGameData = {
  population: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type TGameResult = {
  score: number;
  population: number;
}

export async function getData(): Promise<TGameData | null> {
  const getDataURL = process.env.POPULATION_API_KEY + "/getData";

  try {
    const response = await axios.get(getDataURL);
    const data: TGameData = {
      population: response.data.population,
      x1: response.data.x1,
      x2: response.data.x2,
      y1: response.data.y1,
      y2: response.data.y2
    };
    return data;
  } catch (error) {
    return null;
  }
}

export async function getScoreAndPopulation(populationGuess: number, userId: number): Promise<TGameResult | null> {
  const getScoreURL = process.env.POPULATION_API_KEY + "/getScore";

  try {
    const query = 'SELECT population FROM games WHERE user_id = ?';
    const [rows] = await pool.query<RowDataPacket[]>(query, [userId]);
    
    if (rows.length === 0) {
      throw new Error('No population found for the given user ID');
    }

    const population = rows[0].population;
    const response = await axios.get(getScoreURL, {
      params: {
        guess: populationGuess,
        population: population
      }
    });

    const score = response.data.score;
    updateUserMetrics(userId, score);

    const result = {
      score,
      population
    } as TGameResult;

    return result;
  } catch (error) {
    return null;
  }
}