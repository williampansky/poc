import { Ctx, PhaseConfig } from 'boardgame.io';
import { Card, GameState, Minion, Zone } from '../interfaces';
import getCardPower from '../utilities/get-card-power';

const initZoneInteractions: PhaseConfig = {
  next: 'drawCard',
  onBegin(G: GameState, ctx: Ctx) {
    console.log(G.turn, ctx.phase);
    const { turn, zones } = G;

    // loop thru each zone
    zones.forEach((z: Zone, zoneIdx: number) => {
      if (z.revealed) {
        switch (z.id) {
          case 'ZONE_001':
          case 'ZONE_004':
            // loop thru side 0
            z.sides['0'].forEach((obj: Minion, cardIdx: number) => {
              // if (turn === obj.revealedOnTurn) {
                G.zones[zoneIdx].sides['0'][cardIdx].zonePowerAdjustment =
                  z.powerAdjustment;
                G.zones[zoneIdx].sides['0'][cardIdx] = {
                  ...obj,
                  displayPower: getCardPower(obj),
                };
              // }
            });

            // loop thru side 1
            z.sides['1'].forEach((obj: Minion, cardIdx: number) => {
              // if (turn === obj.revealedOnTurn) {
                G.zones[zoneIdx].sides['1'][cardIdx].zonePowerAdjustment =
                  z.powerAdjustment;
                G.zones[zoneIdx].sides['1'][cardIdx] = {
                  ...obj,
                  displayPower: getCardPower(obj),
                };
              // }
            });
            // zone.sides[playerId].forEach((c: Card, i: number) => {
            //   G.zones[zoneNumber].sides[playerId][i] = {
            //     ...c,
            //     zonePowerAdjustment: zone.powerAdjustment,
            //   };
            //   // if (G.zones[zoneNumber].sides[playerId][i].powerStream) {
            //   //   const stream = G.zones[zoneNumber].sides[playerId][i].powerStream!;
            //   //   const streamLength = stream.length;
            //   //   const lastStreamPower = stream[streamLength].currentPower;

            //   //   G.zones[zoneNumber].sides[playerId][i].powerStream!.push({
            //   //     blame: zone.id,
            //   //     adjustment: zone.powerAdjustment,
            //   //     currentPower: add(lastStreamPower, zone.powerAdjustment),
            //   //   });
            //   // } else {
            //   //   G.zones[zoneNumber].sides[playerId][i].powerStream = [{
            //   //     blame: zone.id,
            //   //     adjustment: zone.powerAdjustment,
            //   //     currentPower: add(c.basePower, zone.powerAdjustment),
            //   //   }];
            //   // }
            // });
            break;
          default:
            break;
        }
      }
    });

    // end the phase
    ctx.events?.endPhase();
  },
};

export default initZoneInteractions;
