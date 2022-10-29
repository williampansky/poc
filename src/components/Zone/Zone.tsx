import { Ctx, MoveMap } from 'boardgame.io';
import React, { ReactElement, useEffect, useState } from 'react';
import {
  Card,
  GameState,
  Zone as ZoneProps,
} from '../../interfaces';
import { ZoneSlot } from '../ZoneSlot/ZoneSlot';
import { ZoneDropSlot } from '../../features/zones/ZoneSlot.Drop';
import { usePrevious } from '../../hooks';
import type { RootState } from '../../store'
import { useSelector, useDispatch } from 'react-redux'

interface ReactZone {
  // G: GameState;
  ctx: Ctx;
  moves: any;
  // disabled: boolean;
  // zone: ZoneProps;
  zoneNumber: number;
  player: string;
  onCardClick: (obj: Card) => void;
}

export const Zone = ({
  // G,
  ctx,
  moves,
  // disabled,
  // zone,
  zoneNumber,
  onCardClick,
  player,
}: ReactZone): ReactElement => {
  // const { powers } = zone;
  const { playCard } = moves;

  const zones = useSelector((state: RootState) => state.zones);
  const zone = zones[zoneNumber];
  const powers = zones[zoneNumber]?.powers;
  const [zoneLeader, setZoneLeader] = useState<string | undefined>(undefined);
  const [zonePowers, setZonePowers] = useState({ '0': 0, '1': 0 });
  const prevZonePowers = usePrevious({ '0': 0, '1': 0 });

  useEffect(() => {
    setZonePowers({
      '0': powers['0'],
      '1': powers['1']
    });
  }, [powers]);

  useEffect(() => {
    if (powers['0'] > powers['1']) {
      setZoneLeader('0')
    } else if (powers['1'] > powers['0']) {
      setZoneLeader('1')
    } else {
      setZoneLeader(undefined)
    }
  }, [powers]);

  const handleZoneDropEvent = (e: any) => {
    // e.preventDefault();
    console.log(e);
    return moves.playCard('0', zoneNumber);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        fontSize: '14px',
        margin: '0 0.35em',
        opacity: zone?.disabled[player] ? 0.5 : 1,
        position: 'relative',
      }}
    >
      <div
        className='opponentZone'
        style={{
          display: 'grid',
          gridGap: '0.3em',
          flexFlow: 'column nowrap',
          alignItems: 'center',
          justifyContent: 'center',
          gridTemplate: `repeat(3, 3.5em) / repeat(${
            zone?.sides[0].length === 1 ? '2' : '2'
          }, 2.75em)`,
          transform: 'scaleY(-1)'
        }}
      >
        {/* {zone?.sides[1].map((obj: Card, idx: number) => {
          return (
            <ZoneSlot
              key={idx}
              data={obj}
              onClick={onCardClick}
              zoneNumber={zoneNumber}
              slotIndex={idx}
              playerId={'1'}
            />
          );
        })} */}
        {[...Array.from(Array(6))].map((_, idx: number) => {
          return (
            <ZoneSlot
              key={idx}
              // data={obj}
              onClick={onCardClick}
              zoneNumber={zoneNumber}
              slotIndex={idx}
              playerId={'1'}
            />
          );
        })}
        {/* {[
          ...Array.from(
            Array(
              G.Config.gameConfig.numberOfSlotsPerZone - zone?.sides[1].length
            )
          ),
        ].map((_, idx: number) => {
          return <div key={idx} />;
        })} */}
      </div>
      <div
        style={{
          position: 'relative',
          height: '8em',
          width: '8em',
          borderRadius: '50%',
          background: 'gray',
          margin: '1em auto',
          display: 'flex',
          flexFlow: 'column nowrap',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0.5em',
        }}
      >
        {zone && zone.revealed ? (
          <React.Fragment>
            <div
              style={{
                fontSize: '9px',
                fontStyle: 'italic',
                letterSpacing: '-0.15px',
              }}
            >
              {zone?.name}
            </div>
            <div
              style={{
                marginTop: '0.25em',
                fontSize: '12px',
                fontWeight: 'bold',
                lineHeight: '0.875',
              }}
            >
              {zone?.powerText}
            </div>
          </React.Fragment>
        ) : (
          <div
            style={{
              marginTop: '0.25em',
              fontSize: '12px',
              fontStyle: 'italic',
              fontWeight: 'normal',
              lineHeight: '0.925',
            }}
          >
            <div>Reveals in</div>
            {/* <div>{G.turn === 1 && zoneNumber === 1 ? '1 turn' : '2 turns'}</div> */}
          </div>
        )}

        <div style={{
          position: 'absolute',
          top: 0, right: 0, bottom: 0, left: 0,
          height: '100%', width: '100%',
          borderTopWidth: '2px',
          borderTopStyle: 'solid',
          borderTopColor: 'yellow',
          borderBottomWidth: '2px',
          borderBottomStyle: 'solid',
          borderBottomColor: 'transparent',
          borderRadius: '50%',
          opacity: zoneLeader ? '1' : '0',
          transform: `scale(${zoneLeader ? '1' : '0'}) rotate(${zoneLeader === '1' ? '0deg' : '180deg'})`,
          transition: '200ms ease-in-out',
        }}></div>

        <div
          style={{
            fontSize: '1em',
            fontWeight: 'bold',
            position: 'absolute',
            top: -8,
            right: 'auto',
            bottom: 'auto',
            left: 'auto',
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'center',
            justifyContent: 'center',
            background: zone?.powers[1] > zone?.powers[0] ? 'yellow' : 'black',
            color: zone?.powers[1] > zone?.powers[0] ? 'black' : 'white',
            borderRadius: '50%',
            height: '1.5em',
            width: '1.5em',
            border: '2px solid white',
            boxSizing: 'content-box',
          }}
        >
          {zonePowers['1']}
        </div>
        <div
          style={{
            fontSize: '1em',
            fontWeight: 'bold',
            position: 'absolute',
            top: 'auto',
            right: 'auto',
            bottom: -8,
            left: 'auto',
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'center',
            justifyContent: 'center',
            background: zone?.powers[0] > zone?.powers[1] ? 'yellow' : 'black',
            color: zone?.powers[0] > zone?.powers[1] ? 'black' : 'white',
            borderRadius: '50%',
            height: '1.5em',
            width: '1.5em',
            border: '2px solid white',
            boxSizing: 'content-box',
          }}
        >
          {zonePowers['0']}
        </div>
      </div>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexFlow: 'column nowrap',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* <ZoneDropSlot
          G={G}
          moves={moves}
          isActive={
            ctx.phase === 'playCards' &&
            G.SelectedCardData['0'] !== undefined &&
            zone?.sides['0'].length !==
              G.Config.gameConfig.numberOfSlotsPerZone &&
            !zone?.disabled['0'] &&
            G.ActionPoints['0'].current >= G.SelectedCardData['0']?.currentCost
          }
          playerId='0'
          zoneNumber={zoneNumber}
          onMouseUp={(e: any) => handleZoneDropEvent(e)}
        /> */}
        <div
          style={{
            display: 'grid',
            gridTemplate: `repeat(3, 3.5em) / repeat(${
              zone?.sides[0].length === 1 ? '2' : '2'
            }, 2.75em)`,
            gridGap: '0.3em',
          }}
        >
          {/* {zone?.sides[0].map((obj: Card, idx: number) => {
            return (
              <ZoneSlot
                key={idx}
                data={obj}
                onClick={onCardClick}
                zoneNumber={zoneNumber}
                slotIndex={idx}
                playerId={'0'}
              />
            );
          })} */}
          {/* {[...Array.from(Array(6))].map((_, idx: number) => {
            return (
              <ZoneSlot
                G={G}
                key={idx}
                // data={obj}
                onClick={onCardClick}
                zoneNumber={zoneNumber}
                slotIndex={idx}
                playerId={'0'}
              />
            );
          })} */}
          {/* {G.ZonesCardsReference[zoneNumber]['0']?.map(
            (obj: Card, idx: number) => {
              return !obj.revealed && zone.sides['0'][idx] === undefined ? (
                <div
                  key={idx}
                  style={{
                    height: '3.5em',
                    width: '2.75em',
                    transition: '150ms ease-in',
                    opacity: '1',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexFlow: 'column nowrap',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '0.25em',
                      textAlign: 'center',
                      position: 'relative',
                      border: '1px solid black',
                      borderRadius: '0.25em',
                      background: '#ccc',
                      height: '100%',
                      width: '100%',
                    }}
                  ></div>
                </div>
              ) : null;
            }
          )} */}
        </div>
      </div>
    </div>
  );
};
