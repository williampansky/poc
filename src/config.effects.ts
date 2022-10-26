import { Card, PlayerID, Zone } from './interfaces';

interface RevealCardEffects {
  card: Card;
  slotIndex: number;
  zoneNumber: number;
  player: PlayerID;
}

interface RevealZoneEffects {
  zone: Zone;
  zoneNumber: number;
}

export const effectsConfig = {
  effects: {
    revealZone: {
      duration: 0.5,
      create: ({ ...value }: RevealZoneEffects) => {
        return {
          zone: value.zone,
          zoneNumber: value.zoneNumber,
        };
      },
    },
    revealCard: {
      duration: 0.5,
      create: ({ ...value }: RevealCardEffects) => {
        return {
          card: value.card,
          slotIndex: value.slotIndex,
          zoneNumber: value.zoneNumber,
          player: value.player,
        };
      },
    },
  },
};
