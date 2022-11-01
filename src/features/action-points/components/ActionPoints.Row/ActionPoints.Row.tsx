import type { ReactElement } from 'react';
import styles from './action-points-row.module.scss';

interface ActionPointsRowComponent {
  current: number;
  total: number;
  playerIdContext?: string;
}

export const ActionPointsRow = ({
  current,
  total,
  playerIdContext,
}: ActionPointsRowComponent): ReactElement => {
  return (
    <div className={styles['wrapper']}>
      <div
        className={styles['component']}
        style={{
          gridTemplateColumns: `repeat(${total}, 1fr)`,
        }}
      >
        {Array.from(Array(total)).map((_, idx) => {
          idx = idx + 1;
          return (
            <div
              key={idx}
              data-index={idx}
              className={[
                styles['slot'],
                current >= idx ? styles['filled'] : styles['empty'],
              ].join(' ')}
            >
              {idx}
            </div>
          );
        })}
      </div>
    </div>
  );
};
