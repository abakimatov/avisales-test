import { configureStore, Action } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'

import { rootReducer, RootState } from './rootReducer'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
})

export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootState, null, Action<string>>
