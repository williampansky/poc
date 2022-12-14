import { useEffect } from 'react';
import { PlayerID } from '../interfaces';

const useEndPhase = (
  events: any,
  ctxPhase: string,
  playerTurnDone: Record<PlayerID, boolean>
): void => {
  useEffect(() => {
    const isPlayCardsPhase = ctxPhase === 'playCards';
    const player0Done = playerTurnDone['0'] === true;
    const player1Done = playerTurnDone['1'] === true;

    if (isPlayCardsPhase && player0Done && player1Done) events?.endPhase!();
  }, [ctxPhase, playerTurnDone]);
};

export default useEndPhase;
