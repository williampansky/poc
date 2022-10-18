import { add } from 'mathjs';
import { Card, Minion } from '../interfaces';

/**
 * Determines which power to show on a card or minion.
 */
const getCardPower = (obj: Card | Minion): number => {
  const initialPower =
    obj?.powerOverride ||
    obj.powerStream[obj.powerStream.length - 1]?.currentPower ||
    obj.basePower;

  if (obj.zonePowerAdjustment) {
    return add(initialPower, obj.zonePowerAdjustment);
  }

  return initialPower;
};

export default getCardPower;
