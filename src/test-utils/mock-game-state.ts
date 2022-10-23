import { GameState } from '../interfaces';
import { DefaultState } from '../state';

const mockGameState = (
  mockKey?: string,
  mockValueForPlayer0?: any,
  mockValueForPlayer1?: any
): GameState => {
  const mockedDefaultGameState = {
    ...DefaultState
  }

  if (mockKey) {
    const mockedModifiedGameState = {
      ...DefaultState,
      [`${mockKey}`]: {
        '0': mockValueForPlayer0
          ? mockValueForPlayer0
          // @ts-ignore
          : DefaultState[`${mockKey}`]['0'],
        '1': mockValueForPlayer1
          ? mockValueForPlayer1
          // @ts-ignore
          : DefaultState[`${mockKey}`]['1'],
      },
    };

    return mockedModifiedGameState;
  }

  return mockedDefaultGameState;
};

export default mockGameState;
