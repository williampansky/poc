import { Ctx } from 'boardgame.io';
import { ReactElement } from 'react';
import { Card, GameState } from '../../game';

interface ReactZoneSlot {
  card?: Card;
}

export const ZoneSlot = ({ card }: ReactZoneSlot): ReactElement => {
  if (card) {
    return (
      <div style={{
        height: '3.5em', width: '2.75em'
      }}>
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
            background: 'white',
            height: '100%',
            width: '100%',
            transform: 'scale(95%)',
          }}
        >
          <div
            style={{
              fontSize: '0.85em',
              fontWeight: 'bold',
              display: 'flex',
              flexFlow: 'column nowrap',
              alignItems: 'center',
              justifyContent: 'center',
              height: '1.195em',
              width: '1.15em',
              position: 'absolute',
              top: '-0.35em',
              right: 'auto',
              bottom: 'auto',
              left: '-0.35em',
              background: 'lightgreen',
              borderRadius: '50%',
            }}
          >
            {card.cost}
          </div>
          <div
            style={{
              fontSize: '0.85em',
              fontWeight: 'bold',
              display: 'flex',
              flexFlow: 'column nowrap',
              alignItems: 'center',
              justifyContent: 'center',
              height: '1.195em',
              width: '1.15em',
              position: 'absolute',
              top: '-0.35em',
              right: '-0.35em',
              bottom: 'auto',
              left: 'auto',
              color: 'white',
              background: 'red',
              borderRadius: '50%',
            }}
          >
            {card.power}
          </div>
          <div style={{ fontSize: '0.5em' }}>{card.name}</div>
        </div>
      </div>
    );
  }

  return <></>;
};
