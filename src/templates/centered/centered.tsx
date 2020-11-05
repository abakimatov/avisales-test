import React from 'react'

import s from './styles.module.css'

export const Centered: React.FC = ({ children }) => (
  <div className={s.centeredRoot}>{children}</div>
)
