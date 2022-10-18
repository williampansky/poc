import { Ctx, Game, PlayerID } from 'boardgame.io';
import { config, GameState, Zone } from './interfaces';
import {
  drawCardPhase,
  handleZonePowerCalculationsPhase,
  incrementGameTurnPhase,
  initCardMechanicsPhase,
  initStartingHandsPhase,
  initZoneInteractionsPhase,
  initZonesPhase,
  playCardsPhase,
  revealCardsPhase,
  revealZonePhase,
} from './phases';
import aiEnumeration from './ai';
import { handleRevealedZonePowerCalculationsPhase } from './phases/handle-zone-power-calculations-phase';
import stripSecrets from './utilities/strip-secrets';
import { PlayerTurnDone } from './state';
import createZoneObject from './utilities/create-zone-object';

export const BcgPoc: Game<GameState> = {
  name: 'BcgPoc',

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

  setup: () => ({
    turn: 0,
    PlayerTurnDone: PlayerTurnDone.defaultState,

    revealed: {
      '0': false,
      '1': false,
    },

    players: {
      '0': {
        name: 'Player',
        deck: [],
        hand: [],
        actionPoints: 0,
        actionPointsTotal: 0,
      },
      '1': {
        name: 'Opponent',
        deck: [],
        hand: [],
        actionPoints: 0,
        actionPointsTotal: 0,
      },
    },

    selectedCardData: {
      '0': undefined,
      '1': undefined,
    },

    selectedCardIndex: {
      '0': undefined,
      '1': undefined,
    },

    playedCards: {
      '0': [],
      '1': [],
    },

    zones: [
      ...Array.from(Array(config.gameConfig.numberOfZones)).map(() => {
        return createZoneObject({
          id: '',
          name: ''
        });
      }),
    ],

    config: config,
  }),

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
    if (G.turn === G.config.gameConfig.numberOfSingleTurnsPerGame) {
      switch (isVictory(G.zones[0], G.zones[1], G.zones[2])) {
        case '1':
          return { winner: '1' };

        case '0':
          return { winner: '0' };

        case '':
        default:
          return { draw: true };
      }
    }
  },
};

const isVictory = (zone1: Zone, zone2: Zone, zone3: Zone): string => {
  let player0TotalPower = 0;
  let player1TotalPower = 0;
  let winner = '';

  player0TotalPower = Math.round(
    zone1.powers[0] + zone2.powers[0] + zone3.powers[0]
  );
  player1TotalPower = Math.round(
    zone1.powers[1] + zone2.powers[1] + zone3.powers[1]
  );

  if (player1TotalPower > player0TotalPower) winner = '1';
  else if (player0TotalPower > player1TotalPower) winner = '0';

  return winner;
};
