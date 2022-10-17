import { GameState } from '../../interfaces';

/**
 * Enables the `zone[#]` for both players.
 */
const enableZone = (G: GameState, zoneNumber: number): void => {
  G.zones[zoneNumber].disabled = { '0': true, '1': true }
};

export default enableZone;
