import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AutoSizer, List, ListRowProps } from 'react-virtualized'
import 'react-virtualized/styles.css'

import { startTicketsPolling } from 'core/slices/tickets.slice'
import { ticketsSelector } from 'core/selectors/tickets'

import { Ticket } from './ticket'
import s from './styles.module.css'

export const TicketsList = () => {
  const dispatch = useDispatch()
  const tickets = useSelector(ticketsSelector)

  useEffect(() => {
    dispatch(startTicketsPolling())
  }, [])

  const rowRenderer = ({ index, style, key }: ListRowProps) => {
    const ticket = tickets[index]
    return (
      <li className={s.ticketWrapper} style={style} key={key}>
        <Ticket {...ticket} />
      </li>
    )
  }

  return (
    <AutoSizer defaultHeight={500} className={s.ticketsListRoot}>
      {({ width, height }) => (
        <List
          height={height}
          width={width}
          rowCount={tickets.length}
          rowHeight={204}
          rowRenderer={rowRenderer}
        />
      )}
    </AutoSizer>
  )
}
