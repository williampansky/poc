import { Ctx, MoveMap } from 'boardgame.io';
import { ReactElement } from 'react';
import { GameState, Zone as ZoneProps } from '../../game';
import { ZoneSlot } from '../ZoneSlot/ZoneSlot';

interface ReactZone {
  moves: any;
  isActive: boolean;
  playerId: string;
  zone: number;
}

export const ZoneDropSlot = ({
  moves,
  isActive,
  playerId,
  zone,
}: ReactZone): ReactElement => {
  return (
    <div
      onClick={() => moves.playCard(playerId, zone)}
      style={{
        position: 'absolute',
        top: 0, right: 0, bottom: 0, left: 0, zIndex: 100,
        width: '100%',
        height: '100%',
        border: '2px dotted green',
        opacity: isActive ? 1 : 0,
        pointerEvents: isActive ? 'auto' : 'none'
      }}
    />
  );
};
