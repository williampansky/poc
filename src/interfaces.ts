export const config = {
  gameConfig: {
    actionPointsPerTurn: 1,
    actionPointsTotal: 10,
    cardsPerDeck: 20,
    cardsPerHand: 8,
    cardsPerStartingHand: 3,
    cardsPerTurn: 1,
    numberOfPlayers: 2,
    numberOfSingleTurnsPerGame: 12,
    numberOfZones: 3,
    numberOfSlotsPerZone: 6,
  },
};

/**
 * Used to track a card or minion's power changes.
 */
export interface CardPowerStream {
  blame: string; // card/minion that changed this power
  adjustment: number; // adjustment to make
  currentPower: number; // if no previous idx, basePower + adjustment—otherwise last idx currentPower + this adjustment
}

export interface Card {
  __id: string;
  baseCost: number;
  basePower: number;
  canPlay: boolean;
  currentCost: number;
  description?: string;
  mechanic?: string;
  name: string;
  powerOverride?: number; // use this power instead of base or latest stream
  powerStream: CardPowerStream[];
  zonePowerAdjustment: number;
  uuid: string;
}

export interface Zone {
  disabled: Record<string, boolean>;
  id: string;
  name: string;
  powers: Record<string, number>;
  powerText?: string;
  powerAdjustment: number;
  sides: Record<string, Card[]>;
  uuid: string;
}

export interface Player {
  name: string;
  deck: Card[];
  hand: Card[];
  actionPoints: number;
  actionPointsTotal: number;
}

export interface SelectedCard {
  index?: number;
  data?: Card;
}

export interface Config {
  gameConfig: {
    actionPointsPerTurn: number;
    actionPointsTotal: number;
    cardsPerDeck: number;
    cardsPerHand: number;
    cardsPerStartingHand: number;
    cardsPerTurn: number;
    numberOfPlayers: number;
    numberOfSingleTurnsPerGame: number;
    numberOfZones: number;
    numberOfSlotsPerZone: number;
  };
}

export interface GameState {
  players: Record<string, Player>;
  selectedCard: Record<string, SelectedCard | undefined>;
  playedCards: Record<string, Card[]>;
  zones: Zone[];
  config: Config;
}
