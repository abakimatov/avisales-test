import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '../store/root-reducer'
import { TicketsState } from '../typings/tickets'

const ticketsStateSelector = (state: RootState): TicketsState => state.tickets

export const allStopsIsCheckedSelector = createSelector(
  [ticketsStateSelector],
  ({ selectedStops }) => selectedStops.all,
)

export const availableStopsSelector = createSelector(
  [ticketsStateSelector],
  ({ selectedStops }) => {
    const { all, ...availableStops } = selectedStops

    return Object.entries(availableStops)
  },
)

const selectedStopsSelector = createSelector(
  [ticketsStateSelector],
  ({ selectedStops }) => selectedStops,
)

export const sortMethodSelector = createSelector(
  [ticketsStateSelector],
  ({ sortMethod }) => sortMethod,
)

export const ticketsSelector = createSelector(
  [ticketsStateSelector, selectedStopsSelector, sortMethodSelector],
  ({ modified }) => {
    return modified
  },
)
