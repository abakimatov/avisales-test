import { createSelector } from '@reduxjs/toolkit'

import { RootState } from '../store/root-reducer'
import { TicketsState } from '../slices/tickets.slice'
import { SORT_METHODS } from '../../constants/sort'

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
  ({ data }, selectedStops, sortMethod) => {
    let filteredTickets
    if (selectedStops.all) {
      filteredTickets = data
    } else {
      filteredTickets = data.filter((el) => {
        const { segments } = el
        const [thereDirection, backDirection] = segments
        console.log(selectedStops[thereDirection.stops.length])
        console.log(selectedStops[backDirection.stops.length])
        return (
          selectedStops[thereDirection.stops.length] &&
          selectedStops[backDirection.stops.length]
        )
      })
    }

    return filteredTickets

    // return filteredTickets.sort((a, b) => {
    //   if (sortMethod === SORT_METHODS.CHEAP) {
    //     return a.price - b.price
    //   } else {
    //     const durationA = a.segments[0].duration + a.segments[1].duration
    //     const durationB = b.segments[0].duration + b.segments[1].duration
    //     return 1 - 1
    //   }
    // })
  },
)
