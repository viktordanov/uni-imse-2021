import styles from '@/styles/pages/debug.module.scss'
import React from 'react'
import c from 'classnames'

export interface DebugProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const Debug: React.FunctionComponent<DebugProps> = ({ className, onClick }: DebugProps) => {
  return (
    <div className={c(styles.debug, className)} onClick={onClick}>
      <p></p>
    </div>
  )
}
