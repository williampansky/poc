import { GameState, Zone } from '../../../interfaces';
import { onTurnStartZoneInteractions } from '../../../zone-interactions';

/**
 * Handles any zone interactions that occur on the start of a turn.
 */
const initZoneOnTurnStartInteractions = (G: GameState): void => {
  onTurnStartZoneInteractions(G);
};

export default initZoneOnTurnStartInteractions;
