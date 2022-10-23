import { createCardObject, drawCardFromPlayersDeck } from '..';
import { DefaultState } from '../../state';
import { mockGameState } from '../../test-utils';

describe('Handles moving card objects from G.Deck to G.Hands + G.Counts', () => {
  test('Should draw a single card if no amount is provided', () => {
    const testCardBase = { id: 'testCard', name: 'cardy', cost: 1, power: 0 };
    const testCardObj = createCardObject(testCardBase);

    let G = {
      ...DefaultState,
      Counts: {
        '0': { deck: 1, hand: 0 },
        '1': { deck: 0, hand: 0 },
      },
      players: {
        '0': {
          deck: [testCardObj],
          hand: [],
          name: '',
          actionPoints: 0,
          actionPointsTotal: 0,
        },
        '1': {
          deck: [],
          hand: [],
          name: '',
          actionPoints: 0,
          actionPointsTotal: 0,
        },
      },
    };

    drawCardFromPlayersDeck(G, '0');

    expect(G.Counts['0'].deck).toBe(0);
    expect(G.Counts['0'].hand).toBe(1);

    expect(G.players['0'].deck).toHaveLength(0);
    expect(G.players['0'].hand).toHaveLength(1);
    expect(G.players['0'].hand).toStrictEqual([testCardObj]);
  });

  test('Should multiple cards if to the provided amount', () => {
    const testCardBase = { id: 'testCard', name: 'cardy', cost: 1, power: 0 };
    const testCardObj = createCardObject(testCardBase);

    let G = {
      ...DefaultState,
      Counts: {
        '0': { deck: 3, hand: 1 },
        '1': { deck: 0, hand: 0 },
      },
      players: {
        '0': {
          deck: [testCardObj, testCardObj, testCardObj],
          hand: [testCardObj],
          name: '',
          actionPoints: 0,
          actionPointsTotal: 0,
        },
        '1': {
          deck: [],
          hand: [],
          name: '',
          actionPoints: 0,
          actionPointsTotal: 0,
        },
      },
    };

    drawCardFromPlayersDeck(G, '0', 3);

    expect(G.Counts['0'].deck).toBe(0);
    expect(G.Counts['0'].hand).toBe(4);

    expect(G.players['0'].deck).toHaveLength(0);
    expect(G.players['0'].hand).toHaveLength(4);
    expect(G.players['0'].hand).toStrictEqual([
      testCardObj,
      testCardObj,
      testCardObj,
      testCardObj,
    ]);
  });

  test("Should draw no card(s) if the player's hand is full", () => {
    const testCardBase = { id: 'testCard', name: 'cardy', cost: 1, power: 0 };
    const testCardObj = createCardObject(testCardBase);

    let G = {
      ...DefaultState,
      Counts: {
        '0': { deck: 3, hand: 8 },
        '1': { deck: 0, hand: 0 },
      },
      players: {
        '0': {
          deck: [testCardObj, testCardObj, testCardObj],
          hand: [
            testCardObj,
            testCardObj,
            testCardObj,
            testCardObj,
            testCardObj,
            testCardObj,
            testCardObj,
            testCardObj,
          ],
          name: '',
          actionPoints: 0,
          actionPointsTotal: 0,
        },
        '1': {
          deck: [],
          hand: [],
          name: '',
          actionPoints: 0,
          actionPointsTotal: 0,
        },
      },
    };

    drawCardFromPlayersDeck(G, '0');

    expect(G.Counts['0'].deck).toBe(3);
    expect(G.Counts['0'].hand).toBe(8);

    expect(G.players['0'].deck).toHaveLength(3);
    expect(G.players['0'].hand).toHaveLength(8);
    expect(G.players['0'].hand).toStrictEqual([
      testCardObj,
      testCardObj,
      testCardObj,
      testCardObj,
      testCardObj,
      testCardObj,
      testCardObj,
      testCardObj,
    ]);
  });

  test("Should stop drawing card(s) when the player's hand gets full", () => {
    const testCardBase = { id: 'testCard', name: 'cardy', cost: 1, power: 0 };
    const testCardObj = createCardObject(testCardBase);

    let G = {
      ...DefaultState,
      Counts: {
        '0': { deck: 3, hand: 6 },
        '1': { deck: 0, hand: 0 },
      },
      players: {
        '0': {
          deck: [testCardObj, testCardObj, testCardObj],
          hand: [
            testCardObj,
            testCardObj,
            testCardObj,
            testCardObj,
            testCardObj,
            testCardObj,
          ],
          name: '',
          actionPoints: 0,
          actionPointsTotal: 0,
        },
        '1': {
          deck: [],
          hand: [],
          name: '',
          actionPoints: 0,
          actionPointsTotal: 0,
        },
      },
    };

    drawCardFromPlayersDeck(G, '0', 3);

    expect(G.Counts['0'].deck).toBe(1);
    expect(G.Counts['0'].hand).toBe(8);

    expect(G.players['0'].deck).toHaveLength(1);
    expect(G.players['0'].hand).toHaveLength(8);
    expect(G.players['0'].hand).toStrictEqual([
      testCardObj,
      testCardObj,
      testCardObj,
      testCardObj,
      testCardObj,
      testCardObj,
      testCardObj,
      testCardObj,
    ]);
  });

  test("Should not draw card(s) when the player's deck is empty", () => {
    const testCardBase = { id: 'testCard', name: 'cardy', cost: 1, power: 0 };
    const testCardObj = createCardObject(testCardBase);

    let G = {
      ...DefaultState,
      Counts: {
        '0': { deck: 3, hand: 0 },
        '1': { deck: 0, hand: 0 },
      },
      players: {
        '0': {
          deck: [testCardObj, testCardObj, testCardObj],
          hand: [],
          name: '',
          actionPoints: 0,
          actionPointsTotal: 0,
        },
        '1': {
          deck: [],
          hand: [],
          name: '',
          actionPoints: 0,
          actionPointsTotal: 0,
        },
      },
    };

    drawCardFromPlayersDeck(G, '0', 5);

    expect(G.Counts['0'].deck).toBe(0);
    expect(G.Counts['0'].hand).toBe(3);

    expect(G.players['0'].deck).toHaveLength(0);
    expect(G.players['0'].hand).toHaveLength(3);
    expect(G.players['0'].hand).toStrictEqual([
      testCardObj,
      testCardObj,
      testCardObj,
    ]);
  });
});
