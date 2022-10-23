import { GameState, PlayerID } from '../interfaces';
import { Counts } from '../state';

/**
 * Draws the `amountToDraw` of cards from the provided `player` param's deck
 * and pushes it to their hand; also handles `G.Counts`
 */
const drawCardFromPlayersDeck = (
  G: GameState,
  player: PlayerID,
  amountToDraw: number = 1
): void => {
  const maxHandSize = G.config.gameConfig.cardsPerHand;

  // prettier-ignore
  for (let i = 0; i < amountToDraw; i++) {
    if (G.players[player].hand.length < maxHandSize) { // ...... can draw
      if (G.players[player].deck.length !== 0) { // ............ to draw exists
        G.players[player].hand.push( // ........................ pushes to hand
          G.players[player].deck.splice(0, 1)[0] // ............ splices from deck
        );
        
        Counts.incrementHand(G, player); // .................... count hand
        Counts.decrementDeck(G, player); // .................... count deck
      }
    }
  }
};

export default drawCardFromPlayersDeck;
