import { Ctx, PhaseConfig } from 'boardgame.io';
import { GameState } from '../interfaces';
import { onCardPlayZoneInteractions } from '../zone-interactions';

const initZoneInteractions: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    console.log(G.turn, ctx.phase);
    onCardPlayZoneInteractions(G);
    ctx.events?.endPhase();
  },
};

export default initZoneInteractions;
