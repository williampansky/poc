import { Ctx, MoveMap } from 'boardgame.io';
import React, { ReactElement, useEffect } from 'react';
import { ZoneSlot } from '../ZoneSlot/ZoneSlot';
import { animated } from 'react-spring';
import { GameState } from '../../interfaces';

interface ReactZone {
  // G: GameState;
  // moves: any;
  isActive: boolean;
  zoneNumber: number;
  // onMouseUp: any;
}

export const ZoneDropSlot = ({
  // G,
  // moves,
  isActive,
  zoneNumber,
  // onMouseUp,
}: ReactZone): ReactElement => {

  return (
    <React.Fragment>
      <div
        data-drop
        style={{
          boxSizing: 'border-box',
          position: 'absolute',
          top: 'auto',
          right: 0,
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100%',
          outline: 'none',
          borderWidth: '2px',
          borderStyle: 'dotted',
          borderColor: 'red',
          transition: '150ms ease-in',
          zIndex: isActive ? 1 : -1,
          opacity: isActive ? 0.5 : 0,
          willChange: 'border-style, opacity, pointer-events',
          overflow: 'hidden',
          display: 'flex',
          flexFlow: 'column nowrap',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          touchAction: 'none',
        }}
      />
      <div
        role='button'
        tabIndex={0}
        data-receive={true}
        data-index={zoneNumber}
        style={{
          boxSizing: 'border-box',
          position: 'absolute',
          top: 'auto',
          right: 0,
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100%',
          outline: 'none',
          border: 'none',
          opacity: 0,
          pointerEvents: isActive ? 'auto' : 'none',
          zIndex: 101,
          overflow: 'hidden',
          display: 'flex',
          flexFlow: 'column nowrap',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          touchAction: 'none',
          willChange: 'pointer-events',
        }}
      />
    </React.Fragment>
  );
};
