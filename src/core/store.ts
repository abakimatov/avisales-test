import { configureStore } from '@reduxjs/toolkit'

import { ticketsApi } from 'api'
import { rootReducer } from './rootReducer'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: ticketsApi,
      },
    }),
})

export type AppDispatch = typeof store.dispatch
