import { Ctx } from 'boardgame.io';
import React, { ReactElement } from 'react';
import { Card, GameState } from '../../game';

interface CardInspectionProps {
  card?: Card;
  onClick: () => void
}

export const CardInspectionModal = ({ card, onClick }: CardInspectionProps): ReactElement => {
  const [cardData, setCardData] = React.useState<Card | undefined>(undefined);

  React.useEffect(() => {
    setTimeout(() => setCardData(card), 50);
  }, [card]);

  return (
    <div
      onClick={onClick}
      style={{
        height: '100%',
        width: '100%',
        transition: '150ms ease-in',
        opacity: cardData ? '1' : '0',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 999,
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.65)'
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
          borderRadius: '1.25em',
          background: 'white',
          height: '80vw',
          width: '60vw',
          maxHeight: `600px`,
          maxWidth: `400px`,
          transform: cardData ? 'scale(100%)' : 'scale(0%)',
          transition: '150ms ease-in',
        }}
      >
        <div
          style={{
            fontSize: '2vh',
            fontWeight: 'bold',
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'center',
            justifyContent: 'center',
            height: '10vw',
            width: '10vw',
            maxHeight: '60px',
            maxWidth: '60px',
            position: 'absolute',
            top: '-5%',
            right: 'auto',
            bottom: 'auto',
            left: '-5%',
            background: 'lightgreen',
            borderRadius: '50%',
          }}
        >
          {cardData?.cost}
        </div>
        <div
          style={{
            fontSize: '2vh',
            fontWeight: 'bold',
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'center',
            justifyContent: 'center',
            height: '10vw',
            width: '10vw',
            maxHeight: '60px',
            maxWidth: '60px',
            position: 'absolute',
            top: '-5%',
            right: '-5%',
            bottom: 'auto',
            left: 'auto',
            color: 'white',
            background: 'red',
            borderRadius: '50%',
            whiteSpace: 'nowrap'
          }}
        >
          {cardData?.temporaryPower || cardData?.temporaryPower === 0
            ? `${cardData?.temporaryPower}(${cardData?.power})`
            : cardData?.power}
        </div>
        <div style={{ fontSize: '2vh' }}>{cardData?.name}</div>
      </div>
    </div>
  );
};
