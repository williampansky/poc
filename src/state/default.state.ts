import { Config } from "../game.config";
import createZoneObject from "../utilities/create-zone-object";
import ActionPoints from "./action-points.state";
import Counts from "./counts.state";
import FirstRevealer from "./first-revealer.state";
import PlayedCards from "./played-cards.state";
import PlayerNames from "./player-names.state";
import PlayerTurnDone from "./player-turn-done.state";
import SelectedCardData from "./selected-card-data.state";
import SelectedCardIndex from "./selected-card-index.state";
import Zones from "./zones.state";

const DefaultState = {
  turn: 0,
    ActionPoints: ActionPoints.defaultState,
    Counts: Counts.defaultState,
    Config: Config,
    PlayerTurnDone: PlayerTurnDone.defaultState,
    FirstRevealer: FirstRevealer.defaultState,

    players: {
      '0': {
        deck: [],
        hand: [],
      },
      '1': {
        deck: [],
        hand: [],
      },
    },

    PlayerNames: PlayerNames.defaultState,
    SelectedCardData: SelectedCardData.defaultState,
    SelectedCardIndex: SelectedCardIndex.defaultState,
    PlayedCards: PlayedCards.defaultState,
    Zones: Zones.defaultState,

    ZonesAreActive: {
      '0': false,
      '1': false,
    },

    ZonesCardsReference: [
      ...Array.from(Array(Config.gameConfig.numberOfZones)).map(() => {
        return { '0': [], '1': [] };
      }),
    ],

    
    
};

export default DefaultState;
