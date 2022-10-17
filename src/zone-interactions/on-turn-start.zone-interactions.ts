import { GameState, Zone } from '../interfaces';
import { clearZoneSides, disableZone } from './methods';

const onTurnStartZoneInteractions = (G: GameState): void => {
  G.zones.forEach((z: Zone, zoneIdx: number) => {
    switch (z.id) {
      case 'ZONE_002':
        if (G.turn === 3) clearZoneSides(G, zoneIdx);
        break;

      case 'ZONE_005':
        if (G.turn === 4) clearZoneSides(G, zoneIdx);
        break;

      case 'ZONE_006':
        if (G.turn === 5) clearZoneSides(G, zoneIdx);
        break;

      case 'ZONE_011':
        if (G.turn === 6) disableZone(G, zoneIdx);
        break;
    
      default:
        break;
    }
  });
};

export default onTurnStartZoneInteractions;
