import * as Comlink from 'comlink'

import { SORT_METHODS } from 'constants/sort'
import { getCarrierIconUrl } from '../utils'
import {
  getFormattedPrice,
  getStopsLabel,
  getFormattedTimeRange,
  getFormattedDuration,
} from '../formatters'

const transformService = {
  async prepareTickets(ticketsChunk) {
    const tickets = []
    const availableStops = {}

    for (const { segments, carrier, price } of ticketsChunk) {
      const [thereDirection, backDirection] = segments

      const ticket = {
        carrierIconUrl: getCarrierIconUrl(carrier),
        formattedPrice: getFormattedPrice(price),
        carrier,
        price,
        segments: segments.map(
          ({ origin, destination, date, duration, stops }) => ({
            origin,
            destination,
            date,
            duration,
            stops,
            directionTitle: `${origin} - ${destination}`,
            directionTimeRange: getFormattedTimeRange(date, duration),
            formattedDuration: getFormattedDuration(duration),
            stopsAmountTitle: getStopsLabel(stops.length),
            stopsAmount: stops.join(', '),
          }),
        ),
      }

      availableStops[thereDirection.stops.length] = true
      availableStops[backDirection.stops.length] = true
      tickets.push(ticket)
    }
    return { tickets, availableStops }
  },

  async filterTickets(tickets, selectedStops) {
    if (selectedStops.all) return tickets

    return tickets.filter(({ segments }) => {
      const [thereDirection, backDirection] = segments
      const thereStops = thereDirection.stops.length
      const backStops = backDirection.stops.length

      return selectedStops[thereStops] || selectedStops[backStops]
    })
  },
  async sortTickets(tickets, sortMethod) {
    const sortByCheap = (a, b) => a.price - b.price
    const sortByDuration = (a, b) => {
      const [thereDirectionA, backDirectionA] = a.segments
      const [thereDirectionB, backDirectionB] = b.segments

      const durationA = thereDirectionA.duration + backDirectionA.duration
      const durationB = thereDirectionB.duration + backDirectionB.duration

      return durationA - durationB
    }

    const sortFunction =
      sortMethod === SORT_METHODS.CHEAP ? sortByCheap : sortByDuration
    return tickets.sort(sortFunction)
  },
}

Comlink.expose(transformService)
