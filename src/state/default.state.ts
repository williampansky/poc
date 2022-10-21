import { config } from "../interfaces";
import createZoneObject from "../utilities/create-zone-object";
import Counts from "./counts.state";
import FirstRevealer from "./first-revealer.state";
import PlayedCards from "./played-cards.state";
import PlayerTurnDone from "./player-turn-done.state";
import SelectedCardData from "./selected-card-data.state";
import SelectedCardIndex from "./selected-card-index.state";

const DefaultState = {
  turn: 0,
    PlayerTurnDone: PlayerTurnDone.defaultState,
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

    SelectedCardData: SelectedCardData.defaultState,
    SelectedCardIndex: SelectedCardIndex.defaultState,

    PlayedCards: PlayedCards.defaultState,

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
