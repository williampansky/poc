import { add, subtract } from 'mathjs';
import { GameState, PlayerID, ActionPoints as Interface } from '../interfaces';
import limitNumberWithinRange from '../utilities/limit-number-within-range';

const ActionPoints = {
  defaultState: <Interface>{
    '0': { current: 0, total: 0 },
    '1': { current: 0, total: 0 },
  },

  /**
   * Increments the `total` G.ActionPoints of the player by one;
   * unless the total is already at the max per config allotment.
   *
   * @param {object} G Game state object
   * @param {string} player Player to increment
   * @requires mathjs::add()
   */
  incrementTotal: (G: GameState, player: PlayerID) => {
    const { ActionPoints, config } = G;
    const { total } = ActionPoints[player];

    if (total === config.gameConfig.actionPointsTotal) return;

    const newTotal = add(Number(total), 1);
    G.ActionPoints[player].total = newTotal;
  },

  /**
   * Sets the `current` value to the player's `total` value.
   *
   * @param {object} G Game state object.
   * @param {string} player Player to match.
   */
  matchTotal: (G: GameState, player: PlayerID) => {
    const { ActionPoints } = G;
    const { total } = ActionPoints[player];
    G.ActionPoints[player].current = total;
  },

  /**
   * Sets the `current` actionPoints value of the
   * `player` param to the specified `amount`.
   *
   * @param {object} G Game state object.
   * @param {string} player Player to set.
   * @param {number} amount Value to set.
   */
  setCurrent: (G: GameState, player: PlayerID, amount: number) => {
    G.ActionPoints[player].current = amount;
  },

  /**
   * Sets the `total` actionPoints value of the
   * `player` param to the specified `amount`.
   *
   * @param {object} G Game state object.
   * @param {string} player Player to set.
   * @param {number} amount Value to set.
   */
  setTotal: (G: GameState, player: PlayerID, amount: number) => {
    G.ActionPoints[player].total = amount;
  },

  /**
   * Subtracts amount from player's current actionPoints value.
   *
   * @param {object} G Game state object.
   * @param {string} player
   * @param {number} amount
   * @requires mathjs::subtract()
   * @requires utils::limitNumberWithinRange()
   */
  subtract: (G: GameState, player: PlayerID, amount: number) => {
    const { current, total } = G.ActionPoints[player];

    const calculation = subtract(Number(current), Number(amount));
    const newValue = limitNumberWithinRange(calculation, total, 0);

    G.ActionPoints[player].current = newValue;
  },
};

export default ActionPoints;
