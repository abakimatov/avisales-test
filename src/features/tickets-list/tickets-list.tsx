import React from 'react'
import { useSelector } from 'react-redux'

import { ticketsSelector } from 'core/selectors/tickets'

import { Ticket } from './ticket'
import s from './styles.module.css'

export const TicketsList = () => {
  const tickets = useSelector(ticketsSelector)
  console.log(tickets)
  return (
    <ul className={s.ticketsListRoot}>
      {tickets.map((ticket) => (
        <li className={s.ticketWrapper} key={ticket.id}>
          <Ticket {...ticket} />
        </li>
      ))}
    </ul>
  )
}
