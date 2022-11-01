import { PlayerID as bgioPlayerID } from "boardgame.io";
import { IConfig } from "./game.config";

export type PlayerID = '0' | '1' | bgioPlayerID;
export type SelectedCardIndex = Record<PlayerID, number | undefined>;
export type ActionPoints = Record<PlayerID, { current: number; total: number }>;

/**
 * Used to track a card's power changes.
 */
export interface CardPowerStream {
  blame: string; // card that changed this power
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
  type?: 'CARD' | 'MINION' | 'SPELL' | 'WEAPON';
}

export interface Card {
  __id: string;
  artist?: string;
  baseCost: number;
  basePower: number;
  canPlay: boolean;
  collectible?: boolean;
  currentCost: number;
  description?: string;
  displayPower: number;
  elite?: boolean;
  entourage?: string[];
  flavorText?: string;
  howToEarn?: string;
  howToEarnGolden?: string;
  imageBaseSrc?: string;
  imageFlairSrc?: string;
  imagePlaceholderSrc?: string;
  isGolden?: boolean;
  mechanic?: string;
  mechanics?: string[];
  name: string;
  numberPrimary?: number;
  numberRNG?: number;
  numberSecondary?: number;
  powerOverride?: number; // use this power instead of base or latest stream
  powerStream: CardPowerStream[];
  race?: string;
  rarity?: string;
  revealed: boolean;
  revealedOnTurn: number;
  set?: string;
  sounds?: Record<string, string>;
  type: 'CARD' | 'MINION' | 'SPELL' | 'WEAPON';
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
  sides: Record<PlayerID, Card[]>;
  uuid: string;
}

export declare type ZonesCardsReference = Record<PlayerID, Card[]>;

export interface Player {
  deck: Card[];
  hand: Card[];
}

export interface Counts {
  deck: number;
  hand: number;
}

export interface GameState {
  ActionPoints: ActionPoints;
  Config: IConfig;
  Counts: Record<PlayerID, Counts>;
  FirstRevealer: PlayerID;
  PlayedCards: Record<PlayerID, Card[]>;
  players: Record<PlayerID, Player>;
  PlayerNames: Record<PlayerID, string>;
  PlayerTurnDone: Record<PlayerID, boolean>;
  SelectedCardData: Record<PlayerID, Card | undefined>;
  SelectedCardIndex: SelectedCardIndex;
  turn: number;
  Zones: Zone[];
  ZonesAreActive: Record<PlayerID, boolean>;
  ZonesCardsReference: Record<PlayerID, Card[]>[];
}
