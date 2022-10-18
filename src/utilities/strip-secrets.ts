import { Ctx, PlayerID } from 'boardgame.io';
import { GameState } from '../interfaces';

/**
 * Strips away the following nested fields
 * from the opposing player's client:
 *  - players
 *  - selectedCard.data
 *
 * @param {Object} G game state object.
 * @param {Number} playerId player's unique playOrder ID.
 * @see https://boardgame.io/documentation/#/secret-state
 */
const stripSecrets = (G: GameState, ctx: Ctx, playerId: PlayerID) => ({
  ...G,
  // players: { [playerId]: G.players[playerId] },
  selectedCardData: { [playerId]: G.selectedCardData[playerId] },
});

export default stripSecrets;