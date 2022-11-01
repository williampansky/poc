import type { ReactElement } from 'react';
import { useSelector } from 'react-redux';

import { PlayerID } from '../../../../interfaces';

import type { RootState } from '../../../../store';
import { ActionPointsRow } from '../ActionPoints.Row';

import styles from './action-points-wrapper.module.scss';

interface ActionPointsComponent {
  player: PlayerID | string | null;
  opponent?: PlayerID;
  playerIdContext?: string;
}

export const ActionPoints = ({
  player,
  opponent,
  playerIdContext,
}: ActionPointsComponent): ReactElement => {
  const ap = useSelector((state: RootState) => state.actionPoints);

  if (player === null) return <div />

  return (
    <ActionPointsRow
      current={ap[player].current}
      total={ap[player].total}
      playerIdContext={playerIdContext}
    />
  );
};
