import { Ctx, PhaseConfig } from "boardgame.io";
import { spliceDeckAndPushToHand } from "./methods";
import { GameState } from "../../interfaces";

const drawCardPhase: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    console.log(G.turn, ctx.phase);
    spliceDeckAndPushToHand(G);
    ctx.events?.endPhase();
  },
}

export default drawCardPhase;
