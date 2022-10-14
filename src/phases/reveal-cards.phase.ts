import { Ctx, PhaseConfig } from "boardgame.io";
import { Card, GameState, Zone } from "../interfaces";
import { revealCard } from "../moves";

const revealCardsPhase: PhaseConfig = {
  next: 'initCardMechanics',
  onBegin(G: GameState, ctx: Ctx) {
    G.zones.forEach((z: Zone, zoneIdx: number) => {
      z.sides['0'].forEach((c: Card, cIdx: number) => {
        if (!c.revealed) revealCard(G, ctx, '0', zoneIdx, c, cIdx);
      });

      z.sides['1'].forEach((c: Card, cIdx: number) => {
        if (!c.revealed) revealCard(G, ctx, '1', zoneIdx, c, cIdx);
      });
    });

    ctx.events?.endPhase();
  },
};

export default revealCardsPhase;
