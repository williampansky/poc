import { PlayerID, Zone } from '../interfaces';
import getGameResult from './get-game-result';
import getRandomNumberBetween from './get-random-number-between';

/**
 * Determines which player's cards get revealed first on the
 * `revealCards` phase.
 * 
 * If no zones are provided to the function, a random Player will be chosen.
 * Otherwise revealed-first is determined by number of zones won.
 * Otherwise revealed-first is determined by total side power combined.
 * Otherwise a random Player will be chosen.
 */
const determineFirstRevealer = (zones?: Zone[]): PlayerID => {
  if (!zones) return getRandomNumberBetween(0, 1).toString();
  
  const result = getGameResult(zones);
  if (result === '') return getRandomNumberBetween(0, 1).toString();
  return result;
};

export default determineFirstRevealer;
