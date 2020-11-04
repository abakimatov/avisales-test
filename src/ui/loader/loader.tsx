import React from 'react'

import s from './styles.module.css'

export const Loader = (props: React.SVGProps<SVGSVGElement>) => (
  <div className={s.loader}>
    <svg className={s.circular} viewBox="25 25 50 50" {...props}>
      <circle
        className={s.path}
        cx={50}
        cy={50}
        r={20}
        fill="none"
        strokeWidth={4}
        strokeMiterlimit={10}
      />
    </svg>
  </div>
)
