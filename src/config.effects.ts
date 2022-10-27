import { Card, PlayerID, Zone } from './interfaces';

interface RevealCardEffects {
  card: Card;
  zoneNumber: number;
  slotIndex: number;
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
        const { card, zoneNumber, slotIndex, player } = value;
        return {
          card,
          zoneNumber,
          slotIndex,
          player,
        };
      },
    },
  },
};
