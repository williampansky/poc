import { PhaseConfig } from 'boardgame.io';

const initCardMechanicsPhase: PhaseConfig = {
  next: 'initZoneInteractions',
  onBegin(G, ctx) {
    if (G.Config.debugConfig.logPhaseToConsole) {
      console.log(G.turn, ctx.phase);
    }

    // @todo add mechanics here
    ctx.events?.endPhase();
  },
};

export default initCardMechanicsPhase;
