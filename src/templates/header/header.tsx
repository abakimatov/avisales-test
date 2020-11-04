import React from 'react'

import s from './styles.module.css'

export const Header: React.FC = ({ children }) => (
  <header className={s.header}>{children}</header>
)
