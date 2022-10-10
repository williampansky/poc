import React from 'react';
import { Client as BoardgameClient } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { MCTSBot } from 'boardgame.io/ai';
import { BcgPoc } from './game';
import { Board } from './Board';
import { v4 as uuid } from 'uuid';

const Client = BoardgameClient({
  game: BcgPoc,
  board: Board,
  multiplayer: Local({ bots: { 1: MCTSBot }, persist: false, storageKey: 'bgio' }),
  numPlayers: 1,
  // loading: GameLoader,
  debug: false,
});

class GameWrapper extends React.Component {
  render(): React.ReactNode {
    return (
      <React.Fragment>
        <Client playerID="0" matchID={uuid()} />
      </React.Fragment>
    );
  }
}

export default GameWrapper;
