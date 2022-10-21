import { Ctx } from 'boardgame.io';
import { ActivePlayers, INVALID_MOVE } from 'boardgame.io/core';
import { add, subtract } from 'mathjs';
import { Card, GameState, PlayerID } from './interfaces';
import { PlayedCards, PlayerTurnDone } from './state';
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

  if (G.selectedCardData[playerId]?.uuid === cardMatch?.uuid) {
    G.selectedCardData[playerId] = undefined;
  } else {
    G.selectedCardData[playerId] = cardMatch;
    G.selectedCardIndex[playerId] = cardMatchIndex;
  }
};

const deselectCard = (G: GameState, ctx: Ctx, playerId: string) => {
  G.selectedCardData[playerId] = undefined;
  G.selectedCardIndex[playerId] = undefined;
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
  if (G.selectedCardData[playerId] === undefined) return INVALID_MOVE;

  const player = G.players[playerId];
  const card = G.selectedCardData[playerId]! as Card;
  const cardUuid = G.selectedCardData[playerId]!.uuid;
  const zone = zones[zoneNumber];
  const zoneRef = G.ZonesCardsReference[zoneNumber];

  // validate cost playability
  if (G.players[playerId].actionPoints < card.currentCost) return INVALID_MOVE;

  // validate zone playability
  if (zone.sides[playerId].length > numberOfSlotsPerZone) return INVALID_MOVE;
  if (zoneRef[playerId].length > numberOfSlotsPerZone) return INVALID_MOVE;
  if (zone.disabled[playerId]) return INVALID_MOVE;

  // add card to PlayedCards array
  PlayedCards.push(G, playerId, card);

  // remove cost from current action points
  const newAP = subtract(G.players[playerId].actionPoints, card.currentCost);
  G.players[playerId].actionPoints = newAP;

  // push card to zone side array
  // zone.sides[playerId].push(createMinionObject(card));
  zoneRef[playerId].push(card);

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
  G.selectedCardData[playerId] = undefined;
  G.selectedCardIndex[playerId] = undefined;
};

const revealCard = async (
  G: GameState,
  ctx: Ctx,
  playerId: string,
  zoneNumber: number,
  obj: Card,
  objIndex: number
) => {
  // @ts-ignore
  const zoneRefs = G.ZonesCardsReference;
  const cardToReveal = zoneRefs[zoneNumber][playerId][objIndex];
  G.zones[zoneNumber].sides[playerId][objIndex] = {
    ...createMinionObject(cardToReveal),
    revealed: true, // reveal card
    displayPower: getCardPower(obj),// set display power
    revealedOnTurn: G.turn // set revealedOnTurn value
  }
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
  G.selectedCardData['1'] = card;
  G.selectedCardIndex['1'] = cardIndex;

  const player = G.players['1'];
  const cardUuid = card.uuid;
  const zone = zones[zoneNumber];
  const zoneSideLength = zone.sides['1'].length;
  const zoneRef = G.ZonesCardsReference[zoneNumber];
  const zoneRefSideLength = zoneRef['1'].length;
  const currentAP = G.players['1'].actionPoints;

  // validate cost playability
  if (currentAP < card.currentCost) return INVALID_MOVE;

  // validate zone playability
  if (zoneSideLength > numberOfSlotsPerZone) return INVALID_MOVE;
  if (zoneRefSideLength > numberOfSlotsPerZone) return INVALID_MOVE;
  if (zone.disabled['1']) return INVALID_MOVE;

  // add card to PlayedCards array
  PlayedCards.push(G, '1', card);

  // remove cost from current action points
  const newAP = subtract(G.players['1'].actionPoints, card.currentCost);
  G.players['1'].actionPoints = newAP;

  // push card to zone side array
  // zone.sides['1'].push(createMinionObject(card));
  zoneRef['1'].push(card);

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
  G.selectedCardData['1'] = undefined;
  G.selectedCardIndex['1'] = undefined;
};

const setDone = (G: GameState, ctx: Ctx, playerId: PlayerID) => {
  PlayerTurnDone.set(G, playerId);
};

export {
  deselectCard,
  playAiCard,
  playCard,
  revealCard,
  selectCard,
  setDone,
};
