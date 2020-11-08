import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Header } from 'templates/header'
import { Content } from 'templates/content'
import { Centered } from 'templates/centered'
import { Loader } from 'ui/loader'
import { LogoIcon } from 'ui/logo-icon'
import { StopsFilter } from 'features/stops-filter'
import { SortControl } from 'features/sort-control'
import { TicketsList } from 'features/tickets-list'
import { getSearchId } from 'core/slices/search-id.slice'
import { isSearchIdReadySelector } from 'core/selectors/search-id'

import s from './styles.module.css'

export const Home = () => {
  const dispatch = useDispatch()
  const isSearchIdReady = useSelector(isSearchIdReadySelector)

  useEffect(() => {
    dispatch(getSearchId())
  }, [])

  return (
    <div className={s.homePageRoot}>
      <Header>
        <LogoIcon />
      </Header>
      {!isSearchIdReady && (
        <Centered>
          <Loader />
        </Centered>
      )}
      {isSearchIdReady && (
        <Content>
          <aside className={s.contentAside}>
            <StopsFilter />
          </aside>
          <main className={s.contentMain}>
            <SortControl />
            <div className={s.ticketsWrapper}>
              <TicketsList />
            </div>
          </main>
        </Content>
      )}
    </div>
  )
}
