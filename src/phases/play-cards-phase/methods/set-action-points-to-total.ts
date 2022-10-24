import { GameState } from '../../../interfaces';
import { ActionPoints } from '../../../state';

/**
 * Sets `actionPoints` to `actionPointsTotal` for the provided player.
 */
const setActionPointsToTotal = (G: GameState): void => {
  ActionPoints.matchTotal(G, '0');
  ActionPoints.matchTotal(G, '1');
};

export default setActionPointsToTotal;
