import { configureStore, Action } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'

import { rootReducer, RootState } from './root-reducer'
import { transformService } from '../worker'
import { TransformService } from '../typings/worker'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: transformService,
      },
      serializableCheck: false,
      immutableCheck: false,
    }),
})

export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<
  void,
  RootState,
  TransformService,
  Action<string>
>
