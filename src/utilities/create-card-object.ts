import { v4 as uuid } from 'uuid';
import { Card, CardBase } from '../interfaces';

/**
 * Creates a playable `Card` object from the provided card base info.
 */
const createCardObject = (obj: CardBase): Card => {
  return {
    __id: obj?.id,
    baseCost: obj?.cost,
    basePower: obj?.power,
    canPlay: false,
    currentCost: obj?.cost,
    description: obj?.description,
    displayPower: obj?.power,
    mechanic: obj?.mechanic,
    name: obj?.name,
    powerStream: [],
    revealed: false,
    revealedOnTurn: 0,
    type: 'CARD',
    uuid: uuid(),
    zonePowerAdjustment: 0,
  } as Card;
};

export default createCardObject;
