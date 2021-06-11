import styles from '@/styles/components/menu.module.scss'
import React, { useMemo } from 'react'
import c from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export interface MenuProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const Menu: React.FunctionComponent<MenuProps> = ({ className, onClick }: MenuProps) => {
  const { setToken } = useAuth()
  const { pathname } = useLocation()

  const selectedIndex = useMemo(() => {
    if (pathname === '/') return 0
    if (pathname === '/pages') return 1
    if (pathname === '/following') return 2
  }, [pathname])

  return (
    <div className={c(styles.menu, className)} onClick={onClick}>
      <Link className={c(styles.link, { [styles.selected]: selectedIndex === 0 })} to="/">
        Home
      </Link>
      <span>/</span>
      <Link className={c(styles.link, { [styles.selected]: selectedIndex === 1 })} to="/pages">
        Pages
      </Link>
      <span>/</span>
      <Link className={c(styles.link, { [styles.selected]: selectedIndex === 2 })} to="/following">
        Students
      </Link>
      <span>/</span>
      <Link className={c(styles.link)} to="/login" onClick={() => setToken(null)}>
        Log out
      </Link>
    </div>
  )
}
