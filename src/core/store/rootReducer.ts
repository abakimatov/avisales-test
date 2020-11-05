import { combineReducers } from '@reduxjs/toolkit'

import { searchId } from '../slices/search-id.slice'

export const rootReducer = combineReducers({ searchId })

export type RootState = ReturnType<typeof rootReducer>
