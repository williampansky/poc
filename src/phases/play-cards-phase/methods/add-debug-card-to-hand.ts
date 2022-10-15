import { Card, GameState } from '../../../interfaces';
import { v4 as uuid } from 'uuid';
import CARD_DATABASE from '../../../tempCardsDatabase';
import createCardObject from '../../../utilities/create-card-object';

/**
 * If a card's id is set in `config.debugConfig`, add that
 * card to player 0's hand for testing.
 */
const addDebugCardToHand = (G: GameState): void => {
  if (G.config.debugConfig.debugCardId !== '') {
    const DEBUG_CARD_ID = G.config.debugConfig.debugCardId;
    const dCardBase = CARD_DATABASE.find((c) => c.id === DEBUG_CARD_ID)!;
    const dCardObj = createCardObject(dCardBase);
    G.players['0'].hand.push({
      ...dCardObj,
      canPlay: true,
      currentCost: 0
    } as Card);
  }
};

export default addDebugCardToHand;
