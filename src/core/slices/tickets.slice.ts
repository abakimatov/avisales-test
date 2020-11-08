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
  data: [],
  viewData: [],
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
      state.data = action.payload
    },
    updateViewTickets(state, action: PayloadAction<Ticket[]>) {
      state.viewData = action.payload
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
        const updatedAvailableStops: AvailableStops = {
          ...availableStops,
          [currentStopsAmount]: !isSelected,
        }

        const updatedSelectedStops: SelectedStops = {
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
  updateViewTickets,
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
    const { viewData, sortMethod, selectedStops, data } = getState().tickets

    const { tickets, availableStops } = await transformService.prepareTickets(
      ticketsChunk,
    )

    const [updatedBackendTickets, updatedTickets] = await Promise.all([
      transformService.concatTickets(data, tickets),
      transformService.concatTickets(viewData, tickets),
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
      dispatch(updateViewTickets(sortedTickets))
      dispatch(updateSelectedStops(availableStops))
    })
  }
}

export const changeAllStopsFilter = (): AppThunk => async (
  dispatch,
  getState,
  transformService,
) => {
  const { selectedStops, data, sortMethod } = getState().tickets

  const { all, ...availableStops } = selectedStops
  const currentAllFiltersState = !all
  const stopsToUpdate: SelectedStops = { all: !all }

  Object.keys(availableStops).forEach((amount) => {
    stopsToUpdate[amount] = currentAllFiltersState
  })

  const filteredTickets = await transformService.filterTickets(
    data,
    stopsToUpdate,
  )

  const sortedTickets = await transformService.sortTickets(
    filteredTickets,
    sortMethod,
  )

  dispatch(changeAllStops(stopsToUpdate))
  dispatch(updateViewTickets(sortedTickets))
}

export const changeStopsFilter = (stopsAmount: string): AppThunk => async (
  dispatch,
  getState,
  transformService,
) => {
  const { selectedStops, data, sortMethod } = getState().tickets

  dispatch(changeOneStop(stopsAmount))

  const filteredTickets = await transformService.filterTickets(data, {
    ...selectedStops,
    [stopsAmount]: !selectedStops[stopsAmount],
  })

  const sortedTickets = await transformService.sortTickets(
    filteredTickets,
    sortMethod,
  )

  dispatch(updateViewTickets(sortedTickets))
}

export const changeSortMethod = (sortMethod: SORT_METHODS): AppThunk => async (
  dispatch,
  getState,
  transformService,
) => {
  const { viewData } = getState().tickets

  dispatch(updateSortMethod(sortMethod))

  const sortedTickets = await transformService.sortTickets(viewData, sortMethod)

  dispatch(updateViewTickets(sortedTickets))
}
