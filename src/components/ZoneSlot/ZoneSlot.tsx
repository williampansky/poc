import { Ctx } from 'boardgame.io';
import React, { ReactElement } from 'react';
import { Card, GameState, Minion } from '../../interfaces';

interface ReactZoneSlot {
  data?: Minion;
  onClick: (card: Minion) => void;
}

export const ZoneSlot = ({ data, onClick }: ReactZoneSlot): ReactElement => {
  const [objData, setObjData] = React.useState<Minion | undefined>(undefined);

  React.useEffect(() => {
    setTimeout(() => setObjData(data), 50);
  }, [data]);

  if (objData?.revealed === false) {
    return (
      <div
        style={{
          height: '3.5em',
          width: '2.75em',
          transition: '150ms ease-in',
          opacity: objData ? '1' : '0',
          transform: objData ? 'scale(100%)' : 'scale(200%)',
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
        >
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => data && onClick(data)}
      style={{
        height: '3.5em',
        width: '2.75em',
        transition: '150ms ease-in',
        opacity: objData ? '1' : '0',
        transform: objData ? 'scale(100%)' : 'scale(200%)',
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
          borderRadius: '1.25em 1.25em 0 0',
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
          {objData?.currentCost}
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
          {objData?.displayPower}
        </div>
        <div style={{ fontSize: '0.5em' }}>{objData?.name}</div>
      </div>
    </div>
  );
};
