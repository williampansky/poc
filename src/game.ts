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
  cost: number;
  name: string;
  power: number;
  uuid: string;
  canPlay: boolean;
}

export interface Zone {
  disabled: boolean[];
  id: string;
  name: string;
  powers: number[];
  powerAdjustment: number;
  powerText?: string;
  sides: Card[][];
  uuid: string;
}

export interface Player {
  id: string;
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
  players: Player[];

  selectedCard: [SelectedCard, SelectedCard];
  playedCards: [Card[], Card[]];

  zones: Zone[];

  config: Config;
}

export const BcgPoc: Game<GameState> = {
  name: 'BcgPoc',
  setup: () => ({
    players: [
      ...Array.from(Array(config.gameConfig.numberOfPlayers)).map(
        (_, idx: number) => {
          return {
            id: idx.toString(),
            name: idx === 0 ? 'Player' : 'Opponent',
            deck: [],
            hand: [],
            actionPoints: 0,
            actionPointsTotal: 0,
          };
        }
      ),
    ],

    selectedCard: [{}, {}],
    playedCards: [[], []],

    zones: [
      ...Array.from(Array(config.gameConfig.numberOfZones)).map(() => {
        return {
          disabled: [false, false],
          id: '',
          name: 'Zone',
          powers: [0, 0],
          powerAdjustment: 0,
          powerText: undefined,
          sides: [[], []],
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
            disabled:
              randomZonesArray![idx].id === 'ZONE_003'
                ? [true, true]
                : [false, false],
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
        G.players[1].deck = tempOpponentArray;
        G.players[0].deck = tempPlayerArray;

        // init hands
        [...Array(config.gameConfig.cardsPerStartingHand)].forEach(() => {
          G.players[1].hand.push(G.players[1].deck.splice(0, 1)[0]);
          G.players[0].hand.push(G.players[0].deck.splice(0, 1)[0]);
        });
      },
      endIf: (G: GameState) => {
        // End phase when both player's decks are full (20 cards)
        const perDeck = config.gameConfig.cardsPerDeck;
        const perStartingHand = config.gameConfig.cardsPerStartingHand;
        const startingDeckLength = Math.abs(perDeck - perStartingHand);

        return (
          G.players[1].deck.length === startingDeckLength &&
          G.players[0].deck.length === startingDeckLength &&
          G.players[1].hand.length === perStartingHand &&
          G.players[0].hand.length === perStartingHand
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
        selectCard: (
          G: GameState,
          ctx: Ctx,
          playerId: string,
          uuid: string
        ) => {
          const playerID = Number(playerId);
          const player = G.players[playerID];
          const hand = player.hand;
          const cardMatch = hand.find((c: Card) => c.uuid === uuid);
          const cardMatchIdx = hand.findIndex((c: Card) => c.uuid === uuid);

          if (G.selectedCard[playerID]?.data?.uuid === cardMatch?.uuid) {
            G.selectedCard[playerID] = {};
          } else {
            G.selectedCard[playerID] = {
              index: cardMatchIdx,
              data: cardMatch,
            };
          }
        },
        playCard: (
          G: GameState,
          ctx: Ctx,
          playerId: string,
          zoneNumber: number,
          card?: Card
        ) => {
          const playerID = Number(playerId);

          if (card) {
            G.selectedCard[playerID] = {
              data: card,
              index: 0,
            };
          }

          const player = G.players[playerID];
          const ap = player.actionPoints;
          const hand = player.hand;
          const zone = G.zones[zoneNumber];
          const zoneSide = zone.sides[playerID];
          const zonePower = zone.powers[playerID];
          let selectedCard = G.selectedCard[playerID];
          let selectedCardData = selectedCard?.data as Card;
          let uuid = selectedCardData?.uuid;
          let cardFromHand = hand.find((c: Card) => c.uuid === uuid) as Card;
          let newHand = hand.filter((c: Card) => c.uuid !== uuid);
          const {
            config: {
              gameConfig: { numberOfSlotsPerZone },
            },
          } = G;

          // if card is playable
          if (zoneSide.length !== numberOfSlotsPerZone) {
            // remove cost from current action points
            player.actionPoints = Math.abs(ap - cardFromHand.cost);

            // re-evaluate cards in hand
            hand.forEach((c: Card) => {
              if (ap >= c.cost) return (c.canPlay = true);
              else return (c.canPlay = false);
            });

            // set the new zone power
            const newZonePower = Math.abs(zonePower + selectedCardData!.power);
            zone.powers[playerID] = newZonePower;

            // add card to zone's side
            zoneSide.push(selectedCardData);

            // add card to playedCards
            G.playedCards[playerID].push(cardFromHand);

            // remove from hand
            player.hand = newHand;

            // unset selected card
            G.selectedCard[playerID] = {};
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
      const playerID = Number(ctx.currentPlayer);
      let moves = [];

      const { config: { gameConfig: { numberOfSlotsPerZone }}} = G;
      const perZone = numberOfSlotsPerZone;

      if (G.players[playerID].hand.length >= 1) {
        let cardsThanCanBePlayed: Card[] = []; // find playable cards
        G.players[playerID].hand.forEach((c: Card) => {
          if (c.canPlay) cardsThanCanBePlayed.push(c);
        });

        for (let i = 0; i < cardsThanCanBePlayed.length; i++) {
          for (let i = 0; i < perZone - G.zones[0].sides[playerID].length; i++) {
            if (!G.zones[0].disabled[playerID])
              moves.push({
                move: 'playCard',
                args: [ctx.currentPlayer, 0, cardsThanCanBePlayed[0]],
              });
          }

          for (let i = 0; i < perZone - G.zones[1].sides[playerID].length; i++) {
            if (!G.zones[1].disabled[playerID])
              moves.push({
                move: 'playCard',
                args: [ctx.currentPlayer, 1, cardsThanCanBePlayed[0]],
              });
          }

          for (let i = 0; i < perZone - G.zones[2].sides[playerID].length; i++) {
            if (!G.zones[2].disabled[playerID])
              moves.push({
                move: 'playCard',
                args: [ctx.currentPlayer, 2, cardsThanCanBePlayed[0]],
              });
          }
        }
      }

      moves.push({ event: 'endTurn' });

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
