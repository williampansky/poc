import { add } from "mathjs";
import { Zone } from "../interfaces";

interface ZonesWonBySide {
  '0': number;
  '1': number;
}

const getZonesWonBySide = (Zones: Zone[]): ZonesWonBySide => {
  let ZonesWon = { '0': 0, '1': 0 };

  const zone1 = {
    '0': Zones[0].powers['0'],
    '1': Zones[0].powers['1'],
  }

  const zone2 = {
    '0': Zones[1].powers['0'],
    '1': Zones[1].powers['1'],
  }

  const zone3 = {
    '0': Zones[2].powers['0'],
    '1': Zones[2].powers['1'],
  }

  if (zone1['1'] > zone1['0']) ZonesWon['1'] = add(ZonesWon['1'], 1);
  else if (zone1['0'] > zone1['1']) ZonesWon['0'] = add(ZonesWon['0'], 1);

  if (zone2['1'] > zone2['0']) ZonesWon['1'] = add(ZonesWon['1'], 1);
  else if (zone2['0'] > zone2['1']) ZonesWon['0'] = add(ZonesWon['0'], 1);

  if (zone3['1'] > zone3['0']) ZonesWon['1'] = add(ZonesWon['1'], 1);
  else if (zone3['0'] > zone3['1']) ZonesWon['0'] = add(ZonesWon['0'], 1);

  return ZonesWon;
}

export default getZonesWonBySide