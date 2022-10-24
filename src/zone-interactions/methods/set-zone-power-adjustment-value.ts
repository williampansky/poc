import { GameState } from "../../interfaces";

/**
 * Sets `card.zoneAdjustmentPower` value.
 */
const setZoneAdjustmentPowerValue = (
  G: GameState,
  zoneNumber: number,
  playerId: string,
  cardIndex: number,
  powerAdjustment: number
) => {
  const power = powerAdjustment;
  G.Zones[zoneNumber].sides[playerId][cardIndex].displayPower = power;
};

export default setZoneAdjustmentPowerValue;
