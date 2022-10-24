import { add } from 'mathjs';
import { GameState } from '../../../interfaces';
import { ActionPoints } from '../../../state';

/**
 * Increments the `actionPointsTotal` for the provided player.
 */
const incrementActionPointsTotal = (G: GameState) => {
  ActionPoints.incrementTotal(G, '0');
  ActionPoints.incrementTotal(G, '1');
}

export default incrementActionPointsTotal;
