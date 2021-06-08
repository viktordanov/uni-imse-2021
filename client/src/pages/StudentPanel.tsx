import styles from '@/styles/pages/studentPanel.module.scss'
import React, { useMemo } from 'react'
import c from 'classnames'
import { Logo } from '@/components/logo'
import { PersonBadge } from '@/components/personBadge'
import { Menu } from '@/components/menu'
import { useAuth } from '@/hooks/useAuth'
import { Switch } from 'react-router'

type UserInfo = {
  name: string
  email: string
  accountType: 'admin' | 'student'
}

export const StudentPanel: React.FunctionComponent = () => {
  const { decodedToken } = useAuth()

  const userInfo = useMemo<UserInfo>(() => {
    const subObj = decodedToken?.sub as any

    return { name: subObj.name ?? '', email: subObj.email ?? '', accountType: 'student' }
  }, [decodedToken])
  return (
    <div className={c(styles.studentPanel)}>
      <header>
        <Logo />
        <div className={styles.right}>
          <Menu className={styles.menu} />
          <PersonBadge name={userInfo.name} email={userInfo.email} mode="profile" />
        </div>
      </header>
      <Switch></Switch>
    </div>
  )
}
