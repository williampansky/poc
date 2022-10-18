import { Ctx, PhaseConfig } from "boardgame.io";
import { add } from "mathjs";
import { GameState } from "../interfaces";

/**
 * Increments the game turn (note: ***not*** `ctx.turn`).
 */
const incrementGameTurnPhase: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    G.turn = add(G.turn, 1);
    console.log(G.turn, ctx.phase);
    ctx.events?.endPhase();
  },
}

export default incrementGameTurnPhase;
