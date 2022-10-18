import { PlayerID } from 'boardgame.io';
import { GameState } from '../interfaces';

const PlayerTurnDone = {
  defaultState: {
    '0': false,
    '1': false,
  },

  set: (G: GameState, playerId: PlayerID) => {
    G.PlayerTurnDone[playerId] = true;
  },

  reset: (G: GameState) => {
    G.PlayerTurnDone = PlayerTurnDone.defaultState;
  },
};

export default PlayerTurnDone;
