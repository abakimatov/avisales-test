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
