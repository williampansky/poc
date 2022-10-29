import { Ctx, MoveMap } from 'boardgame.io';
import React, { ReactElement, useEffect, useState } from 'react';
import { Card, GameState, Zone as ZoneProps } from '../../interfaces';
// import { ZoneSlot } from '../ZoneSlot/ZoneSlot';
// import { ZoneDropSlot } from '../ZoneDropSlot/ZoneDropSlot';
import { usePrevious } from '../../hooks';
import type { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { Zone } from './Zone.Component';
import { useLatestPropsOnEffect } from 'bgio-effects/react';
import { initZone } from './zones.slice';
import { updateZonesRef } from './zones-ref.slice';

interface ReactZones {
  // G: GameState;
  // ctx: Ctx;
  // moves: any;
  // disabled: boolean;
  // zone: ZoneProps;
  // zoneNumber: number;
  player: string;
  opponent: string;
  // onCardClick: (obj: Card) => void;
}

export const Zones = ({ player, opponent }: ReactZones): ReactElement => {
  // const { powers } = zone;
  // const { playCard } = moves;

  const dispatch = useDispatch();
  const { G, ctx } = useLatestPropsOnEffect('effects:end');
  const zones = useSelector((state: RootState) => state.zones);
  const zonesRef = useSelector((state: RootState) => state.zonesRef);

  useEffect(() => {
    G.Zones.forEach((z: ZoneProps, i: number) => {
      if (z.revealed) dispatch(initZone({
        zoneData: G.Zones[i],
        zoneNumber: i
      }))
    })
  }, [G.Zones]);

  useEffect(() => {
    dispatch(updateZonesRef(G.ZonesCardsReference));
  }, [G.ZonesCardsReference]);

  // useEffect(() => {
  //   console.log(G)
  // }, [G]);

  return (
    <>
      {zones.map((zone: ZoneProps, idx: number) => {
        return (
          <Zone
            // G={G}
            // ctx={ctx}
            // moves={moves}
            // disabled={zone.disabled[0]}
            zone={zone}
            zoneNumber={idx}
            zonesAreActive={G.ZonesAreActive[player]}
            zoneRef={zonesRef[idx]}
            key={idx}
            // onCardClick={onCardClick}
            player={player}
            opponent={opponent}
          />
        );
      })}
    </>
  );
};
