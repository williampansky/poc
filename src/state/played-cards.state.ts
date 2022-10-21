import { Card, GameState, PlayerID } from "../interfaces";

const PlayedCards = {
  defaultState: {
    '0': [],
    '1': []
  },

  push: (G: GameState, playerId: PlayerID, card: Card) => {
    G.PlayedCards[playerId].push(card);
  },
};

export default PlayedCards;
