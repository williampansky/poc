import { Ctx, PhaseConfig } from "boardgame.io";
import { Card, GameState, Minion, Zone } from "../interfaces";
import { revealCard } from "../moves";

const revealCardsPhase: PhaseConfig = {
  next: 'initCardMechanics',
  onBegin(G: GameState, ctx: Ctx) {
    G.zones.forEach((z: Zone, zoneIdx: number) => {
      z.sides['0'].forEach((obj: Minion, objIdx: number) => {
        if (!obj.revealed) revealCard(G, ctx, '0', zoneIdx, obj, objIdx);
      });

      z.sides['1'].forEach((obj: Minion, objIdx: number) => {
        if (!obj.revealed) revealCard(G, ctx, '1', zoneIdx, obj, objIdx);
      });
    });

    ctx.events?.endPhase();
  },
};

export default revealCardsPhase;
