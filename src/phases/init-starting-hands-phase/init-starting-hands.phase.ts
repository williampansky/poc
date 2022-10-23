import { Ctx, PhaseConfig } from 'boardgame.io';
import { GameState } from '../../interfaces';
import { spliceDeckAndPushToHand } from '../draw-card-phase/methods';
import CARD_DATABASE from '../../tempCardsDatabase';
import createCardObject from '../../utilities/create-card-object';
import createMinionObject from '../../utilities/create-minion-object';
import createRandomDeck from '../../utilities/create-random-deck';

const initStartingHandsPhase: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    console.log(G.turn, ctx.phase);
    const { random } = ctx;

    // debug opponents side interactions of CARD_10
    if (G.config.debugConfig.debugCardId !== '') {
      let randomCard3 = random!.Shuffle(CARD_DATABASE)[0];
      let randomCard3Obj = createCardObject(randomCard3);
      for (let index = 0; index < 2; index++) {
        G.zones[0].sides['1'].push(createMinionObject(randomCard3Obj));
      }
    }

    // set decks
    G.players['0'].deck = createRandomDeck(G, ctx, CARD_DATABASE);
    G.players['1'].deck = createRandomDeck(G, ctx, CARD_DATABASE);

    // init hands
    [...Array(G.config.gameConfig.cardsPerStartingHand)].forEach(() => {
      spliceDeckAndPushToHand(G);
    });
  },
  endIf: (G: GameState) => {
    // end phase when both players have cards in hand and in deck
    const perDeck = G.config.gameConfig.cardsPerDeck;
    const perStartingHand = G.config.gameConfig.cardsPerStartingHand;
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
