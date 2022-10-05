import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { Board } from './Board';
import { BcgPoc } from './game';

export default Client({
  game: BcgPoc,
  board: Board,
  debug: true,
  // multiplayer: Local()
});
