import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { batch } from 'react-redux'

import { Ticket, ticketsApi } from 'api'
import { SORT_METHODS } from 'constants/sort'
import { sleep, getCarrierIconUrl, generateId } from 'lib/utils'
import { runInWorker } from 'lib/worker'
import { getHumanizedPrice } from 'lib/formatters'
import { AppThunk } from '../store'

export interface IdentifiedTicket extends Ticket {
  id: string
  carrierIconUrl: string
  humanizedPrice: string
}

interface AvailableStops {
  [stopsAmount: string]: boolean
}

interface SelectedStops extends AvailableStops {
  all: boolean
}

export interface TicketsState {
  data: IdentifiedTicket[]
  selectedStops: SelectedStops
  sortMethod: SORT_METHODS
}

const initialState: TicketsState = {
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
    ticketsFetchSuccess(state, action: PayloadAction<IdentifiedTicket[]>) {
      state.data = state.data.concat(action.payload)
    },
    updateSelectedStops(state, action: PayloadAction<AvailableStops>) {
      state.selectedStops = { ...action.payload, ...state.selectedStops }
    },
    changeAllStops(state) {
      const { all, ...availableStops } = state.selectedStops
      const stopsToUpdate: SelectedStops = { all: !all }

      Object.keys(availableStops).forEach((amount) => {
        stopsToUpdate[amount] = !all
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
    changeSortMethod(state, action: PayloadAction<SORT_METHODS>) {
      state.sortMethod = action.payload
    },
  },
})

export const {
  ticketsFetchSuccess,
  updateSelectedStops,
  changeAllStops,
  changeOneStop,
  changeSortMethod,
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

  for await (const tickets of ticketsGenerator(value as string)) {
    const identifiedTickets: IdentifiedTicket[] = []
    const availableStops: AvailableStops = {}

    await runInWorker(() => {
      for (const { segments, carrier, price } of tickets) {
        const [thereDirection, backDirection] = segments

        const identifiedTicket: IdentifiedTicket = {
          id: generateId(),
          carrierIconUrl: getCarrierIconUrl(carrier),
          humanizedPrice: '100 000 Р',
          carrier,
          price,
          segments,
        }

        availableStops[thereDirection.stops.length] = true
        availableStops[backDirection.stops.length] = true
        identifiedTickets.push(identifiedTicket)
      }
    })

    batch(() => {
      dispatch(updateSelectedStops(availableStops))
      dispatch(ticketsFetchSuccess(identifiedTickets))
    })
  }
}
