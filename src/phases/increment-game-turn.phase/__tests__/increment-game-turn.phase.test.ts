import { DefaultState } from '../../../state';
import { mockCtx } from '../../../test-utils';
import { incrementGameTurnPhase } from '../';

describe('Handles state manipulation to increment G.Turn', () => {
  test('Should increment the game turn', () => {
    let G = DefaultState;
    incrementGameTurnPhase.onBegin!(G, mockCtx());
    expect(G.turn).toBe(1);
  });
});
