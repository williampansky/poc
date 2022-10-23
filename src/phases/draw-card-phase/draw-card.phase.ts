import { Ctx, PhaseConfig } from 'boardgame.io';
import { GameState } from '../../interfaces';
import { drawCardFromPlayersDeck } from '../../utilities';

const drawCardPhase: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    if (G.config.debugConfig.logPhaseToConsole) console.log(G.turn, ctx.phase);
    drawCardFromPlayersDeck(G, '0');
    drawCardFromPlayersDeck(G, '1');
    ctx.events?.endPhase();
  },
};

export default drawCardPhase;
