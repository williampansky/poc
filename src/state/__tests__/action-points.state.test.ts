import { ActionPoints, DefaultState } from '..';
import { GameState } from '../../interfaces';

const getMockGameState = (
  val1: any = { current: 0, total: 0 },
  val2: any = { current: 0, total: 0 }
) => {
  const mockGameState: GameState = {
    ...DefaultState,
    ActionPoints: {
      '0': val1,
      '1': val2,
    },
  };

  return mockGameState;
};

describe('Handles G.ActionPoints state manipulation', () => {
  test('Should return the default state', () => {
    const defaultStateCheck = {
      '0': { current: 0, total: 0 },
      '1': { current: 0, total: 0 },
    };

    const fn = ActionPoints.defaultState;
    expect(fn).toStrictEqual(defaultStateCheck);
  });

  test("Should increment the player's total action point value", () => {
    let G = getMockGameState(
      { current: 0, total: 0 },
      { current: 4, total: 4 }
    );

    ActionPoints.incrementTotal(G, '0');
    expect(G.ActionPoints['0']).toStrictEqual({ current: 0, total: 1 });
    expect(G.ActionPoints['1']).toStrictEqual({ current: 4, total: 4 });
  });

  test("Should set the player's current value to match their total", () => {
    let G = getMockGameState(
      { current: 0, total: 5 },
      { current: 1, total: 2 }
    );

    ActionPoints.matchTotal(G, '0');
    expect(G.ActionPoints['0']).toStrictEqual({ current: 5, total: 5 });
    expect(G.ActionPoints['1']).toStrictEqual({ current: 1, total: 2 });
  });

  test("Should set the player's current value to any provided amount", () => {
    let G = getMockGameState(
      { current: 0, total: 5 },
      { current: 2, total: 3 }
    );

    ActionPoints.setCurrent(G, '0', 12);
    expect(G.ActionPoints['0']).toStrictEqual({ current: 12, total: 5 });
    expect(G.ActionPoints['1']).toStrictEqual({ current: 2, total: 3 });
  });

  test("Should set the player's total value to any provided amount", () => {
    let G = getMockGameState(
      { current: 2, total: 5 },
      { current: 4, total: 5 }
    );

    ActionPoints.setTotal(G, '0', 50);
    expect(G.ActionPoints['0']).toStrictEqual({ current: 2, total: 50 });
    expect(G.ActionPoints['1']).toStrictEqual({ current: 4, total: 5 });
  });

  test("Should subtract from the player's current value", () => {
    let G = getMockGameState(
      { current: 6, total: 6 },
      { current: 1, total: 8 }
    );

    ActionPoints.subtract(G, '0', 5);
    expect(G.ActionPoints['0']).toStrictEqual({ current: 1, total: 6 });
    expect(G.ActionPoints['1']).toStrictEqual({ current: 1, total: 8 });
  });

  test("Should *not* subtract from the player's current value past zero", () => {
    let G = getMockGameState(
      { current: 5, total: 5 },
      { current: 2, total: 9 }
    );

    ActionPoints.subtract(G, '0', 10);
    expect(G.ActionPoints['0']).toStrictEqual({ current: 0, total: 5 });
    expect(G.ActionPoints['1']).toStrictEqual({ current: 2, total: 9 });
  });
});
