import React from 'react'
import cx from 'clsx'

import { Box } from 'ui/box'
import { getStopsLabel } from 'lib/formatters'
import { IdentifiedTicket } from 'core/slices/tickets.slice'

import s from './styles.module.css'

export const Ticket = ({
  carrier,
  carrierIconUrl,
  segments,
  humanizedPrice,
}: IdentifiedTicket) => {
  const [thereDirection, backDirection] = segments
  return (
    <Box>
      <div className={s.ticketContainer}>
        <div className={cx([s.infoRow, s.pbM])}>
          <span className={s.price}>{humanizedPrice}</span>
          <img
            src={carrierIconUrl}
            style={{ marginRight: '3rem', width: '11rem' }}
            alt="carrier logo"
          />
        </div>
        <div className={cx([s.infoRow, s.pbS])}>
          <div className={s.detailsColumn}>
            <span className={s.detailsTitle}>
              {thereDirection.origin} - {thereDirection.destination}
            </span>
          </div>
          <div className={s.detailsColumn}>
            <span className={s.detailsTitle}>
              <span className={s.detailsTitle}>в пути</span>
            </span>
          </div>
          <div className={s.detailsColumn}>
            <span className={s.detailsTitle}>
              {getStopsLabel(thereDirection.stops.length)}
            </span>
          </div>
        </div>
        <div className={s.infoRow}>
          <div className={s.detailsColumn}>
            <span className={s.detailsTitle}>
              {backDirection.origin} - {backDirection.destination}
            </span>
          </div>
          <div className={s.detailsColumn}>
            <span className={s.detailsTitle}>в пути</span>
          </div>
          <div className={s.detailsColumn}>
            <span className={s.detailsTitle}>
              {getStopsLabel(backDirection.stops.length)}
            </span>
          </div>
        </div>
      </div>
    </Box>
  )
}
