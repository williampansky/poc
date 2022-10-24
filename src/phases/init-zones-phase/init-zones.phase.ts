import { Ctx, PhaseConfig } from 'boardgame.io';
import { GameState, Zone } from '../../interfaces';
import { Zones } from '../../state';
import ZONE_DATABASE from '../../tempZonesDatabase';
import createZoneObject from '../../utilities/create-zone-object';

const initZonesPhase: PhaseConfig = {
  start: true,
  onBegin(G: GameState, ctx: Ctx) {
    if (G.Config.debugConfig.logPhaseToConsole) console.clear();

    const { random } = ctx;
    const randomZonesArray = random?.Shuffle(ZONE_DATABASE);
    const isCtxRandom = randomZonesArray?.forEach(z => z !== undefined);
    const withUuid = true;
    let newZones: Zone[] = [];


    // check if ctx.random?.Shuffle is working
    // usually seems to fail in mockCtx test util
    if (isCtxRandom) {
      for (let idx = 0; idx < G.Config.gameConfig.numberOfZones; idx++) {
        let newZone = createZoneObject(randomZonesArray![idx], withUuid);
        newZones.push(newZone);
      }
    } else {
      const backupZonesArray = ZONE_DATABASE;
      for (let idx = 0; idx < G.Config.gameConfig.numberOfZones; idx++) {
        let newZone = createZoneObject(backupZonesArray![idx], withUuid);
        newZones.push(newZone);
      }
    }

    Zones.set(G, newZones);

    if (G.Config.debugConfig.logPhaseToConsole) {
      const one = G.Zones[0].name;
      const two = G.Zones[1].name;
      const three = G.Zones[2].name;
      console.log(G.turn, ctx.phase, `| 0: ${one}, 1: ${two}, 2: ${three}`);
    }
  },
  endIf: (G: GameState) => Zones.areReady(G),
};

export default initZonesPhase;
