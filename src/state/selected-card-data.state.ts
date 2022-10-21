import { Card, GameState, PlayerID } from '../interfaces';

const SelectedCardData = {
  defaultState: {
    '0': undefined,
    '1': undefined,
  },

  set: (G: GameState, playerId: PlayerID, dataObj: Card) => {
    G.SelectedCardData[playerId] = dataObj;
  },

  reset: (G: GameState, playerId: PlayerID) => {
    G.SelectedCardData[playerId] = undefined;
  },
};

export default SelectedCardData;
