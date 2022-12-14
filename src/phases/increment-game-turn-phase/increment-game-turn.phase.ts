import { Ctx, PhaseConfig } from 'boardgame.io';
import { add } from 'mathjs';
import { GameState } from '../../interfaces';
import { logPhaseToConsole } from '../../utilities';

/**
 * Increments the game turn (note: ***not*** `ctx.turn`).
 */
const incrementGameTurnPhase: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    if (G.Config.debugConfig.logPhaseToConsole) {
      logPhaseToConsole(G.turn, ctx.phase, {
        key: 'TURNS',
        value: `${G.turn} => ${add(G.turn, 1)}`
      })
    }

    G.turn = add(G.turn, 1);
    ctx.events?.endPhase();
  },
};

export default incrementGameTurnPhase;
