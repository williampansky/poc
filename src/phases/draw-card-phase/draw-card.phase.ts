import { Ctx, PhaseConfig } from 'boardgame.io';
import { GameState } from '../../interfaces';
import { drawCardFromPlayersDeck, logPhaseToConsole } from '../../utilities';

const drawCardPhase: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    logPhaseToConsole(G.turn, ctx.phase);
    drawCardFromPlayersDeck(G, '0');
    drawCardFromPlayersDeck(G, '1');
    ctx.events?.endPhase();
  },
};

export default drawCardPhase;
