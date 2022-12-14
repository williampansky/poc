import { Ctx } from 'boardgame.io';
import { Card, CardBase, GameState } from '../interfaces';
import createCardObject from './create-card-object';

/**
 * Creates a random deck of cards from the provided
 * database parameter.
 */
const createRandomDeck = (
  G: GameState,
  ctx: Ctx,
  database: CardBase[]
): Card[] => {
  let tempDeckArray: Card[] = [];

  [...Array(G.Config.gameConfig.cardsPerDeck)].forEach(() => {
    let randomCard = ctx.random!.Shuffle(database)[0];
    tempDeckArray.push(createCardObject(randomCard));
  });

  return tempDeckArray;
};

export default createRandomDeck;
