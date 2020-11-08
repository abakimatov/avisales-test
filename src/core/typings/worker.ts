import { ApiTicket, ApiSegment } from 'api'

import { SelectedStops, AvailableStops } from './tickets'
import { SORT_METHODS } from '../../constants/sort'

export interface Segment extends ApiSegment {
  directionTitle: string
  directionTimeRange: string
  formattedDuration: string
  stopsAmountTitle: string
  stopsAmount: string
}

export interface Ticket extends ApiTicket {
  formattedPrice: string
  carrierIconUrl: string
  segments: Segment[]
}

export interface TicketsPrepareResult {
  tickets: Ticket[]
  availableStops: AvailableStops
}

type TicketsTransformResult = Promise<Ticket[]>

export type ConcatTickets = (
  tickets: Ticket[],
  dataToConcat: Ticket[],
) => TicketsTransformResult
export type PrepareTickets = (
  tickets: ApiTicket[],
) => Promise<TicketsPrepareResult>
export type FilterTickets = (
  tickets: Ticket[],
  selectedStops: SelectedStops,
) => TicketsTransformResult
export type SortTickets = (
  tickets: Ticket[],
  sortMethod: SORT_METHODS,
) => TicketsTransformResult

export interface TransformService {
  concatTickets: ConcatTickets
  prepareTickets: PrepareTickets
  filterTickets: FilterTickets
  sortTickets: SortTickets
}
