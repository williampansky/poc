import { PlayerID } from "boardgame.io";

export const config = {
  debugConfig: {
    debugCardId: ''
  },
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

// export type PlayerId = '0' | '1' | PlayerID;

/**
 * Used to track a card or minion's power changes.
 */
export interface CardPowerStream {
  blame: string; // card/minion that changed this power
  adjustment: number; // adjustment to make
  currentPower: number; // if no previous idx, basePower + adjustment—otherwise last idx currentPower + this adjustment
}

/**
 * Base card information from the database/API, which gets
 * converted into a Card interface via the `createCardObject` util.
 * @see createCardObject
 */
export interface CardBase {
  cost: number;
  description?: string;
  id: string;
  mechanic?: string;
  name: string;
  power: number;
}

export interface Card {
  __id: string;
  baseCost: number;
  basePower: number;
  canPlay: boolean;
  currentCost: number;
  description?: string;
  displayPower: number;
  mechanic?: string;
  name: string;
  powerOverride?: number; // use this power instead of base or latest stream
  powerStream: CardPowerStream[];
  revealed: boolean;
  revealedOnTurn: number;
  type: 'CARD';
  uuid: string;
  zonePowerAdjustment: number;
}

export interface Minion {
  __id: string;
  baseCost: number;
  basePower: number;
  canPlay: boolean;
  currentCost: number;
  description?: string;
  displayPower: number;
  mechanic?: string;
  name: string;
  powerOverride?: number; // use this power instead of base or latest stream
  powerStream: CardPowerStream[];
  revealed: boolean;
  revealedOnTurn: number;
  type: 'MINION';
  uuid: string;
  zonePowerAdjustment: number;
}

/**
 * Base zone information from the database/API, which gets
 * converted into a Zone interface via the `createZoneObject` util.
 * @see createZoneObject
 */
 export interface ZoneBase {
  id: string;
  name: string;
  powerText?: string;
  powerAdjustment?: number;
}

export interface Zone {
  disabled: Record<PlayerID, boolean>;
  id: string;
  name: string;
  powers: Record<PlayerID, number>;
  powerText?: string;
  powerAdjustment: number;
  revealed: boolean;
  sides: Record<PlayerID, Minion[]>;
  uuid: string;
}

export declare type ZonesCardsReference = Record<PlayerID, Card[]>;

export interface Player {
  name: string;
  deck: Card[];
  hand: Card[];
  actionPoints: number;
  actionPointsTotal: number;
}

export interface Config {
  debugConfig: {
    debugCardId: string;
  };
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
  turn: number;
  PlayerTurnDone: Record<PlayerID, boolean>;
  revealed: Record<PlayerID, boolean>;
  FirstRevealer: PlayerID;
  players: Record<PlayerID, Player>;
  selectedCardData: Record<PlayerID, Card | undefined>;
  selectedCardIndex: Record<PlayerID, number | undefined>;
  playedCards: Record<PlayerID, Card[]>;
  zones: Zone[];
  ZonesCardsReference: Record<PlayerID, Card[]>[];
  config: Config;
}
