import React from 'react'
import cx from 'clsx'

import { CheckIcon } from './check-icon'
import { CheckboxProps } from './types'
import s from './styles.module.css'

export const Checkbox = ({ checked }: CheckboxProps) => (
  <div className={s.wrapper}>
    <input
      type="checkbox"
      defaultChecked={checked}
      className={s.hiddenCheckbox}
    />
    <div className={cx([s.fakeCheckbox, { [s.active]: checked }])}>
      <CheckIcon />
    </div>
  </div>
)
