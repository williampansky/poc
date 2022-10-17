import { GameState, Zone } from '../../../interfaces';

/**
 * Handles any zone interactions that occur on the start of a turn.
 */
const initZoneOnTurnStartInteractions = (G: GameState): void => {
  G.zones.forEach((z: Zone) => {
    switch (z.id) {
      // destroy all cards here after turn 5
      case 'ZONE_002':
        if (G.turn === 3) {
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
      case 'ZONE_005':
        if (G.turn === 4) {
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
      case 'ZONE_006':
        if (G.turn === 5) {
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
      case 'ZONE_011':
        if (G.turn === 6) z.disabled = { '0': false, '1': false }
        break;
      default:
        break;
    }
  });
};

export default initZoneOnTurnStartInteractions;
