import React, { memo } from 'react'

import { Box } from 'ui/box'
import { Ticket as TicketType } from 'lib/worker'

import s from './styles.module.css'

export const Ticket = memo(
  ({ segments, formattedPrice, carrierIconUrl }: TicketType) => {
    return (
      <Box>
        <div className={s.ticketContainer}>
          <div className={s.infoRow}>
            <span className={s.price}>{formattedPrice}</span>
            <img
              src={carrierIconUrl}
              style={{ marginRight: '3rem', width: '11rem' }}
              alt="carrier logo"
            />
          </div>
          {segments.map((segment, idx) => (
            <div key={idx} className={s.infoRow}>
              <div className={s.detailsColumn}>
                <span className={s.detailsTitle}>{segment.directionTitle}</span>
                <span className={s.detailsValue}>
                  {segment.directionTimeRange}
                </span>
              </div>
              <div className={s.detailsColumn}>
                <span className={s.detailsTitle}>в пути</span>
                <span className={s.detailsValue}>
                  {segment.formattedDuration}
                </span>
              </div>
              <div className={s.detailsColumn}>
                <span className={s.detailsTitle}>
                  {segment.stopsAmountTitle}
                </span>
                <span className={s.detailsValue}>{segment.stopsAmount}</span>
              </div>
            </div>
          ))}
        </div>
      </Box>
    )
  },
)
