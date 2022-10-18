import { GameState } from '../interfaces';
import { clearZoneSide, disableZone, enableZone } from './methods';

const ZoneInteractions = {
  /**
   * Clears the `zone[#].side` for the provided `playerId` param,
   * otherwise it clears the zone side for both players.
   */
  clearZoneSide: (G: GameState, zoneNumber: number) => {
    return clearZoneSide(G, zoneNumber);
  },

  /**
   * Enables the `zone[#]` for the provided `playerId` param,
   * otherwise it disables the zone for both players.
   */
  enableZone: (G: GameState, zoneNumber: number, playerId?: string) => {
    return enableZone(G, zoneNumber, playerId);
  },

  /**
   * Disables the `zone[#]` for the provided `playerId` param,
   * otherwise it disables the zone for both players.
   */
  disableZone: (G: GameState, zoneNumber: number, playerId?: string) => {
    return disableZone(G, zoneNumber, playerId);
  },
};

export default ZoneInteractions;
