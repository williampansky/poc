import { Ctx } from "boardgame.io";
import { Card, GameState } from "./interfaces";

const aiEnumeration = {
  enumerate: (G: GameState, ctx: Ctx) => {
    const { players, Zones, config } = G;
    const { random } = ctx;
    const perZone = config.gameConfig.numberOfSlotsPerZone;
    const aiPlayer = players['1'];
    const aiHand = aiPlayer.hand;
    let moves = [];

    // avoids onslaught of INVALID_MOVE errors
    if (G.PlayerTurnDone['1'] === false) {
      if (aiHand.length >= 1) {
        let cardsThanCanBePlayed: Card[] = []; // find playable cards
        aiHand.forEach((c: Card) => {
          if (c.canPlay) cardsThanCanBePlayed.push(c);
        });

        for (let i = 0; i < cardsThanCanBePlayed.length; i++) {
          if (!Zones[0].disabled['1'])
            for (let i = 0; i < perZone - Zones[0].sides[1].length; i++) {
              moves.push({
                move: 'playAiCard',
                args: [0, cardsThanCanBePlayed[0], 0],
              });
            }

          if (!Zones[1].disabled['1'])
            for (let i = 0; i < perZone - Zones[1].sides[1].length; i++) {
              moves.push({
                move: 'playAiCard',
                args: [1, cardsThanCanBePlayed[0], 0],
              });
            }

          if (!Zones[2].disabled['1'])
            for (let i = 0; i < perZone - Zones[2].sides[1].length; i++) {
              moves.push({
                move: 'playAiCard',
                args: [2, cardsThanCanBePlayed[0], 0],
              });
            }
        }
      }

      // moves.push({ event: 'endTurn' });
      moves.push({ move: 'setDone', args: ['1'] });
    }

    // console.log(moves);
    return moves;
  },
}

export default aiEnumeration;
