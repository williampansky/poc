import { Ctx } from 'boardgame.io';
import React, { ReactElement } from 'react';
import { Card, GameState } from '../../interfaces';
import getDisplayPower from '../../utilities/get-display-power';

interface ReactZoneSlot {
  card?: Card;
  onClick: (card: Card) => void;
}

export const ZoneSlot = ({ card, onClick }: ReactZoneSlot): ReactElement => {
  const [cardData, setCardData] = React.useState<Card | undefined>(undefined);

  React.useEffect(() => {
    setTimeout(() => setCardData(card), 50);
  }, [card]);

  return (
    <div
      onClick={() => card && onClick(card)}
      style={{
        height: '3.5em',
        width: '2.75em',
        transition: '150ms ease-in',
        opacity: cardData ? '1' : '0',
        transform: cardData ? 'scale(100%)' : 'scale(200%)',
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
          {cardData?.currentCost}
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
          {cardData && getDisplayPower(cardData)}
        </div>
        <div style={{ fontSize: '0.5em' }}>{cardData?.name}</div>
      </div>
    </div>
  );
};
