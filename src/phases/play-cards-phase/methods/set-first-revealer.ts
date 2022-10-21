import { GameState } from '../../../interfaces';
import { FirstRevealer } from '../../../state';
import determineFirstRevealer from '../../../utilities/determine-first-revealer';

/**
 * Sets the player whose cards will trigger first 
 * on the next `revealCards` phase.
 */
const setFirstRevealer = (G: GameState): void => {
  FirstRevealer.set(G, determineFirstRevealer(G.zones));
};

export default setFirstRevealer;
