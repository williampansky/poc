import { Ctx, PhaseConfig } from 'boardgame.io';
import { Card, GameState } from '../interfaces';
import createCardObject from '../utilities/create-card-object';
import CARD_DATABASE from '../tempCardsDatabase';
import createMinionObject from '../utilities/create-minion-object';

const initStartingHandsPhase: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    const { random } = ctx;
    let tempOpponentArray: Card[] = [];
    let tempPlayerArray: Card[] = [];

    // create deck
    [...Array(G.config.gameConfig.cardsPerDeck)].forEach((_, i) => {
      let randomCard1 = random!.Shuffle(CARD_DATABASE)[0];
      let randomCard2 = random!.Shuffle(CARD_DATABASE)[0];

      tempOpponentArray.push(createCardObject(randomCard1));
      tempPlayerArray.push(createCardObject(randomCard2));
    });

    // debug opponents side interactions of CARD_10
    if (G.config.debugConfig.debugCardId !== '') {
      let randomCard3 = random!.Shuffle(CARD_DATABASE)[0];
      let randomCard3Obj = createCardObject(randomCard3);
      for (let index = 0; index < 2; index++) {
        G.zones[0].sides['1'].push(createMinionObject(randomCard3Obj));
      }
    }

    // set decks
    G.players['0'].deck = tempPlayerArray;
    G.players['1'].deck = tempOpponentArray;

    // init hands
    [...Array(G.config.gameConfig.cardsPerStartingHand)].forEach(() => {
      G.players['0'].hand.push(G.players['0'].deck.splice(0, 1)[0]);
      G.players['1'].hand.push(G.players['1'].deck.splice(0, 1)[0]);
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
