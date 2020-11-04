import React from 'react'

import { Header } from 'templates/header'
import { Content } from 'templates/content'
import { LogoIcon } from 'ui/logo-icon'

import s from './styles.module.css'

export const Home = () => (
  <div className={s.homePageRoot}>
    <Header>
      <LogoIcon />
    </Header>
    <Content>
      <aside className={s.contentAside}>
        <span>aside</span>
      </aside>
      <main className={s.contentMain}>
        <h1>main</h1>
      </main>
    </Content>
  </div>
)
