import { Ctx, PhaseConfig } from 'boardgame.io';
import {
  Card,
  GameState,
  Minion,
  Zone,
  ZonesCardsReference,
} from '../interfaces';
import { revealCard } from '../moves';

const revealCardsFaceDownPhase: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    if (G.Config.debugConfig.logPhaseToConsole) {
      console.log(G.turn, ctx.phase);
    }

    // G.ZonesCardsReference.forEach((z: ZonesCardsReference, zoneIdx: number) => {
    //   z['0'].forEach((obj: Card, objIdx: number) => {
    //     if (!obj.revealed) revealCard(G, ctx, '0', zoneIdx, obj, objIdx);
    //   });

    //   z['1'].forEach((obj: Card, objIdx: number) => {
    //     if (!obj.revealed) revealCard(G, ctx, '1', zoneIdx, obj, objIdx);
    //   });
    // });

    ctx.events?.endPhase();
  },
};

export default revealCardsFaceDownPhase;
