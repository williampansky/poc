import { Card } from "../interfaces";

/**
 * Determines which power to show on a card or minion.
 * @param {Card} card
 * @returns power to display on card/minion
 */
const getDisplayPower = (card: Card): number => {
  if (card.powerOverride) {
    return card.powerOverride;
  }
  
  if (card.powerStream.length !== 0) {
    const streamLength = card.powerStream.length;
    const latestStreamPower = card.powerStream[streamLength].currentPower;
    return latestStreamPower;
  }
  
  if (card.zonePowerAdjustment) {
    return Math.round(card.basePower + card.zonePowerAdjustment);
  }

  return card.basePower;
};

export default getDisplayPower;
