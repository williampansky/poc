import { Config } from "../game.config";
import { GameState, PlayerID } from "../interfaces";

const Counts = {
  defaultState: {
    '0': {
      deck: Config.gameConfig.cardsPerDeck,
      hand: 0
    },
    '1': {
      deck: Config.gameConfig.cardsPerDeck,
      hand: 0
    }
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
