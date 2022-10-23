import { Ctx } from 'boardgame.io';
import { config, GameState } from '../../../interfaces';
import { DefaultState } from '../../../state';
import getRandomNumberBetween from '../../../utilities/get-random-number-between';
import initStartingHandsPhase from '../init-starting-hands.phase';

const { gameConfig: { cardsPerDeck, cardsPerStartingHand } } = config;
const startingDeckLength = Math.abs(cardsPerDeck - cardsPerStartingHand);

const getMockGameState = () => {
  const mockGameState: GameState = {
    ...DefaultState,
  };

  return mockGameState;
};

const getMockCtx = () => {
  const random = () => {
    const rand = getRandomNumberBetween(0, 20);
    const number = rand;
    return number;
  };

  return {
    activePlayers: null,
    currentPlayer: '0',
    numPlayers: 1,
    phase: 'initStartingHands',
    playOrder: ['0'],
    playOrderPos: 0,
    turn: 0,
    random: {
      Shuffle: (array: any) => {
        const clone = [...array];
        let sourceIndex = array.length;
        let destinationIndex = 0;
        const shuffled = Array.from({ length: sourceIndex });

        while (sourceIndex) {
          const randomIndex = Math.trunc(sourceIndex * random());
          shuffled[destinationIndex++] = clone[randomIndex];
          clone[randomIndex] = clone[--sourceIndex];
        }

        return shuffled;
      },
      D4: () => getRandomNumberBetween(1, 4),
      D6: () => getRandomNumberBetween(1, 6),
      D10: () => getRandomNumberBetween(1, 10),
      D12: () => getRandomNumberBetween(1, 12),
      D20: () => getRandomNumberBetween(1, 20),
      Die: () => random(),
      Number: () => random(),
    }
  } as Ctx;
};

describe('Handles state manipulation relative to the starting hands phase', () => {
  test('Should set the player hands to gameConfig.cardsPerStartingHand', () => {
    let G = DefaultState;
    initStartingHandsPhase.onBegin!(G, getMockCtx());

    // check hand length
    expect(G.players['0'].hand.length).toBe(cardsPerStartingHand);
    expect(G.players['1'].hand.length).toBe(cardsPerStartingHand);
    
    // check matching deck length
    expect(G.players['0'].deck.length).toBe(startingDeckLength);
    expect(G.players['1'].deck.length).toBe(startingDeckLength);
  });
});
