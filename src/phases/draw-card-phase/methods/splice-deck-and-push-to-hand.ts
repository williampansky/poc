import { GameState } from '../../../interfaces';
import { Counts } from '../../../state';

const spliceDeckAndPushToHand = (G: GameState): void => {
  // prettier-ignore
  const fn = (G: GameState, playerId: string) => {
    const maxHandSize = G.config.gameConfig.cardsPerHand;
    if (G.players[playerId].hand.length < maxHandSize) { // ...... canDraw
      G.players[playerId].hand.push( // .......................... pushes to hand
        G.players[playerId].deck.splice(0, 1)[0] // .............. splices from deck
      );
      
      Counts.incrementHand(G, playerId); // ...................... count hand
      Counts.decrementDeck(G, playerId); // .................... count deck
    }
  }

  fn(G, '0');
  fn(G, '1');
};

export default spliceDeckAndPushToHand;
