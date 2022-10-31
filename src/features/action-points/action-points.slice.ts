import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ActionPoints } from '../../interfaces';
import { DefaultState } from '../../state';

const initialState: ActionPoints = {
  ...DefaultState.ActionPoints,
};

export const actionPointsSlice = createSlice({
  name: 'actionPoints',
  initialState,
  reducers: {
    setActionPoints: (state, { payload }: PayloadAction<ActionPoints>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      return payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setActionPoints } = actionPointsSlice.actions;

export default actionPointsSlice.reducer;
