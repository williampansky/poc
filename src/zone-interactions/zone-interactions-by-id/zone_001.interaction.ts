import { GameState, Minion, Zone } from '../../interfaces';
import {
  setMinionDisplayPowerValue,
  setZoneAdjustmentPowerValue,
} from '../methods';

const runInteractionForZone001 = (G: GameState): void => {
  G.zones.forEach((z: Zone, zIdx: number) => {
    if (z.revealed) {
      z.sides['0'].forEach((obj: Minion, cIdx: number) => {
        setZoneAdjustmentPowerValue(G, zIdx, '0', cIdx, z.powerAdjustment);
        setMinionDisplayPowerValue(G, zIdx, '0', cIdx, obj);
      });
      z.sides['1'].forEach((obj: Minion, cIdx: number) => {
        setZoneAdjustmentPowerValue(G, zIdx, '1', cIdx, z.powerAdjustment);
        setMinionDisplayPowerValue(G, zIdx, '1', cIdx, obj);
      });
    }
  });
};

export default runInteractionForZone001;
