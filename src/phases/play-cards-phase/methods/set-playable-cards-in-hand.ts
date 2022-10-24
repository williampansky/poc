import { Card, GameState } from '../../../interfaces';

/**
 * Checks each card in the player's hand and sets `canPlay: true`
 * to applicable cards based on the card's cost -vs- current AP.
 */
const setPlayableCardsInHand = (G: GameState) => {
  const fn = (G: GameState, playerId: string): void => {
    if (G.players[playerId].hand.length !== 0) {
      G.players[playerId].hand.forEach((c: Card) => {
        if (G.ActionPoints[playerId].current >= c.currentCost) {
          return (c.canPlay = true);
        } else {
          return (c.canPlay = false);
        }
      });
    }
  };

  fn(G, '0');
  fn(G, '1');
};

export default setPlayableCardsInHand;
