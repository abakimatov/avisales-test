import * as Comlink from 'comlink'

import { SORT_METHODS } from 'constants/sort'
import { getCarrierIconUrl } from '../../lib/utils'
import {
  getFormattedPrice,
  getStopsLabel,
  getFormattedTimeRange,
  getFormattedDuration,
} from '../../lib/formatters'
import { TransformService, Ticket } from './types'
import { AvailableStops } from '../typings/tickets'

const transformService: TransformService = {
  async concatTickets(tickets, dataToConcat) {
    return tickets.concat(dataToConcat)
  },
  async prepareTickets(ticketsChunk) {
    const tickets = []
    const availableStops: AvailableStops = {}

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

    const isNoOneSelected = Object.values(selectedStops).every((el) => !el)

    if (isNoOneSelected) return []

    return tickets.filter(({ segments }) => {
      const [thereDirection, backDirection] = segments
      const thereStopsAmount = thereDirection.stops.length
      const backStopsAmount = backDirection.stops.length
      const isThereStopsSelected = selectedStops[thereStopsAmount]
      const isBackStopsSelected = selectedStops[backStopsAmount]
      const isValidThereDirectionStops =
        isThereStopsSelected || thereStopsAmount === 0
      const isValidBackDirectionStops =
        isBackStopsSelected || backStopsAmount === 0

      return isValidThereDirectionStops && isValidBackDirectionStops
    })
  },
  async sortTickets(tickets, sortMethod) {
    const sortByCheap = (a: Ticket, b: Ticket) => a.price - b.price
    const sortByDuration = (a: Ticket, b: Ticket) => {
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
