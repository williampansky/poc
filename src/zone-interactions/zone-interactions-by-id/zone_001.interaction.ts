import { Card, GameState, Zone } from '../../interfaces';
import {
  setCardDisplayPowerValue,
  setZoneAdjustmentPowerValue,
} from '../methods';

const runInteractionForZone001 = (G: GameState): void => {
  G.Zones.forEach((z: Zone, zIdx: number) => {
    if (z.revealed) {
      z.sides['0'].forEach((obj: Card, cIdx: number) => {
        setZoneAdjustmentPowerValue(G, zIdx, '0', cIdx, z.powerAdjustment);
        setCardDisplayPowerValue(G, zIdx, '0', cIdx, obj);
      });
      z.sides['1'].forEach((obj: Card, cIdx: number) => {
        setZoneAdjustmentPowerValue(G, zIdx, '1', cIdx, z.powerAdjustment);
        setCardDisplayPowerValue(G, zIdx, '1', cIdx, obj);
      });
    }
  });
};

export default runInteractionForZone001;
