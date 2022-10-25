import { Ctx, PhaseConfig } from 'boardgame.io';
import { GameState, Zone } from '../../interfaces';
import { Zones } from '../../state';
import ZONE_DATABASE from '../../tempZonesDatabase';
import createZoneObject from '../../utilities/create-zone-object';

const initZonesPhase: PhaseConfig = {
  start: true,
  onBegin(G: GameState, ctx: Ctx) {
    const { random } = ctx;
    const randomZonesArray = random?.Shuffle(ZONE_DATABASE);
    const withUuid = true;
    let newZones: Zone[] = [];
    
    for (let idx = 0; idx < G.Config.gameConfig.numberOfZones; idx++) {
      let newZone = createZoneObject(randomZonesArray![idx], withUuid);
      newZones.push(newZone);
    }

    Zones.set(G, newZones);

    if (G.Config.debugConfig.logPhaseToConsole) {
      console.clear();
      console.table(newZones);
    }
  },
  endIf: (G: GameState) => Zones.areReady(G),
};

export default initZonesPhase;
