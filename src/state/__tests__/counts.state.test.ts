import { config, GameState } from '../../interfaces';
import { Counts, DefaultState } from '../';

const getMockGameState = () => {
  const mockGameState: GameState = {
    ...DefaultState,
    Counts: {
      '0': {
        deck: 15,
        hand: 5
      },
      '1': {
        deck: 15,
        hand: 5
      }
    }
  }

  return mockGameState;
}

describe('Handles G.Counts state manipulation', () => {
  test('Should return the default state', () => {
    const defaultStateCheck = {
      '0': {
        deck: config.gameConfig.cardsPerDeck,
        hand: 0
      },
      '1': {
        deck: config.gameConfig.cardsPerDeck,
        hand: 0
      }
    }

    const fn = Counts.defaultState;
    expect(fn).toStrictEqual(defaultStateCheck);
  });

  test('Should reduce the player\'s deck count by 1', () => {
    let G = getMockGameState();
    Counts.decrementDeck(G, '0');
    
    expect(G.Counts['0'].deck).toEqual(14); // should change
    expect(G.Counts['0'].hand).toEqual(G.Counts['0'].hand); // shouldn't change
    expect(G.Counts['1'].deck).toEqual(G.Counts['1'].deck); // shouldn't change
    expect(G.Counts['1'].hand).toEqual(G.Counts['1'].hand); // shouldn't change
  });

  test('Should reduce the player\'s hand count by 1', () => {
    let G = getMockGameState();
    Counts.decrementHand(G, '0');

    expect(G.Counts['0'].deck).toEqual(G.Counts['0'].deck);
    expect(G.Counts['0'].hand).toEqual(4);
    expect(G.Counts['1'].deck).toEqual(G.Counts['1'].deck);
    expect(G.Counts['1'].hand).toEqual(G.Counts['1'].hand);
  });

  test('Should increase the player\'s deck count by 1', () => {
    let G = getMockGameState();
    Counts.incrementDeck(G, '0');

    expect(G.Counts['0'].deck).toEqual(16);
    expect(G.Counts['0'].hand).toEqual(G.Counts['0'].hand);
    expect(G.Counts['1'].deck).toEqual(G.Counts['1'].deck);
    expect(G.Counts['1'].hand).toEqual(G.Counts['1'].hand);
  });

  test('Should increase the player\'s deck count by 1', () => {
    let G = getMockGameState();
    Counts.incrementHand(G, '0');

    expect(G.Counts['0'].deck).toEqual(G.Counts['0'].deck);
    expect(G.Counts['0'].hand).toEqual(6);
    expect(G.Counts['1'].deck).toEqual(G.Counts['1'].deck);
    expect(G.Counts['1'].hand).toEqual(G.Counts['1'].hand);
  });
});
