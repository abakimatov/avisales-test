import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { batch } from 'react-redux'

import { ticketsApi } from 'api'
import { SORT_METHODS } from 'constants/sort'
import { sleep } from 'lib/utils'
import {
  Ticket,
  AvailableStops,
  SelectedStops,
  TicketsState,
} from '../typings/tickets'
import { AppThunk } from '../store'

const initialState: TicketsState = {
  origin: [],
  modified: [],
  sortMethod: SORT_METHODS.CHEAP,
  selectedStops: {
    all: true,
  },
}

const { actions, reducer } = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    updateOriginTickets(state, action: PayloadAction<Ticket[]>) {
      state.origin = action.payload
    },
    updateModifiedTickets(state, action: PayloadAction<Ticket[]>) {
      state.modified = action.payload
    },

    updateAvailableStops(state, action: PayloadAction<AvailableStops>) {
      state.selectedStops = { ...action.payload, ...state.selectedStops }
    },
    updateStopsFilter(state, action: PayloadAction<SelectedStops>) {
      state.selectedStops = action.payload
    },
    updateSortMethod(state, action: PayloadAction<SORT_METHODS>) {
      state.sortMethod = action.payload
    },
  },
})

export const {
  updateOriginTickets,
  updateModifiedTickets,
  updateAvailableStops,
  updateStopsFilter,
  updateSortMethod,
} = actions
export const tickets = reducer

async function* ticketsGenerator(searchId: string) {
  while (true) {
    try {
      const { data } = await ticketsApi.getTickets(searchId)
      yield data.tickets

      if (data.stop) return
    } catch (e) {
      await sleep(1000)
    }
  }
}

export const startTicketsPolling = (): AppThunk => async (
  dispatch,
  getState,
  transformService,
) => {
  const { value } = getState().searchId

  for await (const ticketsChunk of ticketsGenerator(value as string)) {
    const { modified, sortMethod, selectedStops, origin } = getState().tickets

    const { tickets, availableStops } = await transformService.prepareTickets(
      ticketsChunk,
    )

    const [updatedBackendTickets, updatedTickets] = await Promise.all([
      transformService.concatTickets(origin, tickets),
      transformService.concatTickets(modified, tickets),
    ])

    const filteredTickets = await transformService.filterTickets(
      updatedTickets,
      selectedStops,
    )

    const sortedTickets = await transformService.sortTickets(
      filteredTickets,
      sortMethod,
    )

    batch(() => {
      dispatch(updateOriginTickets(updatedBackendTickets))
      dispatch(updateModifiedTickets(sortedTickets))
      dispatch(updateAvailableStops(availableStops))
    })
  }
}

export const changeAllStopsFilter = (): AppThunk => async (
  dispatch,
  getState,
  transformService,
) => {
  const { selectedStops, origin, sortMethod } = getState().tickets

  const { all, ...availableStops } = selectedStops
  const toggledAllFilter = !all
  const stopsToUpdate: SelectedStops = { all: toggledAllFilter }

  Object.keys(availableStops).forEach((amount) => {
    stopsToUpdate[amount] = toggledAllFilter
  })

  const filteredTickets = await transformService.filterTickets(
    origin,
    stopsToUpdate,
  )
  const sortedAndFilteredTickets = await transformService.sortTickets(
    filteredTickets,
    sortMethod,
  )

  batch(() => {
    dispatch(updateStopsFilter(stopsToUpdate))
    dispatch(updateModifiedTickets(sortedAndFilteredTickets))
  })
}

export const changeStopsFilter = (stopsAmount: string): AppThunk => async (
  dispatch,
  getState,
  transformService,
) => {
  const { selectedStops, origin, sortMethod } = getState().tickets
  const { all, ...availableStops } = selectedStops
  let updatedStopsFilter: SelectedStops

  if (all) {
    updatedStopsFilter = {
      ...availableStops,
      [stopsAmount]: false,
      all: false,
    }
  } else {
    const isSelected = availableStops[stopsAmount]
    const updatedAvailableStops = {
      ...availableStops,
      [stopsAmount]: !isSelected,
    }

    updatedStopsFilter = {
      ...updatedAvailableStops,
      all: Object.values(updatedAvailableStops).every(Boolean),
    }
  }

  const filteredTickets = await transformService.filterTickets(
    origin,
    updatedStopsFilter,
  )

  const sortedAndFilteredTickets = await transformService.sortTickets(
    filteredTickets,
    sortMethod,
  )

  batch(() => {
    dispatch(updateStopsFilter(updatedStopsFilter))
    dispatch(updateModifiedTickets(sortedAndFilteredTickets))
  })
}

export const changeSortMethod = (sortMethod: SORT_METHODS): AppThunk => async (
  dispatch,
  getState,
  transformService,
) => {
  const { modified } = getState().tickets

  const sortedTickets = await transformService.sortTickets(modified, sortMethod)

  batch(() => {
    dispatch(updateSortMethod(sortMethod))
    dispatch(updateModifiedTickets(sortedTickets))
  })
}
