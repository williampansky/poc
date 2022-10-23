import { GameState, Minion } from "../../interfaces";
import getCardPower from "../../utilities/get-card-power";

/**
 * Sets `minion.displayPower` value.
 */
const setMinionDisplayPowerValue = (
  G: GameState,
  zoneNumber: number,
  playerId: string,
  cardIndex: number,
  minionObj: Minion
) => {
  const power = getCardPower(minionObj);
  G.Zones[zoneNumber].sides[playerId][cardIndex].displayPower = power;
};

export default setMinionDisplayPowerValue;
