import React from 'react';
import { Card as CardProps } from '../../game';

export interface ReactCardProps extends CardProps {
  isSelected: boolean;
  onClick?: (card: CardProps) => void;
}

export const Card = ({
  isSelected,
  onClick,
  ...card
}: ReactCardProps): React.ReactElement => {
  const { canPlay, cost, name, power, uuid } = card;
  const [cardData, setCardData] = React.useState<CardProps | undefined>(undefined);

  React.useEffect(() => {
    setTimeout(() => setCardData(card), 50);
  }, [card]);

  return (
    <div
      // onClick={() => onClick(card)}
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
        height: '3.5em',
        width: '2.45em',
        transition: '75ms ease-in',
        pointerEvents: 'none',
        transform: cardData ? 'translate3d(0px, 0px, 0px) scale(100%)' : 'scale(160%) translate3d(100px, -50px, 0px)',
        // zIndex: isSelected ? '1' : 'auto'
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
