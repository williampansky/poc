import { Ctx, PlayerID } from 'boardgame.io';
import React, { ReactElement } from 'react';
import { Card, GameState, Minion } from '../../interfaces';

interface ReactZoneSlot {
  data?: Minion;
  onClick: (card: Minion) => void;
  zoneNumber: number;
  slotIndex: number;
  playerId: PlayerID;
}

export const ZoneSlot = ({
  data,
  onClick,
  zoneNumber,
  slotIndex,
  playerId,
}: ReactZoneSlot): ReactElement => {
  const [objData, setObjData] = React.useState<Minion | undefined>(undefined);

  React.useEffect(() => {
    setTimeout(() => setObjData(data), 50);
  }, [data]);

  const getAnimationDirection = (zoneNumber: number): string => {
    const scaleEnd = playerId === '1' ? 'scale(1, -1)' : 'scale(1)';
    const scaleStart = playerId === '1' ? 'scale(5, -5)' : 'scale(5)';
    const translateStart0 = playerId === '1' ? 'translate(-50%, -50%)' : 'translate(-50%, 50%)';
    const translateStart1 = playerId === '1' ? 'translate(0, -100%)' : 'translate(0, 100%)';
    const translateStart2 = playerId === '1' ? 'translate(50%, -50%)' : 'translate(50%, 50%)';

    switch (zoneNumber) {
      case 0:
        return objData ? `${scaleEnd} translate(0,0)` : `${scaleStart} ${translateStart0}`;
      case 1:
        return objData ? `${scaleEnd} translate(0,0)` : `${scaleStart} ${translateStart1}`;
      case 2:
        return objData ? `${scaleEnd} translate(0,0)` : `${scaleStart} ${translateStart2}`;
      default:
        return '';
    }
  };

  if (objData?.revealed === false) {
    return (
      <div
        style={{
          height: '3.5em',
          width: '2.75em',
          transition: '150ms ease-in',
          opacity: objData ? '1' : '0',
          transform: getAnimationDirection(zoneNumber),
          transitionDelay: objData ? '' : ''
          // filter: objData ? 'blur(0)' : 'blur(1px)'
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
    );
  }

  return (
    <div
      onClick={() => data && onClick(data)}
      style={{
        height: '3.5em',
        width: '2.75em',
        transition: '250ms ease-in',
        opacity: objData ? '1' : '0',
        transform: getAnimationDirection(zoneNumber),
        transitionDelay: objData?.revealed ? `${slotIndex * 100}ms` : '0ms'
        // filter: objData ? 'blur(0)' : 'blur(1px)'
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
