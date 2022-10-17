import { GameState } from '../../interfaces';
import clearZoneSideForPlayer from './clear-zone-side-for-player';

/**
 * Clears the `zone[#].side` for both players.
 */
const clearZoneSides = (G: GameState, zoneNumber: number): void => {
  clearZoneSideForPlayer(G, zoneNumber, '0');
  clearZoneSideForPlayer(G, zoneNumber, '1');
};

export default clearZoneSides;
