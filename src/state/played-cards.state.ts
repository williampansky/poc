import { GameState, PlayerID } from "../interfaces";

const Counts = {
  defaultState: {
    '0': [],
    '1': []
  },

  decrementDeck: (G: GameState, playerId: PlayerID) => {
    G.Counts[playerId].deck--;
  },

  decrementHand: (G: GameState, playerId: PlayerID) => {
    G.Counts[playerId].hand--;
  },

  incrementDeck: (G: GameState, playerId: PlayerID) => {
    G.Counts[playerId].deck++;
  },

  incrementHand: (G: GameState, playerId: PlayerID) => {
    G.Counts[playerId].hand++;
  }
};

export default Counts;
