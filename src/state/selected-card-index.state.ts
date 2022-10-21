import { GameState, PlayerID, SelectedCardIndex as Interface } from '../interfaces';

const SelectedCardIndex = {
  defaultState: <Interface> {
    '0': undefined,
    '1': undefined,
  },

  set: (G: GameState, playerId: PlayerID, index: number): void => {
    G.SelectedCardIndex[playerId] = index;
  },

  reset: (G: GameState, playerId: PlayerID): void => {
    G.SelectedCardIndex[playerId] = undefined;
  },
};

export default SelectedCardIndex;
