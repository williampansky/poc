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
        {zone.opponentSide.map((card: Card, idx: number) => {
          return <ZoneSlot key={idx} card={card} />;
        })}
        {[...Array.from(Array(4 - zone.opponentSide.length))].map((_, idx: number) => {
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
        }}
      >
        Zone {zoneNumber}
        <div style={{
          position: 'absolute',
          top: -6, right: 'auto', bottom: 'auto', left: 'auto',
          display: 'flex',
          flexFlow: 'column nowrap',
          alignItems: 'center',
          justifyContent: 'center',
          background: zone.opponentPower > zone.playerPower ? 'yellow' : 'black',
          color: zone.opponentPower > zone.playerPower ? 'black' : 'white',
          borderRadius: '50%',
          height: '1.5em', width: '1.5em',
        }}>{zone.opponentPower}</div>
        <div style={{
          position: 'absolute',
          top: 'auto', right: 'auto', bottom: -6, left: 'auto',
          display: 'flex',
          flexFlow: 'column nowrap',
          alignItems: 'center',
          justifyContent: 'center',
          background: zone.playerPower > zone.opponentPower ? 'yellow' : 'black',
          color: zone.playerPower > zone.opponentPower ? 'black' : 'white',
          borderRadius: '50%',
          height: '1.5em', width: '1.5em',
        }}>{zone.playerPower}</div>
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
            G.playerSelectedCard !== undefined &&
            zone.playerSide.length !== 4 &&
            !zone.disabled &&
            !zone.disabledForPlayer &&
            G.playerActionPoints >= G.playerSelectedCard?.cost
          }
          playerId='0'
          zone={zoneNumber}
        />
        <div
          style={{
            display: 'grid',
            gridTemplate: `repeat(2, 3.5em) / repeat(${zone.playerSide.length === 1 ? '2' : '2'}, 2.75em)`,
            gridGap: '0.3em',
          }}
        >
          {zone.playerSide.map((card: Card, idx: number) => {
            return <ZoneSlot key={idx} card={card} />;
          })}
        </div>
      </div>
    </div>
  );
};
