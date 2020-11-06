import { combineReducers } from '@reduxjs/toolkit'

import { searchId } from '../slices/search-id.slice'
import { tickets } from '../slices/tickets.slice'

export const rootReducer = combineReducers({ searchId, tickets })

export type RootState = ReturnType<typeof rootReducer>
