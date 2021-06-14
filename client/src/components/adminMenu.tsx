import { useAuth } from '@/hooks/useAuth'
import styles from '@/styles/components/menu.module.scss'
import c from 'classnames'
import React from 'react'
import { Link } from 'react-router-dom'

export interface AdminMenuProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const AdminMenu: React.FunctionComponent<AdminMenuProps> = ({ className, onClick }: AdminMenuProps) => {
  const { setToken } = useAuth()

  return (
    <div className={c(styles.menu, className)} onClick={onClick}>
      <Link className={c(styles.link)} to="/login" onClick={() => setToken(null)}>
        Log out
      </Link>
    </div>
  )
}
