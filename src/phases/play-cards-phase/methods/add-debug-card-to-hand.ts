import { Card, GameState } from '../../../interfaces';
import { v4 as uuid } from 'uuid';
import CARD_DATABASE from '../../../tempCardsDatabase';

/**
 * If a card's id is set in `config.debugConfig`, add that
 * card to player 0's hand for testing.
 */
const addDebugCardToHand = (G: GameState): void => {
  if (G.config.debugConfig.debugCardId !== '') {
    const DEBUG_CARD_ID = G.config.debugConfig.debugCardId;
    const dCard = CARD_DATABASE.find((c) => c.id === DEBUG_CARD_ID);
    G.players['0'].hand.push({
      __id: dCard?.id,
      baseCost: dCard?.cost,
      basePower: dCard?.power,
      canPlay: true,
      currentCost: 0,
      description: dCard?.description,
      displayPower: dCard?.power,
      mechanic: dCard?.mechanic,
      name: dCard?.name,
      powerStream: [],
      revealed: false,
      revealedOnTurn: 0,
      uuid: uuid(),
      zonePowerAdjustment: 0,
    } as Card);
  }
};

export default addDebugCardToHand;
