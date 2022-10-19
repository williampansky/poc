import { Ctx, PhaseConfig } from "boardgame.io";
import { Card, GameState, Minion, Zone, ZonesCardsReference } from "../interfaces";
import { revealCard } from "../moves";

const revealCardsPhase: PhaseConfig = {
  next: 'initCardMechanics',
  onBegin(G: GameState, ctx: Ctx) {
    console.log(G.turn, ctx.phase);
    G.ZonesCardsReference.forEach((z: ZonesCardsReference, zoneIdx: number) => {
      z['0'].forEach((obj: Card, objIdx: number) => {
        if (!obj.revealed) revealCard(G, ctx, '0', zoneIdx, obj, objIdx);
      });

      z['1'].forEach((obj: Card, objIdx: number) => {
        if (!obj.revealed) revealCard(G, ctx, '1', zoneIdx, obj, objIdx);
      });
    });

    ctx.events?.endPhase();
  },
};

export default revealCardsPhase;
