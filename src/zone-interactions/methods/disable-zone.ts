import { GameState } from '../../interfaces';

const disableZone = (
  G: GameState,
  zoneNumber: number,
  playerId?: string
): void => {
  switch (playerId !== undefined) {
    case true:
      G.Zones[zoneNumber].disabled[playerId!] = true;
      break;

    default:
      G.Zones[zoneNumber].disabled = { '0': true, '1': true };
      break;
  }
};

export default disableZone;
