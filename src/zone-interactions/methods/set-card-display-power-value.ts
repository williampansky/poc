import { Card, GameState } from "../../interfaces";
import getCardPower from "../../utilities/get-card-power";

/**
 * Sets `card.displayPower` value.
 */
const setCardDisplayPowerValue = (
  G: GameState,
  zoneNumber: number,
  playerId: string,
  cardIndex: number,
  cardObj: Card
) => {
  const power = getCardPower(cardObj);
  G.Zones[zoneNumber].sides[playerId][cardIndex].displayPower = power;
};

export default setCardDisplayPowerValue;
