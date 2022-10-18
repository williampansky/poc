import { GameState } from '../../../interfaces';
import { PlayerTurnDone } from '../../../state';

/**
 * Sets `G.done` of each player back to false.
 */
const resetDoneStateForBothPlayers = (G: GameState): void => {
  PlayerTurnDone.reset(G);
};

export default resetDoneStateForBothPlayers;
