import styles from '@/styles/pages/studentPanel.module.scss'
import React, { useMemo } from 'react'
import c from 'classnames'
import { Logo } from '@/components/logo'
import { PersonBadge } from '@/components/personBadge'
import { Menu } from '@/components/menu'
import { useAuth } from '@/hooks/useAuth'
import { Route, Switch } from 'react-router'
import { StudentHome } from './StudentHome'
import { StudentFollowing } from './StudentFollowing'
import { StudentPages } from './StudentPages'

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
          <PersonBadge name={userInfo.name} other={userInfo.email} mode="profile" />
        </div>
      </header>
      <Switch>
        <Route exact path="/">
          <StudentHome className={styles.subpage} />
        </Route>
        <Route exact path="/pages">
          <StudentPages className={styles.subpage} />
        </Route>
        <Route path="/students">
          <StudentFollowing className={styles.subpage} />
        </Route>
        <Route exact path="/students/:student">
          <div>1</div>
        </Route>
        <Route exact path="/students/:student/:pageTitle">
          <div>2</div>
        </Route>
      </Switch>
    </div>
  )
}
