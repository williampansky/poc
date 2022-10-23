import { GameState, PlayerID } from '../interfaces';
import { Counts } from '../state';

/**
 * Draws the first card from the provided `player` param's deck
 * and pushes it to their hand; also handles `G.Counts`
 */
const drawTopCardFromPlayersDeck = (G: GameState, player: PlayerID): void => {
  const maxHandSize = G.config.gameConfig.cardsPerHand;

  // prettier-ignore
  if (G.players[player].hand.length < maxHandSize) { // ...... canDraw
    G.players[player].hand.push( // .......................... pushes to hand
      G.players[player].deck.splice(0, 1)[0] // .............. splices from deck
    );
    
    Counts.incrementHand(G, player); // ...................... count hand
    Counts.decrementDeck(G, player); // ...................... count deck
  }
};

export default drawTopCardFromPlayersDeck;
