import { DefaultState, PlayerTurnDone } from '..';
import { GameState } from '../../interfaces';
import createCardObject from '../../utilities/create-card-object';

const getMockGameState = (val?: any) => {
  const mockGameState: GameState = {
    ...DefaultState,
    PlayerTurnDone: {
      '0': val ? val : false,
      '1': val ? val : false
    }
  }

  return mockGameState;
}

describe('Handles G.PlayerTurnDone state manipulation', () => {
  test('Should return the default state', () => {
    const defaultStateCheck = {
      '0': false,
      '1': false
    }

    const fn = PlayerTurnDone.defaultState;
    expect(fn).toStrictEqual(defaultStateCheck);
  });

  test('Should set the player\'s turn boolean to true', () => {
    let G = getMockGameState();

    PlayerTurnDone.set(G, '0');
    PlayerTurnDone.set(G, '1');
    
    expect(G.PlayerTurnDone['0']).toBe(true);
    expect(G.PlayerTurnDone['1']).toBe(true);
  });

  test('Should reset both player\'s turn boolean to false', () => {
    let G = getMockGameState(true);

    PlayerTurnDone.reset(G);
    
    expect(G.PlayerTurnDone['0']).toBe(false);
    expect(G.PlayerTurnDone['1']).toBe(false);
  });
});
