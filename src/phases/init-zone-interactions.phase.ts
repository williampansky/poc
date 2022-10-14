import { PhaseConfig } from "boardgame.io";

const initZoneInteractions: PhaseConfig = {
  next: 'drawCard',
  onBegin(G, ctx) {
    // end the phase
    ctx.events?.endPhase();
  },
}

export default initZoneInteractions;