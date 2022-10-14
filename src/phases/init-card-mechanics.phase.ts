import { PhaseConfig } from "boardgame.io";

const initCardMechanics: PhaseConfig = {
  next: 'initZoneInteractions',
  onBegin(G, ctx) {
    // end the phase
    ctx.events?.endPhase();
  },
}

export default initCardMechanics;