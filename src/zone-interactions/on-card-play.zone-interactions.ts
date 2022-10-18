import { GameState, Minion, Zone } from '../interfaces';
import {
  setMinionDisplayPowerValue,
  setZoneAdjustmentPowerValue,
} from './methods';
import runInteractionForZone001 from './zone-interactions-by-id/zone_001.interaction';

const onCardPlayZoneInteractions = (G: GameState): void => {
  G.zones.forEach((z: Zone, zIdx: number) => {
    if (z.revealed) {
      switch (z.id) {
        case 'ZONE_001':
          runInteractionForZone001(G);
          break;
        case 'ZONE_004':
          runInteractionForZone001(G);
          break;
        case 'ZONE_007':
          runInteractionForZone001(G);
          break;
        case 'ZONE_008':
          runInteractionForZone001(G);
          break;

        case 'ZONE_010':
          z.sides['0'].forEach((obj: Minion, cIdx: number) => {
            G.zones[zIdx].sides['0'][cIdx].displayPower = obj.currentCost;
          });
          z.sides['1'].forEach((obj: Minion, cIdx: number) => {
            G.zones[zIdx].sides['1'][cIdx].displayPower = obj.currentCost;
          });
          break;

        default:
          break;
      }
    }
  });
};

export default onCardPlayZoneInteractions;
