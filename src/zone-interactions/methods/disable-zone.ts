import { GameState } from '../../interfaces';

/**
 * Disables the `zone[#]` for both players.
 */
const disableZone = (G: GameState, zoneNumber: number): void => {
  G.zones[zoneNumber].disabled = { '0': false, '1': false }
};

export default disableZone;
