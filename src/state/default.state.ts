import { config } from "../interfaces";
import createZoneObject from "../utilities/create-zone-object";
import Counts from "./counts.state";
import FirstRevealer from "./first-revealer.state";
import PlayerTurnDone from "./player-turn-done.state";

const DefaultState = {
  turn: 0,
    PlayerTurnDone: PlayerTurnDone.defaultState,

    revealed: {
      '0': false,
      '1': false,
    },
    FirstRevealer: FirstRevealer.defaultState,

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

    selectedCardData: {
      '0': undefined,
      '1': undefined,
    },

    selectedCardIndex: {
      '0': undefined,
      '1': undefined,
    },

    playedCards: {
      '0': [],
      '1': [],
    },

    zones: [
      ...Array.from(Array(config.gameConfig.numberOfZones)).map(() => {
        return createZoneObject({
          id: '',
          name: '',
        });
      }),
    ],

    ZonesCardsReference: [
      ...Array.from(Array(config.gameConfig.numberOfZones)).map(() => {
        return { '0': [], '1': [] };
      }),
    ],

    config: config,
    Counts: Counts.defaultState,
    cardDrag: null,
};

export default DefaultState;
