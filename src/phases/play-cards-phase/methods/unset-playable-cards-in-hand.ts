import { Card, GameState } from '../../../interfaces';

/**
 * Sets all cards-in-hand to `canPlay: false`
 */
const unsetPlayableCardsInHand = (G: GameState): void => {
  const fn = (G: GameState, playerId: string): void => {
    G.players[playerId].hand.forEach((c: Card) => (c.canPlay = false));
  };

  fn(G, '0')
  fn(G, '1')
};

export default unsetPlayableCardsInHand;
