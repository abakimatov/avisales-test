import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'clsx'

import { SORT_METHODS } from 'constants/sort'
import { changeSortMethod } from 'core/slices/tickets.slice'
import { sortMethodSelector } from 'core/selectors/tickets'

import s from './styles.module.css'

export const SortControl = () => {
  const dispatch = useDispatch()
  const selectedSortMethod = useSelector(sortMethodSelector)

  return (
    <div className={s.sortControlRoot}>
      <button
        onClick={() => dispatch(changeSortMethod(SORT_METHODS.CHEAP))}
        className={cx([
          s.sortButton,
          { [s.active]: selectedSortMethod === SORT_METHODS.CHEAP },
        ])}>
        самый дешевый
      </button>
      <button
        onClick={() => dispatch(changeSortMethod(SORT_METHODS.FAST))}
        className={cx([
          s.sortButton,
          { [s.active]: selectedSortMethod === SORT_METHODS.FAST },
        ])}>
        самый быстрый
      </button>
    </div>
  )
}
