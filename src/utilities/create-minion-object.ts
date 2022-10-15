import { Card, Minion } from '../interfaces';

/**
 * Creates a `Minion` object from the provided card info.
 */
const createMinionObject = (obj: Card): Minion => {
  return {
    __id: obj?.__id,
    baseCost: obj?.baseCost,
    basePower: obj?.basePower,
    canPlay: obj?.canPlay,
    currentCost: obj?.currentCost,
    description: obj?.description,
    displayPower: obj?.displayPower,
    mechanic: obj?.mechanic,
    name: obj?.name,
    powerStream: [],
    revealed: false,
    revealedOnTurn: 0,
    type: 'MINION',
    uuid: obj?.uuid,
    zonePowerAdjustment: 0,
  } as Minion;
};

export default createMinionObject;
