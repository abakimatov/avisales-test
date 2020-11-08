import * as Comlink from 'comlink'

import { SORT_METHODS } from 'constants/sort'
import { getCarrierIconUrl } from 'lib/utils'
import {
  getFormattedPrice,
  getStopsLabel,
  getFormattedTimeRange,
  getFormattedDuration,
} from 'lib/formatters'
import {
  Ticket,
  ConcatTickets,
  PrepareTickets,
  FilterTickets,
  SortTickets,
} from '../typings/worker'
import { AvailableStops } from '../typings/tickets'

const concatTickets: ConcatTickets = async (tickets, dataToConcat) =>
  tickets.concat(dataToConcat)

const prepareTickets: PrepareTickets = async (ticketsChunk) => {
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
}

const filterTickets: FilterTickets = async (tickets, selectedStops) => {
  console.log(selectedStops.all)
  if (selectedStops.all) return tickets

  const isNoOneSelected = Object.values(selectedStops).every((el) => !el)

  if (isNoOneSelected) return []

  return tickets.filter(({ segments }) => {
    const [thereDirection, backDirection] = segments
    const thereStopsAmount = thereDirection.stops.length
    const backStopsAmount = backDirection.stops.length
    const isThereSelected = selectedStops[thereStopsAmount]
    const isBackSelected = selectedStops[backStopsAmount]
    const isValidThere = isThereSelected || thereStopsAmount === 0
    const isValidBack = isBackSelected || backStopsAmount === 0

    return isValidThere && isValidBack
  })
}

const sortTickets: SortTickets = async (tickets, sortMethod) => {
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
}

Comlink.expose({ concatTickets, prepareTickets, filterTickets, sortTickets })
