import { add } from 'mathjs';
import { GameState } from '../../../interfaces';

/**
 * Increments the `actionPointsTotal` for the provided player.
 */
const incrementActionPointsTotal = (G: GameState) => {
  const fn = (G: GameState, playerId: string): void => {
    const apPerTurn = G.config.gameConfig.actionPointsPerTurn;
    const apPerGame = G.config.gameConfig.actionPointsTotal;
  
    if (G.players[playerId].actionPointsTotal < apPerGame) {
      G.players[playerId].actionPointsTotal = add(
        G.players[playerId].actionPointsTotal,
        apPerTurn
      );
    }
  };

  fn(G, '0');
  fn(G, '1');
}

export default incrementActionPointsTotal;
