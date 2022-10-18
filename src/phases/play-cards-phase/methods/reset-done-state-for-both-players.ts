import { GameState } from '../../../interfaces';

/**
 * Sets `G.done` of each player back to false.
 */
const resetDoneStateForBothPlayers = (G: GameState): void => {
  G.done = {
    '0': false,
    '1': false,
  };
};

export default resetDoneStateForBothPlayers;
