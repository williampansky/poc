import { PlayerTurnDone } from '..';
import { mockGameState } from '../../test-utils';

describe('Handles G.PlayerTurnDone state manipulation', () => {
  test('Should return the default state', () => {
    const defaultStateCheck = {
      '0': false,
      '1': false,
    };

    const fn = PlayerTurnDone.defaultState;
    expect(fn).toStrictEqual(defaultStateCheck);
  });

  test("Should set the player's turn boolean to true", () => {
    let G = mockGameState('PlayerTurnDone');

    PlayerTurnDone.set(G, '0');
    PlayerTurnDone.set(G, '1');

    expect(G.PlayerTurnDone['0']).toBe(true);
    expect(G.PlayerTurnDone['1']).toBe(true);
  });

  test("Should reset both player's turn boolean to false", () => {
    let G = mockGameState('PlayerTurnDone', true, false);

    PlayerTurnDone.reset(G);

    expect(G.PlayerTurnDone['0']).toBe(false);
    expect(G.PlayerTurnDone['1']).toBe(false);
  });
});
