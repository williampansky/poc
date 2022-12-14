import { DefaultState } from '../../../state';
import { mockCtx } from '../../../test-utils';
import { initZonesPhase } from '..';

describe('Handles state manipulation of G.Zones', () => {
  test('Should create three unique zone objects during onBegin()', () => {
    let G = DefaultState;
    initZonesPhase.onBegin!(G, mockCtx());

    expect(G.Zones[0].uuid).not.toBeUndefined();
    expect(G.Zones[0].uuid).not.toBe('');
    expect(G.Zones[0].id).not.toBe(G.Zones[1].id);
    expect(G.Zones[0].id).not.toBe(G.Zones[2].id);

    expect(G.Zones[1].uuid).not.toBeUndefined();
    expect(G.Zones[1].uuid).not.toBe('');
    expect(G.Zones[1].id).not.toBe(G.Zones[0].id);
    expect(G.Zones[1].id).not.toBe(G.Zones[2].id);

    expect(G.Zones[2].uuid).not.toBeUndefined();
    expect(G.Zones[2].uuid).not.toBe('');
    expect(G.Zones[2].id).not.toBe(G.Zones[0].id);
    expect(G.Zones[2].id).not.toBe(G.Zones[1].id);
  });

  test('Should get true from Zones.areReady during endIf()', () => {
    let G = DefaultState;
    initZonesPhase.onBegin!(G, mockCtx());
    
    const check = initZonesPhase.endIf!(G, mockCtx());
    expect(check).toBe(true);
  });
});
