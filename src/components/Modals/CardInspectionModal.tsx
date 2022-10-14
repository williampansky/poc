import { Ctx } from 'boardgame.io';
import React, { ReactElement } from 'react';
import { Card, CardPowerStream, GameState } from '../../interfaces';

interface CardInspectionProps {
  card?: Card;
  onClick: () => void;
}

export const CardInspectionModal = ({
  card,
  onClick,
}: CardInspectionProps): ReactElement => {
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
        zIndex: cardData ? 999 : -1,
        pointerEvents: cardData ? 'auto' : 'none',
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.65)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 'auto',
          left: 0,
          padding: '1em 0.5em',
          display: 'flex',
          flexFlow: 'row wrap',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          gridGap: '0.5em',
        }}
      >
        {cardData?.powerStream.map((s: CardPowerStream, i: number) => {
          return (
            <React.Fragment key={`stream_${i}`}>
              <div
                style={{
                  display: 'flex',
                  flexFlow: 'column nowrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  maxWidth: '5em',
                  padding: '0.25em',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    background: 'gray',
                    borderRadius: '50%',
                    padding: '0.5em',
                    height: '2em',
                    width: '2em',
                    display: 'flex',
                    flexFlow: 'column nowrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 4,
                  }}
                >
                  {s.currentPower}
                </div>
                <div style={{ color: 'white', fontSize: 9 }}>{s.blame}</div>
              </div>

              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexFlow: 'column nowrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ color: 'white', fontSize: 14 }}>{'<-'}</div>
              </div>
            </React.Fragment>
          );
        })}

        {cardData?.zonePowerAdjustment && (
          <div
            style={{
              display: 'flex',
              flexFlow: 'column nowrap',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '5em',
              padding: '0.25em',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                background: 'gray',
                borderRadius: '50%',
                padding: '0.5em',
                height: '2em',
                width: '2em',
                display: 'flex',
                flexFlow: 'column nowrap',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 4,
              }}
            >
              {cardData?.zonePowerAdjustment}
            </div>
            <div style={{ color: 'white', fontSize: 9 }}>Zone Adjustment</div>
          </div>
        )}

        <div
          style={{
            height: '100%',
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ color: 'white', fontSize: 14 }}>{'<-'}</div>
        </div>

        {cardData?.basePower && (
          <div
            style={{
              display: 'flex',
              flexFlow: 'column nowrap',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '5em',
              padding: '0.25em',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                background: 'gray',
                borderRadius: '50%',
                padding: '0.5em',
                height: '2em',
                width: '2em',
                display: 'flex',
                flexFlow: 'column nowrap',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 4,
              }}
            >
              {cardData?.basePower}
            </div>
            <div style={{ color: 'white', fontSize: 9 }}>Base Power</div>
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexFlow: 'column nowrap',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1em',
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
          {cardData?.currentCost}
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
            whiteSpace: 'nowrap',
          }}
        >
          {cardData?.displayPower}
        </div>
        <div style={{ fontSize: '1.5vh' }}>{cardData?.__id}</div>
        <div style={{ fontSize: '4vh' }}>{cardData?.name}</div>
        <div style={{ fontSize: '2vh' }}>{cardData?.description}</div>
      </div>
    </div>
  );
};
