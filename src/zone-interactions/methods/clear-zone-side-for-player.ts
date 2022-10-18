import { GameState } from '../../interfaces';

/**
 * Clears the `zone[#].side` of the provided `playerId` param.
 */
const clearZoneSideForPlayer = (
  G: GameState,
  zoneNumber: number,
  playerId: string
): void => {
  G.zones[zoneNumber].sides[playerId] = [];
};

export default clearZoneSideForPlayer;
