import { Ctx, PhaseConfig } from 'boardgame.io';
import { GameState, Zone } from '../interfaces';
import { Zones } from '../state';
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

    Zones.set(G, newZones);
    console.log(G.turn, ctx.phase, `| 0: ${G.Zones[0].name}, 1: ${G.Zones[1].name}, 2: ${G.Zones[2].name}`);
  },
  endIf: (G: GameState) => Zones.areReady(G),
};

export default initZonesPhase;
