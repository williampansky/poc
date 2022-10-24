import { DefaultState } from '../../../state';
import { mockCtx } from '../../../test-utils';
import { initZonesPhase } from '..';

describe('Handles state manipulation of G.Zones', () => {
  test('Should create playable zone objects', () => {
    let G = DefaultState;
    initZonesPhase.onBegin!(G, mockCtx());
    expect(G.Zones[0].uuid).not.toBeUndefined();
  });
});
