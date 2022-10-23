import { config } from '../../interfaces';
import { Counts, DefaultState } from '../';
import { mockGameState } from '../../test-utils';

describe('Handles G.Counts state manipulation', () => {
  test('Should return the default state', () => {
    const defaultStateCheck = {
      '0': {
        deck: config.gameConfig.cardsPerDeck,
        hand: 0,
      },
      '1': {
        deck: config.gameConfig.cardsPerDeck,
        hand: 0,
      },
    };

    const fn = Counts.defaultState;
    expect(fn).toStrictEqual(defaultStateCheck);
  });

  test("Should reduce the player's deck count by 1", () => {
    const G = mockGameState(
      'Counts',
      { deck: 20, hand: 0 },
      { deck: 20, hand: 0 }
    );

    Counts.decrementDeck(G, '0');

    expect(G.Counts['0'].deck).toBe(19); // should change
    expect(G.Counts['0'].hand).toBe(DefaultState.Counts['0'].hand); // shouldn't change
    expect(G.Counts['1'].deck).toBe(DefaultState.Counts['1'].deck); // shouldn't change
    expect(G.Counts['1'].hand).toBe(DefaultState.Counts['1'].hand); // shouldn't change
  });

  test("Should reduce the player's hand count by 1", () => {
    const G = mockGameState(
      'Counts',
      { deck: 20, hand: 5 },
      { deck: 20, hand: 0 }
    );

    Counts.decrementHand(G, '0');

    expect(G.Counts['0'].deck).toBe(DefaultState.Counts['0'].deck);
    expect(G.Counts['0'].hand).toBe(4);
    expect(G.Counts['1'].deck).toBe(DefaultState.Counts['1'].deck);
    expect(G.Counts['1'].hand).toBe(DefaultState.Counts['1'].hand);
  });

  test("Should increase the player's deck count by 1", () => {
    const G = mockGameState(
      'Counts',
      { deck: 20, hand: 0 },
      { deck: 20, hand: 0 }
    );

    Counts.incrementDeck(G, '0');

    expect(G.Counts['0'].deck).toBe(21);
    expect(G.Counts['0'].hand).toBe(DefaultState.Counts['0'].hand);
    expect(G.Counts['1'].deck).toBe(DefaultState.Counts['1'].deck);
    expect(G.Counts['1'].hand).toBe(DefaultState.Counts['1'].hand);
  });

  test("Should increase the player's hand count by 1", () => {
    const G = mockGameState(
      'Counts',
      { deck: 20, hand: 0 },
      { deck: 20, hand: 0 }
    );

    Counts.incrementHand(G, '0');

    expect(G.Counts['0'].deck).toBe(DefaultState.Counts['0'].deck);
    expect(G.Counts['0'].hand).toBe(1);
    expect(G.Counts['1'].deck).toBe(DefaultState.Counts['1'].deck);
    expect(G.Counts['1'].hand).toBe(DefaultState.Counts['1'].hand);
  });
});
