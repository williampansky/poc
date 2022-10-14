import { Ctx, PhaseConfig } from "boardgame.io";
import { add } from "mathjs";
import { v4 as uuid } from 'uuid';
import { Card, GameState, Zone } from "../interfaces";
import { deselectCard, playAiCard, playCard, selectCard, setDone } from "../moves";
import CARD_DATABASE from '../tempCardsDatabase';

const playCardsPhase: PhaseConfig = {
  next: 'revealCards',
  onBegin: (G, ctx) => onTurnBegin(G, ctx),
  onEnd: (G, ctx) => onTurnEnd(G, ctx),
  turn: {
    activePlayers: {
      currentPlayer: { stage: 'playCards' },
      others: { stage: 'playCards' },
      value: {
        '0': { stage: 'playCards' },
        '1': { stage: 'playCards' },
      },
    },
    onEnd(G, ctx) {
      ctx.events?.endPhase();
    },
    endIf(G, ctx) {
      return G.done['0'] === true && G.done['1'] === true;
    },
    stages: {
      // loop this stage
      playCards: {
        // next: 'playCards',
        moves: {
          selectCard: {
            client: false,
            noLimit: true,
            ignoreStaleStateID: true,
            move: (G, ctx, playerId, cardUuid) => {
              return selectCard(G, ctx, playerId, cardUuid);
            },
          },
          deselectCard: {
            client: false,
            noLimit: true,
            ignoreStaleStateID: true,
            move: (G, ctx, playerId) => {
              return deselectCard(G, ctx, playerId);
            },
          },
          playCard: {
            client: false,
            noLimit: true,
            ignoreStaleStateID: true,
            move: (G, ctx, playerId, zoneNumber) => {
              return playCard(G, ctx, playerId, zoneNumber);
            },
          },
          playAiCard: {
            client: false,
            noLimit: true,
            ignoreStaleStateID: true,
            move: (G, ctx, zoneNumber, card, cardIndex) => {
              return playAiCard(G, ctx, zoneNumber, card, cardIndex);
            },
          },
          setDone: {
            client: false,
            noLimit: true,
            ignoreStaleStateID: true,
            move: (G, ctx, playerId) => {
              return setDone(G, ctx, playerId);
            },
          },
        },
      },
    },
  },
}

// prettier-ignore
const onTurnBegin = (G: GameState, ctx: Ctx) => {
  const apPerTurn = G.config.gameConfig.actionPointsPerTurn;
  const apPerGame = G.config.gameConfig.actionPointsTotal;
  const maxHandSize = G.config.gameConfig.cardsPerHand;

  // increment game turn (note: not ctx.turn)
  G.turn = add(G.turn, 1);

  // 
  // PLAYER 1
  // 1: incremement action points
  if (G.players['1'].actionPointsTotal < apPerGame) {
    G.players['1'].actionPointsTotal = add(
      G.players['1'].actionPointsTotal, apPerTurn
    );
  }
  // 1: set current action points
  G.players['1'].actionPoints = G.players['1'].actionPointsTotal;
  
  // 1: set playable cards
  if (G.players['1'].hand.length !== 0)
    G.players['1'].hand.forEach((c: Card) => {
      if (G.players['1'].actionPoints >= c.currentCost) return c.canPlay = true;
      else return c.canPlay = false;
    });

  // 
  // PLAYER 0
  // 0: incremement action points
  if (G.players['0'].actionPointsTotal < apPerGame) {
    G.players['0'].actionPointsTotal = add(
      G.players['0'].actionPointsTotal, apPerTurn
    );
  }
  // 0: set current action points
  G.players['0'].actionPoints = G.players['0'].actionPointsTotal;
  // 0: set playable cards
  if (G.players['0'].hand.length !== 0)
    G.players['0'].hand.forEach((c: Card) => {
      if (G.players['0'].actionPoints >= c.currentCost) return c.canPlay = true;
      else return c.canPlay = false;
    });
  // 0: handle debug card draw
  if (G.config.debugConfig.debugCardId !== '') {
    const DEBUG_CARD_ID = G.config.debugConfig.debugCardId;
    const dCard = CARD_DATABASE.find(c => c.id === DEBUG_CARD_ID);
    G.players['0'].hand.push({
        __id: dCard?.id,
        baseCost: dCard?.cost,
        basePower: dCard?.power,
        canPlay: true,
        currentCost: 0,
        description: dCard?.description,
        displayPower: dCard?.power,
        mechanic: dCard?.mechanic,
        name: dCard?.name,
        powerStream: [],
        uuid: uuid(),
        zonePowerAdjustment: 0,
        revealed: false,
    } as Card);
  }

  // both: on-turn-start zone effects
  G.zones.forEach((z: Zone) => {
    switch (z.id) {
      case 'ZONE_002':
        if (G.turn === 5) {
          z.sides = {
            '0': [],
            '1': [],
          };
          z.powers = {
            '0': 0,
            '1': 0,
          };
        }
        break;
      default:
        break;
    }
  });
  // both: set done back to false
  G.done['0'] = false;
  G.done['1'] = false;
}

const onTurnEnd = (G: GameState, ctx: Ctx) => {
  G.players[1].hand.forEach((c: Card) => (c.canPlay = false));
  G.players[0].hand.forEach((c: Card) => (c.canPlay = false));
};

export default playCardsPhase;
