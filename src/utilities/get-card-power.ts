import { add } from 'mathjs';
import { Card } from '../interfaces';

/**
 * Determines which power to show on a card or minion.
 * @param {Card} card
 * @returns power to display on card/minion
 */
const getCardPower = (card: Card): number => {
  const initialPower =
    card?.powerOverride ||
    card.powerStream[card.powerStream.length - 1]?.currentPower ||
    card.basePower;

  if (card.zonePowerAdjustment) {
    return add(initialPower, card.zonePowerAdjustment);
  }

  return initialPower;
};

export default getCardPower;
