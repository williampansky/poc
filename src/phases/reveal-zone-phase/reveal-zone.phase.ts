import { Ctx, PhaseConfig } from 'boardgame.io';
import { GameState, Minion, Zone } from '../../interfaces';
import getCardPower from '../../utilities/get-card-power';
import runInteractionForZone001 from '../../zone-interactions/zone-interactions-by-id/zone_001.interaction';
import { calculateZoneSidePower } from '../handle-zone-power-calculations-phase/methods';

const revealZonePhase: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    if (G.turn === 0 && !G.zones[0].revealed) {
      console.log(G.turn, `${ctx.phase} 0`);
      G.zones[0].revealed = true;
      // initOnZoneRevealInteractions();
      ctx.events?.endPhase();
    } else if (G.turn === 1 && !G.zones[1].revealed) {
      console.log(G.turn, `${ctx.phase} 1`);
      G.zones[1].revealed = true;
      // initOnZoneRevealInteractions();
      ctx.events?.endPhase();
    } else if (G.turn === 2 && !G.zones[2].revealed) {
      console.log(G.turn, `${ctx.phase} 2`);
      G.zones[2].revealed = true;
      // initOnZoneRevealInteractions();
      ctx.events?.endPhase();
    } else {
      ctx.events?.endPhase();
    }
  },
};

export default revealZonePhase;
