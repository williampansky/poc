import { GameState, Zone } from '../../../interfaces';

/**
 * Handles any zone interactions that occur on the start of a turn.
 */
const initZoneOnTurnStartInteractions = (G: GameState): void => {
  G.zones.forEach((z: Zone) => {
    switch (z.id) {
      // destroy all cards here after turn 5
      case 'ZONE_002':
        if (G.turn === 6) {
          z.sides = {
            '0': [],
            '1': [],
          };
          z.powers = {
            '0': 0,
            '1': 0,
          };
        }
        break;
      default:
        break;
    }
  });
};

export default initZoneOnTurnStartInteractions;
