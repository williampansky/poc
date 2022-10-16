import { Ctx, PhaseConfig } from "boardgame.io";
import { GameState, Zone } from "../../interfaces";

const revealZonePhase: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    if (!G.zones[0].revealed) {
      G.zones[0].revealed = true;
      ctx.events?.endPhase();
    } else if (!G.zones[1].revealed) {
      G.zones[1].revealed = true;
      ctx.events?.endPhase();
    } else if (!G.zones[2].revealed) {
      G.zones[2].revealed = true;
      ctx.events?.endPhase();
    }
  },
};

export default revealZonePhase;
