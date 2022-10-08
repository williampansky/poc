import { Ctx, Game } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import { v4 as uuid } from 'uuid';
import CARD_DATABASE from './tempCardsDatabase';
import ZONE_DATABASE from './tempZonesDatabase';

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

export interface Card {
  id: string;
  name: string;
  canPlay: boolean;
  cost: number;
  power: number;
  powerOverride?: number;
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

export const BcgPoc: Game<GameState> = {
  name: 'BcgPoc',
  setup: () => ({
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

    selectedCard: {
      '0': {},
      '1': {},
    },

    playedCards: {
      '0': [],
      '1': [],
    },

    zones: [
      ...Array.from(Array(config.gameConfig.numberOfZones)).map(() => {
        return {
          disabled: {
            '0': false,
            '1': false,
          },
          id: '',
          name: 'Zone',
          powers: {
            '0': 0,
            '1': 0,
          },
          powerAdjustment: 0,
          powerText: undefined,
          sides: {
            '0': [],
            '1': [],
          },
          uuid: '',
        };
      }),
    ],

    config: config,
  }),
  phases: {
    initZones: {
      start: true,
      next: 'draw',
      onBegin: (G: GameState, ctx: Ctx) => {
        const { random } = ctx;
        const randomZonesArray = random?.Shuffle(ZONE_DATABASE);
        let newZones: Zone[] = [];

        for (let idx = 0; idx < config.gameConfig.numberOfZones; idx++) {
          let newZone = {
            ...G.zones[0],
            id: randomZonesArray![idx].id,
            name: randomZonesArray![idx].name,
            powerText: randomZonesArray![idx]?.powerText,
            powerAdjustment: randomZonesArray![idx]?.powerAdjustment,
            uuid: uuid(),
          } as Zone;

          newZones.push(newZone);
        }

        G.zones = newZones;
      },
      endIf(G: GameState) {
        return (
          G.zones[0].uuid !== '' &&
          G.zones[1].uuid !== '' &&
          G.zones[2].uuid !== ''
        );
      },
    },
    draw: {
      next: 'play',
      onBegin: (G: GameState, ctx: Ctx) => {
        const { random } = ctx;
        let tempOpponentArray: Card[] = [];
        let tempPlayerArray: Card[] = [];

        // create deck
        [...Array(config.gameConfig.cardsPerDeck)].forEach((_, i) => {
          let randomCard1 = random?.Shuffle(CARD_DATABASE)[0] as Card;
          let randomCard2 = random?.Shuffle(CARD_DATABASE)[0] as Card;

          tempOpponentArray.push({
            ...randomCard1,
            canPlay: false,
            uuid: uuid(),
          });
          tempPlayerArray.push({
            ...randomCard2,
            canPlay: false,
            uuid: uuid(),
          });
        });

        // set decks
        G.players['0'].deck = tempPlayerArray;
        G.players['1'].deck = tempOpponentArray;

        // init hands
        [...Array(config.gameConfig.cardsPerStartingHand)].forEach(() => {
          G.players['0'].hand.push(G.players['0'].deck.splice(0, 1)[0]);
          G.players['1'].hand.push(G.players['1'].deck.splice(0, 1)[0]);
        });
      },
      endIf: (G: GameState) => {
        // End phase when both player's decks are full (20 cards)
        const perDeck = config.gameConfig.cardsPerDeck;
        const perStartingHand = config.gameConfig.cardsPerStartingHand;
        const startingDeckLength = Math.abs(perDeck - perStartingHand);

        return (
          G.players['0'].deck.length === startingDeckLength &&
          G.players['0'].hand.length === perStartingHand && 
          G.players['1'].deck.length === startingDeckLength &&
          G.players['1'].hand.length === perStartingHand
        );
      },
    },
    play: {
      turn: {
        // prettier-ignore
        onBegin(G: GameState, ctx: Ctx) {
          const apPerTurn = config.gameConfig.actionPointsPerTurn;
          const apPerGame = config.gameConfig.actionPointsTotal;
          const maxHandSize = config.gameConfig.cardsPerHand;

          switch (ctx.currentPlayer) {
            case '1':
              // incremement action points
              if (G.players[1].actionPointsTotal !== apPerGame) {
                G.players[1].actionPointsTotal = Math.abs(G.players[1].actionPointsTotal + apPerTurn);
              }
  
              // set current action points
              G.players[1].actionPoints = G.players[1].actionPointsTotal;
  
              // add card to hand
              if (G.players[1].hand.length !== maxHandSize) { // .... canDraw
                G.players[1].hand.push( // .......................... pushes to hand
                  G.players[1].deck.splice(0, 1)[0] // .............. splices from deck
                );
              }

              // set playable cards
              G.players[1].hand.forEach((c: Card) => {
                if (G.players[1].actionPoints >= c.cost) return c.canPlay = true;
                else return c.canPlay = false;
              });
              break;
  
            case '0':
            default:
              // incremement action points
              if (G.players[0].actionPointsTotal !== apPerGame) {
                G.players[0].actionPointsTotal = Math.abs(G.players[0].actionPointsTotal + apPerTurn);
              }
  
              // set current action points
              G.players[0].actionPoints = G.players[0].actionPointsTotal;
  
              // add card to hand
              if (G.players[0].hand.length !== maxHandSize) { // .... canDraw
                G.players[0].hand.push( // .......................... pushes to hand
                  G.players[0].deck.splice(0, 1)[0] // .............. splices from deck
                );
              }

              // set playable cards
              G.players[0].hand.forEach((c: Card) => {
                if (G.players[0].actionPoints >= c.cost) return c.canPlay = true;
                else return c.canPlay = false;
              });
              break;
          }
        },
        onEnd(G: GameState, ctx: Ctx) {
          G.players[1].hand.forEach((c: Card) => (c.canPlay = false));
          G.players[0].hand.forEach((c: Card) => (c.canPlay = false));
        },
      },
      moves: {
        // prettier-ignore
        selectCard: (
          G: GameState,
          ctx: Ctx,
          playerId: string,
          cardUuid: string
        ) => {
          const cardMatch = G.players[playerId].hand.find(
            (c: Card) => c.uuid === cardUuid
          );
          const cardMatchIndex = G.players[playerId].hand.findIndex(
            (c: Card) => c.uuid === cardUuid
          );

          if (G.selectedCard[playerId]?.data?.uuid === cardMatch?.uuid) {
            G.selectedCard[playerId] = undefined;
          } else {
            G.selectedCard[playerId] = {
              index: cardMatchIndex,
              data: cardMatch,
            };
          }
        },
        // prettier-ignore
        playCard: (
          G: GameState,
          ctx: Ctx,
          playerId: string,
          zoneNumber: number
        ) => {
          // add card to playedCards
          const cardFromHand = G.players[playerId].hand.find(
            (c: Card) => c.uuid === G.selectedCard[playerId]?.data?.uuid
          ) as Card;
          G.playedCards[playerId].push(cardFromHand);

          // remove from hand
          const newHand = G.players[playerId].hand.filter(
            (c: Card) => c.uuid !== G.selectedCard[playerId]?.data?.uuid
          );
          G.players[playerId].hand = newHand;

          // remove cost from current action points
          G.players[playerId].actionPoints = Math.abs(
            G.players[playerId].actionPoints - cardFromHand.cost
          );

          // re-evaluate cards in hand
          G.players[playerId].hand.forEach((c: Card) => {
            if (G.players[playerId].actionPoints >= c.cost) return (c.canPlay = true);
            else return (c.canPlay = false);
          });

          if (G.zones[zoneNumber].sides[playerId].length !== config.gameConfig.numberOfSlotsPerZone) {
            G.zones[zoneNumber].sides[playerId].push(G.selectedCard[playerId]?.data as Card);
            G.zones[zoneNumber].powers[playerId] = Math.abs(
              G.zones[zoneNumber].powers[playerId] + G.selectedCard[playerId]!.data!.power
            );
            G.selectedCard[playerId] = undefined;
          } else {
            return INVALID_MOVE;
          }
        },
        // prettier-ignore
        aiPlayCard: (
          G: GameState,
          ctx: Ctx,
          zoneNumber: number,
          card: Card
        ) => {
          // add card to playedCards
          G.playedCards[1].push(card);

          // remove from hand
          const newHand = G.players[1].hand.filter((c: Card) => c.uuid !== card?.uuid);
          G.players[1].hand = newHand;

          // remove cost from current action points
          G.players[1].actionPoints = Math.abs(
            G.players[1].actionPoints - card.cost
          );

          // re-evaluate cards in hand
          G.players[1].hand.forEach((c: Card) => {
            if (G.players[1].actionPoints >= c.cost) return (c.canPlay = true);
            else return (c.canPlay = false);
          });

          // play card to zone
          if (G.zones[zoneNumber].sides[1].length !== config.gameConfig.numberOfSlotsPerZone) {
            G.zones[zoneNumber].sides[1].push(card);
            G.zones[zoneNumber].powers[1] = Math.abs(
              G.zones[zoneNumber].powers[1] + card!.power
            );
          } else {
            return INVALID_MOVE;
          }
        },
        endTurn: (G: GameState, ctx) => {
          ctx.events?.endTurn();
        },
      },
    },
  },
  ai: {
    enumerate: (G: GameState, ctx: Ctx) => {
      let moves = [];

      // avoids onslaught of INVALID_MOVE errors
      if (ctx.currentPlayer === '1') {
        if (G.players[1].hand.length >= 1) {
          let cardsThanCanBePlayed: Card[] = []; // find playable cards
          G.players[1].hand.forEach((c: Card) => {
            if (c.canPlay) cardsThanCanBePlayed.push(c);
          });

          for (let i = 0; i < cardsThanCanBePlayed.length; i++) {
            for (let i = 0; i < 6 - G.zones[0].sides[1].length; i++) {
              moves.push({
                move: 'aiPlayCard',
                args: [0, cardsThanCanBePlayed[0]],
              });
            }

            for (let i = 0; i < 6 - G.zones[1].sides[1].length; i++) {
              moves.push({
                move: 'aiPlayCard',
                args: [1, cardsThanCanBePlayed[0]],
              });
            }

            for (let i = 0; i < 6 - G.zones[2].sides[1].length; i++) {
              moves.push({
                move: 'aiPlayCard',
                args: [2, cardsThanCanBePlayed[0]],
              });
            }
          }
        }

        moves.push({ event: 'endTurn' });
      }

      return moves;
    },
  },
  endIf: (G: GameState, ctx: Ctx) => {
    if (
      ctx.turn === Math.abs(config.gameConfig.numberOfSingleTurnsPerGame * 2)
    ) {
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

const playCard = (
  G: GameState,
  ctx: Ctx,
  playerId: string,
  zoneNumber: number,
  card: Card
) => {
  const { currentPlayer } = ctx;
  const {
    players,
    zones,
    config: {
      gameConfig: { numberOfSlotsPerZone },
    },
  } = G;
  const zone = zones[zoneNumber];

  // validate cost playability
  // validate zone playability
  // add card to playedCards array
  // remove cost from current action points
  // handle zone interactions
  // calculate and set zone power
  // remove card from hand & re-evaluate cards in hand
  // push card to zone side array
  // unset selected card
};
