import React from 'react';
import { BoardProps, Client } from 'boardgame.io/react';
import { Ctx } from 'boardgame.io';
import { Card, config, GameState, Zone as IZone } from './game';
import { Zone } from './components/Zone/Zone';
import { ZoneSlot } from './components/ZoneSlot/ZoneSlot';
import { Card as CardInHand } from './components/Card/Card';
import { CardInspectionModal } from './components/Modals/CardInspectionModal';
import { PlayerHand } from './components/Hands/PlayerHand';

const showDebug = false;

export interface GameProps extends BoardProps<GameState> {}

export const Board = (props: GameProps) => {
  const [addressBarSize, setAddressBarSize] = React.useState<number>(0);
  const [cardModal, setCardModal] = React.useState<Card | undefined>(undefined);

  const {
    G,
    G: { players },
    ctx,
    moves,
    events,
    reset,
  } = props;

  /**
   * Uses html.perspective CSS property, which is set to 100vh, to determine
   * a mobile browser's address bar height; such as Android Chrome's URL bar.
   * @see [StackOverflow]{@link https://stackoverflow.com/a/54796813}
   */
  const addressBarCallback = React.useCallback(() => {
    if (typeof document !== 'undefined') {
      setAddressBarSize(
        parseFloat(getComputedStyle(document.documentElement).perspective) -
          document.documentElement.clientHeight
      );
    }
  }, []);

  React.useLayoutEffect(() => {
    addressBarCallback();
  }, [addressBarCallback]);

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

  const onCardClick = (card: Card) => {
    setCardModal(card);
  };

  const onCardSelect = (playerId: string, uuid: string) => {
    return moves.selectCard(playerId, uuid);
  };

  const onCardDeselect = (playerId: string) => {
    return moves.deselectCard(playerId);
  };

  const onCardSlotDrop = (playerId: string, zoneNumber: number) => {
    return moves.playCard(playerId, zoneNumber);
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

      {/* debug stuff */}
      {showDebug && (
        <div
          style={{
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            width: '100%',
            position: 'absolute',
            top: 0,
            bottom: 'auto',
            left: 0,
            right: 0,
            zIndex: 9000,
            padding: '0.15em',
            background: 'darkgray',
            fontSize: 10,
          }}
        >
          <div>addressBarSize: {addressBarSize}px</div>
          <div>
            ctx.turn: {ctx.turn} / singleTurn: {Math.round(ctx.turn / 2)}
          </div>
          <div>selectedCard: {G.selectedCard['0']?.data!.id}</div>
        </div>
      )}

      <main
        style={{
          maxWidth: '100vw',
          filter: ctx.gameover ? 'blur(2px)' : 'none',
          height: `calc(100vh - ${addressBarSize}px)`,
        }}
      >
        <CardInspectionModal
          card={cardModal}
          onClick={() => setCardModal(undefined)}
        />
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
              whiteSpace: 'nowrap',
            }}
          >
            {G.players[1].name}
          </div>
          <div style={{ width: '100%' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${G.players['1'].actionPointsTotal}, 1fr)`,
                gridGap: '0.15em',
                width: '100%',
              }}
            >
              {Array.from(Array(G.players[1].actionPointsTotal)).map(
                (_, idx) => {
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
                          G.players[1].actionPoints >= idx
                            ? 'lightgreen'
                            : 'lightgray',
                      }}
                    >
                      &nbsp;
                    </div>
                  );
                }
              )}
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
            padding: '0 1em',
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
            {[...Array.from(players[1].hand)]?.map((_, idx) => {
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexFlow: 'column nowrap',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    textAlign: 'center',
                    position: 'relative',
                    border: '1px solid',
                    borderColor: 'gray',
                    borderRadius: '0.25em',
                    background: 'white',
                    height: '3.5em',
                    width: '2.45em',
                    transform:
                      G.selectedCard['1']?.index === idx
                        ? 'scale(120%)'
                        : 'scale(80%)',
                    transition: '200ms ease-out',
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
          {G.zones.map((zone: IZone, idx: number) => {
            return (
              <Zone
                G={G}
                ctx={ctx}
                moves={moves}
                disabled={zone.disabled[0]}
                zone={zone}
                zoneNumber={idx}
                key={idx}
                onCardClick={onCardClick}
              />
            );
          })}
        </div>
        <PlayerHand
          G={G}
          ctx={ctx}
          onCardClick={onCardClick}
          onCardSelect={onCardSelect}
          onCardDeselect={onCardDeselect}
          onCardSlotDrop={onCardSlotDrop}
        />
        <div
          style={{
            display: 'flex',
            flexFlow: 'row nowrap',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            height: '22px',
            zIndex: 20,
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
                gridTemplateColumns: `repeat(${G.players['0'].actionPointsTotal}, 1fr)`,
                gridGap: '0.15em',
                width: '100%',
              }}
            >
              {Array.from(Array(G.players[0].actionPointsTotal)).map(
                (_, idx) => {
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
                          G.players[0].actionPoints >= idx
                            ? 'lightgreen'
                            : 'lightgray',
                      }}
                    >
                      &nbsp;
                    </div>
                  );
                }
              )}
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
              End Turn {Math.round(ctx.turn / 2)}/
              {config.gameConfig.numberOfSingleTurnsPerGame}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};
