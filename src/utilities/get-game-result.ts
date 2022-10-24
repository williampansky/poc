import { PlayerID, Zone } from '../interfaces';
import getSumOfAllZonesPower from './get-sum-of-all-zones-power';
import getZonesWonBySide from './get-zone-wins-by-side';

const getGameResult = (Zones: Zone[]): PlayerID | '' => {
  const numberOfZonesWonByPlayer0 = getZonesWonBySide(Zones)['0'];
  const numberOfZonesWonByPlayer1 = getZonesWonBySide(Zones)['1'];
  const player0TotalPower = getSumOfAllZonesPower(Zones, '0');
  const player1TotalPower = getSumOfAllZonesPower(Zones, '1');

  if (numberOfZonesWonByPlayer1 > numberOfZonesWonByPlayer0) {
    return '1';
  } else if (numberOfZonesWonByPlayer0 > numberOfZonesWonByPlayer1) {
    return '0';
  } else {
    if (player1TotalPower > player0TotalPower) {
      return '1';
    } else if (player0TotalPower > player1TotalPower) {
      return '0';
    } else {
      return ''; // draw
    }
  }

};

export default getGameResult;
