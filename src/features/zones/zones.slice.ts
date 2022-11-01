import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Zone } from '../../interfaces';
import { DefaultState } from '../../state';

const initialState: Zone[] = DefaultState.Zones;

export const zonesSlice = createSlice({
  name: 'zones',
  initialState,
  reducers: {
    initZone: (state, { payload }: PayloadAction<{ zoneNumber: number; zoneData: Zone }>) => {
      const { zoneNumber, zoneData } = payload;
      state[zoneNumber] = zoneData;
    },
  },
});

// Action creators are generated for each case reducer function
export const { initZone } = zonesSlice.actions;

export default zonesSlice.reducer;
