import { Ctx, Game } from 'boardgame.io';
import { INVALID_MOVE } from 'boardgame.io/core';
import { v4 as uuid } from 'uuid';
import CARD_DATABASE from './tempCardsDatabase';
import ZONE_DATABASE from './tempZonesDatabase';

export interface Card {
  id: string;
  cost: number;
  name: string;
  power: number;
  uuid: string;
  canPlay: boolean;
}

export interface Zone {
  disabled: boolean;
  disabledForOpponent: boolean;
  disabledForPlayer: boolean;
  opponentPower: number;
  opponentSide: Card[];
  playerPower: number;
  playerSide: Card[];
  zoneId: string;
  zoneName: string;
  zonePowerAdjustment: number;
  zonePowerText?: string;
  zoneUuid: string;
}

export interface Player {
  id: string;
  name: string;
  deck: Card[];
  hand: Card[];
}

export interface GameState {
  players: Player[];

  playerActionPoints: number;
  playerActionPointsTotal: number;
  opponentActionPoints: number;
  opponentActionPointsTotal: number;

  opponentSelectedCard?: Card;
  playerSelectedCard?: Card;

  playerPlayedCards: Card[];
  opponentPlayedCards: Card[];

  zones: Zone[];

  numberOfSingleTurns: number;
}

export const BcgPoc: Game<GameState> = {
  name: 'BcgPoc',
  setup: () => ({
    players: [
      ...Array.from(Array(2)).map((_, idx: number) => {
        return {
          id: idx.toString(),
          name: idx === 0 ? 'Player' : 'Opponent',
          deck: [],
          hand: [],
        };
      }),
    ],

    playerActionPoints: 0,
    playerActionPointsTotal: 0,
    opponentActionPoints: 0,
    opponentActionPointsTotal: 0,

    opponentSelectedCard: undefined,
    playerSelectedCard: undefined,

    playerPlayedCards: [],
    opponentPlayedCards: [],

    zones: [
      ...Array.from(Array(3)).map(() => {
        return {
          disabled: false,
          disabledForOpponent: false,
          disabledForPlayer: false,
          opponentPower: 0,
          opponentSide: [],
          playerPower: 0,
          playerSide: [],
          zoneId: '',
          zoneName: 'Zone',
          zonePowerAdjustment: 0,
          zonePowerText: undefined,
          zoneUuid: ''
        };
      }),
    ],

    numberOfSingleTurns: 12,
  }),
  phases: {
    initZones: {
      start: true,
      next: 'draw',
      onBegin: (G: GameState, ctx: Ctx) => {
        const { random } = ctx;
        const randomZonesArray = random?.Shuffle(ZONE_DATABASE);
        let newZones: Zone[] = [];

        for (let index = 0; index < 3; index++) {
          let newZone = {
            ...G.zones[0],
            zoneId: randomZonesArray![index].id,
            zoneName: randomZonesArray![index].name,
            zonePowerText: randomZonesArray![index]?.text,
            zoneUuid: uuid(),
          } as Zone;

          newZones.push(newZone);
        }

        G.zones = newZones;
      },
      endIf(G: GameState) {
        return (
          G.zones[0].zoneUuid !== '' &&
          G.zones[1].zoneUuid !== '' &&
          G.zones[2].zoneUuid !== ''
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
        [...Array(20)].forEach((_, i) => {
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
        [...Array(3)].forEach((_, i) => {
          G.players[1].hand.push(G.players[1].deck.splice(0, 1)[0]);
          G.players[0].hand.push(G.players[0].deck.splice(0, 1)[0]);
        });
      },
      // End phase when both player's decks are full (20 cards)
      // prettier-ignore
      endIf: (G: GameState) => (
        G.players[1].deck.length === 17 && G.players[0].deck.length === 17 &&
        G.players[1].hand.length === 3 && G.players[0].hand.length === 3
      ),
    },
    play: {
      turn: {
        // prettier-ignore
        onBegin(G: GameState, ctx: Ctx) {
          switch (ctx.currentPlayer) {
            case '1':
              // incremement action points
              if (G.opponentActionPointsTotal !== 10) {
                G.opponentActionPointsTotal = Math.abs(G.opponentActionPointsTotal + 1);
              }
  
              // set current action points
              G.opponentActionPoints = G.opponentActionPointsTotal;
  
              // add card to hand
              if (G.players[1].hand.length !== 8) { // .... canDraw
                G.players[1].hand.push( // ................ pushes to hand
                  G.players[1].deck.splice(0, 1)[0] // .... splices from deck
                );
              }

              // set playable cards
              G.players[1].hand.forEach((c: Card) => {
                if (G.opponentActionPoints >= c.cost) return c.canPlay = true;
                else return c.canPlay = false;
              });
              break;
  
            case '0':
            default:
              // incremement action points
              if (G.playerActionPointsTotal !== 10) {
                G.playerActionPointsTotal = Math.abs(G.playerActionPointsTotal + 1);
              }
  
              // set current action points
              G.playerActionPoints = G.playerActionPointsTotal;
  
              // add card to hand
              if (G.players[0].hand.length !== 8) { // .... canDraw
                G.players[0].hand.push( // ................ pushes to hand
                  G.players[0].deck.splice(0, 1)[0] // .... splices from deck
                );
              }

              // set playable cards
              G.players[0].hand.forEach((c: Card) => {
                if (G.playerActionPoints >= c.cost) return c.canPlay = true;
                else return c.canPlay = false;
              });
              break;
          }
        },
        onEnd(G, ctx) {
          G.players[1].hand.forEach((c: Card) => {
            return (c.canPlay = false);
          });
          G.players[0].hand.forEach((c: Card) => {
            return (c.canPlay = false);
          });
        },
      },
      moves: {
        selectCard: (G, ctx, playerId: string, cardUuid: string) => {
          const cardMatch = G.players[Number(playerId)].hand.find((c: Card) => c.uuid === cardUuid);
          if (G.playerSelectedCard?.uuid === cardMatch?.uuid) {
            G.playerSelectedCard = undefined;
          } else {
            G.playerSelectedCard = cardMatch;
          }
        },
        playCard: (G, ctx, playerId: string, zoneNumber: number) => {
          // add card to playedCards
          const cardFromHand = G.players[Number(playerId)].hand.find(
            (c: Card) => c.uuid === G.playerSelectedCard?.uuid
          ) as Card;
          G.playerPlayedCards.push(cardFromHand);

          // remove from hand
          const newHand = G.players[Number(playerId)].hand.filter(
            (c: Card) => c.uuid !== G.playerSelectedCard?.uuid
          );
          G.players[Number(playerId)].hand = newHand;

          // remove cost from current action points
          G.playerActionPoints = Math.abs(
            G.playerActionPoints - cardFromHand.cost
          );

          // re-evaluate cards in hand
          G.players[Number(playerId)].hand.forEach((c: Card) => {
            if (G.playerActionPoints >= c.cost) return (c.canPlay = true);
            else return (c.canPlay = false);
          });

          // play card to zone
          switch (zoneNumber) {
            case 2:
              if (G.zones[2].playerSide.length !== 6) {
                G.zones[2].playerSide.push(G.playerSelectedCard as Card);
                G.zones[2].playerPower = Math.abs(
                  G.zones[2].playerPower + G.playerSelectedCard!.power
                );
                G.playerSelectedCard = undefined;
              } else {
                return INVALID_MOVE;
              }
              break;

            case 1:
              if (G.zones[1].playerSide.length !== 6) {
                G.zones[1].playerSide.push(G.playerSelectedCard as Card);
                G.zones[1].playerPower = Math.abs(
                  G.zones[1].playerPower + G.playerSelectedCard!.power
                );
                G.playerSelectedCard = undefined;
              } else {
                return INVALID_MOVE;
              }
              break;

            case 0:
              if (G.zones[0].playerSide.length !== 6) {
                G.zones[0].playerSide.push(G.playerSelectedCard as Card);
                G.zones[0].playerPower = Math.abs(
                  G.zones[0].playerPower + G.playerSelectedCard!.power
                );
                G.playerSelectedCard = undefined;
              } else {
                return INVALID_MOVE;
              }
              break;

            default:
              break;
          }
        },
        aiPlayCard: (G, ctx, zoneNumber: number, card: Card) => {
          // add card to playedCards
          G.opponentPlayedCards.push(card);

          // remove from hand
          const newHand = G.players[1].hand.filter((c: Card) => c.uuid !== card?.uuid);
          G.players[1].hand = newHand;

          // remove cost from current action points
          G.opponentActionPoints = Math.abs(G.opponentActionPoints - card.cost);

          // re-evaluate cards in hand
          G.players[1].hand.forEach((c: Card) => {
            if (G.opponentActionPoints >= c.cost) return (c.canPlay = true);
            else return (c.canPlay = false);
          });

          // play card to zone
          switch (zoneNumber) {
            case 2:
              if (G.zones[2].opponentSide.length !== 6) {
                G.zones[2].opponentSide.push(card);
                G.zones[2].opponentPower = Math.abs(
                  G.zones[2].opponentPower + card?.power
                );
              } else {
                return INVALID_MOVE;
              }
              break;

            case 1:
              if (G.zones[1].opponentSide.length !== 6) {
                G.zones[1].opponentSide.push(card);
                G.zones[1].opponentPower = Math.abs(
                  G.zones[1].opponentPower + card?.power
                );
              } else {
                return INVALID_MOVE;
              }
              break;

            case 0:
              if (G.zones[0].opponentSide.length !== 6) {
                G.zones[0].opponentSide.push(card);
                G.zones[0].opponentPower = Math.abs(
                  G.zones[0].opponentPower + card?.power
                );
              } else {
                return INVALID_MOVE;
              }
              break;

            default:
              break;
          }
        },
        endTurn: (G, ctx) => {
          ctx.events?.endTurn();
        },
      },
    },
  },
  ai: {
    enumerate: (G, ctx) => {
      let moves = [];

      // avoids onslaught of INVALID_MOVE errors
      if (ctx.currentPlayer === '1') {
        if (G.players[1].hand.length >= 1) {
          let cardsThanCanBePlayed: Card[] = []; // find playable cards
          G.players[1].hand.forEach((c: Card) => {
            if (c.canPlay) cardsThanCanBePlayed.push(c);
          });

          for (let i = 0; i < cardsThanCanBePlayed.length; i++) {
            for (let i = 0; i < 6 - G.zones[0].opponentSide.length; i++) {
              moves.push({
                move: 'aiPlayCard',
                args: [0, cardsThanCanBePlayed[0]],
              });
            }

            for (let i = 0; i < 6 - G.zones[1].opponentSide.length; i++) {
              moves.push({
                move: 'aiPlayCard',
                args: [1, cardsThanCanBePlayed[0]],
              });
            }

            for (let i = 0; i < 6 - G.zones[2].opponentSide.length; i++) {
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
    if (ctx.turn === Math.abs(G.numberOfSingleTurns * 2)) {
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
  let opponentWonZones = [];
  let playerWonZones = [];
  let winner = '';

  if (zone1.opponentPower > zone1.playerPower) opponentWonZones.push(true);
  else if (zone1.playerPower > zone1.opponentPower) playerWonZones.push(true);

  if (zone2.opponentPower > zone2.playerPower) opponentWonZones.push(true);
  else if (zone2.playerPower > zone2.opponentPower) playerWonZones.push(true);

  if (zone3.opponentPower > zone3.playerPower) opponentWonZones.push(true);
  else if (zone3.playerPower > zone3.opponentPower) playerWonZones.push(true);

  if (opponentWonZones > playerWonZones) winner = '1';
  else if (playerWonZones > opponentWonZones) winner = '0';

  return winner;
};
