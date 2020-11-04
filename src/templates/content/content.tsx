import React from 'react'

import s from './styles.module.css'

export const Content: React.FC = ({ children }) => (
  <div className={s.root}>{children}</div>
)
