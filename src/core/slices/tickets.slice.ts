import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ticketsApi } from 'api'
import { SORT_METHODS } from 'constants/sort'
import { sleep } from 'lib/utils'
import { transformService, Ticket } from 'lib/worker'
import { AppThunk } from '../store'

interface AvailableStops {
  [stopsAmount: string]: boolean
}

interface SelectedStops extends AvailableStops {
  all: boolean
}

export interface TicketsState {
  rawBackendData: Ticket[]
  data: Ticket[]
  selectedStops: SelectedStops
  sortMethod: SORT_METHODS
}

const initialState: TicketsState = {
  rawBackendData: [],
  data: [],
  sortMethod: SORT_METHODS.CHEAP,
  selectedStops: {
    all: true,
  },
}

const { actions, reducer } = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    updateBackendTickets(state, action: PayloadAction<Ticket[]>) {
      state.rawBackendData = action.payload
    },
    updateTickets(state, action: PayloadAction<Ticket[]>) {
      state.data = action.payload
    },
    updateSelectedStops(state, action: PayloadAction<AvailableStops>) {
      state.selectedStops = { ...action.payload, ...state.selectedStops }
    },
    changeAllStops(state, action: PayloadAction<boolean>) {
      const { all, ...availableStops } = state.selectedStops
      const currentAllFilterState = action.payload
      const stopsToUpdate: SelectedStops = { all: currentAllFilterState }

      Object.keys(availableStops).forEach((amount) => {
        stopsToUpdate[amount] = currentAllFilterState
      })

      state.selectedStops = stopsToUpdate
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
        state.selectedStops[currentStopsAmount] = !isSelected
      }
    },
    updateSortMethod(state, action: PayloadAction<SORT_METHODS>) {
      state.sortMethod = action.payload
    },
  },
})

export const {
  updateBackendTickets,
  updateTickets,
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
) => {
  const { value } = getState().searchId

  for await (const ticketsChunk of ticketsGenerator(value as string)) {
    const {
      data,
      sortMethod,
      selectedStops,
      rawBackendData,
    } = getState().tickets

    const { tickets, availableStops } = await transformService.prepareTickets(
      ticketsChunk,
    )

    const updatedBackendTickets = rawBackendData.concat(data)
    const updatedTickets = data.concat(tickets)

    const filteredTickets = await transformService.filterTickets(
      updatedTickets,
      selectedStops,
    )

    const sortedTickets = await transformService.sortTickets(
      filteredTickets,
      sortMethod,
    )

    dispatch(updateBackendTickets(updatedBackendTickets))
    dispatch(updateTickets(sortedTickets))
    dispatch(updateSelectedStops(availableStops))
  }
}

export const changeAllStopsFilter = (): AppThunk => async (
  dispatch,
  getState,
) => {
  const { selectedStops, rawBackendData, sortMethod } = getState().tickets
  const currentAllFilterState = !selectedStops.all

  dispatch(changeAllStops(currentAllFilterState))

  const filteredTickets = await transformService.filterTickets(rawBackendData, {
    ...selectedStops,
    all: currentAllFilterState,
  })

  const sortedTickets = await transformService.sortTickets(
    filteredTickets,
    sortMethod,
  )

  dispatch(updateTickets(sortedTickets))
}

export const changeStopsFilter = (stopsAmount: string): AppThunk => async (
  dispatch,
  getState,
) => {
  const { selectedStops, rawBackendData, sortMethod } = getState().tickets

  dispatch(changeOneStop(stopsAmount))

  const filteredTickets = await transformService.filterTickets(rawBackendData, {
    ...selectedStops,
    [stopsAmount]: !selectedStops[stopsAmount],
  })

  const sortedTickets = await transformService.sortTickets(
    filteredTickets,
    sortMethod,
  )

  dispatch(updateTickets(sortedTickets))
}

export const changeSortMethod = (sortMethod: SORT_METHODS): AppThunk => async (
  dispatch,
  getState,
) => {
  const { data } = getState().tickets

  dispatch(updateSortMethod(sortMethod))

  const sortedTickets = await transformService.sortTickets(data, sortMethod)

  dispatch(updateTickets(sortedTickets))
}
