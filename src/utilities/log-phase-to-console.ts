import chalk from 'chalk';
import { Config } from '../game.config';

const log = console.log;
const key = chalk.gray;
const value = chalk.bold.green;

const logPhaseToConsole = (
  turn: number = 0,
  phase: string = '',
  custom?: { key: string; value: string }
) => {
  if (Config.debugConfig.logPhaseToConsole) {
    if (custom) {
      log(`
   TURN: ${value(turn)}
  PHASE: ${value(phase)}
  ${custom.key}: ${value(custom.value)}
      `);
    } else {
      log(`
   TURN: ${value(turn)}
  PHASE: ${value(phase)}
      `);
    }
  }
};

export default logPhaseToConsole;
