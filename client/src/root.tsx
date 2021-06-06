import React from 'react'
import styles from './styles/root.module.scss'
import c from 'classnames'

export interface RootProps {
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
}

export const Root: React.FunctionComponent<RootProps> = ({ className, onClick }: RootProps) => {
  return (
    <div className={c(styles.root, className)} onClick={onClick}>
      <div className={styles.test}>
        <p>Testo</p>
      </div>
    </div>
  )
}
