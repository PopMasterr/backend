import axios from 'axios';
import { updateUserMetrics } from './userMetricsController';

interface ICoordinates {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    cx1: number;
    cx2: number;
    cy1: number;
    cy2: number;
}

 export interface IGuessData {
  population: number;
  guess: number;
  score: number;
}
 
export async function getPopulation(x1: number, x2: number, y1: number, y2: number, guess: number, userId: number): Promise<IGuessData | null> {
  const getPopulationURL = process.env.POPULATION_API_KEY + "/getPopulation";

  try {
    const response = await axios.get(getPopulationURL, {
      params: {
        x1,
        x2,
        y1,
        y2,
        guess
      }
    });
    console.log(response.data);
    const population: number = response.data.population;
    const score: number = response.data.score;

    await updateUserMetrics(userId, score);

    return {population: population, guess: guess, score: score};
  } catch (error) {
    return null;
  }
}

export async function getCoordinates(): Promise<any> {
  const getCoordinatesURL = process.env.POPULATION_API_KEY + "/getCoordinates";

  try {
    const response = await axios.get(getCoordinatesURL);
    const coordinates: ICoordinates = {
      x1: response.data.x1,
      x2: response.data.x2,
      y1: response.data.y1,
      y2: response.data.y2,
      cx1: response.data.cx1,
      cx2: response.data.cx2,
      cy1: response.data.cy1,
      cy2: response.data.cy2
    };
    return coordinates;
  } catch (error) {
    return null;
  }
}