import { ActivePlayers, Ctx, PlayerID } from "boardgame.io";
import { getRandomNumberBetween } from "../utilities";

export interface MockCtxOptions {
  activePlayers?: null | ActivePlayers;
  currentPlayer?: PlayerID;
  gameover?: any;
  numMoves?: number;
  numPlayers?: number;
  phase: string;
  playOrder?: Array<PlayerID>;
  playOrderPos?: number;
  turn?: number;
}

const mockCtx = (opts?: MockCtxOptions) => {
  const random = (): number => {
    const rand = getRandomNumberBetween(0, 20);
    const number = rand;
    return number;
  };

  return {
    activePlayers: opts?.activePlayers || null,
    currentPlayer: opts?.currentPlayer || '0',
    numPlayers: opts?.numPlayers || 1,
    numMoves: opts?.numMoves,
    phase: opts?.phase || '',
    playOrder: opts?.playOrder || ['0'],
    playOrderPos: opts?.playOrderPos || 0,
    turn: opts?.turn || 0,
    gameover: opts?.gameover,
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

export default mockCtx;
