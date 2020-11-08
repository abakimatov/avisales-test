import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { Box } from 'ui/box'
import { CheckboxField } from 'ui/checkbox-field'
import { getStopsLabel } from 'lib/formatters'
import {
  allStopsIsCheckedSelector,
  availableStopsSelector,
} from 'core/selectors/tickets'
import {
  changeAllStopsFilter,
  changeStopsFilter,
} from 'core/slices/tickets.slice'

import s from './styles.module.css'

export const StopsFilter = () => {
  const dispatch = useDispatch()
  const allStopsIsChecked = useSelector(allStopsIsCheckedSelector)
  const availableStops = useSelector(availableStopsSelector)

  const onChangeAll = () => dispatch(changeAllStopsFilter())
  const onChangeCheckbox = (value: string) => dispatch(changeStopsFilter(value))

  return (
    <Box>
      <div className={s.wrapper}>
        <div className={s.titleContainer}>
          <h2 className={s.title}>количество пересадок</h2>
        </div>
        <CheckboxField
          checked={allStopsIsChecked}
          onChange={onChangeAll}
          value="all"
          label="Все"
        />
        {availableStops.map(([stopsAmount, checked]) => (
          <CheckboxField
            key={stopsAmount}
            onChange={onChangeCheckbox}
            checked={checked}
            value={stopsAmount}
            label={getStopsLabel(stopsAmount)}
          />
        ))}
      </div>
    </Box>
  )
}
