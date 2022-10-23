import { add } from "mathjs";
import { PlayerID, Zone } from "../interfaces";

const getSumOfAllZonesPower = (Zones: Zone[], playerId: PlayerID): number => {
  let result = 0;
  Zones.forEach((z: Zone) => result = add(result, z.powers[playerId]));
  return result;
}

export default getSumOfAllZonesPower;