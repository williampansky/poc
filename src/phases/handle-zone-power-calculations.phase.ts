import { Ctx, PhaseConfig } from 'boardgame.io';
import { add } from 'mathjs';
import { Card, GameState, Zone } from '../interfaces';

const handleZonePowerCalculationsPhase: PhaseConfig = {
  next: 'drawCard',
  onBegin(G: GameState, ctx: Ctx) {
    const { zones } = G;

    // loop thru each zone
    zones.forEach((z: Zone, zoneIdx: number) => {
      // calculate zonePower from zero for a clean slate since
      // we're looping thru each card on each side
      let sidePower0: number = 0; // zonePower of player '0' for zoneIdx
      let sidePower1: number = 0; // zonePower of player '1' for zoneIdx

      // loop thru each side and add each card's current power
      // to the sidePowerX variable defined above
      z.sides['0'].forEach((c: Card) => {
        return sidePower0 = add(c.displayPower, sidePower0);
      });
      z.sides['1'].forEach((c: Card) => {
        return sidePower1 = add(c.displayPower, sidePower1);
      });

      // set the zone power based on the previous calculations
      G.zones[zoneIdx].powers = {
        '0': sidePower0,
        '1': sidePower1,
      };
    });

    // end the phase
    ctx.events?.endPhase();
  },
};

export default handleZonePowerCalculationsPhase;
