import { Ctx, PhaseConfig } from "boardgame.io";
import { v4 as uuid } from 'uuid';
import { Card, GameState } from "../interfaces";
import CARD_DATABASE from '../tempCardsDatabase';

const initStartingHandsPhase: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    const { random } = ctx;
    let tempOpponentArray: Card[] = [];
    let tempPlayerArray: Card[] = [];

    // create deck
    [...Array(G.config.gameConfig.cardsPerDeck)].forEach((_, i) => {
      let randomCard1 = random?.Shuffle(CARD_DATABASE)[0];
      let randomCard2 = random?.Shuffle(CARD_DATABASE)[0];

      tempOpponentArray.push({
        __id: randomCard1?.id,
        baseCost: randomCard1?.cost,
        basePower: randomCard1?.power,
        canPlay: false,
        currentCost: randomCard1?.cost,
        description: randomCard1?.description,
        displayPower: randomCard1?.power,
        mechanic: randomCard1?.mechanic,
        name: randomCard1?.name,
        powerStream: [],
        uuid: uuid(),
        zonePowerAdjustment: 0,
        revealed: false,
        revealedOnTurn: 0
      } as Card);
      tempPlayerArray.push({
        __id: randomCard2?.id,
        baseCost: randomCard2?.cost,
        basePower: randomCard2?.power,
        canPlay: false,
        currentCost: randomCard2?.cost,
        description: randomCard2?.description,
        displayPower: randomCard2?.power,
        mechanic: randomCard2?.mechanic,
        name: randomCard2?.name,
        powerStream: [],
        uuid: uuid(),
        zonePowerAdjustment: 0,
        revealed: false,
        revealedOnTurn: 0
      } as Card);
    });

    // debug opponents side interactions of CARD_10
    if (G.config.debugConfig.debugCardId !== '') {
      let randomCard3 = random?.Shuffle(CARD_DATABASE)[0];
      for (let index = 0; index < 2; index++) {
        G.zones[0].sides['1'].push({
          __id: randomCard3?.id,
          baseCost: randomCard3?.cost,
          basePower: randomCard3?.power,
          canPlay: false,
          currentCost: randomCard3?.cost,
          description: randomCard3?.description,
          displayPower: randomCard3?.power,
          mechanic: randomCard3?.mechanic,
          name: randomCard3?.name,
          powerStream: [],
          uuid: uuid(),
          zonePowerAdjustment: 0,
          revealed: false,
          revealedOnTurn: 0
        } as Card);
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
    // End phase when both player's decks are full (20 cards)
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
}

export default initStartingHandsPhase;
