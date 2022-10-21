import { Ctx, PhaseConfig } from "boardgame.io";
import { Card, GameState, Minion, Zone, ZonesCardsReference } from "../interfaces";
import { revealCard } from "../moves";

const revealCardsPhase: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    console.log(G.turn, ctx.phase);
    const first = G.FirstRevealer;
    const second = first === '0' ? '1' : '0';
    G.ZonesCardsReference.forEach((z: ZonesCardsReference, zoneIdx: number) => {
      z[first].forEach((obj: Card, objIdx: number) => {
        if (!obj.revealed) revealCard(G, ctx, '0', zoneIdx, obj, objIdx);
      });

      z[second].forEach((obj: Card, objIdx: number) => {
        if (!obj.revealed) revealCard(G, ctx, '1', zoneIdx, obj, objIdx);
      });
    });

    ctx.events?.endPhase();
  },
};

export default revealCardsPhase;
