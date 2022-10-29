import { useEffectListener } from 'bgio-effects/react';
import { Ctx } from 'boardgame.io';
import React, { ReactElement, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, GameState, PlayerID } from '../../interfaces';
import { showCardModal } from '../card-modal/card-modal.slice';

interface ReactZoneSlot {
  data?: Card;
  onClick: (card: Card) => void;
  zoneNumber: number;
  zoneRef: any;
  slotIndex: number;
  player: PlayerID;
}

export const PlayerZoneSlot = ({
  data,
  zoneNumber,
  zoneRef,
  slotIndex,
  player,
  onClick,
}: ReactZoneSlot): ReactElement => {
  const dispatch = useDispatch();
  const [objData, setObjData] = useState<Card | null>(null);
  const [incoming, setIncoming] = useState<boolean>(false);

  useEffect(() => {
    if (zoneRef[player]?.length && zoneRef[player][slotIndex]) {
      const ref = zoneRef[player][slotIndex].revealed;
      if (!ref) setIncoming(true);
    }
  }, [zoneRef]);

  useEffect(() => {
    if (data?.revealed) {
      setObjData(data);
      setIncoming(false);
    }
  }, [data]);

  const getAnimationDirection = (zoneNumber: number): string => {
    const scaleEnd = player === '1' ? 'scale(1, -1)' : 'scale(1)';
    const scaleStart = player === '1' ? 'scale(5, -5)' : 'scale(5)';
    const translateStart0 =
      player === '1' ? 'translate(-50%, -50%)' : 'translate(-50%, 50%)';
    const translateStart1 =
      player === '1' ? 'translate(0, -100%)' : 'translate(0, 100%)';
    const translateStart2 =
      player === '1' ? 'translate(50%, -50%)' : 'translate(50%, 50%)';

    switch (zoneNumber) {
      case 0:
        return objData
          ? `${scaleEnd} translate(0,0)`
          : `${scaleStart} ${translateStart0}`;
      case 1:
        return objData
          ? `${scaleEnd} translate(0,0)`
          : `${scaleStart} ${translateStart1}`;
      case 2:
        return objData
          ? `${scaleEnd} translate(0,0)`
          : `${scaleStart} ${translateStart2}`;
      default:
        return '';
    }
  };

  const onUnrevealedClick = () => {
    if (!incoming) return;
    return dispatch(showCardModal(zoneRef[player][slotIndex]));
  }

  // if (G?.ZonesCardsReference[zoneNumber]['0'][slotIndex]) {
  // if (objData?.revealed === false) {
  if (incoming) {
    return (
      <div
      onClick={onUnrevealedClick}
      style={{
        height: '3.5em',
        width: '2.75em',
        transition: '100ms ease-in',
        opacity: 0.65,
        border: '1px solid orange',
        borderRadius: '1.25em 1.25em 0 0',
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
          {zoneRef[player][slotIndex]?.currentCost}
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
          {zoneRef[player][slotIndex]?.displayPower}
        </div>
        <div style={{ fontSize: '0.5em' }}>{zoneRef[player][slotIndex]?.name}</div>
      </div>
    </div>
      // <div
      //   onClick={onUnrevealedClick}
      //   style={{
      //     height: '3.5em',
      //     width: '2.75em',
      //     transition: '150ms ease-in',
      //     opacity: '1',
      //     // transform: getAnimationDirection(zoneNumber),
      //     transitionDelay: '',
      //     // filter: objData ? 'blur(0)' : 'blur(1px)'
      //   }}
      // >
      //   <div
      //     style={{
      //       display: 'flex',
      //       flexFlow: 'column nowrap',
      //       alignItems: 'center',
      //       justifyContent: 'center',
      //       padding: '0.25em',
      //       textAlign: 'center',
      //       position: 'relative',
      //       border: '1px solid black',
      //       borderRadius: '0.25em',
      //       background: '#ccc',
      //       height: '100%',
      //       width: '100%',
      //     }}
      //   ></div>
      // </div>
    );
  }

  return (
    <div
      onClick={() => objData && dispatch(showCardModal(objData))}
      style={{
        height: '3.5em',
        width: '2.75em',
        transition: '250ms ease-in',
        opacity: objData ? '1' : '0',
        transform: getAnimationDirection(zoneNumber),
        transitionDelay: objData?.revealed ? `${slotIndex * 100}ms` : '0ms',
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
