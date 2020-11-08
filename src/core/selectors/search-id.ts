import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '../store/root-reducer'
import { SearchIdState } from '../typings/search-id'

const searchIdStateSelector = (state: RootState): SearchIdState =>
  state.searchId

const searchIdSelector = createSelector(
  [searchIdStateSelector],
  (state) => state.value,
)

const isSearchIdLoadingSelector = createSelector(
  [searchIdStateSelector],
  (state) => state.loading,
)

const isFetchSearchIdErrorSelector = createSelector(
  [searchIdStateSelector],
  (state) => state.error,
)

export const isSearchIdReadySelector = createSelector(
  [searchIdSelector, isSearchIdLoadingSelector, isFetchSearchIdErrorSelector],
  (searchId, loading, error) => searchId !== null && !loading && error === null,
)
