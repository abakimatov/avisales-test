import { AxiosResponse } from 'axios'

export interface SearchId {
  searchId: string
}

export interface ApiSegment {
  origin: string
  destination: string
  date: string
  stops: string[]
  duration: number
}

export interface ApiTicket {
  price: number
  carrier: string
  segments: ApiSegment[]
}

export interface TicketsResponse {
  tickets: ApiTicket[]
  stop: boolean
}

export interface TicketsApi {
  getSearchId: () => Promise<AxiosResponse<SearchId>>
  getTickets: (searchId: string) => Promise<AxiosResponse<TicketsResponse>>
}
