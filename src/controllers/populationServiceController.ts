import axios from 'axios';

interface ICoordinates {
    
}
 
export async function getPopulationData(): Promise<number | null> {
  try {
    const population: number = await axios.get('') as number;
    return population;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getCoordinates(): Promise<any> {

}