import styles from '@/styles/pages/studentPanel.module.scss'
import React from 'react'
import c from 'classnames'
import { Logo } from '@/components/logo'
import { PersonBadge } from '@/components/personBadge'
import { Menu } from '@/components/menu'

export const StudentPanel: React.FunctionComponent = () => {
  return (
    <div className={c(styles.studentPanel)}>
      <header>
        <Logo />
        <div className={styles.right}>
          <Menu className={styles.menu} />
          <PersonBadge name="tewt" mode="profile" />
        </div>
      </header>
    </div>
  )
}
