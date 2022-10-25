import { Ctx, Game } from 'boardgame.io';
import { EffectsPlugin } from 'bgio-effects/plugin';
import { Card, GameState, PlayerID } from './interfaces';
import {
  drawCardPhase,
  handleZonePowerCalculationsPhase,
  incrementGameTurnPhase,
  initCardMechanicsPhase,
  initStartingHandsPhase,
  initZoneInteractionsPhase,
  initZonesPhase,
  playCardsPhase,
  revealCardsFaceDownPhase,
  revealCardsPhase,
  revealZonePhase,
} from './phases';
import aiEnumeration from './ai';
import stripSecrets from './utilities/strip-secrets';
import { DefaultState } from './state';
import getGameResult from './utilities/get-game-result';

const effectsConfig = {
  effects: {
    revealCard: {
      create: (value: any) => {
        // console.log(value.card, value.idx);
        return {
          card: value.card,
          idx: value.idx,
          zone: value.zone,
          player: value.player,
        };
      },
      duration: 0.5
    },
  },
};

export const BcgPoc: Game<GameState> = {
  name: 'BcgPoc',
  plugins: [EffectsPlugin(effectsConfig)],

  /**
   * This method uses the `stripSecrets` function to hide
   * the opponent player's hand and deck data from your client.
   * @name playerView
   * @requires stripSecrets
   * @see https://boardgame.io/documentation/#/secret-state
   */
  playerView: (G: GameState, ctx: Ctx, playerId: PlayerID | null) => {
    return stripSecrets(G, ctx, playerId!);
  },

  setup: () => DefaultState,

  /**
   * Each phase in boardgame.io defines a set of game configuration options
   * that are applied for the duration of that phase. This includes the
   * ability to define a different set of moves, use a different turn order
   * etc. Turns happen inside phases.
   * @see https://boardgame.io/documentation/#/phases
   *
   * Order of Phases:
   *  - initZones
   *  - initStartingHands
   *
   *  - revealZone (turns 0,1,2 only)
   *  - incrementGameTurn
   *  - drawCard
   *  - playCards
   *  - revealCardsFaceDown
   *  - revealCards
   *  - initCardMechanics
   *  - initZoneInteractions
   *  - handleZonePowerCalculations
   *
   *  - incrementGameTurn
   *  - drawCard
   *  - playCards
   *  - etc... loop until game ends
   */
  phases: {
    initZones: {
      ...initZonesPhase,
      next: 'initStartingHands',
      start: true,
    },
    initStartingHands: {
      ...initStartingHandsPhase,
      next: 'revealZone',
    },
    revealZone: {
      ...revealZonePhase,
      next: 'incrementGameTurn',
    },
    incrementGameTurn: {
      ...incrementGameTurnPhase,
      next: 'drawCard',
    },
    drawCard: {
      ...drawCardPhase,
      next: 'playCards',
    },
    playCards: {
      ...playCardsPhase,
      next: 'revealCardsFaceDown',
    },
    revealCardsFaceDown: {
      ...revealCardsFaceDownPhase,
      next: 'revealCards',
    },
    revealCards: {
      ...revealCardsPhase,
      next: 'initCardMechanics',
    },
    initCardMechanics: {
      ...initCardMechanicsPhase,
      next: 'initZoneInteractions',
    },
    initZoneInteractions: {
      ...initZoneInteractionsPhase,
      next: 'handleZonePowerCalculations',
    },
    handleZonePowerCalculations: {
      ...handleZonePowerCalculationsPhase,
      next: 'revealZone',
    },
  },
  ai: aiEnumeration,
  endIf: (G: GameState, ctx: Ctx) => {
    if (G.turn === G.Config.gameConfig.numberOfSingleTurnsPerGame) {
      // prettier-ignore
      switch (getGameResult(G.Zones)) {
        case '1': return { winner: '1' };
        case '0': return { winner: '0' };
        default:  return { draw: true };
      }
    }
  },
};
