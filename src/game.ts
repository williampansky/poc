import { Ctx, Game } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import { v4 as uuid } from 'uuid';
import { add, subtract } from 'mathjs';

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
  powerAdjustment?: number;
  temporaryPower?: number;
  mechanic?: string;
  description?: string;
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
      '0': undefined,
      '1': undefined,
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
            disabled:
              randomZonesArray![idx].id === 'ZONE_003'
                ? { '0': true, '1': true }
                : { '0': false, '1': false },
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
          const currentTurn = Math.round(ctx.turn / 2);
          G.players[1].hand.forEach((c: Card) => (c.canPlay = false));
          G.players[0].hand.forEach((c: Card) => (c.canPlay = false));

          G.zones.forEach((z: Zone) => {
            switch (z.id) {
              case 'ZONE_002':
                if (currentTurn === 6) {
                  z.sides = {
                    '0': [],
                    '1': []
                  };
                  z.powers = {
                    '0': 0,
                    '1': 0
                  };
                }
                break;
              default:
                break;
            }
          })
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
        deselectCard: (
          G: GameState,
          ctx: Ctx,
          playerId: string
        ) => {
          G.selectedCard[playerId] = undefined
        },
        playCard: {
          // move: playCard(G, ctx, playerId, zoneNumber, card)
          client: false,
          noLimit: true,
          move: (G, ctx, playerId, zoneNumber) => {
            return playCard(G, ctx, playerId, zoneNumber);
          },
        },
        playAiCard: (
          G: GameState,
          ctx: Ctx,
          zoneNumber: number,
          card: Card,
          cardIndex: number
        ) => {
          const {
            zones,
            config: {
              gameConfig: { numberOfSlotsPerZone },
            },
          } = G;

          // set selected card
          G.selectedCard['1'] = {
            data: card,
            index: cardIndex,
          } as SelectedCard;

          const player = G.players['1'];
          const cardUuid = card.uuid;
          const zone = zones[zoneNumber];

          // validate cost playability
          if (G.players['1'].actionPoints < card.cost) return INVALID_MOVE;

          // validate zone playability
          if (zone.sides['1'].length > numberOfSlotsPerZone)
            return INVALID_MOVE;
          if (zone.disabled['1']) return INVALID_MOVE;

          // add card to playedCards array
          G.playedCards['1'].push(card);

          // remove cost from current action points
          const newAP = subtract(G.players['1'].actionPoints, card.cost);
          G.players['1'].actionPoints = newAP;

          // push card to zone side array
          zone.sides['1'].push(card);

          // if zone has interaction text
          if (zone?.powerAdjustment) {
            // handle zone interactions
            handleZoneInteraction(G, ctx, '1', zoneNumber);

            // calculate and set zone power
            G.zones[zoneNumber].powers['1'] = Math.round(
              G.zones[zoneNumber].powers['1'] +
                zone.sides['1'].find((c) => c.uuid === cardUuid)!
                  .temporaryPower!
            );
          } else {
            // calculate and set zone power
            G.zones[zoneNumber].powers['1'] = add(
              G.zones[zoneNumber].powers['1'],
              card.power
            );
          }

          // remove card from hand
          const newHand = player.hand.filter((c: Card) => c.uuid !== cardUuid);
          G.players['1'].hand = newHand;

          // re-evaluate cards in hand
          G.players['1'].hand.forEach((c: Card) => {
            if (G.players['1'].actionPoints >= c.cost)
              return (c.canPlay = true);
            else return (c.canPlay = false);
          });
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
            if (!G.zones[0].disabled['1'])
              for (let i = 0; i < 6 - G.zones[0].sides[1].length; i++) {
                moves.push({
                  move: 'playAiCard',
                  args: [0, cardsThanCanBePlayed[0], 0],
                });
              }

            if (!G.zones[1].disabled['1'])
              for (let i = 0; i < 6 - G.zones[1].sides[1].length; i++) {
                moves.push({
                  move: 'playAiCard',
                  args: [1, cardsThanCanBePlayed[0], 0],
                });
              }

            if (!G.zones[2].disabled['1'])
              for (let i = 0; i < 6 - G.zones[2].sides[1].length; i++) {
                moves.push({
                  move: 'playAiCard',
                  args: [2, cardsThanCanBePlayed[0], 0],
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
  zoneNumber: number
) => {
  const { currentPlayer } = ctx;
  const {
    zones,
    config: {
      gameConfig: { numberOfSlotsPerZone },
    },
  } = G;

  // validate selected card
  if (G.selectedCard[playerId] === undefined) return INVALID_MOVE;

  const player = G.players[playerId];
  const card = G.selectedCard[playerId]!.data as Card;
  const cardUuid = G.selectedCard[playerId]!.data!.uuid;
  const zone = zones[zoneNumber];

  // validate cost playability
  if (G.players[playerId].actionPoints < card.cost) return INVALID_MOVE;

  // validate zone playability
  if (zone.sides[playerId].length > numberOfSlotsPerZone) return INVALID_MOVE;
  if (zone.disabled[playerId]) return INVALID_MOVE;

  // add card to playedCards array
  G.playedCards[playerId].push(card);

  // remove cost from current action points
  const newAP = subtract(G.players[playerId].actionPoints, card.cost);
  G.players[playerId].actionPoints = newAP;

  // push card to zone side array
  zone.sides[playerId].push(card);

  // handle card mechanics
  handleCardInteraction(G, ctx, playerId, zoneNumber, card);

  // if zone has interaction text
  if (zone?.powerAdjustment) {
    // handle zone interactions
    handleZoneInteraction(G, ctx, playerId, zoneNumber);

    // calculate and set zone power
    G.zones[zoneNumber].powers[playerId] = add(
      G.zones[zoneNumber].powers[playerId],
      zone.sides[playerId].find((c) => c.uuid === cardUuid)!.temporaryPower!
    );
  } else {
    // calculate and set zone power
    G.zones[zoneNumber].powers[playerId] = add(
      G.zones[zoneNumber].powers[playerId],
      card.power
    );
  }

  // remove card from hand
  const newHand = player.hand.filter((c: Card) => c.uuid !== cardUuid);
  G.players[playerId].hand = newHand;

  // re-evaluate cards in hand
  G.players[playerId].hand.forEach((c: Card) => {
    if (G.players[playerId].actionPoints >= c.cost) return (c.canPlay = true);
    else return (c.canPlay = false);
  });

  // unset selected card
  G.selectedCard[playerId] = undefined;
};

const handleCardInteraction = (
  G: GameState,
  ctx: Ctx,
  playerId: string,
  zoneNumber: number,
  card: Card,
) => {
  switch (card?.id) {
    case 'CARD_005':
      G.players[playerId].actionPointsTotal = add(G.players[playerId].actionPointsTotal, 1);
      break;
    default:
      break;
  }
};

const handleZoneInteraction = (
  G: GameState,
  ctx: Ctx,
  playerId: string,
  zoneNumber: number
) => {
  const zone = G.zones[zoneNumber];
  switch (zone.id) {
    case 'ZONE_001':
    case 'ZONE_004':
      zone.sides[playerId].forEach((c: Card, i: number) => {
        G.zones[zoneNumber].sides[playerId][i] = {
          ...c,
          powerAdjustment: zone.powerAdjustment,
          temporaryPower: add(c.power, zone.powerAdjustment),
        } as Card;
      });
      break;
    case 'ZONE_002':
      const currentTurn = Math.round(ctx.turn / 2);
      if (currentTurn === 6) {
        zone.sides['0'] = [];
        zone.sides['1'] = [];
      }
      break;
    default:
      break;
  }
};
