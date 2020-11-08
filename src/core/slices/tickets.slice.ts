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
    updateTickets(state, action: PayloadAction<Ticket[]>) {
      state.origin = action.payload
    },
    updateModifiedTickets(state, action: PayloadAction<Ticket[]>) {
      state.modified = action.payload
    },
    updateSelectedStops(state, action: PayloadAction<AvailableStops>) {
      state.selectedStops = { ...action.payload, ...state.selectedStops }
    },
    changeAllStops(state, action: PayloadAction<SelectedStops>) {
      state.selectedStops = action.payload
    },
    changeOneStop(state, action: PayloadAction<string>) {
      const { all, ...availableStops } = state.selectedStops
      const currentStopsAmount = action.payload

      if (all) {
        state.selectedStops = {
          ...availableStops,
          [currentStopsAmount]: false,
          all: false,
        }
      } else {
        const isSelected = availableStops[currentStopsAmount]
        const updatedAvailableStops = {
          ...availableStops,
          [currentStopsAmount]: !isSelected,
        }

        const updatedSelectedStops = {
          ...updatedAvailableStops,
          all: Object.values(updatedAvailableStops).every(Boolean),
        }
        state.selectedStops = updatedSelectedStops
      }
    },
    updateSortMethod(state, action: PayloadAction<SORT_METHODS>) {
      state.sortMethod = action.payload
    },
  },
})

export const {
  updateTickets,
  updateModifiedTickets,
  updateSelectedStops,
  changeAllStops,
  changeOneStop,
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
      dispatch(updateTickets(updatedBackendTickets))
      dispatch(updateModifiedTickets(sortedTickets))
      dispatch(updateSelectedStops(availableStops))
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

  dispatch(changeAllStops(stopsToUpdate))

  const filteredTickets = await transformService.filterTickets(
    origin,
    stopsToUpdate,
  )
  const sortedAndFilteredTickets = await transformService.sortTickets(
    filteredTickets,
    sortMethod,
  )

  dispatch(updateModifiedTickets(sortedAndFilteredTickets))
}

export const changeStopsFilter = (stopsAmount: string): AppThunk => async (
  dispatch,
  getState,
  transformService,
) => {
  dispatch(changeOneStop(stopsAmount))

  const { selectedStops, origin, sortMethod } = getState().tickets

  const filteredTickets = await transformService.filterTickets(
    origin,
    selectedStops,
  )

  const sortedAndFilteredTickets = await transformService.sortTickets(
    filteredTickets,
    sortMethod,
  )

  dispatch(updateModifiedTickets(sortedAndFilteredTickets))
}

export const changeSortMethod = (sortMethod: SORT_METHODS): AppThunk => async (
  dispatch,
  getState,
  transformService,
) => {
  const { modified } = getState().tickets

  dispatch(updateSortMethod(sortMethod))

  const sortedTickets = await transformService.sortTickets(modified, sortMethod)

  dispatch(updateModifiedTickets(sortedTickets))
}
