import { Ctx, PhaseConfig } from 'boardgame.io';
import { Card, GameState } from '../../interfaces';
import {
  addDebugCardToHand,
  incrementActionPointsTotal,
  incrementGameTurn,
  initZoneOnTurnStartInteractions,
  resetDoneStateForBothPlayers,
  setActionPointsToTotal,
  setFirstRevealer,
  setPlayableCardsInHand,
  unsetPlayableCardsInHand,
} from './methods';
import {
  deselectCard,
  playAiCard,
  playCard,
  selectCard,
  setDone,
} from '../../moves';

const playCardsPhase: PhaseConfig = {
  onBegin(G: GameState, ctx: Ctx) {
    if (G.config.debugConfig.logPhaseToConsole) {
      console.log(G.turn, ctx.phase);
    }

    incrementActionPointsTotal(G); // ...... set new total action points available
    setActionPointsToTotal(G); // .......... set current action points to new total
    setPlayableCardsInHand(G); // .......... check card playability
    initZoneOnTurnStartInteractions(G); // . on-turn-start zone effects
    resetDoneStateForBothPlayers(G); // .... reset turn done state
    setFirstRevealer(G); // ................ sets who reveals first
    addDebugCardToHand(G); // .............. handle debug card draw, if applicable
  },
  onEnd(G: GameState, ctx: Ctx) {
    unsetPlayableCardsInHand(G); // ......... set all cards to canPlay: false
  },
  turn: {
    activePlayers: {
      currentPlayer: { stage: 'playCards' },
      others: { stage: 'playCards' },
      value: {
        '0': { stage: 'playCards' },
        '1': { stage: 'playCards' },
      },
    },
    endIf(G: GameState, ctx: Ctx) {
      return G.PlayerTurnDone['0'] === true && G.PlayerTurnDone['1'] === true;
    },
    onEnd(G: GameState, ctx: Ctx) {
      ctx.events?.endPhase();
    },
    stages: {
      playCards: {
        moves: {
          selectCard: {
            client: false,
            noLimit: true,
            ignoreStaleStateID: true,
            move: (
              G: GameState,
              ctx: Ctx,
              playerId: string,
              cardUuid: string
            ) => {
              return selectCard(G, ctx, playerId, cardUuid);
            },
          },
          deselectCard: {
            client: false,
            noLimit: true,
            ignoreStaleStateID: true,
            move: (G: GameState, ctx: Ctx, playerId: string) => {
              return deselectCard(G, ctx, playerId);
            },
          },
          playCard: {
            client: false,
            noLimit: true,
            ignoreStaleStateID: true,
            move: (
              G: GameState,
              ctx: Ctx,
              playerId: string,
              zoneNumber: number
            ) => {
              return playCard(G, ctx, playerId, zoneNumber);
            },
          },
          playAiCard: {
            client: false,
            noLimit: true,
            ignoreStaleStateID: true,
            move: (
              G: GameState,
              ctx: Ctx,
              zoneNumber: number,
              card: Card,
              cardIndex: number
            ) => {
              return playAiCard(G, ctx, zoneNumber, card, cardIndex);
            },
          },
          setDone: {
            client: false,
            noLimit: true,
            ignoreStaleStateID: true,
            move: (G: GameState, ctx: Ctx, playerId: string) => {
              return setDone(G, ctx, playerId);
            },
          },
        },
      },
    },
  },
};

export default playCardsPhase;
