import { GameState, Zone } from '../../../interfaces';
import ZoneInteractions from '../../../zone-interactions/zone-interactions';

/**
 * Handles any zone interactions that occur on the start of a turn.
 */
const initZoneOnTurnStartInteractions = (G: GameState): void => {
  G.zones.forEach((z: Zone, zoneIdx: number) => {
    switch (z.id) {
      case 'ZONE_002':
        if (G.turn === 3) ZoneInteractions.clearZoneSide(G, zoneIdx);
        break;

      case 'ZONE_005':
        if (G.turn === 4) ZoneInteractions.clearZoneSide(G, zoneIdx);
        break;

      case 'ZONE_006':
        if (G.turn === 5) ZoneInteractions.clearZoneSide(G, zoneIdx);
        break;

      case 'ZONE_011':
        if (G.turn === 6) ZoneInteractions.disableZone(G, zoneIdx);
        break;
    
      default:
        break;
    }
  });
};

export default initZoneOnTurnStartInteractions;
