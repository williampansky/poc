import { DefaultState, SelectedCardData } from '../';
import { GameState } from '../../interfaces';
import createCardObject from '../../utilities/create-card-object';

const getMockGameState = () => {
  const mockGameState: GameState = {
    ...DefaultState,
    SelectedCardData: {
      '0': undefined,
      '1': undefined
    }
  }

  return mockGameState;
}

describe('Handles G.SelectedCardData state manipulation', () => {
  test('Should return the default state', () => {
    const defaultStateCheck = {
      '0': undefined,
      '1': undefined
    }

    const fn = SelectedCardData.defaultState;
    expect(fn).toStrictEqual(defaultStateCheck);
  });

  test('Should set the player\'s selected card data object', () => {
    let G = getMockGameState();
    const testCardBase = { id: 'testCard1', name: 'cardy', cost: 1, power: 0 };
    const testCardObj = createCardObject(testCardBase);

    SelectedCardData.set(G, '0', testCardObj);
    
    expect(G.SelectedCardData['0']).toStrictEqual(testCardObj); // should change
    expect(G.SelectedCardData['1']).toBeUndefined(); // shouldn't change
  });

  test('Should set the player\'s selected card to undefined', () => {
    let G = getMockGameState();
    SelectedCardData.reset(G, '0');
    
    expect(G.SelectedCardData['0']).toBeUndefined(); // should'nt change
    expect(G.SelectedCardData['1']).toBeUndefined(); // shouldn't change
  });
});
