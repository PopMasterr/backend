import axios from 'axios';
import { updateUserMetrics } from './userMetricsController';
import pool from '../config/db';
import { RowDataPacket } from 'mysql2';
import { findClassicGameByUserId } from './classicGamesController';

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
    const classicGame: TGameData | null = await findClassicGameByUserId(userId);

    if (classicGame === null) {
      throw new Error('Error getting classic game');
    }

    const population = classicGame.population;
    const response = await axios.get(getScoreURL, {
      params: {
        guess: populationGuess,
        population: population
      }
    });

    const score = response.data.score;
    await updateUserMetrics(userId, score);


    const result = {
      score,
      population
    } as TGameResult;

    return result;
  } catch (error) {
    return null;
  }
}