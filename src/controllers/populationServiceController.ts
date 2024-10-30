import axios from 'axios';

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
 
export async function getPopulation(x1: number, x2: number, y1: number, y2: number): Promise<number | null> {
  const getPopulationURL = process.env.POPULATION_API_KEY + "/getPopulation";

  try {
    const response = await axios.get(getPopulationURL, {
      params: {
        x1,
        x2,
        y1,
        y2
      }
    });
    const population: number = response.data.population;
    return population;
  } catch (error) {
    console.log(error);
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
    console.log(error);
    return null;
  }
}