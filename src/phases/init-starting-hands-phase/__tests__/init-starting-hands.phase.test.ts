import { Config } from '../../../interfaces';
import { DefaultState } from '../../../state';
import { mockCtx } from '../../../test-utils';
import initStartingHandsPhase from '../init-starting-hands.phase';

const { gameConfig: { cardsPerDeck, cardsPerStartingHand } } = Config;
const startingDeckLength = Math.abs(cardsPerDeck - cardsPerStartingHand);

describe('Handles state manipulation relative to the starting hands phase', () => {
  test('Should set the player hands to gameConfig.cardsPerStartingHand', () => {
    let G = DefaultState;
    initStartingHandsPhase.onBegin!(G, mockCtx());

    // check hand length
    expect(G.players['0'].hand.length).toBe(cardsPerStartingHand);
    expect(G.players['1'].hand.length).toBe(cardsPerStartingHand);
    
    // check matching deck length
    expect(G.players['0'].deck.length).toBe(startingDeckLength);
    expect(G.players['1'].deck.length).toBe(startingDeckLength);
  });
});
