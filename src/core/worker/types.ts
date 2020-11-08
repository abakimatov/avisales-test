import { ApiTicket, ApiSegment } from 'api'

import { SelectedStops, AvailableStops } from '../typings/tickets'
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

export interface TransformService {
  concatTickets(tickets: Ticket[], dataToConcat: Ticket[]): Promise<Ticket[]>
  prepareTickets(tickets: ApiTicket[]): Promise<TicketsPrepareResult>
  filterTickets(
    tickets: Ticket[],
    selectedStops: SelectedStops,
  ): Promise<Ticket[]>
  sortTickets(tickets: Ticket[], sortMethod: SORT_METHODS): Promise<Ticket[]>
}
