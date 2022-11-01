import type { ReactElement } from 'react';
import styles from './zone-name.module.scss';

interface ZoneNameComponent {
  name: string;
  powerText?: string;
}

export const ZoneName = ({
  name,
  powerText,
}: ZoneNameComponent): ReactElement => {
  return (
    <div className={styles['component']}>
      <div className={styles['zone-name']}>{name}</div>
      {powerText && (
        <div className={styles['zone-power-text']}>{powerText}</div>
      )}
    </div>
  );
};
