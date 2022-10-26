import { Ctx, PhaseConfig } from 'boardgame.io';
import { GameState } from '../interfaces';
import { logPhaseToConsole } from '../utilities';

const initZoneInteractions: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    logPhaseToConsole(G.turn, ctx.phase);

    ctx.events?.endPhase();
  },
};

export default initZoneInteractions;
