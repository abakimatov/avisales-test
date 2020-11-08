import React from 'react'

import { Checkbox } from './checkbox'
import { CheckboxFieldProps } from './types'
import s from './styles.module.css'

export const CheckboxField = ({
  checked,
  label,
  onChange,
  value,
}: CheckboxFieldProps) => (
  <div className={s.fieldWrapper} onClick={() => onChange(value)}>
    <Checkbox checked={checked} />
    <label className={s.label}>{label}</label>
  </div>
)
