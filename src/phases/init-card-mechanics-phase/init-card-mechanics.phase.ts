import { PhaseConfig } from 'boardgame.io';
import { logPhaseToConsole } from '../../utilities';

const initCardMechanicsPhase: PhaseConfig = {
  next: 'initZoneInteractions',
  onBegin(G, ctx) {
    logPhaseToConsole(G.turn, ctx.phase);

    // @todo add mechanics here
    ctx.events?.endPhase();
  },
};

export default initCardMechanicsPhase;
