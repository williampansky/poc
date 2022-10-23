import { Ctx, PhaseConfig } from 'boardgame.io';
import { calculateZoneSidePower } from './methods';
import { GameState, } from '../../interfaces';

const handleZonePowerCalculationsPhase: PhaseConfig = {
  next: 'drawCard',
  onBegin(G: GameState, ctx: Ctx) {
    console.log(G.turn, ctx.phase);
    const { Zones } = G;

    // loop thru each zone
    Zones.forEach((_, zoneIdx: number) => {
      // set the zone power
      G.Zones[zoneIdx].powers = {
        '0': calculateZoneSidePower(G, zoneIdx, '0'),
        '1': calculateZoneSidePower(G, zoneIdx, '1'),
      };
    });

    // end the phase
    ctx.events?.endPhase();
  },
};

export default handleZonePowerCalculationsPhase;
