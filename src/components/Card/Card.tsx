import { ReactElement } from 'react';
import { Card as CardProps } from '../../game';

export interface ReactCardProps extends CardProps {
  isSelected: boolean;
  onClick: (uuid: string) => void;
}

export const Card = ({
  isSelected,
  onClick,
  ...card
}: ReactCardProps): ReactElement => {
  const { canPlay, cost, name, power, uuid } = card;

  return (
    <div
      onClick={() => onClick(uuid)}
      style={{
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0.25em',
        textAlign: 'center',
        position: 'relative',
        border: '1px solid',
        borderColor: canPlay ? 'violet' : 'gray',
        boxShadow: canPlay ? '0px 0px 0px 2px rgb(238, 130, 238)' : '0px 0px 0px 0px transparent',
        borderRadius: '0.25em',
        background: 'white',
        height: '4em',
        width: '2.95em',
        transition: '100ms ease-in',
        transform: isSelected ? 'scale(160%) translateY(-0.65em)' : 'scale(80%)',
        zIndex: isSelected ? '1' : 'auto'
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
        {cost}
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
        {power}
      </div>
      <div style={{ fontSize: '0.5em' }}>{name}</div>
    </div>
  );
};