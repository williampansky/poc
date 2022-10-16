import { Ctx, PhaseConfig } from "boardgame.io";
import { v4 as uuid } from 'uuid';
import { GameState, Zone } from "../interfaces";
import ZONE_DATABASE from '../tempZonesDatabase';

const initZonesPhase: PhaseConfig = {
  start: true,
  next: 'drawCard',
  onBegin(G: GameState, ctx: Ctx) {
    console.clear();
    console.log(G.turn, ctx.phase);
    const { random } = ctx;
    const randomZonesArray = random?.Shuffle(ZONE_DATABASE);
    let newZones: Zone[] = [];

    for (let idx = 0; idx < G.config.gameConfig.numberOfZones; idx++) {
      let newZone = {
        ...G.zones[0],
        disabled:
          randomZonesArray![idx].id === 'ZONE_003'
            ? { '0': true, '1': true }
            : { '0': false, '1': false },
        id: randomZonesArray![idx].id,
        name: randomZonesArray![idx].name,
        powerText: randomZonesArray![idx]?.powerText,
        powerAdjustment: randomZonesArray![idx]?.powerAdjustment,
        uuid: uuid(),
      } as Zone;

      newZones.push(newZone);
    }

    G.zones = newZones;
  },
  endIf(G: GameState) {
    return (
      G.zones[0].uuid !== '' && G.zones[1].uuid !== '' && G.zones[2].uuid !== ''
    );
  },
};

export default initZonesPhase;
