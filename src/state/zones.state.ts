import { add, subtract } from 'mathjs';
import { config, GameState, PlayerID, Zone, ZoneBase } from '../interfaces';
import tempZonesDatabase from '../tempZonesDatabase';
import createZoneObject from '../utilities/create-zone-object';
import getRandomNumberBetween from '../utilities/get-random-number-between';

const Zones = {
  defaultState: <Zone[]>[
    ...Array.from(Array(config.gameConfig.numberOfZones)).map(() => {
      return createZoneObject({
        id: '',
        name: '',
      });
    }),
  ],

  create: (zoneBase: ZoneBase, withUuid: boolean): Zone => {
    return createZoneObject(zoneBase, withUuid);
  },

  createRandom: (): Zone => {
    const db = tempZonesDatabase;
    const randomZone = db[getRandomNumberBetween(0, db.length)];
    return createZoneObject(randomZone, true);
  },

  set: (G: GameState, ZonesArray: Zone[]): void => {
    G.Zones = ZonesArray;
  },

  setZone: (G: GameState, zoneNumber: number, zoneObj: Zone): void => {
    G.Zones[zoneNumber] = zoneObj;
  },

  areReady: (G: GameState): boolean => {
    return (
      G.Zones[0].uuid !== '' && G.Zones[1].uuid !== '' && G.Zones[2].uuid !== ''
    );
  },
};

export default Zones;
