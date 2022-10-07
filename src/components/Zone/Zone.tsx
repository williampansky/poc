import { Ctx, MoveMap } from 'boardgame.io';
import { ReactElement } from 'react';
import { Card, GameState, Zone as ZoneProps } from '../../game';
import { ZoneSlot } from '../ZoneSlot/ZoneSlot';
import { ZoneDropSlot } from '../ZoneDropSlot/ZoneDropSlot';

interface ReactZone {
  G: GameState;
  ctx: Ctx;
  moves: MoveMap;
  disabled: boolean;
  zone: ZoneProps;
  zoneNumber: number;
}

export const Zone = ({
  G,
  ctx,
  moves,
  disabled,
  zone,
  zoneNumber,
}: ReactZone): ReactElement => {
  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        fontSize: '14px',
        margin: '0 0.35em',
        opacity: disabled ? 0.5 : 1,
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
        {zone?.opponentSide.map((card: Card, idx: number) => {
          return <ZoneSlot key={idx} card={card} />;
        })}
        {[...Array.from(Array(6 - zone?.opponentSide.length))].map(
          (_, idx: number) => {
            return <div key={idx} />;
          }
        )}
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
        <div
          style={{
            fontSize: '9px',
            fontStyle: 'italic',
            letterSpacing: '-0.15px'
          }}
        >
          {zone?.zoneName}
        </div>
        <div
          style={{
            marginTop: '0.25em',
            fontSize: '12px',
            fontWeight: 'bold',
            lineHeight: '0.875'
          }}
        >
          {zone?.zonePowerText}
        </div>
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
            background:
              zone?.opponentPower > zone?.playerPower ? 'yellow' : 'black',
            color: zone?.opponentPower > zone?.playerPower ? 'black' : 'white',
            borderRadius: '50%',
            height: '1.5em',
            width: '1.5em',
            border: '2px solid white',
            boxSizing: 'content-box',
          }}
        >
          {zone?.opponentPower}
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
            background:
              zone?.playerPower > zone?.opponentPower ? 'yellow' : 'black',
            color: zone?.playerPower > zone?.opponentPower ? 'black' : 'white',
            borderRadius: '50%',
            height: '1.5em',
            width: '1.5em',
            border: '2px solid white',
            boxSizing: 'content-box',
          }}
        >
          {zone?.playerPower}
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
          moves={moves}
          isActive={
            ctx.currentPlayer === '0' &&
            G.selectedCard[0]?.data !== undefined &&
            zone?.playerSide.length !== 6 &&
            !zone?.disabled &&
            !zone?.disabledForPlayer &&
            G.playerActionPoints >= G.selectedCard[0]?.data?.cost
          }
          playerId='0'
          zone={zoneNumber}
        />
        <div
          style={{
            display: 'grid',
            gridTemplate: `repeat(3, 3.5em) / repeat(${
              zone?.playerSide.length === 1 ? '2' : '2'
            }, 2.75em)`,
            gridGap: '0.3em',
          }}
        >
          {zone?.playerSide.map((card: Card, idx: number) => {
            return <ZoneSlot key={idx} card={card} />;
          })}
        </div>
      </div>
    </div>
  );
};
