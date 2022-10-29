import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PlayerID, Zone, ZonesCardsReference } from '../../interfaces';
import { DefaultState } from '../../state';

const initialState: ZonesCardsReference[] = DefaultState.ZonesCardsReference;

export const zonesRefSlice = createSlice({
  name: 'zonesRef',
  initialState,
  reducers: {
    updateZonesRef: (state, { payload }: PayloadAction<any>) => {
      return payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateZonesRef } = zonesRefSlice.actions;

export default zonesRefSlice.reducer;
