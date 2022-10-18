import { Ctx, PhaseConfig } from 'boardgame.io';
import { v4 as uuid } from 'uuid';
import { GameState, Zone } from '../interfaces';
import ZONE_DATABASE from '../tempZonesDatabase';
import createZoneObject from '../utilities/create-zone-object';

const initZonesPhase: PhaseConfig = {
  start: true,
  onBegin(G: GameState, ctx: Ctx) {
    console.clear();
    const { random } = ctx;
    const randomZonesArray = random?.Shuffle(ZONE_DATABASE) as Zone[];
    const withUuid = true;
    let newZones: Zone[] = [];

    for (let idx = 0; idx < G.config.gameConfig.numberOfZones; idx++) {
      let newZone = createZoneObject(randomZonesArray![idx], withUuid);
      newZones.push(newZone);
    }

    G.zones = newZones;
    console.log(G.turn, ctx.phase, ` | 0: ${G.zones[0].name}, 1: ${G.zones[1].name}, 2: ${G.zones[2].name}`);
  },
  endIf(G: GameState) {
    return (
      G.zones[0].uuid !== '' && G.zones[1].uuid !== '' && G.zones[2].uuid !== ''
    );
  },
};

export default initZonesPhase;
