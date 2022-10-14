import { Ctx, Game } from 'boardgame.io';
import { ActivePlayers, INVALID_MOVE } from 'boardgame.io/core';
import { v4 as uuid } from 'uuid';
import { add, subtract } from 'mathjs';
import { Card, config, GameState, SelectedCard, Zone } from './interfaces';

import CARD_DATABASE from './tempCardsDatabase';
import ZONE_DATABASE from './tempZonesDatabase';
import getCardPower from './utilities/get-card-power';

const DEBUG_CARD_ID: string = '';

export const BcgPoc: Game<GameState> = {
  name: 'BcgPoc',
  setup: () => ({
    turn: 0,
    done: {
      '0': false,
      '1': false,
    },

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
          let randomCard1 = random?.Shuffle(CARD_DATABASE)[0];
          let randomCard2 = random?.Shuffle(CARD_DATABASE)[0];

          tempOpponentArray.push({
            __id: randomCard1?.id,
            baseCost: randomCard1?.cost,
            basePower: randomCard1?.power,
            canPlay: false,
            currentCost: randomCard1?.cost,
            description: randomCard1?.description,
            displayPower: randomCard1?.power,
            mechanic: randomCard1?.mechanic,
            name: randomCard1?.name,
            powerStream: [],
            uuid: uuid(),
            zonePowerAdjustment: 0,
            revealed: false,
          } as Card);
          tempPlayerArray.push({
            __id: randomCard2?.id,
            baseCost: randomCard2?.cost,
            basePower: randomCard2?.power,
            canPlay: false,
            currentCost: randomCard2?.cost,
            description: randomCard2?.description,
            displayPower: randomCard2?.power,
            mechanic: randomCard2?.mechanic,
            name: randomCard2?.name,
            powerStream: [],
            uuid: uuid(),
            zonePowerAdjustment: 0,
            revealed: false,
          } as Card);
        });

        // debug opponents side interactions of CARD_10
        if (DEBUG_CARD_ID !== '') {
          let randomCard3 = random?.Shuffle(CARD_DATABASE)[0];
          for (let index = 0; index < 2; index++) {
            G.zones[0].sides['1'].push({
              __id: randomCard3?.id,
              baseCost: randomCard3?.cost,
              basePower: randomCard3?.power,
              canPlay: false,
              currentCost: randomCard3?.cost,
              description: randomCard3?.description,
              displayPower: randomCard3?.power,
              mechanic: randomCard3?.mechanic,
              name: randomCard3?.name,
              powerStream: [],
              uuid: uuid(),
              zonePowerAdjustment: 0,
              revealed: false,
            } as Card);
          }
        }

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
      next: 'reveal',
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
        // onBegin: (G, ctx) => onTurnBegin(G, ctx),
        // onEnd: (G, ctx) => onTurnEnd(G, ctx),
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
              // endTurn: (G: GameState, ctx) => {
              //   ctx.events?.endTurn();
              // },
            },
          },
        },
      },
    },
    reveal: {
      next: 'play',
      onBegin: (G, ctx) => {
        G.zones.forEach((z: Zone, zoneIdx: number) => {
          z.sides['0'].forEach((c: Card, cIdx: number) => {
            if (!c.revealed) revealCard(G, ctx, '0', zoneIdx, c, cIdx);
          });
      
          z.sides['1'].forEach((c: Card, cIdx: number) => {
            if (!c.revealed) revealCard(G, ctx, '1', zoneIdx, c, cIdx);
          });
        });

        ctx.events?.endPhase();
      },
      // endIf: (G, ctx) => {
      //   let result: boolean;
      //   return G.zones.forEach((z: Zone, zoneIdx: number) => {
      //     z.sides['0'].forEach((c: Card, cIdx: number) => {
      //       if (c.revealed) return true;
      //     });
      
      //     z.sides['1'].forEach((c: Card, cIdx: number) => {
      //       if (!c.revealed) return true
      //     });
      //   });
      // },
      // onEnd: (G, ctx) => {
      //   G.revealed = {
      //     '0': false,
      //     '1': false
      //   }

      //   // ctx.events?.setPhase('play');
      // }
    }
  },
  ai: {
    enumerate: (G: GameState, ctx: Ctx) => {
      const { players, zones, config } = G;
      const { random } = ctx;
      const perZone = config.gameConfig.numberOfSlotsPerZone;
      const aiPlayer = players['1'];
      const aiHand = aiPlayer.hand;
      let moves = [];

      // avoids onslaught of INVALID_MOVE errors
      if (G.done['1'] === false) {
        if (aiHand.length >= 1) {
          let cardsThanCanBePlayed: Card[] = []; // find playable cards
          aiHand.forEach((c: Card) => {
            if (c.canPlay) cardsThanCanBePlayed.push(c);
          });

          for (let i = 0; i < cardsThanCanBePlayed.length; i++) {
            if (!zones[0].disabled['1'])
              for (let i = 0; i < perZone - zones[0].sides[1].length; i++) {
                moves.push({
                  move: 'playAiCard',
                  args: [0, cardsThanCanBePlayed[0], 0],
                });
              }

            if (!zones[1].disabled['1'])
              for (let i = 0; i < perZone - zones[1].sides[1].length; i++) {
                moves.push({
                  move: 'playAiCard',
                  args: [1, cardsThanCanBePlayed[0], 0],
                });
              }

            if (!zones[2].disabled['1'])
              for (let i = 0; i < perZone - zones[2].sides[1].length; i++) {
                moves.push({
                  move: 'playAiCard',
                  args: [2, cardsThanCanBePlayed[0], 0],
                });
              }
          }
        }

        // moves.push({ event: 'endTurn' });
        moves.push({ move: 'setDone', args: ['1'] });
      }

      // console.log(moves);
      return moves;
    },
  },
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

// prettier-ignore
const onTurnBegin = (G: GameState, ctx: Ctx) => {
  const apPerTurn = config.gameConfig.actionPointsPerTurn;
  const apPerGame = config.gameConfig.actionPointsTotal;
  const maxHandSize = config.gameConfig.cardsPerHand;

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
  // 1: add card to hand
  if (G.players['1'].hand.length < maxHandSize) { // ...... canDraw
    G.players['1'].hand.push( // .......................... pushes to hand
      G.players['1'].deck.splice(0, 1)[0] // .............. splices from deck
    );
  }
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
  // 0: add card to hand
  if (G.players['0'].hand.length < maxHandSize) { // ...... canDraw
    G.players['0'].hand.push( // .......................... pushes to hand
      G.players['0'].deck.splice(0, 1)[0] // .............. splices from deck
    );
  }
  // 0: set playable cards
  if (G.players['0'].hand.length !== 0)
    G.players['0'].hand.forEach((c: Card) => {
      if (G.players['0'].actionPoints >= c.currentCost) return c.canPlay = true;
      else return c.canPlay = false;
    });
  // 0: handle debug card draw
  if (DEBUG_CARD_ID !== '') {
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
  const currentSingleTurn = Math.round(ctx.turn / 2);
  G.players[1].hand.forEach((c: Card) => (c.canPlay = false));
  G.players[0].hand.forEach((c: Card) => (c.canPlay = false));
  // ctx.events?.endPhase();

  // reveal cards
  // G.zones.forEach((z: Zone, zoneIdx: number) => {
  //   z.sides['0'].forEach((c: Card, cIdx: number) => {
  //     if (!c.revealed) revealCard(G, ctx, '0', zoneIdx, c, cIdx);
  //   });

  //   z.sides['1'].forEach((c: Card, cIdx: number) => {
  //     if (!c.revealed) revealCard(G, ctx, '1', zoneIdx, c, cIdx);
  //   });
  // });
};

const selectCard = (
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
};

// prettier-ignore
const deselectCard = (G: GameState, ctx: Ctx, playerId: string) => {
  G.selectedCard[playerId] = undefined;
}

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
  if (G.players[playerId].actionPoints < card.currentCost) return INVALID_MOVE;

  // validate zone playability
  if (zone.sides[playerId].length > numberOfSlotsPerZone) return INVALID_MOVE;
  if (zone.disabled[playerId]) return INVALID_MOVE;

  // add card to playedCards array
  G.playedCards[playerId].push(card);

  // remove cost from current action points
  const newAP = subtract(G.players[playerId].actionPoints, card.currentCost);
  G.players[playerId].actionPoints = newAP;

  // push card to zone side array
  zone.sides[playerId].push(card);

  // remove card from hand
  const newHand = player.hand.filter((c: Card) => c.uuid !== cardUuid);
  G.players[playerId].hand = newHand;

  // re-evaluate cards in hand
  if (G.players[playerId].hand.length !== 0)
    G.players[playerId].hand.forEach((c: Card) => {
      if (G.players[playerId].actionPoints >= c.currentCost) {
        return (c.canPlay = true);
      } else {
        return (c.canPlay = false);
      }
    });

  // unset selected card
  G.selectedCard[playerId] = undefined;
};

const revealCard = async (
  G: GameState,
  ctx: Ctx,
  playerId: string,
  zoneNumber: number,
  card: Card,
  cardIndex: number
) => {
  const { uuid } = card;

  // reveal card
  G.zones[zoneNumber].sides[playerId][cardIndex].revealed = true;
  
  // handle zone interactions
  handleZoneInteraction(G, ctx, playerId, zoneNumber);

  // run interaction
  handleCardInteraction(G, ctx, playerId, zoneNumber, card);

  // calculate new power
  const power = getCardPower(card);

  // set display power
  G.zones[zoneNumber].sides[playerId][cardIndex].displayPower = power;

  // calculate zone power
  G.zones[zoneNumber].powers[playerId] = add(
    G.zones[zoneNumber].powers[playerId], 
    power
  );
};

const playAiCard = (
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
  const zoneSideLength = zone.sides['1'].length;
  const currentAP = G.players['1'].actionPoints;

  // validate cost playability
  if (currentAP < card.currentCost) return INVALID_MOVE;

  // validate zone playability
  if (zoneSideLength > numberOfSlotsPerZone) return INVALID_MOVE;
  if (zone.disabled['1']) return INVALID_MOVE;

  // add card to playedCards array
  G.playedCards['1'].push(card);

  // remove cost from current action points
  const newAP = subtract(G.players['1'].actionPoints, card.currentCost);
  G.players['1'].actionPoints = newAP;

  // push card to zone side array
  zone.sides['1'].push(card);

  // remove card from hand
  const newHand = player.hand.filter((c: Card) => c.uuid !== cardUuid);
  G.players['1'].hand = newHand;

  // re-evaluate cards in hand
  G.players['1'].hand.forEach((c: Card) => {
    if (G.players['1'].actionPoints >= c.currentCost) {
      return (c.canPlay = true);
    } else {
      return (c.canPlay = false);
    }
  });

  // unset selectedCard
  G.selectedCard['1'] = undefined;
};

const setDone = (G: GameState, ctx: Ctx, playerId: string) => {
  G.done[playerId] = true;
};

const handleCardInteraction = async (
  G: GameState,
  ctx: Ctx,
  playerId: string,
  zoneNumber: number,
  card: Card
) => {
  const apPerGame = config.gameConfig.actionPointsTotal;
  switch (card?.__id) {
    case 'CARD_017':
      // if (G.players[playerId].actionPointsTotal < apPerGame) {
        G.players[playerId].actionPointsTotal = add(
          G.players[playerId].actionPointsTotal,
          1
        );
      // }
      break;
    default:
      break;
  }
};

const handleZoneInteraction = async (
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
          zonePowerAdjustment: zone.powerAdjustment,
        };
        // if (G.zones[zoneNumber].sides[playerId][i].powerStream) {
        //   const stream = G.zones[zoneNumber].sides[playerId][i].powerStream!;
        //   const streamLength = stream.length;
        //   const lastStreamPower = stream[streamLength].currentPower;

        //   G.zones[zoneNumber].sides[playerId][i].powerStream!.push({
        //     blame: zone.id,
        //     adjustment: zone.powerAdjustment,
        //     currentPower: add(lastStreamPower, zone.powerAdjustment),
        //   });
        // } else {
        //   G.zones[zoneNumber].sides[playerId][i].powerStream = [{
        //     blame: zone.id,
        //     adjustment: zone.powerAdjustment,
        //     currentPower: add(c.basePower, zone.powerAdjustment),
        //   }];
        // }
      });
      break;
    default:
      break;
  }
};

const handleZoneCalculation = (
  G: GameState,
  ctx: Ctx,
  playerId: string,
  zoneNumber: number,
  card: Card
) => {
  // if zone has no power:
  if (G.zones[zoneNumber].powers[playerId] === 0) {
  // -- if the zone has a power adjustment, add card's basePower to it—then set
  // -- else set zone's power to the card's base power
  }

  // if zone has power already:
  // -- if the zone has a power adjustment, add zone's powers to it—then set
  // -- else add card's base power to zone's power—then set
}

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}
