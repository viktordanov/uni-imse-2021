import { Logo } from '@/components/logo'
import { Menu } from '@/components/menu'
import { PersonBadge } from '@/components/personBadge'
import { useAuth } from '@/hooks/useAuth'
import styles from '@/styles/pages/admin.module.scss'
import c from 'classnames'
import React, { useMemo } from 'react'

type UserInfo = {
  name: string
  email: string
  accountType: 'admin' | 'student'
}

export interface AdminProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const Admin: React.FunctionComponent<AdminProps> = ({ className, onClick }: AdminProps) => {
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
      <div className={styles.wrapper}> </div>
    </div>
  )
}
