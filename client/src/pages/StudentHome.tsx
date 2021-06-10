import styles from '@/styles/pages/studentHome.module.scss'
import React from 'react'
import c from 'classnames'

export interface StudentHomeProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const StudentHome: React.FunctionComponent<StudentHomeProps> = ({ className, onClick }: StudentHomeProps) => {
  return (
    <div className={c(styles.studentHome, className)} onClick={onClick}>
      <div className={styles.following}></div>
      <div className={styles.feed}></div>
      <div className={styles.pages}></div>
    </div>
  )
}
