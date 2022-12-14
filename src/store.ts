import { configureStore } from '@reduxjs/toolkit';
import {
  actionPointsSlice,
  cardModalSlice,
  configSlice,
  zonesRefSlice,
  zonesSlice,
} from './features';

export const store = configureStore({
  reducer: {
    actionPoints: actionPointsSlice,
    cardModal: cardModalSlice,
    config: configSlice,
    zones: zonesSlice,
    zonesRef: zonesRefSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
