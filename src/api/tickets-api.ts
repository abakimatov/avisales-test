import { client } from './client'
import { TicketsApi } from './types'

export const ticketsApi: TicketsApi = {
  getSearchId: () => client.get('search'),
  getTickets: (searchId) =>
    client.get('tickets', {
      params: {
        searchId,
      },
    }),
}
