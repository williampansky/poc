import { Ctx, PhaseConfig } from 'boardgame.io';
import { GameState } from '../interfaces';

const initZoneInteractions: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    if (G.config.debugConfig.logPhaseToConsole) {
      console.log(G.turn, ctx.phase);
    }

    ctx.events?.endPhase();
  },
};

export default initZoneInteractions;
