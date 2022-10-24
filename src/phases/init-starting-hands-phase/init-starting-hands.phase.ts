import { Ctx, PhaseConfig } from 'boardgame.io';
import { drawCardFromPlayersDeck } from '../../utilities';
import { GameState } from '../../interfaces';
import CARD_DATABASE from '../../tempCardsDatabase';
import createCardObject from '../../utilities/create-card-object';
import createRandomDeck from '../../utilities/create-random-deck';

const initStartingHandsPhase: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    const { random } = ctx;
    if (G.Config.debugConfig.logPhaseToConsole) {
      console.log(G.turn, ctx.phase);
    }

    // debug opponents side interactions of CARD_10
    if (G.Config.debugConfig.debugCardId !== '') {
      let randomCard3 = random!.Shuffle(CARD_DATABASE)[0];
      let randomCard3Obj = createCardObject(randomCard3);
      for (let index = 0; index < 2; index++) {
        G.Zones[0].sides['1'].push(randomCard3Obj);
      }
    }

    // set decks
    G.players['0'].deck = createRandomDeck(G, ctx, CARD_DATABASE);
    G.players['1'].deck = createRandomDeck(G, ctx, CARD_DATABASE);

    // init hands
    [...Array(G.Config.gameConfig.cardsPerStartingHand)].forEach(() => {
      drawCardFromPlayersDeck(G, '0');
      drawCardFromPlayersDeck(G, '1');
    });
  },
  endIf: (G: GameState) => {
    // end phase when both players have cards in hand and in deck
    const perDeck = G.Config.gameConfig.cardsPerDeck;
    const perStartingHand = G.Config.gameConfig.cardsPerStartingHand;
    const startingDeckLength = Math.abs(perDeck - perStartingHand);

    return (
      G.players['0'].deck.length === startingDeckLength &&
      G.players['0'].hand.length === perStartingHand &&
      G.players['1'].deck.length === startingDeckLength &&
      G.players['1'].hand.length === perStartingHand
    );
  },
};

export default initStartingHandsPhase;
