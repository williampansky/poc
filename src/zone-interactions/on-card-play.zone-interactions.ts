import { GameState, Minion, Zone } from '../interfaces';
import {
  setMinionDisplayPowerValue,
  setZoneAdjustmentPowerValue,
} from './methods';

const onCardPlayZoneInteractions = (G: GameState): void => {
  G.zones.forEach((z: Zone, zIdx: number) => {
    if (z.revealed) {
      switch (z.id) {
        case 'ZONE_001':
        case 'ZONE_004':
        case 'ZONE_007':
        case 'ZONE_008':
          z.sides['0'].forEach((obj: Minion, cIdx: number) => {
            setZoneAdjustmentPowerValue(G, zIdx, '0', cIdx, z.powerAdjustment);
            setMinionDisplayPowerValue(G, zIdx, '0', cIdx, obj);
          });
          z.sides['1'].forEach((obj: Minion, cIdx: number) => {
            setZoneAdjustmentPowerValue(G, zIdx, '1', cIdx, z.powerAdjustment);
            setMinionDisplayPowerValue(G, zIdx, '1', cIdx, obj);
          });
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
