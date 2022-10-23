import { mockGameState } from '..';
import { DefaultState } from '../../state';

describe('Handles creating a mock object of the GameState', () => {
  test('Should return the default state when no modifications are provided', () => {
    const fn = mockGameState();
    expect(fn).toStrictEqual(DefaultState);
  });

  test('Should return the default state when only the mockKey is passed', () => {
    expect(mockGameState('ActionPoints')).toStrictEqual(DefaultState);
    expect(mockGameState('Counts')).toStrictEqual(DefaultState);
    expect(mockGameState('PlayerTurnDone')).toStrictEqual(DefaultState);
  });

  test('Should return the modified state when options are passed', () => {
    const apForPlayer0 =  { current: 2, total: 4 }
    expect(mockGameState('ActionPoints', apForPlayer0)).toStrictEqual({
      ...DefaultState,
      ActionPoints: {
        '0': apForPlayer0,
        '1': { current: 0, total: 0 }
      }
    });

    const countsP0 = { hand: 5, deck: 15 };
    const countsP1 = { hand: 10, deck: 10 };
    expect(mockGameState('Counts', countsP0, countsP1)).toStrictEqual({
      ...DefaultState,
      Counts: {
        '0': countsP0,
        '1': countsP1
      }
    });

    expect(mockGameState('PlayerTurnDone', true, false)).toStrictEqual({
      ...DefaultState,
      PlayerTurnDone: {
        '0': true,
        '1': false
      }
    });
  });
});
