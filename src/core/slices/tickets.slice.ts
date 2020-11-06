import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { Ticket, ticketsApi } from 'api'
import { sleep, getCarrierIconUrl, generateId } from 'lib/utils'
import { AppThunk } from '../store'

interface IdentifiedTicked extends Ticket {
  id: string
  carrierIconUrl: string
}

interface AvailableStops {
  [stopsAmount: string]: boolean
}

interface SelectedStops extends AvailableStops {
  all: boolean
}

interface TicketsState {
  data: IdentifiedTicked[]
  selectedStops: SelectedStops
}

const initialState: TicketsState = {
  data: [],
  selectedStops: {
    all: true,
  },
}

const { actions, reducer } = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    ticketsFetchSuccess(state, action: PayloadAction<IdentifiedTicked[]>) {
      state.data = state.data.concat(action.payload)
    },
    updateSelectedStops(state, action: PayloadAction<AvailableStops>) {
      state.selectedStops = { ...state.selectedStops, ...action.payload }
    },
  },
})

export const { ticketsFetchSuccess, updateSelectedStops } = actions
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

  for await (const tickets of ticketsGenerator(value as string)) {
    const identifiedTickets = []
    const availableStops: AvailableStops = {}

    for (const ticket of tickets) {
      const {
        segments: [thereDirection, backDirection],
      } = ticket
      const identifiedTicked: IdentifiedTicked = {
        id: generateId(),
        carrierIconUrl: getCarrierIconUrl(ticket.carrier),
        ...ticket,
      }

      availableStops[thereDirection.stops.length] = true
      availableStops[backDirection.stops.length] = true
      identifiedTickets.push(identifiedTicked)
    }

    dispatch(updateSelectedStops(availableStops))
    dispatch(ticketsFetchSuccess(identifiedTickets))
  }
}
