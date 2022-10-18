import { PhaseConfig } from "boardgame.io";

const initCardMechanicsPhase: PhaseConfig = {
  next: 'initZoneInteractions',
  onBegin(G, ctx) {
    console.log(G.turn, ctx.phase);
    // @todo add mechanics here
    // end the phase
    ctx.events?.endPhase();
  },
}

export default initCardMechanicsPhase;