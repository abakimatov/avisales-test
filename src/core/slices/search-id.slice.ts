import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { SearchId, ticketsApi } from 'api'
import { AppThunk } from '../store'
import { SearchIdState } from '../typings/search-id'

const initialState: SearchIdState = {
  value: null,
  loading: false,
  error: null,
}

const { actions, reducer } = createSlice({
  name: 'searchId',
  initialState,
  reducers: {
    fetchSearchIdStart(state) {
      state.loading = true
      state.error = null
    },
    fetchSearchIdSuccess(state, action: PayloadAction<SearchId>) {
      const { searchId } = action.payload
      state.value = searchId
      state.loading = false
    },
    fetchSearchIdFail(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
  },
})

export const {
  fetchSearchIdStart,
  fetchSearchIdSuccess,
  fetchSearchIdFail,
} = actions
export const searchId = reducer

export const getSearchId = (): AppThunk => async (dispatch) => {
  dispatch(fetchSearchIdStart())
  try {
    const { data } = await ticketsApi.getSearchId()

    dispatch(fetchSearchIdSuccess(data))
  } catch (e) {
    dispatch(fetchSearchIdFail(e.message))
  }
}
