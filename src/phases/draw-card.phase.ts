import { Ctx, PhaseConfig } from "boardgame.io";
import { GameState } from "../interfaces";

const drawCardPhase: PhaseConfig = {
  // prettier-ignore
  onBegin(G: GameState, ctx: Ctx) {
    const maxHandSize = G.config.gameConfig.cardsPerHand;

    // 1: add card to hand
    if (G.players['1'].hand.length < maxHandSize) { // ...... canDraw
      G.players['1'].hand.push( // .......................... pushes to hand
        G.players['1'].deck.splice(0, 1)[0] // .............. splices from deck
      );
    }

    // 0: add card to hand
    if (G.players['0'].hand.length < maxHandSize) { // ...... canDraw
      G.players['0'].hand.push( // .......................... pushes to hand
        G.players['0'].deck.splice(0, 1)[0] // .............. splices from deck
      );
    }

    ctx.events?.endPhase();
  },
}

export default drawCardPhase;
