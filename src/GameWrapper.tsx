import React from 'react';
import { Client as BoardgameClient } from 'boardgame.io/react';
import { EffectsBoardWrapper } from 'bgio-effects/react';
import { Local } from 'boardgame.io/multiplayer';
import { MCTSBot } from 'boardgame.io/ai';
import { BcgPoc } from './game';
import { Board } from './Board';
import { v4 as uuid } from 'uuid';

// @todo figure out better solution here
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: any;
  }
}

const REDUX_DEVTOOLS =
  typeof window !== undefined &&
  window.__REDUX_DEVTOOLS_EXTENSION__ &&
  window.__REDUX_DEVTOOLS_EXTENSION__();

const Client = BoardgameClient({
  game: BcgPoc,
  board: EffectsBoardWrapper(Board, { updateStateAfterEffects: true }),
  multiplayer: Local({ bots: { 1: MCTSBot }, persist: false, storageKey: 'bgio' }),
  numPlayers: 1,
  // loading: GameLoader,
  debug: false,
  enhancer: REDUX_DEVTOOLS
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
