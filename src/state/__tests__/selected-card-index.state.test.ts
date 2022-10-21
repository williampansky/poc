import { DefaultState, SelectedCardIndex } from '..';
import { GameState } from '../../interfaces';

const getMockGameState = (val1?: any, val2?: any) => {
  const mockGameState: GameState = {
    ...DefaultState,
    SelectedCardIndex: {
      '0': val1 ? val1 : undefined,
      '1': val2 ? val2 : undefined
    }
  }

  return mockGameState;
}

describe('Handles G.SelectedCardIndex state manipulation', () => {
  test('Should return the default state', () => {
    const defaultStateCheck = {
      '0': undefined,
      '1': undefined
    }

    const fn = SelectedCardIndex.defaultState;
    expect(fn).toStrictEqual(defaultStateCheck);
  });

  test('Should set the player\'s selected card index', () => {
    let G = getMockGameState();

    SelectedCardIndex.set(G, '0', 2);
    
    expect(G.SelectedCardIndex['0']).toBe(2); // should change
    expect(G.SelectedCardIndex['1']).toBeUndefined(); // shouldn't change
  });

  test('Should set the player\'s selected card to undefined', () => {
    let G = getMockGameState(1);
    SelectedCardIndex.reset(G, '0');
    
    expect(G.SelectedCardIndex['0']).toBeUndefined();
    expect(G.SelectedCardIndex['1']).toBeUndefined();
  });
});
