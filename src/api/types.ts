import { AxiosResponse } from 'axios'

export interface SearchId {
  searchId: string
}

export interface Segment {
  origin: string
  destination: string
  date: string
  stops: string[]
  duration: number
}

export interface Ticket {
  price: number
  carrier: string
  segments: Segment[]
}

export interface TicketsResponse {
  tickets: Ticket[]
  stop: boolean
}

export interface TicketsApi {
  getSearchId: () => Promise<AxiosResponse<SearchId>>
  getTickets: (searchId: string) => Promise<AxiosResponse<TicketsResponse>>
}
