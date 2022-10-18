import { GameState } from '../../../interfaces';

/**
 * Sets `actionPoints` to `actionPointsTotal` for the provided player.
 */
const setActionPointsToTotal = (G: GameState): void => {
  const fn = (G: GameState, playerId: string): void => {
    G.players[playerId].actionPoints = G.players[playerId].actionPointsTotal;
  }

  fn(G, '0');
  fn(G, '1');
};

export default setActionPointsToTotal;
