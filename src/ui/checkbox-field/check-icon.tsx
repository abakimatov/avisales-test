import React from 'react'

import s from './styles.module.css'

export const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    className={s.checkIcon}
    width={12}
    height={8}
    viewBox="0 0 12 8"
    fill="none"
    {...props}>
    <path d="M4.286 8L0 4.161 1.209 3.08l3.077 2.748L10.79 0 12 1.09 4.286 8z" />
  </svg>
)
