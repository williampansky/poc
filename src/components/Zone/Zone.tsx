import { Ctx, MoveMap } from 'boardgame.io';
import React, { ReactElement } from 'react';
import {
  Card,
  config,
  GameState,
  Minion,
  Zone as ZoneProps,
} from '../../interfaces';
import { ZoneSlot } from '../ZoneSlot/ZoneSlot';
import { ZoneDropSlot } from '../ZoneDropSlot/ZoneDropSlot';

interface ReactZone {
  G: GameState;
  ctx: Ctx;
  moves: any;
  disabled: boolean;
  zone: ZoneProps;
  zoneNumber: number;
  onCardClick: (obj: Minion) => void;
}

export const Zone = ({
  G,
  ctx,
  moves,
  disabled,
  zone,
  zoneNumber,
  onCardClick,
}: ReactZone): ReactElement => {
  const { playCard } = moves;

  // const handleZoneDropEvent = React.useCallback(
  //   (e: any) => {
  //     e.persist();
  //     e.preventDefault();
  //     console.log(e)
  //     return moves.playCard('0', zoneNumber);
  //   },
  //   [playCard]
  // );

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
        opacity: disabled ? 0.5 : 1,
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
        }}
      >
        {zone?.sides[1].map((obj: Minion, idx: number) => {
          return <ZoneSlot key={idx} data={obj} onClick={onCardClick} />;
        })}
        {[
          ...Array.from(
            Array(
              config.gameConfig.numberOfSlotsPerZone - zone?.sides[1].length
            )
          ),
        ].map((_, idx: number) => {
          return <div key={idx} />;
        })}
      </div>
      <div
        style={{
          position: 'relative',
          height: '8em',
          width: '8em',
          borderRadius: '50%',
          background: 'gray',
          margin: '0.5em auto 0.5em',
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
            <div>{G.turn === 1 && zoneNumber === 1 ? '1 turn' : '2 turns'}</div>
          </div>
        )}

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
          {zone?.powers[1]}
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
          {zone?.powers[0]}
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
        <ZoneDropSlot
          G={G}
          moves={moves}
          isActive={
            ctx.currentPlayer === '0' &&
            G.selectedCardData['0'] !== undefined &&
            zone?.sides['0'].length !== config.gameConfig.numberOfSlotsPerZone &&
            !zone?.disabled['0'] &&
            G.players['0'].actionPoints >= G.selectedCardData['0']?.currentCost
          }
          playerId='0'
          zoneNumber={zoneNumber}
          onMouseUp={(e: any) => handleZoneDropEvent(e)}
        />
        <div
          style={{
            display: 'grid',
            gridTemplate: `repeat(3, 3.5em) / repeat(${
              zone?.sides[0].length === 1 ? '2' : '2'
            }, 2.75em)`,
            gridGap: '0.3em',
          }}
        >
          {zone?.sides[0].map((obj: Minion, idx: number) => {
            return <ZoneSlot key={idx} data={obj} onClick={onCardClick} />;
          })}
        </div>
      </div>
    </div>
  );
};
