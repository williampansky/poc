import { Ctx, PhaseConfig } from 'boardgame.io';
import { GameState, Zone } from '../../interfaces';
import { PlayerNames, Zones } from '../../state';
import ZONE_DATABASE from '../../tempZonesDatabase';
import { logPhaseToConsole } from '../../utilities';
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
    PlayerNames.set(G, '0', 'Player');
    PlayerNames.set(G, '1', 'Opponent');

    // @ts-ignore
    ctx.effects.effectsEnd();

    if (G.Config.debugConfig.logPhaseToConsole) {
      console.clear();

      const zone0 = `${newZones[0].name} (${newZones[0].id})`;
      const zone1 = `${newZones[1].name} (${newZones[1].id})`;
      const zone2 = `${newZones[2].name} (${newZones[2].id})`;

      logPhaseToConsole(G.turn, ctx.phase, {
        key: 'ZONES',
        value: `${zone0} | ${zone1} | ${zone2}`,
      });
    }
  },
  endIf: (G: GameState) => Zones.areReady(G),
};

export default initZonesPhase;
