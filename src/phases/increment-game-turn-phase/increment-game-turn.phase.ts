import { Ctx, PhaseConfig } from 'boardgame.io';
import { add } from 'mathjs';
import { GameState } from '../../interfaces';

/**
 * Increments the game turn (note: ***not*** `ctx.turn`).
 */
const incrementGameTurnPhase: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    if (G.Config.debugConfig.logPhaseToConsole) {
      console.log(`${G.turn} => ${add(G.turn, 1)}`, ctx.phase);
    }

    G.turn = add(G.turn, 1);
    ctx.events?.endPhase();
  },
};

export default incrementGameTurnPhase;
