import { Ctx, PhaseConfig } from 'boardgame.io';
import { GameState, Minion, Zone } from '../../interfaces';
import getCardPower from '../../utilities/get-card-power';
import { calculateZoneSidePower } from '../handle-zone-power-calculations-phase/methods';

const revealZonePhase: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    const fn = () => {
      G.zones.forEach((z: Zone, zoneIdx: number) => {
        if (z.revealed) {
          switch (z.id) {
            case 'ZONE_001':
            case 'ZONE_004':
            case 'ZONE_007':
            case 'ZONE_008':
              // loop thru side 0
              z.sides['0'].forEach((obj: Minion, cardIdx: number) => {
                const pA = z.powerAdjustment
                G.zones[zoneIdx].sides['0'][cardIdx].zonePowerAdjustment = pA;
                G.zones[zoneIdx].sides['0'][cardIdx] = {
                  ...obj,
                  displayPower: getCardPower(obj),
                };
              });

              z.sides['1'].forEach((obj: Minion, cardIdx: number) => {
                const pA = z.powerAdjustment
                G.zones[zoneIdx].sides['1'][cardIdx].zonePowerAdjustment = pA;
                G.zones[zoneIdx].sides['1'][cardIdx] = {
                  ...obj,
                  displayPower: getCardPower(obj),
                };
              });
              break;
            case 'ZONE_003':
              z.disabled = { '0': true, '1': true };
              break;
            case 'ZONE_010':
              z.sides['0'].forEach((obj: Minion, cardIdx: number) => {
                const c = obj.currentCost;
                G.zones[zoneIdx].sides['0'][cardIdx].displayPower = c;
              });
              z.sides['1'].forEach((obj: Minion, cardIdx: number) => {
                const c = obj.currentCost;
                G.zones[zoneIdx].sides['1'][cardIdx].displayPower = c;
              });
              break;
            case 'ZONE_011':
              z.disabled = { '0': true, '1': true };
              break;
            default:
              break;
          }
        }
      });

      G.zones.forEach((_, zoneIdx: number) => {
        // set the zone power
        G.zones[zoneIdx].powers = {
          '0': calculateZoneSidePower(G, zoneIdx, '0'),
          '1': calculateZoneSidePower(G, zoneIdx, '1'),
        };
      });
    };

    if (G.turn === 0 && !G.zones[0].revealed) {
      console.log(G.turn, `${ctx.phase} 0`);
      G.zones[0].revealed = true;
      fn();
      ctx.events?.endPhase();
    } else if (G.turn === 1 && !G.zones[1].revealed) {
      console.log(G.turn, `${ctx.phase} 1`);
      G.zones[1].revealed = true;
      fn();
      ctx.events?.endPhase();
    } else if (G.turn === 2 && !G.zones[2].revealed) {
      console.log(G.turn, `${ctx.phase} 2`);
      G.zones[2].revealed = true;
      fn();
      ctx.events?.endPhase();
    } else {
      ctx.events?.endPhase();
    }
  },
};

export default revealZonePhase;
