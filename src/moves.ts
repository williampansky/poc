import { Ctx } from 'boardgame.io';
import { ActivePlayers, INVALID_MOVE } from 'boardgame.io/core';
import { add, subtract } from 'mathjs';
import { Card, GameState, Minion, SelectedCard } from './interfaces';
import createMinionObject from './utilities/create-minion-object';
import getCardPower from './utilities/get-card-power';

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

const deselectCard = (G: GameState, ctx: Ctx, playerId: string) => {
  G.selectedCard[playerId] = undefined;
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
  zone.sides[playerId].push(createMinionObject(card));

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
  obj: Minion,
  objIndex: number
) => {
  const { uuid } = obj;

  // reveal card
  G.zones[zoneNumber].sides[playerId][objIndex].revealed = true;

  // handle zone interactions
  // handleZoneInteraction(G, ctx, playerId, zoneNumber);

  // run interaction
  // handleCardInteraction(G, ctx, playerId, zoneNumber, card);

  // calculate new power
  const power = getCardPower(obj);

  // set display power
  G.zones[zoneNumber].sides[playerId][objIndex].displayPower = power;

  // set revealedOnTurn value
  G.zones[zoneNumber].sides[playerId][objIndex].revealedOnTurn = G.turn;

  // calculate zone power
  // G.zones[zoneNumber].powers[playerId] = add(
  //   G.zones[zoneNumber].powers[playerId],
  //   power
  // );
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
  zone.sides['1'].push(createMinionObject(card));

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
  const apPerGame = G.config.gameConfig.actionPointsTotal;
  switch (card?.__id) {
    case 'CARD_017':
      G.players[playerId].actionPointsTotal = add(
        G.players[playerId].actionPointsTotal,
        1
      );
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
      zone.sides[playerId].forEach((m: Minion, i: number) => {
        G.zones[zoneNumber].sides[playerId][i] = {
          ...m,
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

export {
  deselectCard,
  handleCardInteraction,
  handleZoneInteraction,
  playAiCard,
  playCard,
  revealCard,
  selectCard,
  setDone,
};
