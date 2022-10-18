import { add } from 'mathjs';
import { GameState } from '../../../interfaces';

/**
 * Increments the game turn (note: ***not*** `ctx.turn`).
 */
const incrementGameTurn = (G: GameState): void => {
  G.turn = add(G.turn, 1);
};

export default incrementGameTurn;
