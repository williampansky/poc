import { Config } from '../game.config';
import { GameState, Zone, ZoneBase } from '../interfaces';
import tempZonesDatabase from '../tempZonesDatabase';
import createZoneObject from '../utilities/create-zone-object';
import getRandomNumberBetween from '../utilities/get-random-number-between';

const Zones = {
  defaultState: [
    ...Array.from(Array(Config.gameConfig.numberOfZones)).map(() => {
      return createZoneObject({
        id: '',
        name: '',
      });
    }),
  ] as Zone[],

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
