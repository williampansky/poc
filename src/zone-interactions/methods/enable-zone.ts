import { GameState } from '../../interfaces';

const enableZone = (
  G: GameState,
  zoneNumber: number,
  playerId?: string
): void => {
  switch (playerId !== undefined) {
    case true:
      G.Zones[zoneNumber].disabled[playerId!] = false;
      break;

    default:
      G.Zones[zoneNumber].disabled = { '0': false, '1': false };
      break;
  }
};

export default enableZone;
