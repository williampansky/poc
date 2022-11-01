import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Config } from '../../game.config';
import type { Config as IConfig } from '../../game.config';
import { DefaultState } from '../../state';

const initialState: any = null;

export const movesSlice = createSlice({
  name: 'actionPoints',
  initialState,
  reducers: {
    setPlayerDone: (state, { payload }: PayloadAction<any>) => {
      return payload;
    },
  },
});

export const { setPlayerDone } = movesSlice.actions;

export default movesSlice.reducer;
