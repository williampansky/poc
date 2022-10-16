import { add } from 'mathjs';
import { GameState, Minion } from '../../../interfaces';

const calculateZoneSidePower = (
  G: GameState,
  zoneNumber: number,
  playerId: string
): number => {
  // calculate zonePower from zero for a clean slate since
  // we're looping thru each card on each side
  let sidePower: number = 0;

  // add up each minion's current displayPower by
  // looping thru each side and add each card's current power
  // to the sidePowerX variable defined above
  G.zones[zoneNumber].sides[playerId].forEach((obj: Minion) => {
    return (sidePower = add(obj.displayPower, sidePower));
  });

  return sidePower;
};

export default calculateZoneSidePower;
