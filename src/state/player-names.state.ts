import { GameState, PlayerID } from '../interfaces';

const PlayerNames = {
  defaultState: {
    '0': '',
    '1': '',
  } as Record<PlayerID, string>,

  set: (G: GameState, player: PlayerID, name: string): void => {
    G.PlayerNames[player] = name;
  },
};

export default PlayerNames;
