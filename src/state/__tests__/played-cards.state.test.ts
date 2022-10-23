import { PlayedCards } from '../';
import { mockGameState } from '../../test-utils';
import createCardObject from '../../utilities/create-card-object';

describe('Handles G.PlayedCards state manipulation', () => {
  test('Should return the default state', () => {
    const defaultStateCheck = {
      '0': [],
      '1': [],
    };

    const fn = PlayedCards.defaultState;
    expect(fn).toStrictEqual(defaultStateCheck);
  });

  test("Should push a Card object the player's PlayedCards array", () => {
    let G = mockGameState();
    const testCardBase = { id: 'testCard1', name: 'cardy', cost: 1, power: 0 };
    const testCardObj = createCardObject(testCardBase);

    PlayedCards.push(G, '0', testCardObj);

    expect(G.PlayedCards['0']).toStrictEqual([testCardObj]);
    expect(G.PlayedCards['0']).toHaveLength(1);
    expect(G.PlayedCards['1']).toEqual([]);
    expect(G.PlayedCards['1']).toHaveLength(0);
  });
});
