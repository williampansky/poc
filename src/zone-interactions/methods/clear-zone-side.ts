import { GameState } from '../../interfaces';

const clearZoneSide = (
  G: GameState,
  zoneNumber: number,
  playerId?: string
): void => {
  switch (playerId !== undefined) {
    case true:
      G.zones[zoneNumber].sides[playerId!] = [];
      break;
  
    default:
      G.zones[zoneNumber].sides = {
        '0': [],
        '1': [],
      }
      break;
  }
};

export default clearZoneSide;
