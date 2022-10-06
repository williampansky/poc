import React from 'react';
import { BoardProps, Client } from 'boardgame.io/react';
import { Ctx } from 'boardgame.io';
import { Card, GameState } from './game';
import { Zone } from './components/Zone/Zone';
import { ZoneSlot } from './components/ZoneSlot/ZoneSlot';
import { Card as CardInHand } from './components/Card/Card';

export interface BcgPocProps extends BoardProps<GameState> {}

export const Board = (props: BcgPocProps) => {
  const {
    G,
    G: { playerHand, opponentHand },
    ctx,
    moves,
    events,
    reset,
  } = props;

  const onClick = () => {
    // @ts-ignore
    if (ctx.currentPlayer === '0') return events.endTurn({ next: '1' });
    // @ts-ignore
    if (ctx.currentPlayer === '1') return events.endTurn({ next: '0' });
  };

  const resetGame = () => {
    reset();
    setTimeout(() => window.location.reload());
  };

  const getWinner = (ctx: Ctx): string | null => {
    if (!ctx.gameover) return null;
    if (ctx.gameover.draw) return 'Draw...';
    if (ctx.gameover.winner === '0') return 'Victory!';
    else return 'Defeat...';
  };

  const onCardClick = (uuid: string) => {
    return moves.selectCard('0', uuid);
  };

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: 999,
          background: 'rgba(255, 255, 255, 0.825)',
          display: ctx.gameover ? 'flex' : 'none',
          flexFlow: 'column nowrap',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h2>{getWinner(ctx)}</h2>
        <div
          style={{
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h3>
            <button onClick={() => resetGame()}>Replay?</button>
          </h3>
        </div>
      </div>

      <main
        style={{
          maxWidth: '100vw',
          filter: ctx.gameover ? 'blur(2px)' : 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexFlow: 'row nowrap',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '22px',
            position: 'absolute',
            top: 0,
            bottom: 'auto',
            left: 0,
            right: 0,
            zIndex: 1,
            padding: '0.15em',
            background: 'gray',
          }}
        >
          <div
            style={{
              paddingRight: '0.25em',
              marginRight: 'auto',
              fontSize: '11px',
            }}
          >
            {G.opponentName}
          </div>
          <div style={{ width: '100%' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(10, 1fr)',
                gridGap: '0.15em',
                width: '100%',
              }}
            >
              {Array.from(Array(G.opponentActionPointsTotal)).map((_, idx) => {
                idx = idx + 1;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexFlow: 'column nowrap',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                      userSelect: 'none',
                      background:
                        G.opponentActionPoints >= idx
                          ? 'lightgreen'
                          : 'lightgray',
                    }}
                  >
                    &nbsp;
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div
          style={{
            width: '100%',
            position: 'absolute',
            top: '10px',
            bottom: 'auto',
            left: 0,
            right: 0,
            zIndex: 0,
            maxWidth: '100%',
            padding: '0',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gridGap: '0',
              width: '100%',
            }}
          >
            {[...Array.from(opponentHand)]?.map((_, idx) => {
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexFlow: 'column nowrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0.25em',
                    textAlign: 'center',
                    position: 'relative',
                    border: '1px solid',
                    borderColor: 'gray',
                    borderRadius: '0.25em',
                    background: 'white',
                    height: '4em',
                    width: '2.95em',
                    transform: 'scale(80%)',
                  }}
                ></div>
              );
            })}
          </div>
        </div>
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexFlow: 'row nowrap',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto',
            padding: '0 1em',
            height: '100vh',
            width: '100%',
          }}
        >
          <Zone
            G={G}
            ctx={ctx}
            moves={moves}
            disabled={false}
            zone={G.zone1}
            zoneNumber={1}
            key={1}
          />
          <Zone
            G={G}
            ctx={ctx}
            moves={moves}
            disabled={false}
            zone={G.zone2}
            zoneNumber={2}
            key={2}
          />
          <Zone
            G={G}
            ctx={ctx}
            moves={moves}
            disabled={false}
            zone={G.zone3}
            zoneNumber={3}
            key={3}
          />
        </div>
        <div
          style={{
            width: '100%',
            position: 'absolute',
            top: 'auto',
            bottom: '10px',
            left: 0,
            right: 0,
            maxWidth: '100%',
            padding: '0',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gridGap: '0',
              width: '100%',
            }}
          >
            {playerHand?.map((card: Card) => (
              <CardInHand
                {...card}
                key={card.uuid}
                onClick={onCardClick}
                isSelected={G.playerSelectedCard?.uuid === card.uuid}
              />
            ))}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexFlow: 'row nowrap',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '22px',
            position: 'absolute',
            top: 'auto',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '0.15em',
            background: 'gray',
          }}
        >
          <div style={{ width: '100%' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(10, 1fr)',
                gridGap: '0.15em',
                width: '100%',
              }}
            >
              {Array.from(Array(G.playerActionPointsTotal)).map((_, idx) => {
                idx = idx + 1;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      flexFlow: 'column nowrap',
                      alignItems: 'center',
                      justifyContent: 'center',
                      pointerEvents: 'none',
                      userSelect: 'none',
                      background:
                        G.playerActionPoints >= idx
                          ? 'lightgreen'
                          : 'lightgray',
                    }}
                  >
                    &nbsp;
                  </div>
                );
              })}
            </div>
          </div>
          <div
            style={{
              paddingLeft: '0.15em',
              marginLeft: 'auto',
            }}
          >
            <button
              onClick={onClick}
              style={{
                background: ctx.currentPlayer === '0' ? 'yellow' : 'initial',
                display: 'flex',
                flexFlow: 'column nowrap',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                fontSize: '0.75rem',
                borderRadius: 0,
                border: 0,
                height: '17.5px',
                minWidth: 95,
              }}
            >
              End Turn {Math.round(ctx.turn / 2)}/{G.numberOfSingleTurns}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};
