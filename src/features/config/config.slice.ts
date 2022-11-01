import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Config } from '../../game.config';
import type { Config as IConfig } from '../../game.config';
import { DefaultState } from '../../state';

const initialState: any = null;

export const configSlice = createSlice({
  name: 'configPoints',
  initialState,
  reducers: {
    setConfig: (state, { payload }: PayloadAction<any>) => {
      return payload;
    },
  },
});

export const { setConfig } = configSlice.actions;

export default configSlice.reducer;
