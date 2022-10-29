import { configureStore } from '@reduxjs/toolkit'
import { actionPointsSlice, zonesSlice, zonesRefSlice, cardModalSlice } from './features';

export const store = configureStore({
  reducer: {
    actionPoints: actionPointsSlice,
    zones: zonesSlice,
    zonesRef: zonesRefSlice,
    cardModal: cardModalSlice,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
