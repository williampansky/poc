import { PhaseConfig } from "boardgame.io";

const initCardMechanicsPhase: PhaseConfig = {
  next: 'initZoneInteractions',
  onBegin(G, ctx) {
    // @todo add mechanics here
    // end the phase
    ctx.events?.endPhase();
  },
}

export default initCardMechanicsPhase;