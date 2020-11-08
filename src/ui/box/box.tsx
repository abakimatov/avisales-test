import React from 'react'

import s from './styles.module.css'

export const Box: React.FC = ({ children }) => (
  <div className={s.boxRoot}>{children}</div>
)
