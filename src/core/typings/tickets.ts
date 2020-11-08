import { SORT_METHODS } from 'constants/sort'
import { ApiTicket, ApiSegment } from 'api'

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

export interface AvailableStops {
  [stopsAmount: string]: boolean
}

export interface SelectedStops extends AvailableStops {
  all: boolean
}

export interface TicketsState {
  data: Ticket[]
  viewData: Ticket[]
  selectedStops: SelectedStops
  sortMethod: SORT_METHODS
}
