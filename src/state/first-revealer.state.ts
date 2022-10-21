import { GameState, PlayerID } from '../interfaces';
import determineFirstRevealer from '../utilities/determine-first-revealer';

const FirstRevealer = {
  defaultState: determineFirstRevealer(),

  set: (G: GameState, playerId: PlayerID) => {
    G.FirstRevealer = playerId;
  },

  reset: (G: GameState) => {
    G.FirstRevealer = FirstRevealer.defaultState;
  },
};

export default FirstRevealer;
