import { Ctx, PhaseConfig } from 'boardgame.io';
import { GameState } from '../../interfaces';
import { drawTopCardFromPlayersDeck } from '../../utilities';

const drawCardPhase: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    if (G.config.debugConfig.logPhaseToConsole) console.log(G.turn, ctx.phase);
    drawTopCardFromPlayersDeck(G, '0');
    drawTopCardFromPlayersDeck(G, '1');
    ctx.events?.endPhase();
  },
};

export default drawCardPhase;
